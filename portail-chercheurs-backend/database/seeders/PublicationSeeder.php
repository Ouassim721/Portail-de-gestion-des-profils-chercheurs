<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\Storage;
use App\Models\Publication;

class PublicationSeeder extends Seeder
{
    public function run(): void
    {
        Publication::factory()->count(50)->create();
    }
}
