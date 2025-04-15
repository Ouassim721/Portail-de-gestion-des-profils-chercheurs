<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Chercheur extends Model
{
    use HasFactory;

    protected $table = 'chercheur';

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'mot_de_passe',
        'date_naissance',
        'cv',
        'role',
        'discipline'
    ];

    // Pour ne pas exposer le mot de passe dans les réponses JSON
    protected $hidden = ['mot_de_passe'];

    public function publications()
    {
        return $this->hasMany(Publication::class);
    }

    // Pour obtenir le nombre de publications par chercheur
    public function scopeWithPublicationsCount($query)
    {
        return $query->withCount('publications');
    }
}
