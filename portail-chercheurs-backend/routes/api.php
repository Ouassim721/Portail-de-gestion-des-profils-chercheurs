<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Http\Controllers\EmailVerificationController;


Route::post('/register', [AuthController::class, 'register']);
//*************Verification d'email****************************/
Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill(); // Met à jour email_verified_at
    return response()->json(['message' => 'Email vérifié avec succès']);
})->middleware(['auth:api', 'signed'])->name('verification.verify');

Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();

    return response()->json(['message' => 'Lien de vérification renvoyé']);
})->middleware(['auth:api'])->name('verification.send');

Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
    ->name('verification.verify');

/*
Route::middleware(['auth:api', 'verified'])->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
});*/ //cette partie indique que /profil est accessible ssi l'émail est vérifié
/*Route::middleware(['auth:api', 'verified'])->group(function () {
    Route::get('/user', function () {
        return auth()->user();
    });
});*/


//*************FIN Verification d'email****************************/
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
