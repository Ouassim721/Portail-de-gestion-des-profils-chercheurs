<?php

namespace App\Http\Controllers;

use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\Chercheur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class ChercheurController extends Controller
{
    use SoftDeletes;
    // Méthode API pour récupérer la liste paginée des chercheurs
    public function apiIndex(Request $request)
    {
        $perPage = $request->get('per_page', 10); // Nombre d'éléments par page configurable

        // Construction de la requête de base avec le count de publications
        $query = Chercheur::query()
            ->select([
                'chercheurs.*',
                DB::raw('(SELECT COUNT(*) FROM publications WHERE publications.chercheur_id = chercheurs.id) as publications_count')
            ]);

        // Recherche textuelle
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('nom', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('prenom', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('discipline', 'LIKE', "%{$searchTerm}%");
            });
        }

        // Filtrage par département
        if ($request->filled('departement')) {
            $query->where('discipline', $request->departement);
        }

        // Filtrage par nombre minimum de publications
        if ($request->filled('publications')) {
            $minPublications = (int)$request->publications;
            $query->having('publications_count', '>=', $minPublications);
        }

        // Gestion du tri
        $sortableColumns = [
            'nom' => DB::raw("CONCAT(prenom, ' ', nom)"), // Tri par nom complet
            'departement' => 'discipline',
            'publications' => 'publications_count'
        ];

        $sortColumn = $request->get('sort', 'nom');
        $sortDirection = strtolower($request->get('direction', 'asc')) === 'asc' ? 'asc' : 'desc';

        if (array_key_exists($sortColumn, $sortableColumns)) {
            $query->orderBy($sortableColumns[$sortColumn], $sortDirection);
        }

        // Tri secondaire par nom pour plus de cohérence
        if ($sortColumn !== 'nom') {
            $query->orderBy(DB::raw("CONCAT(prenom, ' ', nom)"), 'asc');
        }

        // Pagination avec count du total exact
        $chercheurs = $query->paginate($perPage);

        return response()->json([
            'data' => $chercheurs->items(),
            'current_page' => $chercheurs->currentPage(),
            'last_page' => $chercheurs->lastPage(),
            'per_page' => $chercheurs->perPage(),
            'total' => $chercheurs->total(),
        ]);
    }
    /**
     * Méthode pour la suppression d'un chercheur via admin
     *
     * @param [type] $id
     * @return void
     */
    public function destroy($id)
    {
        $chercheur = Chercheur::find($id);
        if ($chercheur) {
            $chercheur->delete();
            return response()->json(['message' => 'Chercheur supprimé avec succès.']);
        }
        return response()->json(['message' => 'Chercheur introuvable.'], 404);
    }
    /**
     * Méthode permettant au chercheur de modifier son profil depuis sa page profil
     *
     * @param Request $request
     * @param [type] $id
     * @return void
     */
    public function update(Request $request, $id)
    {
        $chercheur = Chercheur::findOrFail($id);
        $request->validate([
            'photoProfil' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Mise à jour des champs de base
        $chercheur->update($request->only(['nom', 'prenom', 'discipline', 'email', 'status', 'about']));

        // Gestion du CV (si applicable)
        if ($request->hasFile('cv')) {
            $path = $request->file('cv')->store('cvs', 'public');
            $chercheur->cv = $path;
        }

        //  Gestion de la suppression de photo
        if ($request->has('removePhoto') && $request->removePhoto == "true") {
            if ($chercheur->photoProfil && Storage::exists($chercheur->photoProfil)) {
                Storage::delete($chercheur->photoProfil);
            }
            $chercheur->photoProfil = null;
        }
        // Gestion de l'upload de nouvelle photo
        elseif ($request->hasFile('photoProfil')) {
            // Supprimer l'ancienne si elle existe
            if ($chercheur->photoProfil && Storage::exists($chercheur->photoProfil)) {
                Storage::delete($chercheur->photoProfil);
            }

            $path = $request->file('photoProfil')->store('images/profils', 'public');
            $chercheur->photoProfil = 'storage/' . $path;
        }

        $chercheur->save();

        return response()->json($chercheur);
    }
    /**
     * Méthode pour le remplissage de profil lors de la première connexion
     *
     * @param Request $request
     * @return void
     */
    public function updateProfil(Request $request)
    {
        $chercheur = JWTAuth::user();

        $validated = $request->validate([
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'scopus_author_id' => 'required|string|max:20',
            'discipline' => 'nullable|string|max:100',
        ]);

        $chercheur->update($validated);

        return response()->json(['message' => 'Profil mis à jour avec succès']);
    }
    /**
     * Méthode pour la barre de recherche
     *
     * @param Request $request
     * @return void
     */
    public function search(Request $request)
    {
        $search = $request->query('q');

        $results = Chercheur::where('nom', 'like', "%{$search}%")
            ->orWhere('prenom', 'like', "%{$search}%")
            ->limit(5)
            ->get(['id', 'nom', 'prenom']);

        return response()->json($results);
    }


    /**
     * Méthode pour la récupération de nombre des chercheurs inscrit dans le portail
     *
     * @return void
     */
    public function getNombreChercheurs()
    {
        $compteur = Chercheur::count();
        return response()->json(['count' => $compteur]);
    }

public function getFollowersCount()
{
    try {
        $chercheur = JWTAuth::user();
        return response()->json([
            'count' => $chercheur->followers()->count()
        ]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

public function personalStats()
{
    try {
        $chercheur = JWTAuth::user();
        return response()->json([
            'publications' => $chercheur->publications()->count(),
            'citations' => $chercheur->publications()->sum('citation_count'),
            'collaborations' => $chercheur->publications->sum(function($pub) {
                $auteurs = explode(',', $pub->auteurs);
                return count($auteurs) ; // Subtract the researcher themselves
            })
        ]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
}
