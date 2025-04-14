<?php

namespace App\Http\Controllers;

use App\Models\Chercheur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class ChercheurController extends Controller
{
    /**
     * Affiche la liste des chercheurs
     */
    public function index()
    {
        $chercheurs = Chercheur::all();
        return view('chercheurs.index', compact('chercheurs'));
    }

    /**
     * Affiche le formulaire de création
     */
    public function create()
    {
        return view('chercheurs.create');
    }

    /**
     * Enregistre un nouveau chercheur
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'email' => 'required|email|unique:chercheur,email',
            'mot_de_passe' => 'required|min:8',
            'date_naissance' => 'required|date',
            'cv' => 'required|mimes:pdf|max:2048',
            'role' => 'sometimes|in:Chercheur,Administrateur'
        ]);

        // Gestion du CV
        $cvPath = $request->file('cv')->store('cv', 'public');

        Chercheur::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'mot_de_passe' => Hash::make($request->mot_de_passe),
            'date_naissance' => $request->date_naissance,
            'cv' => $cvPath,
            'role' => $request->role ?? 'Chercheur'
        ]);

        return redirect()->route('chercheurs.index')
            ->with('success', 'Chercheur créé avec succès');
    }

    /**
     * Affiche les détails d'un chercheur
     */
    public function show(Chercheur $chercheur)
    {
        return view('chercheurs.show', compact('chercheur'));
    }

    /**
     * Affiche le formulaire d'édition
     */
    public function edit(Chercheur $chercheur)
    {
        return view('chercheurs.edit', compact('chercheur'));
    }

    /**
     * Met à jour un chercheur
     */
    public function update(Request $request, Chercheur $chercheur)
    {
        $validated = $request->validate([
            'nom' => 'sometimes|string|max:100',
            'prenom' => 'sometimes|string|max:100',
            'email' => 'sometimes|email|unique:chercheur,email,'.$chercheur->id,
            'mot_de_passe' => 'sometimes|min:8',
            'date_naissance' => 'sometimes|date',
            'cv' => 'sometimes|mimes:pdf|max:2048',
            'role' => 'sometimes|in:Chercheur,Administrateur'
        ]);

        $data = $request->except('cv', 'mot_de_passe');

        // Mise à jour du mot de passe
        if ($request->filled('mot_de_passe')) {
            $data['mot_de_passe'] = Hash::make($request->mot_de_passe);
        }

        // Mise à jour du CV
        if ($request->hasFile('cv')) {
            Storage::delete($chercheur->cv);
            $data['cv'] = $request->file('cv')->store('cv', 'public');
        }

        $chercheur->update($data);

        return redirect()->route('chercheurs.show', $chercheur)
            ->with('success', 'Profil mis à jour');
    }

    /**
     * Supprime un chercheur
     */
    public function destroy(Chercheur $chercheur)
    {
        Storage::delete($chercheur->cv);
        $chercheur->delete();
        return redirect()->route('chercheurs.index')
            ->with('success', 'Chercheur supprimé');
    }

    /**
     * Télécharge le CV
     */
    public function downloadCv(Chercheur $chercheur)
    {
        return Storage::disk('public')->download($chercheur->cv);
    }
}