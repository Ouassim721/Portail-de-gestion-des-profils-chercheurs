<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Enseigner;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class EnseignerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $enseigners = Enseigner::with(['chercheur', 'matiere'])->get();
        return response()->json($enseigners, Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_chercheur' => 'required|exists:chercheurs,id',
            'id_matiere' => 'required|exists:matieres,id',
        ]);

         $exists = Enseigner::where([
            ['id_chercheur', $request->id_chercheur],
            ['id_matiere', $request->id_matiere],
        ])->first();

        if ($exists) {
            return response()->json(['message' => 'Relation déjà existante.'], Response::HTTP_CONFLICT);
        }

        $relation = Enseigner::create([
            'id_chercheur' => $request->id_chercheur,
            'id_matiere'   => $request->id_matiere,
        ]);

        return response()->json($relation, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(Enseigner $enseigner)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Enseigner $enseigner)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Enseigner $enseigner)
    {
        // On peut accepter deux paramètres (clé composite) :
        $relation = Enseigner::where('id_chercheur', $id_chercheur)
                             ->where('id_matiere', $id_matiere)
                             ->first();

        if (! $relation) {
            return response()->json(['message' => 'Relation non trouvée.'], Response::HTTP_NOT_FOUND);
        }

        $relation->delete();
        return response()->json(['message' => 'Relation supprimée.'], Response::HTTP_NO_CONTENT);
    }
}
