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
            'fichier' => 'cours_' . $this->faker->numberBetween(1, 1000) . '.pdf',

            // Clés étrangères :
            // On choisit un Chercheur existant ou on en crée un à la volée :
            'id_chercheur' => Chercheur::inRandomOrder()->first()?->id
                ?? Chercheur::factory()->create()->id,

            // Idem pour Matiere :
            'id_matiere' => Matiere::inRandomOrder()->first()?->id_matiere
                ?? Matiere::factory()->create()->id_matiere,

        ];
    }
}
