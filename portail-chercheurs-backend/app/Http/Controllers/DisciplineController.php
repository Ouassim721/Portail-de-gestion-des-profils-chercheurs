<?php

namespace App\Http\Controllers;

use App\Models\Discipline;
use Illuminate\Http\Request;
use App\Models\Categoriser; 

class DisciplineController extends Controller
{
    // GET /api/disciplines
    public function index()
    {
        return response()->json(Discipline::all(), 200);
    }

    // POST /api/disciplines
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
        ]);

        $discipline = Discipline::create($validated);

        return response()->json($discipline, 201);
    }

    // GET /api/disciplines/{id}
    public function show($id)
    {
        $discipline = Discipline::find($id);

        if (!$discipline) {
            return response()->json(['message' => 'Discipline non trouvée'], 404);
        }

        return response()->json($discipline, 200);
    }

    // PUT /api/disciplines/{id}
    public function update(Request $request, $id)
    {
        $discipline = Discipline::find($id);

        if (!$discipline) {
            return response()->json(['message' => 'Discipline non trouvée'], 404);
        }

        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
        ]);

        $discipline->update($validated);

        return response()->json($discipline, 200);
    }

    // DELETE /api/disciplines/{id}
    public function destroy($id)
    {
        $discipline = Discipline::find($id);

        if (!$discipline) {
            return response()->json(['message' => 'Discipline non trouvée'], 404);
        }

        $discipline->delete();

        return response()->json(['message' => 'Discipline supprimée'], 200);
    }

    public function stats()
    {
        try {
            $stats = Discipline::query()
                ->select('disciplines.id', 'disciplines.nom')
                // Utiliser la relation many-to-many via la table pivot
                ->withCount(['publications' => function ($query) {
                    $query->distinct(); // Éviter les doublons
                }])
                ->withSum(['publications' => function ($query) {
                    $query->select(\DB::raw('SUM(citation_count)'))
                          ->distinct(); // Somme distincte
                }], 'citation_count') 
                ->get();

            return response()->json($stats, 200);
        } catch (\Exception $e) {
            \Log::error('Erreur stats disciplines', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error'   => 'Erreur technique lors de la récupération des stats.',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}

