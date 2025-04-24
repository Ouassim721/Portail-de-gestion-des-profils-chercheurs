<?php

namespace App\Http\Controllers;

use App\Models\Chercheur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ChercheurController extends Controller
{
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
    public function destroy($id)
    {
        $chercheur = Chercheur::find($id);
        if ($chercheur) {
            $chercheur->delete();
            return response()->json(['message' => 'Chercheur supprimé avec succès.']);
        }
        return response()->json(['message' => 'Chercheur introuvable.'], 404);
    }
    public function update(Request $request, $id)
    {
        $chercheur = Chercheur::findOrFail($id);
        $request->validate([
            'photoProfil' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // max 2 Mo
        ]);
        $chercheur->update($request->only(['nom', 'prenom', 'discipline', 'email']));

        if ($request->hasFile('cv')) {
            $path = $request->file('cv')->store('cvs', 'public');
            $chercheur->cv = $path;
        }

        // 🔥 Gestion de l’image
        if ($request->hasFile('photoProfil')) {
            // Supprimer l’ancienne si elle existe
            if ($chercheur->photoProfil && Storage::exists($chercheur->photoProfil)) {
                Storage::delete($chercheur->photoProfil);
            }

            // Enregistrer la nouvelle image
            $path = $request->file('photoProfil')->store('images/profils', 'public');
            $chercheur->photoProfil = 'storage/' . $path;
        }

        $chercheur->save();

        return response()->json($chercheur);
    }
    public function getNombreChercheurs()
    {
        $compteur = Chercheur::count();
        return response()->json(['count' => $compteur]);
    }
}
