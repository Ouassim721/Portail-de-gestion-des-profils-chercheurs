<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matiere extends Model
{
    use HasFactory;

    protected $table = 'matieres';

    public $timestamps = true;

    protected $fillable = [
        'nom_matiere',
        
    ];

    /**
     * Une matière peut avoir plusieurs cours (relation 1-N).
     */
    public function cours()
    {
        return $this->hasMany(Cours::class, 'id_matiere', 'id');
    }

    /**
     * Relation Many-to-Many vers Chercheur via la table pivot 'enseigner'.
     */
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
