<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('chercheur', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nom', 100);
            $table->string('prenom', 100);
            $table->string('discipline', 100);
            $table->string('mot_de_passe', 255);
            $table->string('email', 150);
            $table->date('date_naissance');
            $table->string('cv', 255)->nullable(); // nouvelle colonne pour le CV
            $table->enum('role', ['Chercheur', 'Administrateur'])->default('Chercheur');
            $table->string('photoProfil', 255)->nullable(); // nouvelle colonne pour la photo de profil
            $table->timestamps();
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chercheur');
    }
};