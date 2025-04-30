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

    public function store(Request $request)
    {
        $chercheur = JWTAuth::user();

        foreach ($request->all() as $pub) {
            Publication::create([
                'titre' => $pub['titre'],
                'date_publication' => $pub['date_publication'],
                'auteurs' => $pub['auteurs'],
                'abstract' => $pub['abstract'],
                'citation_count' => $pub['citation_count'] ?? null,
                'chercheur_id' => $chercheur->id,
            ]);
        }

        return response()->json(['message' => 'Publications enregistrées avec succès.']);
    }
}
