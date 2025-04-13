<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

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

        // Envoie l'email de vérification
        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Utilisateur créé. Veuillez vérifier votre e-mail pour activer votre compte.'
        ]);
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

        // Login OK
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
