<?php

use App\Http\Controllers\ChercheurController;
use Illuminate\Support\Facades\Route;

Route::get('/chercheurs', [ChercheurController::class, 'index']);
Route::get('/chercheurs/{id}', [ChercheurController::class, 'show']);
Route::post('/chercheurs', [ChercheurController::class, 'store']);
