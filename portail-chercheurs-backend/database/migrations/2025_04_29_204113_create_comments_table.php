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
        Schema::create('comments', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('chercheur_id');
            $table->unsignedInteger('publication_id');
            $table->text('contenu');
            $table->timestamps();
        
            $table->foreign('chercheur_id')
                  ->references('id')->on('chercheurs')
                  ->onDelete('cascade');
        
            $table->foreign('publication_id')
                  ->references('id')->on('publications')
                  ->onDelete('cascade');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
