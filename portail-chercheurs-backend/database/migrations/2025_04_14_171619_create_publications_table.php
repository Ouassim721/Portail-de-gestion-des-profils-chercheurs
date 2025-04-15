<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('Publications', function (Blueprint $table) {
            $table->increments('id');
            $table->string('titre', 255);
            $table->date('date_publication');
            $table->date('date_modification')->nullable();
            $table->text('auteurs');
            $table->text('abstract');
            $table->unsignedInteger('chercheur_id');

            $table->timestamps();
            
            // Clé étrangère adaptée à la table Chercheur existante
            $table->foreign('chercheur_id')
                  ->references('id')
                  ->on('Chercheur')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('Publications');
    }
};
