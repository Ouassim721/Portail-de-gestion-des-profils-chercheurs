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
        Schema::create('actualites', function (Blueprint $table) {
            $table->id();
            $table->string('titre', 100);
            $table->string('localisation', 100);
            $table->string('description', 255);
            $table->string('categorie', 255);
            $table->string('document_pdf')->nullable();
            $table->date('date_publication')->nullable(); // Date de publication
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('actualites', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
