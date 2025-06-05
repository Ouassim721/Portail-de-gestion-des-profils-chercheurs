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
        Schema::create('cours', function (Blueprint $table) {
            $table->increments('id_cours');
            $table->string('titre');
            $table->text('description');
            $table->date('datePublication');
            $table->string('fichier');

            // Clé étrangère vers la table 'chercheurs'
            $table->unsignedInteger('id_chercheur');
            $table->foreign('id_chercheur')
                  ->references('id')
                  ->on('chercheurs')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');

            // Clé étrangère vers la table 'matieres'
            $table->unsignedInteger('id_matiere');
            $table->foreign('id_matiere')
                  ->references('id_matiere')
                  ->on('matieres')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cours');
    }
};
