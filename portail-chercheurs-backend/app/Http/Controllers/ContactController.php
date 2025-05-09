<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactMessage;
use Tymon\JWTAuth\Facades\JWTAuth;

class ContactController extends Controller
{
    public function sendMessage(Request $request)
    {
        $user = JWTAuth::user();

        // Valider les champs
        $validated = $request->validate([
            'sujet' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        // Vérifier que les données sont bien définies
        if (is_null($user) || is_null($validated['sujet']) || is_null($validated['message'])) {
            return response()->json(['message' => 'Données manquantes ou invalides.'], 400);
        }
        // Envoyer l'email
        try {
            Mail::to(env('MAIL_FROM_ADDRESS'))->send(
                (new ContactMessage($user, $validated['sujet'], $validated['message']))
                    ->replyTo($user->email, $user->prenom . ' ' . $user->nom)
            );
            return response()->json(['message' => 'Email envoyé avec succès'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de l\'envoi de l\'email.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
