<?php

namespace App\Http\Controllers;

use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\Chercheur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\SoftDeletes;

class ChercheurController extends Controller
{
    use SoftDeletes;
    // Méthode API pour récupérer la liste paginée des chercheurs
    public function apiIndex(Request $request)
    {
        $perPage = 10; // Nombre de chercheurs par page
        $chercheurs = Chercheur::withPublicationsCount()->paginate($perPage);

        return response()->json([
            'data' => $chercheurs->items(),       // Liste des chercheurs
            'current_page' => $chercheurs->currentPage(),
            'last_page' => $chercheurs->lastPage(),
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

        // 🔥 Gestion de la suppression de photo
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
     * Méthode pour la récupération de nombre des chercheurs inscrit dans le portail
     *
     * @return void
     */
    public function getNombreChercheurs()
    {
        $compteur = Chercheur::count();
        return response()->json(['count' => $compteur]);
    }
}
