<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Cours;
use App\Models\Chercheur;
use App\Models\Matiere;
use Illuminate\Support\Facades\Storage;

class CoursSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    // database/seeders/CoursSeeder.php

public function run(): void
{
    // Créer le répertoire si nécessaire
    Storage::disk('public')->makeDirectory('cours');
    
    Cours::factory()->count(50)->create()->each(function ($cours) {
        // Contenu PDF minimal valide
        $pdfContent = "%PDF-1.4\n1 0 obj\n<</Type /Catalog /Pages 2 0 R>>\nendobj\n2 0 obj\n<</Type /Pages /Kids [3 0 R] /Count 1>>\nendobj\n3 0 obj\n<</Type /Page /Parent 2 0 R /Resources <<>> /MediaBox [0 0 612 792] /Contents 4 0 R>>\nendobj\n4 0 obj\n<</Length 44>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(Hello World) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000074 00000 n \n0000000120 00000 n \n0000000200 00000 n \ntrailer\n<</Size 5 /Root 1 0 R>>\nstartxref\n307\n%%EOF";
        
        // Créer physiquement le fichier
        Storage::disk('public')->put(
            $cours->fichier, 
            $pdfContent
        );
    });
}
}
