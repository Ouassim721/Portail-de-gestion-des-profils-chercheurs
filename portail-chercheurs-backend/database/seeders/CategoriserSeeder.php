<?php

namespace Database\Seeders;

use App\Models\Publication;
use App\Models\Discipline;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriserSeeder extends Seeder
{
    public function run(): void
    {
        $publications = Publication::all();
        $disciplines = Discipline::all();

        foreach ($publications as $publication) {
            $count = rand(1, 3);
            $randomDisciplines = $disciplines->random($count);
            
            foreach ($randomDisciplines as $discipline) {
                // Vérifier l'existence avec DB facade
                $exists = DB::table('categoriser')
                    ->where('publication_id', $publication->id)
                    ->where('discipline_id', $discipline->id)
                    ->exists();

                if (!$exists) {
                    DB::table('categoriser')->insert([
                        'publication_id' => $publication->id,
                        'discipline_id' => $discipline->id
                    ]);
                }
            }
        }

       
    }
}