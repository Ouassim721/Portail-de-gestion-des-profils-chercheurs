<?php

namespace App\Http\Controllers;

use App\Models\Chercheur;
use Illuminate\Http\Request;

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
}
