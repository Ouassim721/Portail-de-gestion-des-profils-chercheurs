<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Discipline extends Model
{
    use HasFactory;

    protected $fillable = ['nom'];

    public function chercheurs()
    {
        return $this->hasMany(Chercheur::class);
    }


public function publications()
{
    return $this->belongsToMany(
        Publication::class,
        'categoriser',
        'discipline_id',
        'publication_id'
    )->using(Categoriser::class);
}
}