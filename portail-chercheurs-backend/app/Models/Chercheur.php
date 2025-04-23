<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Laravel\Sanctum\HasApiTokens;

class Chercheur extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $table = 'chercheurs';
    /**
     * Les attributs qui sont assignables en masse.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nom',
        'prenom',
        'scopus_author_id',
        'email',
        'password',
        'date_naissance',
        'cv',
        'role',
        'discipline',
        'photoProfil',
        'must_change_password',
        'remember_token',
    ];

    /**
     * Les atrributs qui doivent être câcher pour la sérialization
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function publications()
    {
        return $this->hasMany(Publication::class);
    }
    /**
     * Pour obtenir le nombre de publications par chercheur
     *
     * @param [type] $query
     * @return void
     */
    public function scopeWithPublicationsCount($query)
    {
        return $query->withCount('publications');
    }
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    /**
     * Obtenez l'identifiant qui sera stocké dans la revendication d'objet du JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Renvoie un tableau de valeurs clés, contenant toutes les revendications personnalisées à ajouter au JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * Casts.
     */
    protected $casts = [
        'must_change_password' => 'boolean',
    ];
}
