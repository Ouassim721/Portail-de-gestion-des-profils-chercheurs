<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Actualite extends Model
{
    use HasFactory;

    protected $table = 'actualites';

    protected $fillable = [
        'titre',
        'localisation',
        'description',
        'categorie',
        'document_pdf',
        'date_publication',
    ];

    protected $casts = [
        'date_publication' => 'date',
    ];
}
