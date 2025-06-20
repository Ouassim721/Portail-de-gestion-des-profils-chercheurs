<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class Categoriser extends Pivot
{
    protected $table = 'categoriser';
    
    public $incrementing = false;
    public $timestamps = false; 
    protected $primaryKey = ['publication_id', 'discipline_id'];
}