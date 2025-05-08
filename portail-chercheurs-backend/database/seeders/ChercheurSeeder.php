<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\Chercheur;

class ChercheurSeeder extends Seeder
{
    public function run(): void
    {
        Chercheur::create([
            'nom' => 'Derja',
            'prenom' => 'Ouassim',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'cv' => null,
            'role' => 'Administrateur',
            'discipline' => 'Informatique',
            'photoProfil' => null,
            'must_change_password' => false,
            'remember_token' => Str::random(10),
            'scopus_author_id' => null,
        ]);
        \App\Models\Chercheur::factory(25)->create();
    }
}
