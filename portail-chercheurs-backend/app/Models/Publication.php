<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use App\Models\Discipline;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PublicationController extends Controller
{
    /**
     * Liste toutes les publications
     */
    public function index()
    {
        return response()->json([
            'publications' => Publication::with('discipline')->get()
        ], Response::HTTP_OK);
    }

    /**
     * Crée une nouvelle publication
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'date_publication' => 'required|date',
            'date_modification' => 'nullable|date',
            'auteurs' => 'required|string',
            'abstract' => 'required|string',
            'discipline_id' => 'required|exists:disciplines,id',
            'chercheur_id' => 'required|exists:chercheur,id'
        ]);

        $publication = Publication::create($validated);

        return response()->json([
            'message' => 'Publication créée',
            'publication' => $publication->load('discipline')
        ], Response::HTTP_CREATED);
    }

    /**
     * Affiche une publication
     */
    public function show(Publication $publication)
    {
        return response()->json([
            'publication' => $publication->load(['discipline', 'chercheur'])
        ], Response::HTTP_OK);
    }

    /**
     * Met à jour une publication
     */
    public function update(Request $request, Publication $publication)
    {
        $validated = $request->validate([
            'titre' => 'sometimes|string|max:255',
            'date_publication' => 'sometimes|date',
            'date_modification' => 'nullable|date',
            'auteurs' => 'sometimes|string',
            'abstract' => 'sometimes|string',
            'discipline_id' => 'sometimes|exists:disciplines,id',
            'chercheur_id' => 'sometimes|exists:chercheur,id'
        ]);

        $publication->update($validated);

        return response()->json([
            'message' => 'Publication mise à jour',
            'publication' => $publication->fresh()->load('discipline')
        ], Response::HTTP_OK);
    }

    /**
     * Supprime une publication
     */
    public function destroy(Publication $publication)
    {
        $publication->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}