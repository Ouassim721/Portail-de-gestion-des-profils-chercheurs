<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Chercheur;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function createChercheurFromAdmin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'prenom' => 'required|string',
            'nom' => 'required|string',
            'email' => 'required|email',
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

        $chercheur = Chercheur::whereRaw('LOWER(prenom) = ?', [$prenom])
            ->whereRaw('LOWER(nom) = ?', [$nom])
            ->whereRaw('LOWER(email) = ?', [$email])
            ->first();

        if (!$chercheur) {
            return response()->json(['message' => 'Chercheur non trouvé.'], 404);
        }

        $annee = $chercheur->date_naissance ? Carbon::parse($chercheur->date_naissance)->year : '0000';
        $passwordRaw = $prenom . $nom . '@' . $annee;

        if (User::where('email', $email)->exists()) {
            return response()->json(['message' => 'Un utilisateur avec cet email existe déjà.'], 409);
        }

        $user = User::create([
            'name' => ucfirst($prenom) . ' ' . ucfirst($nom),
            'email' => $email,
            'password' => Hash::make($passwordRaw),
            'role' => 'chercheur',
        ]);

        return response()->json([
            'message' => 'Utilisateur chercheur créé avec succès.',
            'default_password' => $passwordRaw,
            'user' => $user,
        ], 201);
    }
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['error' => 'Identifiants incorrects.'], 401);
        }

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'user' => $user,
        ])->cookie(
            'token',               // Nom du cookie
            $token,                // Le token JWT
            60 * 24,               // Durée d'expiration (ici 24 heures)
            null,                  // Chemin (null pour tout le domaine)
            null,                  // Domaine (null pour le domaine actuel)
            true,                  // Secure (True pour HTTPS uniquement)
            true,                  // HttpOnly (Empêche l'accès par JavaScript)
            false,                 // SameSite (Strict pour éviter le partage inter-domaines)
            'Strict'              // SameSite=Strict (protéger contre CSRF)
        );
    }

    public function profile()
    {
        return response()->json(JWTAuth::user());
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
