<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    /**
     * Batalkan transaksi tiket milik user.
     *
     * Syarat:
     * - Transaksi harus milik user yang sedang login.
     * - Status transaksi harus 'paid'.
     * - Konser masih lebih dari 7 hari ke depan (H-7).
     */
    public function cancel(Transaction $transaction): RedirectResponse
    {
        // Pastikan transaksi milik user yang sedang login
        if ($transaction->user_id !== Auth::id()) {
            abort(403);
        }

        // Muat relasi yang dibutuhkan untuk validasi dan pengembalian quota
        $transaction->load([
            'details.ticketCategory.concert:id,title,event_date',
        ]);

        // Validasi: status harus 'paid'
        if ($transaction->status !== 'paid') {
            return back()->with('error', 'Transaksi ini tidak dapat dibatalkan.');
        }

        // Validasi: konser masih lebih dari 7 hari
        if (! $transaction->isCancellable()) {
            return back()->with('error', 'Pembatalan tiket hanya dapat dilakukan maksimal H-7 sebelum konser.');
        }

        // Proses pembatalan dalam satu database transaction agar data konsisten
        DB::transaction(function () use ($transaction) {
            // Kembalikan quota tiket untuk setiap detail transaksi
            foreach ($transaction->details as $detail) {
                $detail->ticketCategory->increment('available_quota', $detail->quantity);
            }

            // Ubah status transaksi menjadi cancelled
            $transaction->update(['status' => 'cancelled']);
        });

        return redirect()->route('akun')
            ->with('success', 'Tiket berhasil dibatalkan. Silakan hubungi admin untuk proses refund.');
    }
}
