<?php

namespace App\Http\Controllers;

use App\Models\Discipline;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DisciplineController extends Controller
{
    /**
     * Affiche la liste des disciplines
     */
    public function index()
    {
        $disciplines = Discipline::all();
        return view('disciplines.index', compact('disciplines'));
    }

    /**
     * Affiche le formulaire de création
     */
    public function create()
    {
        return view('disciplines.create');
    }

    /**
     * Stocke une nouvelle discipline
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:100|unique:disciplines'
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        Discipline::create($request->all());

        return redirect()->route('disciplines.index')
            ->with('success', 'Discipline créée avec succès');
    }

    /**
     * Affiche les détails d'une discipline
     */
    public function show(Discipline $discipline)
    {
        return view('disciplines.show', compact('discipline'));
    }

    /**
     * Affiche le formulaire d'édition
     */
    public function edit(Discipline $discipline)
    {
        return view('disciplines.edit', compact('discipline'));
    }

    /**
     * Met à jour une discipline
     */
    public function update(Request $request, Discipline $discipline)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:100|unique:disciplines,nom,'.$discipline->id
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $discipline->update($request->all());

        return redirect()->route('disciplines.index')
            ->with('success', 'Discipline mise à jour');
    }

    /**
     * Supprime une discipline
     */
    public function destroy(Discipline $discipline)
    {
        try {
            $discipline->delete();
            return redirect()->route('disciplines.index')
                ->with('success', 'Discipline supprimée');
                
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Impossible de supprimer : des publications sont liées');
        }
    }
}