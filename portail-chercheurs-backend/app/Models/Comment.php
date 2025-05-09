<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'chercheur_id',
        'publication_id',
        'contenu',
    ];

    /**
     * L’auteur du commentaire
     */
    public function chercheur(): BelongsTo
    {
        return $this->belongsTo(Chercheur::class, 'chercheur_id');
    }

    /**
     * La publication commentée
     */
    public function publication(): BelongsTo
    {
        return $this->belongsTo(Publication::class);
    }
}
