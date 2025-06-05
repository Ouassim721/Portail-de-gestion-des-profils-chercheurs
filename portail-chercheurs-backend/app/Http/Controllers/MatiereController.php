<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Matiere;
use Illuminate\Http\Request;
use Illuminate\Http\Response;


class MatiereController extends Controller
{
    /**
     * Display a listing of the resource.
     */
public function index()
{
    return Matiere::all();
}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
       $request->validate([
            'nom_matiere' => 'required|string|max:255|unique:matieres,nom_matiere',
        ]);

        $matiere = Matiere::create([
            'nom_matiere' => $request->nom_matiere,
        ]);

        return response()->json($matiere, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(Matiere $matiere)
    {
        $matiere = Matiere::with(['cours', 'chercheurs'])->find($id);

        if (! $matiere) {
            return response()->json(['message' => 'Matière non trouvée.'], Response::HTTP_NOT_FOUND);
        }

        return response()->json($matiere, Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Matiere $matiere)
    {
        $matiere = Matiere::find($id);

        if (! $matiere) {
            return response()->json(['message' => 'Matière non trouvée.'], Response::HTTP_NOT_FOUND);
        }

        $request->validate([
            'nom_matiere' => 'sometimes|required|string|max:255|unique:matieres,nom_matiere,' . $matiere->id,
        ]);

        $matiere->update($request->only('nom_matiere'));

        return response()->json($matiere, Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Matiere $matiere)
    {
        $matiere = Matiere::find($id);

        if (! $matiere) {
            return response()->json(['message' => 'Matière non trouvée.'], Response::HTTP_NOT_FOUND);
        }

        $matiere->delete();

        return response()->json(['message' => 'Matière supprimée avec succès.'], Response::HTTP_NO_CONTENT);
    }
    public function chercheurMatieres($chercheurId)
    {
        $chercheur = Chercheur::findOrFail($chercheurId);
        return $chercheur->matieres;
    }
}

