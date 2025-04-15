<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\Chercheur;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Utilisateur créé. Veuillez vérifier votre e-mail pour activer votre compte.'
        ]);
    }
    public function createChercheurFromAdmin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'prenom' => 'required|string',
            'nom' => 'required|string',
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Données invalides.'], 400);
        }

        $prenom = strtolower($request->prenom);
        $nom = strtolower($request->nom);
        $email = strtolower($request->email);

        // Chercher le chercheur dans la base
        $chercheur = Chercheur::whereRaw('LOWER(prenom) = ?', [$prenom])
            ->whereRaw('LOWER(nom) = ?', [$nom])
            ->whereRaw('LOWER(email) = ?', [$email])
            ->first();

        if (!$chercheur) {
            return response()->json(['message' => 'Chercheur non trouvé.'], 404);
        }

        $annee = \Carbon\Carbon::parse($chercheur->date_naissance)->year ?? '0000';
        $passwordRaw = $prenom . $nom . '@' . $annee;

        // Vérifier si un utilisateur existe déjà avec cet email
        if (User::where('email', $email)->exists()) {
            return response()->json(['message' => 'Un utilisateur avec cet email existe déjà.'], 409);
        }

        // Créer l'utilisateur
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

        // Vérifier si l'email est confirmé
        if (!$user->hasVerifiedEmail()) {
            // Supprime l'utilisateur non vérifié
            $user->delete();

            return response()->json([
                'error' => 'Votre e-mail n\'a pas été vérifié. Le compte a été supprimé.'
            ], 403);
        }

        $token = $user->createToken('MyApp')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function profile()
    {
        return response()->json(Auth::guard('api')->user());
    }

    public function logout()
    {
        Auth::guard('api')->logout();
        return response()->json(['message' => 'Déconnexion réussie']);
    }
}
