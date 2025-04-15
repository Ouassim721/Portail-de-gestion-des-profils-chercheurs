<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Discipline extends Model
{
    use HasFactory;

    protected $fillable = ['nom'];

    public function publications()
    {
        return $this->hasMany(Publication::class);
    }

    public function chercheurs()
    {
        return $this->hasMany(Chercheur::class);
    }
}