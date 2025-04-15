<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Publication extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'date_publication',
        'date_modification',
        'auteurs',
        'abstract',
        'chercheur_id',
        'discipline_id'
    ];

    public function chercheur()
    {
        return $this->belongsTo(Chercheur::class);
    }

    public function discipline()
    {
        return $this->belongsTo(Discipline::class);
    }
}