<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ScopusController extends Controller
{
    public function fetchPublications(Request $request)
    {
        try {
            $user = $request->user();
            
            $response = Http::withHeaders([
                'X-ELS-APIKey' => config('services.scopus.api_key'),
                'Accept' => 'application/json'
            ])->get('https://api.elsevier.com/content/search/scopus', [
                'query' => "auth({$user->nom} {$user->prenom})",
                'count' => 25,
                'field' => 'title,authors,citation-count,coverDate'
            ]);

            if (!$response->successful()) {
                Log::error('Scopus API Error: ' . $response->body());
                return response()->json(['error' => 'Failed to fetch publications'], 500);
            }

            return $this->formatResponse($response->json()['search-results']['entry'] ?? []);

        } catch (\Exception $e) {
            Log::error('Scopus API Exception: ' . $e->getMessage());
            return response()->json(['error' => 'Server error'], 500);
        }
    }

    private function formatResponse(array $publications)
    {
        return array_map(function ($pub) {
            return [
                'id' => $pub['dc:identifier'],
                'title' => $pub['dc:title'],
                'authors' => implode(', ', array_column($pub['author'] ?? [], 'authname')),
                'date' => $pub['prism:coverDate'],
                'citationCount' => $pub['citedby-count'] ?? 0
            ];
        }, $publications);
    }
}