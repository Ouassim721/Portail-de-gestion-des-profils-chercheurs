<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Auth;
use App\Models\Chercheur;
use App\Http\Controllers\DisciplineController;
use App\Http\Controllers\StatisticsController;
use App\Http\Controllers\PublicationController;
use App\Http\Controllers\ChercheurController;
use App\Http\Controllers\ScopusPublicationController;

//-------------------------------Authentification (JWT)-----------------------------------------------//
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:api')->post('/logout', [AuthController::class, 'logout']);
Route::middleware(['auth:api', 'is_admin'])->post('/admin/create-chercheur', [AuthController::class, 'createChercheurFromAdmin']);


Route::middleware('auth:api')->get('/user', function (Request $request) {
    return response()->json($request->user());
});

// Route::middleware(['auth:api', 'password.changed'])->group(function () {
//     Route::get('/profile', [AuthController::class, 'profile']);
// });
Route::middleware('auth:api')->get('/profile', function (Request $request) {
    return $request->user();
});


//Chercheurs
Route::middleware('auth:api')->get('/chercheurs', function () {
    return Chercheur::all();
});

Route::get('/chercheurs/{id}', function ($id) {
    return Chercheur::findOrFail($id);
});
Route::delete('/chercheurs/{id}', [ChercheurController::class, 'destroy']);

// Routes pour les disciplines
Route::apiResource('disciplines', DisciplineController::class);

// Routes pour les publications
// Route::apiResource('/publications', PublicationController::class, 'index');
Route::get('/publications', [PublicationController::class, 'index']);

Route::get('/chercheurs', [ChercheurController::class, 'apiIndex']);

// Route pour le nombre des chercheurs inscrit
Route::get('/stats', [StatisticsController::class, 'getStats']);

//Route pour le changement de mot de passe
Route::middleware('auth:api')->post('/change-password', [AuthController::class, 'changePassword']);

Route::middleware('auth:api')->group(function () {
    // Scopus
    Route::get('/scopus-publications', [ScopusPublicationController::class, 'searchAuthors']);
    Route::post('/publications', [ScopusPublicationController::class, 'store']);
    
    Route::put('/chercheur/profile', [ChercheurController::class, 'updateProfile']);
});

Route::middleware('auth:api')->group(function () {
    // Recherche d'auteurs
    Route::get('/scopus/authors', [ScopusPublicationController::class, 'searchAuthors']);
    Route::post('/scopus/link', [ScopusPublicationControllerr::class, 'linkAuthor']);
    // Lier un auteur
    Route::post('/scopus/link-author', [ScopusPublicationController::class, 'linkAuthor']);
    
});

