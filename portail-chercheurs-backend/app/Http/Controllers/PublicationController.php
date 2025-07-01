<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Chercheur;
use App\Models\Publication;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Carbon;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\Notification;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewPublicationNotification;
use App\Models\Categoriser;
use Illuminate\Support\Facades\Storage;

class PublicationController extends Controller
{
    /**
     * Affiche la liste des publications
     */
    public function index(Request $request)
    {
        $query = Publication::query()->with(['chercheur', 'disciplines']);

        // Nouveau filtre par chercheur_id
        if ($request->has('chercheur_id')) {
            $query->where('chercheur_id', $request->chercheur_id);
        }

        if ($request->has('year')) {
            $query->whereYear('date_publication', $request->year);
        }

        if ($request->has('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->where('titre', 'LIKE', $searchTerm);
        }

        // Gestion du cas "all" pour le limit
        if ($request->has('limit') && $request->limit === 'all') {
            $publications = $query->get();
            return response()->json([
                'data' => $publications,
                'hasMore' => false,
            ]);
        }

        // filtre par discipline
        if ($request->has('discipline_id')) {
            $disciplineId = $request->discipline_id;
            $query->whereHas('disciplines', function ($q) use ($disciplineId) {
                $q->where('disciplines.id', $disciplineId);
            });
        }

        $page = $request->input('page', 1);
        $limit = $request->input('limit', 10);
        $publications = $query->paginate((int)$limit, ['*'], 'page', $page);

        return response()->json([
            'data' => $publications->items(),
            'hasMore' => $publications->hasMorePages(),
        ]);
    }

    /**
     * Affiche le formulaire de création
     */
    public function create()
    {
        $chercheurs = Chercheur::all();
        return view('publications.create', compact('chercheurs'));
    }
    public function fetchScopusPublications()
    {
        $chercheur = JWTAuth::user();

        if (!$chercheur || !$chercheur->scopus_author_id) {
            return response()->json(['message' => 'Scopus ID manquant ou chercheur non authentifié'], 400);
        }

        $scopusId = $chercheur->scopus_author_id;
        $client = new \GuzzleHttp\Client();

        try {
            // 🆕 Récupération des identifiants des publications déjà enregistrées en base
            $existingIds = $chercheur->publications()->pluck('identifiant')->toArray();

            // Appel de l'API Scopus
            $response = $client->get("https://api.elsevier.com/content/search/scopus", [
                'query' => [
                    'query' => "AU-ID({$scopusId})",
                    'field' => 'title,coverDate,creator,description,citedby-count,dc:identifier'
                ],
                'headers' => [
                    'Accept' => 'application/json',
                    'X-ELS-APIKey' => env('SCOPUS_API_KEY'),
                ]
            ]);

            $data = json_decode($response->getBody(), true);

            $rawEntries = $data['search-results']['entry'] ?? [];

            // 🆕 Filtrage : ne garder que les publications dont l'identifiant n'existe pas déjà
            $filtered = array_filter($rawEntries, function ($entry) use ($existingIds) {
                if (!isset($entry['dc:identifier'])) return false;

                $scopusId = str_replace('SCOPUS_ID:', '', $entry['dc:identifier']);
                return !in_array($scopusId, $existingIds);
            });

            // 🆕 Formatage uniquement des publications filtrées
            $formattedData = [
                'publications' => array_map(function ($entry) {
                    $scopusId = isset($entry['dc:identifier'])
                        ? str_replace('SCOPUS_ID:', '', $entry['dc:identifier'])
                        : null;

                    return [
                        'identifiant' => $scopusId,
                        'titre' => $entry['dc:title'] ?? 'Titre non disponible',
                        'date_publication' => $entry['prism:coverDate'] ?? null,
                        'auteurs' => is_array($entry['dc:creator'] ?? null)
                            ? implode(', ', $entry['dc:creator'])
                            : ($entry['dc:creator'] ?? 'Auteur inconnu'),
                        'abstract' => $entry['dc:description'] ?? null,
                        'citation_count' => $entry['citedby-count'] ?? 0,
                    ];
                }, array_values($filtered)) // 🆕 array_values pour réindexer proprement le tableau
            ];

            return response()->json($formattedData);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la récupération des publications Scopus',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        return Publication::findOrFail($id);
    }
    public function store(Request $request)
    {
        try {
            $chercheur = JWTAuth::parseToken()->authenticate();
            if (!$chercheur) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $request->validate([
                'publications' => 'required|array',
                'publications.*.identifiant' => 'nullable|string',
                'publications.*.titre' => 'required|string',
                'publications.*.date_publication' => 'required|date',
                'publications.*.auteurs' => 'required',
                'publications.*.abstract' => 'nullable|string',
                'publications.*.citation_count' => 'nullable|integer',
                'publications.*.pdf_path' => 'nullable|file|mimes:pdf|max:10240',
                'publications.*.disciplines' => 'nullable|array',
                'publications.*.disciplines.*' => 'exists:disciplines,id',
            ]);

            foreach ($request->publications as $pub) {
                // 🆕 Vérifie si la publication avec cet identifiant existe déjà pour ce chercheur
                $publication = Publication::firstOrCreate(
                    [
                        'identifiant' => $pub['identifiant'] ?? null,
                        'chercheur_id' => $chercheur->id
                    ],
                    [
                        'titre' => $pub['titre'],
                        'date_publication' => $pub['date_publication'],
                        'auteurs' => is_array($pub['auteurs'])
                            ? implode(', ', $pub['auteurs'])
                            : $pub['auteurs'],
                        'abstract' => $pub['abstract'] ?? null,
                        'citation_count' => $pub['citation_count'] ?? 0,
                    ]
                );

                // Association des disciplines
                if (!empty($pub['disciplines'])) {
                    $publication->disciplines()->syncWithoutDetaching($pub['disciplines']);
                }

                // Notifier les abonnés
                $followers = $chercheur->followers;
                foreach ($followers as $follower) {
                    Notification::create([
                        'chercheur_id' => $follower->id,
                        'publication_id' => $publication->id,
                        'message' => 'Nouvelle publication de ' . $chercheur->prenom . ' ' . $chercheur->nom
                    ]);

                    Mail::to($follower->email)
                        ->queue(new NewPublicationNotification($chercheur, $publication));
                }
            }

            return response()->json(['message' => 'Publications enregistrées avec succès']);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de l\'enregistrement',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function profilePublications(Request $request)
{
    $chercheur = JWTAuth::user();
    $publications = Publication::where('chercheur_id', $chercheur->id)
        ->select('id', 'titre', 'date_publication', 'visible') // Ajouter date_publication
        ->with('disciplines')
        ->get();
    
    return response()->json(['publications' => $publications], 200);
}

    public function getPublicationYears()
    {
        $years = Publication::selectRaw('YEAR(date_publication) as year')
            ->distinct()
            ->orderBy('year', 'DESC')
            ->pluck('year');

        if ($years->isEmpty()) {
            return response()->json(['message' => 'No publication years found'], 404);
        }

        return response()->json($years);
    }

    public function toggleVisibility($id)
    {
        $publication = Publication::findOrFail($id);
        $user = JWTAuth::user();

        if ($publication->chercheur_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $publication->visible = !$publication->visible;
        $publication->save();

        return response()->json([
            'message' => 'Visibilité mise à jour',
            'visible' => $publication->visible
        ]);
    }
    public function getPublicationsByChercheur($id)
    {
        $chercheur = Chercheur::findOrFail($id);
        $count = $chercheur->publications()->count();

        return response()->json(['total' => $count]);
    }
}
