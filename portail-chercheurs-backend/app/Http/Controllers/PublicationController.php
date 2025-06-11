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

class PublicationController extends Controller
{
    /**
     * Affiche la liste des publications
     */
    public function index(Request $request)
    {
        $query = Publication::query()->with(['chercheur']);

        if ($request->has('year')) {
            $query->whereYear('date_publication', $request->year);
        }
        // Nouveau filtre de recherche
        if ($request->has('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->where('titre', 'LIKE', $searchTerm);
        }

        $page = $request->input('page', 1);
        $limit = $request->input('limit', 10);
        $publications = $query->paginate($limit, ['*'], 'page', $page);

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

            $formattedData = [
                'publications' => array_map(function ($entry) {
                    // Extraction de l'identifiant Scopus (format: "SCOPUS_ID:85076477900")
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
                }, $data['search-results']['entry'] ?? [])
            ];

            return response()->json($formattedData);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la récupération des publications Scopus',
                'details' => $e->getMessage()
            ], 500);
        }
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
            ]);

            foreach ($request->publications as $pub) {
                $publication = Publication::create([
                    'scopus_id' => $pub['identifiant'] ?? null,
                    'titre' => $pub['titre'],
                    'date_publication' => $pub['date_publication'],
                    'auteurs' => is_array($pub['auteurs'])
                        ? implode(', ', $pub['auteurs'])
                        : $pub['auteurs'],
                    'abstract' => $pub['abstract'] ?? null,
                    'citation_count' => $pub['citation_count'] ?? 0,
                    'chercheur_id' => $chercheur->id,
                ]);

                // Notifier les abonnés
                $followers = $chercheur->followers;
                foreach ($followers as $follower) {
                    // Création de la notification
                    Notification::create([
                        'chercheur_id' => $follower->id,
                        'publication_id' => $publication->id,
                        'message' => 'Nouvelle publication de ' . $chercheur->prenom . ' ' . $chercheur->nom
                    ]);

                    // Envoi d'email via queue
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

        if (!$chercheur) {
            return response()->json(['message' => 'Non autorisé'], 401);
        }

        $publications = Publication::where('chercheur_id', $chercheur->id)->get();

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
