<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class PublicationController extends Controller
{
    public function storeBatch(Request $request)
    {
        $request->validate([
            'publications' => 'required|array',
            'publications.*.titre' => 'required|string',
        ]);

        try {
            $publications = collect($request->publications)->map(function ($pubId) {
                $pubData = cache()->get('scopus_pub_' . $pubId);
                
                return [
                    'titre' => $pubData['title'],
                    'auteurs' => $pubData['authors'],
                    'date_publication' => Carbon::parse($pubData['date']),
                    'abstract' => 'Abstract non disponible', 
                    'citation_count' => $pubData['citationCount'],
                    'chercheur_id' => auth()->id(),
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            });

            Publication::insert($publications->toArray());

            return response()->json(['message' => 'Publications importées avec succès']);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de l\'importation'], 500);
        }
    }
    public function store(Request $request)
    {
        $request->validate([
            'publications' => 'required|array',
            'publications.*.scopus_id' => 'required|string',
            'publications.*.title' => 'required|string',
        ]);

        try {
            $importedIds = [];
            
            foreach ($request->publications as $pub) {
                $chercheur = Publication::updateOrCreate(
                    ['scopus_id' => $pub['scopus_id']],
                    [
                        'user_id' => auth()->id(),
                        'title' => $pub['title'],
                        'authors' => $pub['authors'],
                        'publication_date' => $pub['publication_date'],
                        'citation_count' => $pub['citation_count'],
                        'doi' => $pub['doi']
                    ]
                );
                
                $importedIds[] = $publication->id;
            }

            return response()->json([
                'message' => count($importedIds).' publications importées avec succès',
                'ids' => $importedIds
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de l\'importation: '.$e->getMessage()
            ], 500);
        }
    }
}