<?php

namespace App\Http\Controllers;

use App\Models\Chercheur;
use App\Models\Publication;
use App\Models\Discipline;
use App\Models\Comment;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    public function getStats()
    {
        try {
            $stats = [
                'chercheurs' => Chercheur::count(),
                'publications' => Publication::count(),
                'comments' => Comment::count(),
                'avgCitations' => round(Publication::avg('citation_count'), 1),
                'disciplines' => Discipline::count() // Nouvelle statistique ajoutée
            ];

            return response()->json($stats);

        } catch (\Exception $e) {
            Log::error('Erreur getStats:', [
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
        try {
            $stats = Chercheur::selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as count')
                ->groupBy('year', 'month')
                ->orderBy('year', 'asc')
                ->orderBy('month', 'asc')
                ->get();

            return response()->json($stats);

        } catch (\Exception $e) {
            Log::error('Erreur getChercheursStats:', $e->getMessage());
            return response()->json(['error' => 'Erreur technique'], 500);
        }
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

            // Formatage optionnel - peut être supprimé si non nécessaire
            $formattedStats = $stats->map(function ($item) {
                return [
                    'year' => $item->year,
                    'month' => str_pad($item->month, 2, '0', STR_PAD_LEFT),
                    'count' => $item->count
                ];
            });

            return response()->json($formattedStats);

        } catch (\Exception $e) {
            Log::error('Erreur getPublicationsStats:', $e->getMessage());
            return response()->json(['error' => 'Erreur technique'], 500);
        }
    }

    public function getCommentsStats()
    {
        try {
            $stats = Comment::selectRaw(
                'YEAR(created_at) as year, 
                MONTH(created_at) as month, 
                COUNT(*) as count'
            )
            ->groupBy('year', 'month')
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get();

            return response()->json($stats);

        } catch (\Exception $e) {
            Log::error('Erreur getCommentsStats:', $e->getMessage());
            return response()->json(['error' => 'Erreur technique'], 500);
        }
    }

    public function getAuthorsStats()
    {
        try {
            // Correction: Utilisation de flatMap et d'explode
            $authors = Publication::pluck('auteurs')
                ->flatMap(function ($authorsList) {
                    return array_map('trim', explode(',', $authorsList));
                })
                ->filter() // Filtrer les valeurs vides
                ->countBy()
                ->sortDesc()
                ->take(10)
                ->map(function ($count, $author) {
                    return [
                        'author' => $author,
                        'count' => $count
                    ];
                })
                ->values();

            return response()->json($authors);

        } catch (\Exception $e) {
            Log::error('Erreur getAuthorsStats:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Erreur lors du calcul des statistiques auteurs',
                'code' => 'AUTHOR_STATS_ERROR'
            ], 500);
        }
    }
}