<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;

class ActualiteFactory extends Factory
{
    public function definition(): array
    {
        $fileName = 'actualite' . $this->faker->unique()->numberBetween(1, 1000) . '.pdf';
        $filePath = 'actualites/' . $fileName;

        // Créer le fichier PDF ici
        $pdfContent = "%PDF-1.4\n1 0 obj\n<</Type /Catalog /Pages 2 0 R>>\nendobj\n2 0 obj\n<</Type /Pages /Kids [3 0 R] /Count 1>>\nendobj\n3 0 obj\n<</Type /Page /Parent 2 0 R /Resources <<>> /MediaBox [0 0 612 792] /Contents 4 0 R>>\nendobj\n4 0 obj\n<</Length 44>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(Hello World) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000074 00000 n \n0000000120 00000 n \n0000000200 00000 n \ntrailer\n<</Size 5 /Root 1 0 R>>\nstartxref\n307\n%%EOF";
        Storage::disk('public')->put($filePath, $pdfContent);
        return [
            'titre' => $this->faker->sentence(3),
            'localisation' => $this->faker->city,
            'description' => $this->faker->text(150),
            'categorie' => $this->faker->randomElement(['Conférence', 'Publication', 'Événement', 'Annonce']),
            'document_pdf' => $filePath,
            'date_publication' => $this->faker->dateTimeBetween('2025-06-01', '2025-07-01')->format('Y-m-d'),
        ];
    }
}
