<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class PublicationSeeder extends Seeder
{
    public function run(): void
    {
        \App\Models\Publication::factory(100)->create();
    }
}