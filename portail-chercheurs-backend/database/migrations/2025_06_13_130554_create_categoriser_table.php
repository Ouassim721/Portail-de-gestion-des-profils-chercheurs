<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('categoriser', function (Blueprint $table) {
            $table->unsignedInteger('publication_id');
            $table->unsignedInteger('discipline_id');
            
            // Clés étrangères
            $table->foreign('publication_id')
                  ->references('id')
                  ->on('publications')
                  ->onDelete('cascade');
                  
            $table->foreign('discipline_id')
                  ->references('id')
                  ->on('disciplines')
                  ->onDelete('cascade');
            
            // Clé primaire composite
            $table->primary(['publication_id', 'discipline_id']);
        });
    }

    public function down()
    {
        // Désactiver temporairement les contraintes
        Schema::disableForeignKeyConstraints();
        
        Schema::dropIfExists('categoriser');
        
        // Réactiver les contraintes
        Schema::enableForeignKeyConstraints();
    }
};