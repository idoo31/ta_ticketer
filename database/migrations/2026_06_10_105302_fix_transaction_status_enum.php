<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Fix inkonsistensi enum status transaksi.
     *
     * Bug: Migration awal mendefinisikan enum ['pending', 'success', 'failed']
     * namun CheckoutController menyimpan status 'paid' dan akun-user.blade.php
     * mencari status 'paid' untuk menampilkan E-Ticket Aktif.
     *
     * Fix: Ubah enum menjadi ['pending', 'paid', 'cancelled', 'failed']
     * dan migrate data lama 'success' → 'paid'.
     */
    public function up(): void
    {
        // SQLite tidak support ALTER COLUMN untuk enum, tapi mendukung tipe text
        // Karena project ini pakai SQLite, kita pastikan kolom menerima nilai yang benar
        // dengan menggunakan string biasa (SQLite tidak enforce enum)

        // Untuk database MySQL/PostgreSQL, uncomment baris berikut:
        DB::statement("ALTER TABLE transactions MODIFY COLUMN status ENUM('pending', 'paid', 'cancelled', 'failed') DEFAULT 'pending'");

        // Migrate data lama: 'success' → 'paid' (untuk konsistensi)
        DB::table('transactions')
            ->where('status', 'success')
            ->update(['status' => 'paid']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Kembalikan 'paid' → 'success' jika rollback
        DB::table('transactions')
            ->where('status', 'paid')
            ->update(['status' => 'success']);
    }
};
