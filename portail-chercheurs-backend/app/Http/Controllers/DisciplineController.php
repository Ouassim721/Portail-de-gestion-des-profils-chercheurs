<?php

namespace App\Http\Controllers;

use App\Models\Discipline;
use Illuminate\Http\Request;
use App\Models\Categoriser; 

class DisciplineController extends Controller
{
    // GET /api/disciplines
    /**
     * liste toutes les disciplines
     */
public function index(Request $request)
{
    $search = $request->query('search');
    
    $query = Discipline::query();
    
    if ($search) {
        $query->where('nom', 'LIKE', '%' . $search . '%');
    }

    // tri par nom
    $query->orderBy('nom', 'asc');
    
    return response()->json($query->get(), 200);
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
            ->withCount(['publications' => function ($query) {
                $query->distinct(); // Correct pour le comptage
            }])
            // Correction : Supprimer le distinct() pour withSum
            ->withSum('publications', 'citation_count') 
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nom' => $item->nom,
                    'publications_count' => $item->publications_count,
                    'total_citations' => $item->publications_sum_citation_count
                ];
            });

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

