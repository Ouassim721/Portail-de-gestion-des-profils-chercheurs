<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Chercheur;
use App\Models\Publication;

class StatisticsController extends Controller
{
    public function getStats()
    {
        $chercheurs = Chercheur::count();
        $publications = Publication::count();
        $citations = Publication::sum('citation_count');

        return response()->json([
            'chercheurs' => $chercheurs,
            'publications' => $publications,
            'citations' => $citations
        ]);
    }
}
