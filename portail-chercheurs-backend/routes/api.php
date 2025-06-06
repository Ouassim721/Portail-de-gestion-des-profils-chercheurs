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
use App\Http\Controllers\ContactController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\MatiereController;
use App\Http\Controllers\CoursController;
use App\Http\Controllers\EnseignerController;

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
Route::middleware('auth:api')->get('/me', function (Request $request) {
    return $request->user();
});

// Changement de mot de passe
Route::middleware('auth:api')->post('/change-password', [AuthController::class, 'changePassword']);

/* ==================== ROUTES POUR LES CHERCHEURS ==================== */
Route::middleware('auth:api')->group(function () {
    // Supprimer un chercheur
    Route::delete('/chercheurs/{id}', [ChercheurController::class, 'destroy']);

    // Mettre à jour un chercheur
    Route::post('/chercheurs/{id}/update', [ChercheurController::class, 'update']);

    // Mettre à jour le profil (première connexion)
    Route::put('/chercheur/profil', [ChercheurController::class, 'updateProfil']);

    // Mettre à jour le profil général
    Route::put('/chercheur/profile', [ChercheurController::class, 'updateProfile']);
});
// Lister tous les chercheurs
Route::get('/chercheurs', [ChercheurController::class, 'apiIndex']);

//recherche rapide (barre de recherche)
Route::get('/chercheurs/search', [ChercheurController::class, 'search']);

// Récupérer un chercheur spécifique
Route::get('/chercheurs/{id}', function ($id) {
    return Chercheur::findOrFail($id);
});
/* ==================== ROUTES POUR LES PUBLICATIONS ==================== */
Route::middleware('auth:api')->group(function () {
    // Récupérer les publications Scopus d'un chercheur
    Route::get('/chercheur/publications', [PublicationController::class, 'fetchScopusPublications']);

    // Enregistrer une publication
    Route::post('/chercheur/publications', [PublicationController::class, 'store']);

    // Enregistrer un batch de publications
    Route::post('/publications', [PublicationController::class, 'storeBatch']);
});
//Récuperer les publications d'un chercheur donnée
Route::middleware('auth:api')->get('/profile/publications', [PublicationController::class, 'profilePublications']);

// Récupérer les publications d'un chercheur spécifique par son ID
Route::get('/chercheurs/{id}/publications', [PublicationController::class, 'getPublicationsByChercheur']);

// Lister les publications
Route::get('/publications', [PublicationController::class, 'index']);

// Récupérer liste des annees de publication
Route::get('/publications/years', [PublicationController::class, 'getPublicationYears']);

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
Route::get('/disciplines/stats', [DisciplineController::class, 'stats']);
Route::apiResource('disciplines', DisciplineController::class);
Route::get('/disciplines', [DisciplineController::class, 'index']);
Route::get('/disciplines/{id}', [DisciplineController::class, 'show']);

/* ==================== ROUTES POUR LES COMMENTAIRES ==================== */
Route::middleware(['auth:api'])->group(function () {
    Route::get('/publications/{publication}/comments', [CommentController::class, 'index']);
    Route::post('/comments', [CommentController::class, 'store']);
    Route::put('/comments/{comment}', [CommentController::class, 'update']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);
});
/* ==================== ROUTES POUR LES STATISTIQUES ==================== */
Route::get('/stats', [StatisticsController::class, 'getStats']);

/* ==================== ROUTES POUR LE CONTACT ==================== */
Route::middleware('auth:api')->post('/contact', [ContactController::class, 'sendMessage']);

/* ==================== ROUTES POUR LES STATISTIQUES ==================== */
Route::get('/stats/chercheurs', [StatisticsController::class, 'getChercheursStats']);
Route::get('/stats/publications', [StatisticsController::class, 'getPublicationsStats']);
Route::get('/stats/comments', [StatisticsController::class, 'getCommentsStats']);
Route::get('/stats/authors', [StatisticsController::class, 'getAuthorsStats']);

Route::middleware('auth:api')->group(function () {
    // Stats personnelles
    Route::get('/chercheurs/me/stats', [ChercheurController::class, 'personalStats']);

    // Nombre d'abonnés
    Route::get('/chercheurs/followers/count', [ChercheurController::class, 'getFollowersCount']);
});

Route::middleware('auth:api')->put('/publications/{id}/toggle-visibility', [PublicationController::class, 'toggleVisibility']);

Route::middleware('auth:api')->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/mark-as-read', [NotificationController::class, 'markAsRead']);
});

Route::middleware('auth:api')->group(function () {
    // Matières
    Route::apiResource('matieres', MatiereController::class);
    // Cours
    Route::apiResource('cours', CoursController::class);
});

Route::apiResource('enseigner', EnseignerController::class)
    ->only(['index', 'store']);

// Pour la suppression (DELETE /api/enseigner/{id_chercheur}/{id_matiere})
Route::delete(
    'enseigner/{id_chercheur}/{id_matiere}',
    [EnseignerController::class, 'destroy']
);


Route::middleware('auth:api')->group(function () {
    // --- Pour gérer les cours d’un chercheur ---
    Route::get('chercheurs/{id}/cours', [ChercheurController::class, 'getCours']);
    Route::post('chercheurs/{id}/cours', [ChercheurController::class, 'storeCours']);
    Route::put('chercheurs/{id}/cours/{coursId}', [ChercheurController::class, 'updateCours']);
    Route::patch('chercheurs/{id}/cours/{coursId}', [ChercheurController::class, 'updateCours']);
    Route::delete('chercheurs/{id}/cours/{coursId}', [ChercheurController::class, 'destroyCours']);

    // --- Pour gérer les matières (pivot “enseigner”) ---
    Route::get('chercheurs/{id}/matieres', [ChercheurController::class, 'getMatieres']);
    Route::post('chercheurs/{id}/matieres', [ChercheurController::class, 'attachMatiere']);
    Route::delete('chercheurs/{id}/matieres/{matiereId}', [ChercheurController::class, 'detachMatiere']);
});
