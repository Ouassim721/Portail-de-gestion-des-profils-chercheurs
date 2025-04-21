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
            'publications.*' => 'required|string'
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
}