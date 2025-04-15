<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class DisciplineFactory extends Factory
{
    public function definition(): array
    {
        $disciplines = [
            'Informatique', 'Biologie Moléculaire', 
            'Physique Quantique', 'Neurosciences',
            'Chimie Organique', 'Mathématiques Appliquées',
            'Génétique', 'Astrophysique'
        ];

        return [
            'nom' => $this->faker->unique()->randomElement($disciplines),
            'created_at' => $this->faker->dateTimeBetween('-2 years'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year')
        ];
    }
}