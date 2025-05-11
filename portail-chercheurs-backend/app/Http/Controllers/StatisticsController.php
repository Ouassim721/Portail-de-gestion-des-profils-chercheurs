<?php

namespace App\Http\Controllers;

use App\Models\Chercheur;
use App\Models\Publication;
use App\Models\Discipline;
use App\Models\Comment;

class StatisticsController extends Controller
{
public function getStats()
{
    try {
        $stats = [
            'chercheurs' => Chercheur::count(),
            'publications' => Publication::count(),
            'comments' => Comment::count(), // Nouvelle statistique
            'avgCitations' => round(Publication::avg('citation_count'), 1)
        ];

        return response()->json($stats);

    } catch (\Exception $e) {
        \Log::error('Erreur getStats:', [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'error' => 'Erreur lors de la récupération des statistiques',
            'details' => $e->getMessage()
        ], 500);
    }
}

 public function getChercheursStats()
{
    $stats = Chercheur::selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as count')
        ->groupBy('year', 'month')
        ->orderBy('year', 'asc')
        ->orderBy('month', 'asc')
        ->get();

    return response()->json($stats);
}

    public function getPublicationsStats()
{
    try {
        $stats = Publication::selectRaw(
            'YEAR(date_publication) as year, 
            MONTH(date_publication) as month, 
            COUNT(*) as count'
        )
        ->groupBy('year', 'month')
        ->orderBy('year', 'asc')
        ->orderBy('month', 'asc')
        ->get();

        $formattedStats = $stats->map(function ($item) {
            return [
                'year' => $item->year,
                'month' => str_pad($item->month, 2, '0', STR_PAD_LEFT),
                'count' => $item->count
            ];
        });

        return response()->json($formattedStats);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Erreur lors de la récupération des stats publications',
            'details' => $e->getMessage()
        ], 500);
    }
}

public function getCommentsStats()
{
    try {
        \Log::info('Tentative de récupération des stats commentaires');
        
        $stats = Comment::selectRaw(
            'YEAR(created_at) as year, 
            MONTH(created_at) as month, 
            COUNT(*) as count'
        )
        ->groupBy('year', 'month')
        ->orderBy('year', 'asc')
        ->orderBy('month', 'asc')
        ->get();

        \Log::debug('Données brutes SQL:', $stats->toArray());

        return response()->json($stats);

    } catch (\Exception $e) {
        \Log::error('Erreur getCommentsStats:', [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        
        return response()->json([
            'error' => 'Erreur technique détaillée dans les logs',
            'code' => 'COMMENT_STATS_ERROR'
        ], 500);
    }
}

}
