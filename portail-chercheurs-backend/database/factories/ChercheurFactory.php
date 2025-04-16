<?php

namespace Database\Factories;

use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ChercheurFactory extends Factory
{
    public function definition(): array
    {
        // Créer le dossier fake-cv si inexistant

        return [
            'nom' => $this->faker->lastName,
            'prenom' => $this->faker->firstName,
            'email' => $this->faker->unique()->safeEmail,
            'password' => Hash::make('password'),
            'cv' => null,
            'role' => 'Chercheur',
            'discipline' => $this->faker->randomElement([
                'Informatique',
                'Biologie Moléculaire',
                'Physique Quantique',
                'Chimie Organique'
            ]),
            // Ajout du nouveau champ photoProfil avec une URL d'image factice
            'photoProfil' => $this->faker->imageUrl(640, 480, 'people', true),
            'remember_token' => Str::random(10),
            'created_at' => $this->faker->dateTimeBetween('-1 year'),
            'updated_at' => $this->faker->dateTimeBetween('-6 months'),
        ];
    }
}
