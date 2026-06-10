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
        Schema::create('concerts', function (Blueprint $table) {
            $table->id();
            $table->string('title', 150);
            $table->string('venue_name', 100);
            $table->string('city', 100);
            $table->date('event_date');
            $table->time('event_time');
            $table->text('description')->nullable();
            $table->string('banner_url')->nullable();
            $table->enum('status', ['active', 'draft', 'completed'])->default('draft');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('concerts');
    }
};
