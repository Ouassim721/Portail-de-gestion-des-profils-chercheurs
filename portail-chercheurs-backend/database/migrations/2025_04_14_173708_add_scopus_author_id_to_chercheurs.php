<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('chercheurs', function (Blueprint $table) {
            $table->string('scopus_author_id', 20)->nullable()->after('prenom');
        });
    }

    public function down()
    {
        Schema::table('chercheurs', function (Blueprint $table) {
            $table->dropColumn('scopus_author_id');
        });
    }
};