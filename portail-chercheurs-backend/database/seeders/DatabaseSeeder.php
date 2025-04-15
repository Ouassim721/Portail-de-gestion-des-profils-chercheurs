<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

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
        $this->createTestUsers();
        $this->generateFakeCVs(20);

        // 3. Exécution des seeders spécifiques
        $this->call([
            UserSeeder::class,
            DisciplineSeeder::class,
            ChercheurSeeder::class,
            PublicationSeeder::class
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
            \Artisan::call('storage:link');
        }
    }

    /**
     * Crée les utilisateurs de test
     */
    private function createTestUsers(): void
    {
        // Utilisateur de test principal
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        
    }

    /**
     * Génère des fichiers PDF factices pour les CV
     */
    private function generateFakeCVs(int $count): void
    {
        $fakeCvPath = storage_path('app/fake-cv');

        for ($i = 0; $i < $count; $i++) {
            $filename = uniqid() . '.pdf';
            $content = "%%PDF-1.4\n%%Fake PDF Content\n";
            file_put_contents("$fakeCvPath/$filename", $content);
        }
    }
}