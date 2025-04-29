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
    public function index()
    {
        $publications = Publication::with(['chercheur', 'discipline'])->get();

        return response()->json([
            'status' => 'success',
            'data' => $publications,
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

        $response = $client->get("https://api.elsevier.com/content/search/scopus", [
            'query' => [
                'query' => "AU-ID({$scopusId})"
            ],
            'headers' => [
                'Accept' => 'application/json',
                'X-ELS-APIKey' => env('SCOPUS_API_KEY'), // définit dans  .env
            ]
        ]);

        $data = json_decode($response->getBody(), true);

        return response()->json($data);
    }


    /**
     * Stocke une nouvelle publication
     */
    /*public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'titre' => 'required|string|max:255',
            'date_publication' => 'required|date',
            'auteurs' => 'required|string',
            'abstract' => 'required|string',
            'pdf' => 'nullable|file|mimes:pdf|max:10240', // 10MB max
            'chercheur_id' => 'required|exists:chercheur,id',
            'discipline_id' => 'required|exists:disciplines,id'
        ]);

        $pdfPath = null;
        if ($request->hasFile('pdf')) {
            $pdfPath = $request->file('pdf')->store('publications_pdfs', 'public');
        }

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        Publication::create([
            'titre' => $request->titre,
            'date_publication' => $request->date_publication,
            'date_modification' => $request->date_modification,
            'auteurs' => $request->auteurs,
            'abstract' => $request->abstract,
            'pdf_path' => $pdfPath,
            'chercheur_id' => $request->chercheur_id,
            'discipline_id' => $request->discipline_id
        ]);

        return redirect()->route('publications.index')
            ->with('success', 'Publication créée avec succès');
    }*/
    /*public function store(Request $request)
    {
        $chercheurId = JWTAuth::user()->id;

        foreach ($request->input('publications') as $pub) {
            Publication::create([
                'titre' => $pub['title'],
                'date_publication' => substr($pub['prism:coverDate'], 0, 10),
                'auteurs' => $pub['dc:creator'],
                'abstract' => $pub['dc:description'] ?? '',
                'citation_count' => $pub['citedby-count'] ?? 0,
                'chercheur_id' => $chercheurId,
            ]);
        }

        return response()->json(['message' => 'Publications enregistrées avec succès']);
    }*/
    public function store(Request $request)
    {
        try {
            // Vérification de l'authentification
            $chercheur = JWTAuth::parseToken()->authenticate();
            if (!$chercheur) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            // Validation des données
            $request->validate([
                'publications' => 'required|array',
                'publications.*.titre' => 'required|string',
                'publications.*.date_publication' => 'required|date',
                'publications.*.auteurs' => 'required',
                'publications.*.abstract' => 'nullable|string',
                'publications.*.citation_count' => 'nullable|integer',
            ]);

            $publications = $request->input('publications', []);

            // Gestion des auteurs (peut être un array ou une string)
            foreach ($publications as $pub) {
                $auteurs = is_array($pub['auteurs'])
                    ? implode(', ', $pub['auteurs'])
                    : $pub['auteurs'];

                Publication::create([
                    'titre' => $pub['titre'],
                    'date_publication' => $pub['date_publication'],
                    'auteurs' => $auteurs,
                    'abstract' => $pub['abstract'] ?? null,
                    'citation_count' => $pub['citation_count'] ?? 0,
                    'chercheur_id' => $chercheur->id,
                    'discipline_id' => $pub['discipline_id']
                ]);
            }

            return response()->json([
                'message' => 'Publications enregistrées avec succès',
                'count' => count($publications)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de l\'enregistrement',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}
