<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DisciplineSeeder extends Seeder
{
    public function run(): void
    {
        \App\Models\Discipline::factory(8)->create();
    }
}