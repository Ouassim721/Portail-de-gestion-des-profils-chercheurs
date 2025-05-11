<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Chercheur;
use App\Models\Publication;
use App\Models\Discipline;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Carbon;
use Tymon\JWTAuth\Facades\JWTAuth;

class PublicationController extends Controller
{
    /**
     * Affiche la liste des publications
     */
    /*public function index()
    {
        $publications = Publication::with(['chercheur', 'discipline'])->get();
        return view('publications.index', compact('publications'));
    }*/
    public function index(Request $request)
    {
        $perPage = $request->get('limit', 10);

        $publications = Publication::with(['chercheur', 'discipline'])
            ->orderBy('date_publication', 'desc')
            ->paginate($perPage);

        return response()->json([
            'data' => $publications->items(),
            'hasMore' => $publications->hasMorePages()
        ]);
    }



    /**
     * Affiche le formulaire de création
     */
    public function create()
    {
        $chercheurs = Chercheur::all();
        $disciplines = Discipline::all();
        return view('publications.create', compact('chercheurs', 'disciplines'));
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
                        'discipline_id' => 1 // Valeur par défaut
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
                'publications.*.identifiant' => 'nullable|string', // Champ identifiant ajouté
                'publications.*.titre' => 'required|string',
                'publications.*.date_publication' => 'required|date',
                'publications.*.auteurs' => 'required',
                'publications.*.abstract' => 'nullable|string',
                'publications.*.citation_count' => 'nullable|integer',
                'publications.*.discipline_id' => 'sometimes|exists:disciplines,id',
            ]);

            foreach ($request->publications as $pub) {
                Publication::create([
                    'scopus_id' => $pub['identifiant'] ?? null, // Stockage de l'identifiant Scopus
                    'titre' => $pub['titre'],
                    'date_publication' => $pub['date_publication'],
                    'auteurs' => is_array($pub['auteurs'])
                        ? implode(', ', $pub['auteurs'])
                        : $pub['auteurs'],
                    'abstract' => $pub['abstract'] ?? null,
                    'citation_count' => $pub['citation_count'] ?? 0,
                    'chercheur_id' => $chercheur->id,
                    'discipline_id' => $pub['discipline_id'] ?? null
                ]);
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

    public function getPublicationsByChercheur($id)
    {
        // Vérifie d'abord si le chercheur existe
        $chercheur = Chercheur::find($id);

        if (!$chercheur) {
            return response()->json(['message' => 'Chercheur non trouvé'], 404);
        }

        // Récupère les publications du chercheur
        $publications = Publication::where('chercheur_id', $id)
            ->orderBy('annee', 'desc')
            ->get();

        return response()->json($publications);
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
}
