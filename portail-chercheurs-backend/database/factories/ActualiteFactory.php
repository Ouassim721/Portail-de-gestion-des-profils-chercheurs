<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ActualiteFactory extends Factory
{
    public function definition(): array
    {
        return [
            'titre' => $this->faker->sentence(3),
            'localisation' => $this->faker->city,
            'description' => $this->faker->text(150),
            'categorie' => $this->faker->randomElement(['Conférence', 'Publication', 'Événement', 'Annonce']),
            'document_pdf' => null,
            'date_publication' => $this->faker->dateTimeBetween('2025-06-01', '2025-07-01')->format('Y-m-d'),
        ];
    }
}
