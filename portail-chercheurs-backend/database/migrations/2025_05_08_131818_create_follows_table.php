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
        Schema::create('follows', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('follower_id');
            $table->unsignedInteger('followed_id');
            $table->timestamps();

            $table->foreign('follower_id')->references('id')->on('chercheurs')->onDelete('cascade');
            $table->foreign('followed_id')->references('id')->on('chercheurs')->onDelete('cascade');

            $table->unique(['follower_id', 'followed_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('follows');
    }
};
