<?php

namespace App\Http\Controllers;

use App\Models\Chercheur;
use Illuminate\Http\Request;

class ChercheurController extends Controller
{
    // Récupérer la liste des chercheurs
    public function index()
    {
        $chercheurs = Chercheur::all();
        return response()->json($chercheurs);
    }

    // Récupérer un chercheur spécifique
    public function show($id)
    {
        $chercheur = Chercheur::find($id);
        return response()->json($chercheur);
    }

    // Créer un nouveau chercheur
    public function store(Request $request)
    {
        $chercheur = Chercheur::create($request->all());
        return response()->json($chercheur, 201);
    }
}
