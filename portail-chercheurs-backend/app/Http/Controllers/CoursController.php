<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Cours;
use Illuminate\Http\Request;
use App\Models\Chercheur;
use App\Models\Matiere;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class CoursController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cours = Cours::with(['chercheur', 'matiere'])->get();
        return response()->json($cours, Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'datePublication' => 'required|date',
            'fichier' => 'required|file|mimes:pdf|max:10240', // Max 10MB, PDF uniquement
            'id_chercheur' => 'required|exists:chercheurs,id',
            'id_matiere' => 'required|exists:matieres,id',
        ]);

        // Stockage du fichier
        if ($request->hasFile('fichier')) {
            $file = $request->file('fichier');
            $filePath = $file->store('cours', 'public');

            // Stocker seulement le chemin relatif
            $relativePath = str_replace('public/', '', $filePath);
        }

        $cours = Cours::create([
            'titre' => $request->titre,
            'description' => $request->description,
            'datePublication' => $request->datePublication,
            'fichier' => $relativePath,
            'id_chercheur' => $request->id_chercheur,
            'id_matiere' => $request->id_matiere,
        ]);

        return response()->json([
            'message' => 'Cours créé avec succès',
            'cours' => $cours
        ], Response::HTTP_CREATED);
    }
    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $cours = Cours::find($id);

        if (!$cours) {
            return response()->json(['message' => 'Cours non trouvé.'], 404);
        }

        if ($cours->fichier) {
            // Génération correcte de l'URL
            $cours->fichier_url = Storage::url($cours->fichier);
        } else {
            $cours->fichier_url = null;
        }

        return response()->json($cours);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $cours = Cours::findOrFail($id);

        $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'datePublication' => 'required|date',
            'id_matiere' => 'required|exists:matieres,id_matiere',
            'fichier' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx|max:10240',
        ]);

        $data = $request->only(['titre', 'description', 'datePublication', 'id_matiere']);

        if ($request->hasFile('fichier')) {
            // Supprimer l'ancien fichier
            Storage::disk('public')->delete($cours->fichier);

            // Stocker le nouveau fichier
            $filePath = $request->file('fichier')->store('cours', 'public');
            $data['fichier'] = $filePath;
        }

        $cours->update($data);

        return response()->json($cours);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $cours = Cours::find($id);

        if (! $cours) {
            return response()->json(['message' => 'Cours non trouvé.'], Response::HTTP_NOT_FOUND);
        }

        $cours->delete();

        return response()->json(['message' => 'Cours supprimé avec succès.'], Response::HTTP_NO_CONTENT);
    }
}
