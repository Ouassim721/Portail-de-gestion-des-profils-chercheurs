<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Chercheur;
use App\Models\Matiere;

class EnseignerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
{
    $chercheurs = Chercheur::all();
    $matieres = Matiere::all();

    // Vérifier que des matières existent
    if ($matieres->isEmpty()) {
        $this->command->error('Aucune matière trouvée. Exécutez d\'abord MatiereSeeder!');
        return;
    }

    foreach ($chercheurs as $c) {
        // Récupérer les IDs des matières correctement
        $matiereIds = $matieres->random(rand(1, 3))->pluck('id_matiere')->toArray();
        
        foreach ($matiereIds as $matiereId) {
            // Vérifier si la relation existe déjà
            $exists = \DB::table('enseigner')
                ->where('id_chercheur', $c->id)
                ->where('id_matiere', $matiereId)
                ->exists();
            
            if (!$exists) {
                \DB::table('enseigner')->insert([
                    'id_chercheur' => $c->id,
                    'id_matiere'   => $matiereId,
                ]);
            }
        }
    }
}
}
