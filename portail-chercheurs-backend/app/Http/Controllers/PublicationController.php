<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class PublicationController extends Controller
{
<<<<<<< HEAD
    public function storeBatch(Request $request)
    {
        $request->validate([
            'publications' => 'required|array',
            'publications.*' => 'required|string'
        ]);

        try {
            $publications = collect($request->publications)->map(function ($pubId) {
                $pubData = cache()->get('scopus_pub_' . $pubId);
                
                return [
                    'titre' => $pubData['title'],
                    'auteurs' => $pubData['authors'],
                    'date_publication' => Carbon::parse($pubData['date']),
                    'abstract' => 'Abstract non disponible', 
                    'citation_count' => $pubData['citationCount'],
                    'chercheur_id' => auth()->id(),
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            });

            Publication::insert($publications->toArray());

            return response()->json(['message' => 'Publications importées avec succès']);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de l\'importation'], 500);
        }
=======
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

    /**
     * Stocke une nouvelle publication
     */
    public function store(Request $request)
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
>>>>>>> ouassim
    }
}