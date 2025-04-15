<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Models\Chercheur;
use App\Http\Controllers\EmailVerificationController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Http\Controllers\DisciplineController;
use App\Http\Controllers\PublicationController;
use App\Http\Controllers\ChercheurController;

Route::post('/register', [AuthController::class, 'register']);  // Inscription de l'utilisateur

// ******************** Vérification d'email ****************************/
Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();  // Met à jour email_verified_at
    return response()->json(['message' => 'Email vérifié avec succès']);
})->middleware(['auth:api', 'signed'])->name('verification.verify');

Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();
    return response()->json(['message' => 'Lien de vérification renvoyé']);
})->middleware(['auth:api'])->name('verification.send');

Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
    ->name('verification.verify');
// ******************** Fin Vérification d'email ************************/

// Route pour la connexion avec JWT
Route::post('/login', [AuthController::class, 'login']);  // Connexion pour obtenir le token

// Middleware pour les utilisateurs authentifiés et vérifiés
Route::middleware(['auth:api', 'verified'])->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);  // Affiche le profil de l'utilisateur connecté
    Route::post('/logout', [AuthController::class, 'logout']);  // Déconnexion
});

// Route pour récupérer tous les chercheurs
Route::get('/chercheurs', function () {
    return Chercheur::all();
});

// Route pour récupérer un chercheur par ID
Route::get('/chercheurs/{id}', function ($id) {
    return Chercheur::findOrFail($id);
});

// Routes pour les disciplines
Route::apiResource('disciplines', DisciplineController::class);

// Routes pour les publications
Route::apiResource('publications', PublicationController::class);


Route::get('/chercheurs', [ChercheurController::class, 'apiIndex']);