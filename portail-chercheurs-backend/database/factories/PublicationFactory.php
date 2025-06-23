<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;

class PublicationFactory extends Factory
{
    public function definition(): array
    {
        $fileName = 'publication_' . $this->faker->unique()->numberBetween(1, 1000) . '.pdf';
        $filePath = 'publications/' . $fileName;

        // Créer le fichier PDF ici
        $pdfContent = "%PDF-1.4\n1 0 obj\n<</Type /Catalog /Pages 2 0 R>>\nendobj\n2 0 obj\n<</Type /Pages /Kids [3 0 R] /Count 1>>\nendobj\n3 0 obj\n<</Type /Page /Parent 2 0 R /Resources <<>> /MediaBox [0 0 612 792] /Contents 4 0 R>>\nendobj\n4 0 obj\n<</Length 44>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(Hello World) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000074 00000 n \n0000000120 00000 n \n0000000200 00000 n \ntrailer\n<</Size 5 /Root 1 0 R>>\nstartxref\n307\n%%EOF";
        Storage::disk('public')->put($filePath, $pdfContent);

        return [
            'titre' => rtrim($this->faker->sentence(4), '.'),
            'date_publication' => $this->faker->dateTimeBetween('-3 years'),
            'date_modification' => $this->faker->optional(0.3)->dateTimeBetween('-1 year'),
            'auteurs' => $this->generateAuthors(),
            'abstract' => $this->faker->paragraphs(3, true),
            'citation_count' => $this->faker->numberBetween(0, 1000),
            'pdf_path' => $filePath,
            'chercheur_id' => \App\Models\Chercheur::inRandomOrder()->first()->id,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }


    private function generateAuthors(): string
    {
        $count = rand(1, 4);
        $authors = [];

        for ($i = 0; $i < $count; $i++) {
            $authors[] = $this->faker->name;
        }

        return implode(', ', $authors);
    }
}
