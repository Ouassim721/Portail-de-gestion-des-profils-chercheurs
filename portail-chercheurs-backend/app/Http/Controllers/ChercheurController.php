<?php

namespace App\Http\Controllers;

use App\Models\Discipline;
use App\Models\Chercheur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

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
     * Stocke un nouveau chercheur
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'email' => 'required|email|max:150|unique:chercheur',
            'mot_de_passe' => 'required|string|min:8',
            'date_naissance' => 'required|date',
            'discipline' => 'required|string|max:100',
            'cv' => 'required|mimes:pdf|max:2048',
            'role' => 'sometimes|in:Chercheur,Administrateur'
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $cheminCV = $this->uploadCV($request->file('cv'));

        Chercheur::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'mot_de_passe' => bcrypt($request->mot_de_passe),
            'date_naissance' => $request->date_naissance,
            'discipline' => $request->discipline,
            'cv' => $cheminCV,
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
    $validator = Validator::make($request->all(), [
        'nom' => 'sometimes|string|max:100',
        'prenom' => 'sometimes|string|max:100',
        'email' => 'sometimes|email|max:150|unique:chercheur,email,'.$chercheur->id,
        'date_naissance' => 'sometimes|date',
        'discipline' => 'required|string|max:100',
        'cv' => 'sometimes|mimes:pdf|max:2048',
        'role' => 'sometimes|in:Chercheur,Administrateur'
    ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $data = $request->except('cv');

        if ($request->hasFile('cv')) {
            Storage::delete($chercheur->cv);
            $data['cv'] = $this->uploadCV($request->file('cv'));
        }

        $chercheur->update($data);

        return redirect()->route('chercheurs.index')
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
     * Gère l'upload du CV
     */
    private function uploadCV($file)
    {
        return $file->storeAs(
            'cv',
            'cv_'.time().'.'.$file->getClientOriginalExtension(),
            'public'
        );
    }
}
