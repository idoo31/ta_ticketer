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
        Schema::create('concert_artists', function (Blueprint $table) {
            $table->foreignId('concert_id')->constrained('concerts')->cascadeOnDelete();
            $table->foreignId('artist_id')->constrained('artists')->cascadeOnDelete();
            $table->primary(['concert_id', 'artist_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('concert_artists');
    }
};
