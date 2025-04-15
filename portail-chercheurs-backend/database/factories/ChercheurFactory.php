<?php

namespace Database\Factories;

use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;

class ChercheurFactory extends Factory
{
    public function definition(): array
    {
        // Créer le dossier fake-cv si inexistant
        Storage::makeDirectory('fake-cv');

        return [
            'nom' => $this->faker->lastName,
            'prenom' => $this->faker->firstName,
            'email' => $this->faker->unique()->safeEmail,
            'mot_de_passe' => Hash::make('Password123!'),
            'date_naissance' => $this->faker->dateTimeBetween('-60 years', '-25 years')->format('Y-m-d'),
            'cv' => $this->faker->file(
                storage_path('app/fake-cv'),
                storage_path('app/public/cv'),
                false
            ),
            'role' => $this->faker->randomElement(['Chercheur', 'Administrateur']),
            'discipline' => $this->faker->randomElement([ // Ajout du champ texte libre
                'Informatique',
                'Biologie Moléculaire',
                'Physique Quantique',
                'Chimie Organique'
            ]),
            'created_at' => $this->faker->dateTimeBetween('-1 year'),
            'updated_at' => $this->faker->dateTimeBetween('-6 months')
        ];
    }
}