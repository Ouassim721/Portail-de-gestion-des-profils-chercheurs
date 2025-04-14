<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChercheurController;

Route::post('/chercheurs', [ChercheurController::class, 'store'])->name('chercheurs.store');
Route::resource('chercheurs', ChercheurController::class);
Route::get('chercheurs/{chercheur}/download-cv', [ChercheurController::class, 'downloadCv'])
     ->name('chercheurs.download-cv');

Route::get('/', function () {
    return view('welcome');
});
