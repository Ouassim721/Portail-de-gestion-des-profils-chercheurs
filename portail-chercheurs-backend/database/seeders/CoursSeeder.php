<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Cours;
use App\Models\Chercheur;
use App\Models\Matiere;

class CoursSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        Chercheur::factory()->count(10)->create();
        Matiere::factory()->count(5)->create();

        Cours::factory()->count(20)->create();
    }
}
