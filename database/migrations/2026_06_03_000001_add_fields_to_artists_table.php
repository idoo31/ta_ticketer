<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('artists', function (Blueprint $table) {
            $table->string('slug', 120)->unique()->nullable()->after('name');
            $table->string('origin', 100)->nullable()->after('genre');
            $table->string('instagram_url', 255)->nullable()->after('origin');
            $table->boolean('is_active')->default(true)->after('instagram_url');
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('artists', function (Blueprint $table) {
            $table->dropColumn(['slug', 'origin', 'instagram_url', 'is_active', 'deleted_at']);
        });
    }
};
