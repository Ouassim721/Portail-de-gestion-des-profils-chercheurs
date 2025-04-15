<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Chercheur extends Model
{
    use HasFactory;

    protected $table = 'chercheur'; // Si votre table s'appelle "chercheur"
    
    protected $fillable = [
        'nom', 
        'prenom', 
        'email', 
        'mot_de_passe', 
        'date_naissance',
        'cv',
        'role',
        'discipline_id'
    ];

    protected $hidden = ['mot_de_passe'];

    public function publications()
    {
        return $this->hasMany(Publication::class);
    }
}