<?php

namespace App\Http\Controllers;

use App\Models\Discipline;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DisciplineController extends Controller
{
    /**
     * Liste toutes les disciplines
     */
    public function index()
    {
        return response()->json([
            'disciplines' => Discipline::all()
        ], Response::HTTP_OK);
    }

    /**
     * Crée une nouvelle discipline
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:100|unique:disciplines'
        ]);

        $discipline = Discipline::create($validated);

        return response()->json([
            'message' => 'Discipline créée',
            'discipline' => $discipline
        ], Response::HTTP_CREATED);
    }

    /**
     * Affiche une discipline
     */
    public function show(Discipline $discipline)
    {
        return response()->json([
            'discipline' => $discipline->load('publications')
        ], Response::HTTP_OK);
    }

    /**
     * Met à jour une discipline
     */
    public function update(Request $request, Discipline $discipline)
    {
        $validated = $request->validate([
            'nom' => 'sometimes|string|max:100|unique:disciplines,nom,' . $discipline->id
        ]);

        $discipline->update($validated);

        return response()->json([
            'message' => 'Discipline mise à jour',
            'discipline' => $discipline
        ], Response::HTTP_OK);
    }

    /**
     * Supprime une discipline
     */
    public function destroy(Discipline $discipline)
    {
        try {
            $discipline->delete();
            return response()->json([
                'message' => 'Discipline supprimée'
            ], Response::HTTP_NO_CONTENT);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Impossible de supprimer la discipline (des publications y sont liées)'
            ], Response::HTTP_CONFLICT);
        }
    }
}