<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PublicationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'titre' => rtrim($this->faker->sentence(4), '.'),
            'date_publication' => $this->faker->dateTimeBetween('-3 years'),
            'date_modification' => $this->faker->optional(0.3)->dateTimeBetween('-1 year'),
            'auteurs' => $this->generateAuthors(),
            'abstract' => $this->faker->paragraphs(3, true),
            'chercheur_id' => \App\Models\Chercheur::inRandomOrder()->first()->id,
            'discipline_id' => \App\Models\Discipline::inRandomOrder()->first()->id,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    private function generateAuthors(): string
    {
        $count = rand(1, 4);
        $authors = [];

        for ($i = 0; $i < $count; $i++) {
            $authors[] = $this->faker->name;
        }

        return implode(', ', $authors);
    }
}
