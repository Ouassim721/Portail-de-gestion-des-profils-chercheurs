<?php

namespace App\Http\Controllers;

use App\Models\Actualite;
use Illuminate\Http\Request;

class ActualiteController extends Controller
{
    /**
     * Méthode permettant de récupérer les actualités stockés dans la Base de données
     *
     * @return void
     */
    public function index()
    {
        $actualites = Actualite::whereDate('date_publication', '>=', now())
            ->orderBy('date_publication', 'asc')
            ->get();

        return response()->json($actualites);
    }
    /**
     * Méthode permettant de récuperer un nombre limité des actualites pour la page d'accueil
     *
     * @return void
     */
    public function homeIndex()
    {
        $actualites = Actualite::whereDate('date_publication', '>=', now())
            ->orderBy('date_publication', 'asc')
            ->limit(3)
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
            'document_pdf' => 'nullable|file|mimes:pdf|max:10240',
            'date_publication' => 'nullable|date',
        ]);
        if ($request->hasFile('document_pdf')) {
            $pdfPath = $request->file('document_pdf')->store('actualites', 'public');
            $validated['document_pdf'] = $pdfPath;
        }
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
            'document_pdf' => 'nullable|file|mimes:pdf|max:10240',
            'date_publication' => 'nullable|date',
        ]);
        if ($request->hasFile('document_pdf')) {
            $file = $request->file('document_pdf');
            $path = $file->store('actualites', 'public'); // Stocké dans storage/app/public/actualites
            $validated['document_pdf'] = $path;
        }
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
