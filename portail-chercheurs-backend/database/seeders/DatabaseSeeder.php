<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Artisan;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Configuration initiale du stockage
        $this->prepareStorageEnvironment();

        // 2. Génération de données de test
        $this->generateFakeCVs(20);

        // 3. Exécution des seeders spécifiques
        $this->call([
            DisciplineSeeder::class,
            ChercheurSeeder::class,
            PublicationSeeder::class,
            CategoriserSeeder::class,
            CommentSeeder::class,
            ActualiteSeeder::class,
            MatiereSeeder::class,
        ]);

        // 2) Ensuite, on crée des Cours qui dépendent des Chercheur + Matiere
        $this->call([
            CoursSeeder::class,
        ]);

        // 3) Finalement, on peuple la pivot Enseigner
        $this->call([
            EnseignerSeeder::class,
        ]);
    }

    /**
     * Configure l'environnement de stockage
     */
    private function prepareStorageEnvironment(): void
    {
        // Création des dossiers nécessaires
        Storage::disk('public')->makeDirectory('cv');
        Storage::disk('local')->makeDirectory('fake-cv');

        // Création du lien symbolique si absent
        if (!is_link(public_path('storage'))) {
            Artisan::call('storage:link');
        }
    }

    /**
     * Génère des fichiers PDF factices pour les CV
     */
    private function generateFakeCVs(int $count): void
    {
        $fakeCvPath = storage_path('app/fake-cv');
        if (!file_exists($fakeCvPath)) {
            mkdir($fakeCvPath, 0755, true);
        }

        for ($i = 0; $i < $count; $i++) {
            $filename = uniqid() . '.pdf';
            $content = "%%PDF-1.4\n%%Fake PDF Content\n";
            file_put_contents("$fakeCvPath/$filename", $content);
        }
    }
}
