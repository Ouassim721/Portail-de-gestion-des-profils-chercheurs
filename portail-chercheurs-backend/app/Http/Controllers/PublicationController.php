<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use App\Models\Chercheur;
use App\Models\Discipline;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PublicationController extends Controller
{
    /**
     * Affiche la liste des publications
     */
    public function index()
    {
        $publications = Publication::with(['chercheur', 'discipline'])->get();
        return view('publications.index', compact('publications'));
    }

    /**
     * Affiche le formulaire de création
     */
    public function create()
    {
        $chercheurs = Chercheur::all();
        $disciplines = Discipline::all();
        return view('publications.create', compact('chercheurs', 'disciplines'));
    }

    /**
     * Stocke une nouvelle publication
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'titre' => 'required|string|max:255',
            'date_publication' => 'required|date',
            'auteurs' => 'required|string',
            'abstract' => 'required|string',
            'chercheur_id' => 'required|exists:chercheur,id',
            'discipline_id' => 'required|exists:disciplines,id'
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        Publication::create([
            'titre' => $request->titre,
            'date_publication' => $request->date_publication,
            'date_modification' => $request->date_modification,
            'auteurs' => $request->auteurs,
            'abstract' => $request->abstract,
            'chercheur_id' => $request->chercheur_id,
            'discipline_id' => $request->discipline_id
        ]);

        return redirect()->route('publications.index')
            ->with('success', 'Publication créée avec succès');
    }

    /**
     * Affiche les détails d'une publication
     */
    public function show(Publication $publication)
    {
        return view('publications.show', compact('publication'));
    }

    /**
     * Affiche le formulaire d'édition
     */
    public function edit(Publication $publication)
    {
        $chercheurs = Chercheur::all();
        $disciplines = Discipline::all();
        return view('publications.edit', compact('publication', 'chercheurs', 'disciplines'));
    }

    /**
     * Met à jour une publication
     */
    public function update(Request $request, Publication $publication)
    {
        $validator = Validator::make($request->all(), [
            'titre' => 'sometimes|string|max:255',
            'date_publication' => 'sometimes|date',
            'auteurs' => 'sometimes|string',
            'abstract' => 'sometimes|string',
            'chercheur_id' => 'sometimes|exists:chercheur,id',
            'discipline_id' => 'sometimes|exists:disciplines,id'
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $publication->update($request->all());

        return redirect()->route('publications.index')
            ->with('success', 'Publication mise à jour');
    }

    /**
     * Supprime une publication
     */
    public function destroy(Publication $publication)
    {
        $publication->delete();
        return redirect()->route('publications.index')
            ->with('success', 'Publication supprimée');
    }
    public function getNombrePublications()
    {
        $compteur = Publication::count();
        return response()->json(['count' => $compteur]);
    }
}
