<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ChercheurSeeder extends Seeder
{
    public function run(): void
    {
        \App\Models\Chercheur::factory(25)->create();
    }
}