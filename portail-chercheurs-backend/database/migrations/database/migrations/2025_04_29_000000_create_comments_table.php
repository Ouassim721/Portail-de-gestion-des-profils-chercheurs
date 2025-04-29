<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->increments('id');
            // Auteur du commentaire
            $table->unsignedInteger('chercheur_id');
            // Publication commentée
            $table->unsignedInteger('publication_id');
            // Contenu du commentaire
            $table->text('contenu');
            $table->timestamps();

            // Clés étrangères
            $table->foreign('chercheur_id')
                  ->references('id')
                  ->on('chercheurs')
                  ->onDelete('cascade');

            $table->foreign('publication_id')
                  ->references('id')
                  ->on('publications')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->dropForeign(['chercheur_id']);
            $table->dropForeign(['publication_id']);
        });
        Schema::dropIfExists('comments');
    }
};
