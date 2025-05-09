<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Models\Chercheur;
use App\Http\Controllers\DisciplineController;
use App\Http\Controllers\StatisticsController;
use App\Http\Controllers\PublicationController;
use App\Http\Controllers\ActualiteController;
use App\Http\Controllers\ChercheurController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\ScopusPublicationController;
use App\Http\Controllers\CommentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/* ==================== ROUTES D'AUTHENTIFICATION (JWT) ==================== */

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:api')->post('/logout', [AuthController::class, 'logout']);

// Route protégée pour admin seulement
Route::middleware(['auth:api', 'is_admin'])->post('/admin/create-chercheur', [AuthController::class, 'createChercheurFromAdmin']);

// Récupérer les informations de l'utilisateur connecté
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return response()->json($request->user());
});

// Profil utilisateur
Route::middleware('auth:api')->get('/profile', function (Request $request) {
    return $request->user();
});

// Changement de mot de passe
Route::middleware('auth:api')->post('/change-password', [AuthController::class, 'changePassword']);

/* ==================== ROUTES POUR LES CHERCHEURS ==================== */
Route::middleware('auth:api')->group(function () {
    // Lister tous les chercheurs
    Route::get('/chercheurs', [ChercheurController::class, 'apiIndex']);

    // Récupérer un chercheur spécifique

    // Supprimer un chercheur
    Route::delete('/chercheurs/{id}', [ChercheurController::class, 'destroy']);

    // Mettre à jour un chercheur
    Route::post('/chercheurs/{id}/update', [ChercheurController::class, 'update']);

    // Mettre à jour le profil (première connexion)
    Route::put('/chercheur/profil', [ChercheurController::class, 'updateProfil']);

    // Mettre à jour le profil général
    Route::put('/chercheur/profile', [ChercheurController::class, 'updateProfile']);
});
//recherche rapide (barre de recherche)
Route::get('/chercheurs/search', [ChercheurController::class, 'search']);

//get chercheur via son id
Route::get('/chercheurs/{id}', function ($id) {
    return Chercheur::findOrFail($id);
});
/* ==================== ROUTES POUR LES PUBLICATIONS ==================== */
Route::middleware('auth:api')->group(function () {
    // Lister les publications
    Route::get('/publications', [PublicationController::class, 'index']);

    // Récupérer les publications Scopus d'un chercheur
    Route::get('/chercheur/publications', [PublicationController::class, 'fetchScopusPublications']);

    // Enregistrer une publication
    Route::post('/chercheur/publications', [PublicationController::class, 'store']);

    // Enregistrer un batch de publications
    Route::post('/publications', [PublicationController::class, 'storeBatch']);

    //Récuperer les publications d'un chercheur donnée
    Route::get('/profile/publications', [PublicationController::class, 'profilePublications']);
});

// Récupérer les publications Scopus (via API externe)
Route::middleware('auth:api')->get('/scopus-publications', [ScopusPublicationController::class, 'fetchPublications']);

/* ==================== ROUTES POUR LES ACTUALITES ==================== */
Route::apiResource('actualites', ActualiteController::class);
Route::get('/actualites', [ActualiteController::class, 'index']);
Route::get('/actualites/{id}', [ActualiteController::class, 'show']);


/* ==================== ROUTES POUR LES FOLLOWS ==================== */
Route::middleware('auth:api')->group(function () {
    Route::post('/follow/{userToFollow}', [FollowController::class, 'follow']);
    Route::delete('/unfollow/{userToUnfollow}', [FollowController::class, 'unfollow']);
    Route::get('/is-following/{user}', [FollowController::class, 'isFollowing']);
});

/* ==================== ROUTES POUR LES DISCIPLINES ==================== */
Route::apiResource('disciplines', DisciplineController::class);
Route::get('/disciplines', [DisciplineController::class, 'index']);
Route::get('/disciplines/{id}', [DisciplineController::class, 'show']);

/* ==================== ROUTES POUR LES COMMENTAIRES ==================== */
Route::middleware(['auth:api'])->group(function () {
    Route::get('publications/{publication}/comments', [CommentController::class, 'index']);
    Route::post('comments',                         [CommentController::class, 'store']);
    Route::put('comments/{comment}',                [CommentController::class, 'update']);
    Route::delete('comments/{comment}',             [CommentController::class, 'destroy']);
});
/* ==================== ROUTES POUR LES STATISTIQUES ==================== */
Route::get('/stats', [StatisticsController::class, 'getStats']);
