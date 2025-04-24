<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ScopusPublicationController extends Controller
{
    public function searchAuthors(Request $request)
    {
        $request->validate([
            'nom' => 'sometimes|string|max:100',
            'prenom' => 'sometimes|string|max:100'
        ]);

        $user = $request->user();
        $nom = $this->cleanName($request->input('nom', $user->nom));
        $prenom = $this->cleanName($request->input('prenom', $user->prenom));

        try {
            $response = Http::withHeaders([
                'X-ELS-APIKey' => config('services.scopus.key'),
                'Accept' => 'application/json'
            ])->timeout(15)->get('https://api.elsevier.com/content/search/author', [
                'query' => "AUTHLASTNAME({$nom}) AND AUTHFIRST({$prenom})",
                'count' => 10,
                'field' => 'dc:identifier,preferred-name,affiliation-current,document-count'
            ]);

            return $this->handleAuthorResponse($response);
            
        } catch (\Exception $e) {
            Log::error('Erreur API Scopus: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur de connexion au service Scopus',
                'code' => 'scopus_unavailable'
            ], 503);
        }
    }

    private function cleanName(string $name): string
    {
        return preg_replace('/[^a-zA-Z\-\s]/', '', $name);
    }

    private function handleAuthorResponse($response)
    {
        if ($response->failed()) {
            $status = $response->status();
            $errorType = $status >= 500 ? 'server_error' : 'client_error';
            
            return response()->json([
                'message' => $this->getErrorMessage($status),
                'type' => $errorType,
                'retryable' => $status >= 500
            ], $status >= 500 ? 503 : 400);
        }

        $authors = collect($response->json('search-results.entry', []))
            ->map(function ($entry) {
                return [
                    'id' => $this->extractAuthorId($entry),
                    'name' => $entry['preferred-name']['indexed-name'] ?? 'Nom inconnu',
                    'affiliation' => data_get($entry, 'affiliation-current.0.affiliation-name', 'Affiliation non précisée'),
                    'documents' => $entry['document-count'] ?? 0,
                    'valid' => !empty($entry['dc:identifier'])
                ];
            })
            ->filter(fn($a) => $a['valid']);

        if ($authors->isEmpty()) {
            return response()->json([
                'message' => 'Aucun profil correspondant trouvé',
                'suggestions' => [
                    'Vérifiez les accents et caractères spéciaux',
                    'Essayez une version abrégée du prénom'
                ]
            ], 404);
        }

        return response()->json($authors->values());
    }

    private function extractAuthorId(array $entry): string
    {
        return Str::afterLast($entry['dc:identifier'] ?? '', 'AUTHOR_ID:') 
            ?: Str::uuid()->toString();
    }

    private function getErrorMessage(int $status): string
    {
        return match($status) {
            400 => 'Requête invalide - Vérifiez les paramètres',
            401 => 'Clé API Scopus invalide',
            403 => 'Accès non autorisé',
            429 => 'Limite de requêtes dépassée',
            500 => 'Erreur interne du serveur Scopus',
            default => 'Erreur de communication avec Scopus'
        };
    }

    public function linkAuthor(Request $request)
    {
        $data = $request->validate([
            'author_id' => [
                'required',
                'string',
                'max:20',
                'regex:/^\d+$/',
                Rule::prohibitedIf(fn() => !$this->validateScopusId($request->author_id))
            ]
        ]);

        try {
            $request->user()->updateScopusId($data['author_id']);

            return response()->json([
                'message' => 'Profil Scopus associé avec succès',
                'author_id' => $data['author_id'],
                'next' => route('publications.index')
            ]);

        } catch (\Exception $e) {
            Log::error('Liaison échouée: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Échec de la mise à jour du profil',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    private function validateScopusId(string $id): bool
    {
        return preg_match('/^[1-9]\d{8,19}$/', $id);
    }
}