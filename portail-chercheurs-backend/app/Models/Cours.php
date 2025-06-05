<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cours extends Model
{
    use HasFactory;

    protected $table = 'cours';

    public $timestamps = true;

    protected $fillable = [
        'titre',
        'description',
        'datePublication',
        'fichier',
        'id_chercheur',
        'id_matiere',
    ];

    /**
     * Un cours appartient à un chercheur (relation N-1).
     */
    public function chercheur()
    {
        return $this->belongsTo(Chercheur::class, 'id_chercheur', 'id');
    }

    /**
     * Un cours appartient à une matière (relation N-1).
     */
    public function matiere()
    {
        return $this->belongsTo(Matiere::class, 'id_matiere', 'id');
    }
}
