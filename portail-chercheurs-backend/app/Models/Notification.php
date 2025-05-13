<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = ['chercheur_id', 'publication_id', 'message', 'is_read'];

    public function chercheur()
    {
        return $this->belongsTo(Chercheur::class);
    }

    public function publication()
    {
        return $this->belongsTo(Publication::class);
    }
}
