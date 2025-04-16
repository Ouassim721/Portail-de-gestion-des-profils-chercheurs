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

Route::get('/', function () {
     return view('welcome');
});
