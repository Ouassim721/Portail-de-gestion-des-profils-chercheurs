<?php

namespace App\Http\Controllers;

use App\Models\Actualite;
use Illuminate\Http\Request;

class ActualiteController extends Controller
{
    // public function index()
    // {
    //     return Actualite::all();
    // }
    public function index()
    {
        $actualites = Actualite::whereDate('date_publication', '>=', now())
            ->orderBy('date_publication', 'asc')
            ->get();

        return response()->json($actualites);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre' => 'required|string|max:100',
            'localisation' => 'required|string|max:100',
            'description' => 'required|string|max:255',
            'categorie' => 'required|string|max:255',
            'document_pdf' => 'nullable|string',
            'date_publication' => 'nullable|date',
        ]);

        $actualite = Actualite::create($validated);

        return response()->json($actualite, 201);
    }

    public function show($id)
    {
        return Actualite::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $actualite = Actualite::findOrFail($id);

        $validated = $request->validate([
            'titre' => 'required|string|max:100',
            'localisation' => 'required|string|max:100',
            'description' => 'required|string|max:255',
            'categorie' => 'required|string|max:255',
            'document_pdf' => 'nullable|string',
            'date_publication' => 'nullable|date',
        ]);

        $actualite->update($validated);

        return response()->json($actualite);
    }

    public function destroy($id)
    {
        $actualite = Actualite::findOrFail($id);
        $actualite->delete();

        return response()->json(['message' => 'Actualité supprimée avec succès.']);
    }
}
