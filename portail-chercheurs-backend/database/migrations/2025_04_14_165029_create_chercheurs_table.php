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
        Schema::create('chercheurs', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nom', 100);
            $table->string('prenom', 100);
            $table->string('discipline', 100)->nullable();
            $table->string('email', 150);
            $table->string('password', 255);
            $table->string('cv', 255)->nullable();
            $table->enum('role', ['Chercheur', 'Administrateur'])->default('Chercheur');
            $table->string('photoProfil', 255)->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chercheurs');
        Schema::dropIfExists('password_reset_tokens');
    }
};
