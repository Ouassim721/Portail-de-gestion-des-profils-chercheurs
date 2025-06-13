<?php

namespace Database\Factories;

use App\Models\Cours;
use App\Models\Chercheur;
use App\Models\Matiere;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cours>
 */
class CoursFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'titre' => $this->faker->sentence(3), 
            'description' => $this->faker->paragraph(2), 
            'datePublication' => $this->faker->dateTimeBetween('-2 years', 'now')->format('Y-m-d'),
            'fichier' => 'cours_'.$this->faker->numberBetween(1, 1000).'.pdf',
           'id_chercheur' => \App\Models\Chercheur::inRandomOrder()->first()->id,
           'id_matiere' => \App\Models\Matiere::inRandomOrder()->first()->id_matiere
        ];
    }
}
