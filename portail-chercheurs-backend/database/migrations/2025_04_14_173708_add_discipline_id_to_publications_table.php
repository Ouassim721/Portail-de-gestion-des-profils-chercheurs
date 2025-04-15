<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::table('publications', function (Blueprint $table) {
        // Ajout de la colonne discipline_id
        $table->unsignedInteger('discipline_id');
        
        // Clé étrangère
        $table->foreign('discipline_id')
              ->references('id')
              ->on('disciplines')
              ->onDelete('cascade'); // Suppression en cascade
    });
}

public function down()
{
    Schema::table('publications', function (Blueprint $table) {
        $table->dropForeign(['discipline_id']);
        $table->dropColumn('discipline_id');
    });
}

};