<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChercheurController;
use App\Http\Controllers\PublicationController;
use App\Http\Controllers\DisciplineController;

// Chercheurs
Route::resource('chercheurs', \App\Http\Controllers\ChercheurController::class)
     ->except(['show']);

Route::get('chercheurs/{chercheur}/download-cv', [\App\Http\Controllers\ChercheurController::class, 'downloadCv'])
     ->name('chercheurs.download-cv');

Route::resource('publications', PublicationController::class);
Route::resource('disciplines', DisciplineController::class);

$frontendUrl = config('app.frontend_url', 'http://localhost:5173');
Route::get('/reset-password/{token}', function ($token) use ($frontendUrl) {
     return redirect("$frontendUrl/reset-password/$token");
})->name('password.reset');
Route::get('/', function () {
     return view('welcome');
});
