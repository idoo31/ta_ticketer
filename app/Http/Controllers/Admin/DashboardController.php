<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Concert;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Tampilkan halaman dashboard admin dengan statistik nyata dari database.
     */
    public function index(): Response
    {
        // ── Statistik kartu utama ──────────────────────────────────────────────
        $stats = [
            'totalRevenue'   => Transaction::where('status', 'paid')->sum('grand_total'),
            'totalTickets'   => TransactionDetail::whereHas('transaction', fn($q) => $q->where('status', 'paid'))->sum('quantity'),
            'activeConcerts' => Concert::where('status', 'active')->whereDate('event_date', '>=', now())->count(),
            'totalUsers'     => User::where('role', 'customer')->count(),
        ];

        // ── Data chart: pendapatan per bulan (6 bulan terakhir) ───────────────
        $revenueChart = Transaction::where('status', 'paid')
            ->where('created_at', '>=', now()->subMonths(5)->startOfMonth())
            ->select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('SUM(grand_total) as total')
            )
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        // Isi bulan yang kosong agar chart selalu tampil 6 titik
        $chartLabels = [];
        $chartValues = [];
        for ($i = 5; $i >= 0; $i--) {
            $date  = now()->subMonths($i);
            $key   = $date->year . '-' . $date->month;
            $label = $date->translatedFormat('M Y'); // mis: Jan 2026

            $found = $revenueChart->first(fn($r) => $r->year == $date->year && $r->month == $date->month);

            $chartLabels[] = $label;
            $chartValues[] = $found ? (float) $found->total : 0;
        }

        // ── Transaksi terbaru (5 terakhir) ────────────────────────────────────
        $recentTransactions = Transaction::with('user:id,name')
            ->select(['id', 'trx_code', 'user_id', 'grand_total', 'status', 'created_at'])
            ->latest()
            ->limit(5)
            ->get();

        // ── Top 5 konser berdasarkan tiket terjual ────────────────────────────
        $topConcerts = Concert::select('concerts.id', 'concerts.title', 'concerts.event_date')
            ->join('ticket_categories', 'ticket_categories.concert_id', '=', 'concerts.id')
            ->join('transaction_details', 'transaction_details.ticket_category_id', '=', 'ticket_categories.id')
            ->join('transactions', 'transactions.id', '=', 'transaction_details.transaction_id')
            ->where('transactions.status', 'paid')
            ->groupBy('concerts.id', 'concerts.title', 'concerts.event_date')
            ->orderByRaw('SUM(transaction_details.quantity) DESC')
            ->selectRaw('SUM(transaction_details.quantity) as tickets_sold')
            ->selectRaw('SUM(transactions.grand_total) as revenue')
            ->limit(5)
            ->get();

        return Inertia::render('Admin/Dashboard', compact(
            'stats',
            'recentTransactions',
            'chartLabels',
            'chartValues',
            'topConcerts'
        ));
    }
}
