// 2025_04_14_171619_create_publications_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up()
    {
        Schema::create('publications', function (Blueprint $table) {
            $table->increments('id');
            $table->string('titre', 255);
            $table->date('date_publication');
            $table->date('date_modification')->nullable();
            $table->text('auteurs');
            $table->text('abstract')->nullable(); //ne doit pas être nulle juste maintenant pour le test
            $table->integer('citation_count')->nullable(); //->after('abstract'); 
            $table->unsignedInteger('chercheur_id');
            $table->string('pdf_path')->nullable();
            $table->timestamps();
            $table->boolean('visible')->default(true);
            $table->foreign('chercheur_id')
                ->references('id')
                ->on('chercheurs')
                ->onDelete('cascade');
        });
    }

public function down()
{
    // Désactiver temporairement les vérifications de clés étrangères
    Schema::disableForeignKeyConstraints();
    
    // Supprimer la table publications
    Schema::dropIfExists('publications');
    
    // Réactiver les vérifications
    Schema::enableForeignKeyConstraints();
}
};
