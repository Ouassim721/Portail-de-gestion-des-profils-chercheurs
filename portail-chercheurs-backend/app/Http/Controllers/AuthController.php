<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Chercheur;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Notifications\ChercheurCree;

class AuthController extends Controller
{
    public function createChercheurFromAdmin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'prenom' => 'required|string',
            'nom' => 'required|string',
            'email' => 'required|email|unique:chercheurs,email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Données invalides.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $prenom = strtolower(trim($request->prenom));
        $nom = strtolower(trim($request->nom));
        $email = strtolower(trim($request->email));

        $passwordRaw = $prenom . '@' . $nom;

        $user = Chercheur::create([
            'nom' => ucfirst($nom),
            'prenom' => ucfirst($prenom),
            'email' => $email,
            'password' => Hash::make($passwordRaw),
            'role' => 'chercheur',
            'discipline' => 'Informatique'
        ]);
        $user->notify(new ChercheurCree($passwordRaw));

        return response()->json([
            'message' => 'Utilisateur chercheur créé avec succès.',
            // 'default_password' => $passwordRaw,
            'user' => $user,
        ], 201);
    }
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        $user = Chercheur::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['error' => 'Identifiants incorrects.'], 401);
        }

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'user' => $user,
        ])->cookie(
            'token',               // Nom du cookie
            $token,                // Le token JWT
            60 * 24 * 30,               // Durée d'expiration (ici 1 mois)
            null,                  // Chemin (null pour tout le domaine)
            null,                  // Domaine (null pour le domaine actuel)
            true,                  // Secure (True pour HTTPS uniquement)
            true,                  // HttpOnly (Empêche l'accès par JavaScript)
            false,                 // SameSite (Strict pour éviter le partage inter-domaines)
            'Strict'               // SameSite=Strict (protéger contre CSRF)
        );
    }

    public function profile()
    {
        return response()->json(JWTAuth::user());
    }
    public function changePassword(Request $request)
    {
        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = JWTAuth::user();
        $user->password = bcrypt($request->password);
        $user->must_change_password = false;
        $user->save();

        return response()->json(['message' => 'Mot de passe changé avec succès.']);
    }

    public function logout()
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['message' => 'Déconnexion réussie.']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Échec de la déconnexion.'], 500);
        }
    }
}
