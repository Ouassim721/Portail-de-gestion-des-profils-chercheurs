<?php

namespace Database\Factories;

use App\Models\Publication;
use App\Models\Discipline;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoriserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'publication_id' => Publication::factory(),
            'discipline_id' => Discipline::factory(),
        ];
    }
}