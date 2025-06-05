<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enseigner extends Model
{
    use HasFactory;

    protected $table = 'enseigner';

    public $incrementing = false;
    public $timestamps = false;
    protected $primaryKey = ['id_chercheur', 'id_matiere'];
    protected $fillable = [
        'id_chercheur',
        'id_matiere',
    ];
}
