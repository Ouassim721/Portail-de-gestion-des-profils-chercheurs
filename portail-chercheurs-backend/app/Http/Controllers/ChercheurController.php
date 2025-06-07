<?php

namespace App\Http\Controllers;

use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\Chercheur;
use App\Models\Cours;
use App\Models\Matiere;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\Rule;

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
                'collaborations' => $chercheur->publications->sum(function ($pub) {
                    $auteurs = explode(',', $pub->auteurs);
                    return count($auteurs); // Subtract the researcher themselves
                })
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * GET /api/chercheurs/{id}/cours
     * Récupère tous les cours publiés par le chercheur d’ID = $id
     */
    public function getCours($id)
    {
        try {
            $chercheur = Chercheur::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Chercheur introuvable.'], 404);
        }

        // Charger les cours avec leurs matières
        $cours = $chercheur->cours()
            ->with('matiere')
            ->orderBy('datePublication', 'desc')
            ->get();

        return response()->json($cours, 200);
    }

    /**
     * POST /api/chercheurs/{id}/cours
     * Crée un nouveau cours pour le chercheur d’ID = $id
     */
    public function storeCours(Request $request, $id)
    {
        try {
            $chercheur = Chercheur::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Chercheur introuvable.'], 404);
        }

        // Validation des champs
        $request->validate([
            'titre'           => 'required|string|max:255',
            'description'     => 'required|string',
            'datePublication' => 'required|date',
            'fichier'         => 'required|file|mimes:pdf|max:10240',
            'id_matiere'      => [
                'required',
                'integer',
                Rule::exists('matieres', 'id_matiere')
            ],
        ]);

        // Vérifier que la matière demandée existe
        $matiere = Matiere::find($request->id_matiere);
        if (! $matiere) {
            return response()->json(['message' => 'Matière introuvable.'], 404);
        }

        // Stocker le fichier (par ex. dans storage/app/public/cours)
        $cheminFichier = $request->file('fichier')->store('cours', 'public');

        // Création du cours
        $cours = new Cours();
        $cours->titre           = $request->titre;
        $cours->description     = $request->description;
        $cours->datePublication = $request->datePublication;
        $cours->fichier         = 'storage/' . $cheminFichier; // chemin accessible depuis le front
        $cours->id_chercheur    = $chercheur->id;
        $cours->id_matiere = $matiere->id_matiere;
        $cours->save();

        // Charger la relation matière pour retourner un objet plus complet
        $cours->load('matiere');

        return response()->json($cours, 201);
    }

    /**
     * PUT/PATCH /api/chercheurs/{id}/cours/{coursId}
     * Met à jour un cours existant, à condition qu’il appartienne bien au chercheur.
     */
    public function updateCours(Request $request, $id, $coursId)
    {
        try {
            $chercheur = Chercheur::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Chercheur introuvable.'], 404);
        }

        // Récupérer le cours et vérifier qu’il appartient à ce chercheur
        $cours = Cours::where('id_cours', $coursId)
            ->where('id_chercheur', $chercheur->id)
            ->first();

        if (! $cours) {
            return response()->json(['message' => 'Cours introuvable ou n’appartient pas à ce chercheur.'], 404);
        }

        // Validation des champs (tous en "sometimes" car on ne les modifie pas forcément tous)
        $request->validate([
            'titre'           => 'sometimes|required|string|max:255',
            'description'     => 'sometimes|required|string',
            'datePublication' => 'sometimes|required|date',
            'fichier' => 'sometimes|file|mimes:pdf|max:10240',
            'id_matiere'      => [
                'sometimes',
                'required',
                'integer',
                Rule::exists('matieres', 'id_matiere')
            ],
        ]);

        // Mise à jour des champs si présents
        if ($request->filled('titre')) {
            $cours->titre = $request->titre;
        }
        if ($request->filled('description')) {
            $cours->description = $request->description;
        }
        if ($request->filled('datePublication')) {
            $cours->datePublication = $request->datePublication;
        }
        if ($request->filled('id_matiere')) {
            $cours->id_matiere = $request->id_matiere;
        }

        // Gestion du remplacement du fichier PDF
        if ($request->hasFile('fichier')) {
            // Supprimer l’ancien fichier
            if ($cours->fichier && Storage::exists(str_replace('storage/', '', $cours->fichier))) {
                Storage::delete(str_replace('storage/', '', $cours->fichier));
            }
            $cheminFichier = $request->file('fichier')->store('cours', 'public');
            $cours->fichier = 'storage/' . $cheminFichier;
        }

        $cours->save();
        $cours->load('matiere');

        return response()->json($cours, 200);
    }

    /**
     * DELETE /api/chercheurs/{id}/cours/{coursId}
     * Supprime un cours, à condition qu’il appartienne à ce chercheur.
     */
     public function destroyCours($id, $coursId)
    {
        try {
            $chercheur = Chercheur::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Chercheur introuvable.'], 404);
        }

        $cours = Cours::where('id_cours', $coursId)
            ->where('id_chercheur', $chercheur->id)
            ->first();

        if (!$cours) {
            return response()->json(['message' => 'Cours introuvable ou n’appartient pas à ce chercheur.'], 404);
        }
        // Supprimer le fichier associé au cours
        $filePath = str_replace('storage/', 'public/', $cours->fichier);
        
        if (Storage::exists($filePath)) {
            Storage::delete($filePath);
        }

        $cours->delete();
        return response()->json(['message' => 'Cours supprimé avec succès.'], 200);
    }

    /**
     * GET /api/chercheurs/{id}/matieres
     * Récupère toutes les matières que le chercheur d’ID = $id enseigne.
     */
