<?php

namespace App\Http\Controllers;

use App\Models\Categoriser;
use App\Models\Publication;
use App\Models\Discipline;
use Illuminate\Http\Request;

class CategoriserController extends Controller
{
    /**
     * Associer une discipline à une publication
     */
    public function store(Request $request)
{
    $validated = $request->validate([
        'publication_id' => 'required|integer|exists:publications,id',
        'discipline_id' => 'required|integer|exists:disciplines,id'
    ]);

    // Vérifier si l'association existe déjà
    $exists = Categoriser::where([
        'publication_id' => $validated['publication_id'],
        'discipline_id' => $validated['discipline_id']
    ])->exists();

    if ($exists) {
        return response()->json([
            'message' => 'Cette discipline est déjà associée à cette publication'
        ], 409); // Code HTTP 409 Conflict
    }

    try {
        $categorisation = Categoriser::create($validated);
        return response()->json($categorisation, 201);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Erreur lors de la création de l\'association',
            'error' => $e->getMessage()
        ], 500);
    }
}

    /**
     * Détacher une discipline d'une publication
     */
public function destroy($publicationId, $disciplineId)
{
    try {
        $deleted = Categoriser::where([
            'publication_id' => $publicationId,
            'discipline_id' => $disciplineId
        ])->delete();

        if (!$deleted) {
            return response()->json([
                'message' => 'Association non trouvée'
            ], 404);
        }

        return response()->json([
            'message' => 'Association supprimée'
        ], 200);
    } catch (\Exception $e) {
        \Log::error('Erreur suppression catégorisation', [
            'message' => $e->getMessage(),
            'publicationId' => $publicationId,
            'disciplineId' => $disciplineId
        ]);
        
        return response()->json([
            'message' => 'Erreur lors de la suppression',
            'error' => $e->getMessage()
        ], 500);
    }
}

    /**
     * Lister les disciplines d'une publication
     */
    public function forPublication($publicationId)
    {
        $disciplines = Publication::findOrFail($publicationId)
            ->disciplines()
            ->get();

        return response()->json($disciplines, 200);
    }

    /**
     * Lister les publications d'une discipline
     */
    public function forDiscipline($disciplineId)
    {
        $publications = Discipline::findOrFail($disciplineId)
            ->publications()
            ->get();

        return response()->json($publications, 200);
    }
}