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
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chercheur_id')->constrained()->onDelete('cascade'); // Associe chaque message à un utilisateur
            $table->string('sujet');
            $table->text('message');
            $table->enum('status', ['en attente', 'répondu', 'archivé'])->default('en attente');
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
