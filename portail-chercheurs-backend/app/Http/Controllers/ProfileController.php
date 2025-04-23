<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\Chercheur;

class ProfileController extends Controller
{
    /**
     * Complète le profil du chercheur connecté.
     */
    public function completeProfile(Request $request)
    {
        $request->validate([
            'discipline'         => 'required|string|max:100',
            'scopus_author_id'   => 'nullable|string|max:20',
            'cv'                 => 'nullable|file|mimes:pdf|max:2048',
            'photoProfil'        => 'nullable|image|max:2048',
        ]);

        $user = Auth::user(); // instance de App\Models\Chercheur

        // Met à jour les champs simples
        $user->discipline = $request->input('discipline');
        $user->scopus_author_id = $request->input('scopus_author_id');

        // Gère le fichier CV
        if ($request->hasFile('cv')) {
            // supprime l'ancien CV si nécessaire
            if ($user->cv) {
                Storage::disk('public')->delete($user->cv);
            }
            $path = $request->file('cv')->store('cvs', 'public');
            $user->cv = $path;
        }

        // Gère la photo de profil
        if ($request->hasFile('photoProfil')) {
            if ($user->photoProfil) {
                Storage::disk('public')->delete($user->photoProfil);
            }
            $path = $request->file('photoProfil')->store('profiles', 'public');
            $user->photoProfil = $path;
        }

        // Enregistre et retourne la réponse
        $user->save();

        return response()->json([
            'message' => 'Profil complété avec succès.',
            'data'    => $user,
        ], 200);
    }
}