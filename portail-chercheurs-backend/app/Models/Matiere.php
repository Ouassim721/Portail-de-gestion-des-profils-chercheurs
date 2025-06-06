<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matiere extends Model
{
    use HasFactory;

    protected $table = 'matieres';
    protected $primaryKey = 'id_matiere';

    public $timestamps = true;

    protected $fillable = [
        'nom_matiere',
    ];

    public function cours()
    {
        return $this->hasMany(Cours::class, 'id_matiere', 'id_matiere');
    }

    public function chercheurs()
    {
        return $this->belongsToMany(
            Chercheur::class,
            'enseigner',
            'id_matiere',
            'id_chercheur'
        );
    }
}
