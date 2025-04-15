<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Models\Chercheur;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Http\Controllers\EmailVerificationController;
use App\Http\Controllers\DisciplineController;
use App\Http\Controllers\PublicationController;

// 🔐 Authentification (JWT)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/create-chercheur', [AuthController::class, 'createChercheurFromAdmin']);

// 📨 Vérification d'e-mail
Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill(); // Met à jour email_verified_at
    return response()->json(['message' => 'Email vérifié avec succès']);
})->middleware(['auth:api', 'signed'])->name('verification.verify');

Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();
    return response()->json(['message' => 'Lien de vérification renvoyé']);
})->middleware(['auth:api'])->name('verification.send');

// ✅ Cette route permet à React de récupérer l'utilisateur connecté via JWT
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return response()->json($request->user());
});

// ✅ Routes protégées (nécessitent d’être connecté + email vérifié)
Route::middleware(['auth:api', 'verified'])->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// 📚 Chercheurs
/*Route::get('/chercheurs', function () {
    return Chercheur::all();
});

Route::get('/chercheurs/{id}', function ($id) {
    return Chercheur::findOrFail($id);
});*/

// Routes pour les disciplines
Route::apiResource('disciplines', DisciplineController::class);

// Routes pour les publications
Route::apiResource('publications', PublicationController::class);
