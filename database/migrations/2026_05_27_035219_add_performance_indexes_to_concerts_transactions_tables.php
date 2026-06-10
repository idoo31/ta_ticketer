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
        // Index komposit pada concerts: mempercepat query WHERE status='active' AND event_date >= now() ORDER BY event_date
        Schema::table('concerts', function (Blueprint $table) {
            $table->index(['status', 'event_date'], 'idx_concerts_status_event_date');
        });

        // Index pada ticket_categories.concert_id: mempercepat eager load ticketCategories
        Schema::table('ticket_categories', function (Blueprint $table) {
            $table->index('concert_id', 'idx_ticket_categories_concert_id');
        });

        // Index pada transactions.user_id: mempercepat lookup transaksi per user
        Schema::table('transactions', function (Blueprint $table) {
            $table->index('user_id', 'idx_transactions_user_id');
        });

        // Index pada transaction_details.transaction_id: mempercepat eager load details
        Schema::table('transaction_details', function (Blueprint $table) {
            $table->index('transaction_id', 'idx_transaction_details_transaction_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('concerts', function (Blueprint $table) {
            $table->dropIndex('idx_concerts_status_event_date');
        });

        Schema::table('ticket_categories', function (Blueprint $table) {
            $table->dropIndex('idx_ticket_categories_concert_id');
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->dropIndex('idx_transactions_user_id');
        });

        Schema::table('transaction_details', function (Blueprint $table) {
            $table->dropIndex('idx_transaction_details_transaction_id');
        });
    }
};
