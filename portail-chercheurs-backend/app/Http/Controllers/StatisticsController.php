<?php

namespace App\Http\Controllers;

use App\Models\Chercheur;
use App\Models\Publication;
use App\Models\Discipline;

class StatisticsController extends Controller
{
    public function getStats()
    {
        $chercheurs = Chercheur::count();
        $publications = Publication::count();
        $citations = Publication::sum('citation_count');
        $disciplines = Discipline::count();

        return response()->json([
            'chercheurs' => $chercheurs,
            'publications' => $publications,
            'citations' => $citations,
            'disciplines' => $disciplines
        ]);
    }
}
