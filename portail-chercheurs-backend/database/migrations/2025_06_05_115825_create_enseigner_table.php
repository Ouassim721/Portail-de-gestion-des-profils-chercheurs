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
        Schema::create('enseigner', function (Blueprint $table) {
            // Clé étrangère vers 'chercheurs'
            $table->unsignedInteger('id_chercheur');
            $table->foreign('id_chercheur')
                  ->references('id')
                  ->on('chercheurs')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');

            // Clé étrangère vers 'matieres'
            $table->unsignedInteger('id_matiere');
            $table->foreign('id_matiere')
                  ->references('id_matiere')
                  ->on('matieres')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');

            // Définition de la clé primaire composite
            $table->primary(['id_chercheur', 'id_matiere']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enseigner');
    }
};