public function getMatieres($id)
{
    try {
        $chercheur = Chercheur::findOrFail($id);
        // Charger via la relation pivot
        $matieres = $chercheur->matieres()
            ->select('matieres.id_matiere', 'matieres.nom_matiere') // Spécifier explicitement les colonnes
            ->get();
        return response()->json($matieres, 200);
    } catch (ModelNotFoundException $e) {
        return response()->json(['message' => 'Chercheur introuvable.'], 404);
    }
}

    /**
     * POST /api/chercheurs/{id}/matieres
     * Lie une matière au chercheur (table pivot 'enseigner').
     * On attend, dans le corps JSON, { "id_matiere": X }
     */
   public function attachMatiere(Request $request, $id)
{
    try {
        $chercheur = Chercheur::findOrFail($id);
    } catch (ModelNotFoundException $e) {
        return response()->json(['message' => 'Chercheur introuvable.'], 404);
    }

    $request->validate([
        'id_matiere' => 'required|integer|exists:matieres,id_matiere',
    ]);

    $matiereId = $request->id_matiere;

    // Correction : Spécifier explicitement la table dans la condition where
    if ($chercheur->matieres()->where('matieres.id_matiere', $matiereId)->exists()) {
        return response()->json(['message' => 'Le chercheur enseigne déjà cette matière.'], 409);
    }

    // Insérer dans la table pivot
    $chercheur->matieres()->attach($matiereId);

    // Retourner la matière attachée
    $matiere = Matiere::find($matiereId);
    return response()->json([
        'id_matiere' => $matiere->id_matiere,
        'nom_matiere' => $matiere->nom_matiere
    ], 201);
}

    /**
     * DELETE /api/chercheurs/{id}/matieres/{matiereId}
     * Supprime la liaison entre le chercheur et la matière (table pivot).
     */
public function detachMatiere($id, $matiereId)
{
    try {
        $chercheur = Chercheur::findOrFail($id);
    } catch (ModelNotFoundException $e) {
        return response()->json(['message' => 'Chercheur introuvable.'], 404);
    }

    // Correction : Spécifier explicitement la table dans la condition where
    if (!$chercheur->matieres()->where('matieres.id_matiere', $matiereId)->exists()) {
        return response()->json(['message' => 'Le lien chercheur⇄matière n’existe pas.'], 404);
    }

    // Correction : Utiliser detach avec l'ID de matière
    $chercheur->matieres()->detach($matiereId);

    return response()->json(['message' => 'Matière détachée avec succès.'], 200);
}

public function showCours($id, $coursId)
{
    try {
        $chercheur = Chercheur::findOrFail($id);
    } catch (ModelNotFoundException $e) {
        return response()->json(['message' => 'Chercheur introuvable.'], 404);
    }

    $cours = Cours::where('id_cours', $coursId)
        ->where('id_chercheur', $chercheur->id)
        ->with('matiere')
        ->first();

    if (!$cours) {
        return response()->json(['message' => 'Cours introuvable ou n’appartient pas à ce chercheur.'], 404);
    }

    return response()->json($cours);
}

}
