<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = ['chercheur_id', 'sujet', 'message', 'status'];

    // Définir la relation avec l'utilisateur
    public function user()
    {
        return $this->belongsTo(Chercheur::class);
    }
}
