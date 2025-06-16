<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Publication extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'date_publication',
        'date_modification',
        'auteurs',
        'abstract',
        'citation_count',
        'chercheur_id',
        'pdf_path',
    ];

    /**
     * Les casts de colonnes
     */
    protected $casts = [
        'date_publication'   => 'date:Y-m-d',
        'date_modification'  => 'date:Y-m-d',
        'citation_count'     => 'integer',
    ];

    /**
     * Le chercheur·e propriétaire de la publication
     */
    public function chercheur(): BelongsTo
    {
        return $this->belongsTo(Chercheur::class);
    }

    /**
     * Les commentaires sur cette publication
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Les notifications associées à cette publication
     */
    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

public function disciplines()
{
    return $this->belongsToMany(
        Discipline::class,
        'categoriser',
        'publication_id',
        'discipline_id'
    )->using(Categoriser::class);
}
}
