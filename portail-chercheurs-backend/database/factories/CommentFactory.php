<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Publication;
use App\Models\Chercheur;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentFactory extends Factory
{
    protected $model = Comment::class;

    public function definition()
    {
        return [
            'chercheur_id'   => Chercheur::factory(),
            'publication_id' => Publication::factory(),
            'contenu'        => $this->faker->sentence(12),
        ];
    }
}