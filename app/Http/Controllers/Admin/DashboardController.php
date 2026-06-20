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
        // ── Status Koneksi Node ──────────────────────────────────────────────
        $nodeStatus = [
            'node1' => true,
            'node2' => true
        ];
        
        try {
            DB::connection('mysql')->getPdo();
        } catch (\Exception $e) {
            $nodeStatus['node1'] = false;
        }

        try {
            DB::connection('mysql_node2')->getPdo();
        } catch (\Exception $e) {
            $nodeStatus['node2'] = false;
        }

        // Default empty data
        $stats = [
            'totalRevenue'   => 0,
            'totalTickets'   => 0,
            'activeConcerts' => 0,
            'totalUsers'     => 0,
        ];
        $recentTransactions = collect([]);
        $chartLabels = [];
        $chartValues = [];
        $topConcerts = collect([]);

        // ── Statistik Node 1 (Master) ─────────────────────────────────────────
        if ($nodeStatus['node1']) {
            $stats['activeConcerts'] = Concert::where('status', 'active')->whereDate('event_date', '>=', now())->count();
            $stats['totalUsers']     = User::where('role', 'customer')->count();
        }

        // ── Statistik Node 2 (Transaksi) ──────────────────────────────────────
        if ($nodeStatus['node2']) {
            $stats['totalRevenue'] = Transaction::where('status', 'paid')->sum('grand_total');
            $stats['totalTickets'] = TransactionDetail::whereHas('transaction', fn($q) => $q->where('status', 'paid'))->sum('quantity');

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

            for ($i = 5; $i >= 0; $i--) {
                $date  = now()->subMonths($i);
                $key   = $date->year . '-' . $date->month;
                $label = $date->translatedFormat('M Y'); 

                $found = $revenueChart->first(fn($r) => $r->year == $date->year && $r->month == $date->month);

                $chartLabels[] = $label;
                $chartValues[] = $found ? (float) $found->total : 0;
            }

            // Jika Node 1 dan Node 2 Hidup (Bisa melakukan Join / Relasi Lintas Node)
            if ($nodeStatus['node1']) {
                $recentTransactions = Transaction::with('user:id,name')
                    ->select(['id', 'trx_code', 'user_id', 'grand_total', 'status', 'created_at'])
                    ->latest()
                    ->limit(5)
                    ->get();

                $details = TransactionDetail::with(['ticketCategory.concert', 'transaction'])
                    ->whereHas('transaction', fn($q) => $q->where('status', 'paid'))
                    ->get();

                $grouped = $details->groupBy('ticketCategory.concert_id')->map(function ($items) {
                    $concert = $items->first()->ticketCategory->concert;
                    if (!$concert) return null;
                    return [
                        'id' => $concert->id,
                        'title' => $concert->title,
                        'event_date' => $concert->event_date,
                        'tickets_sold' => $items->sum('quantity'),
                        'revenue' => $items->sum('subtotal')
                    ];
                })->filter()->sortByDesc('tickets_sold')->take(5)->values();

                $topConcerts = collect($grouped);
            } else {
                // Jika hanya Node 2 yang hidup, jangan panggil relasi Node 1
                $recentTransactions = Transaction::select(['id', 'trx_code', 'user_id', 'grand_total', 'status', 'created_at'])
                    ->latest()
                    ->limit(5)
                    ->get();
            }
        } else {
             // Jika Node 2 mati, buat dummy data untuk chart agar React tidak error
             for ($i = 5; $i >= 0; $i--) {
                $chartLabels[] = now()->subMonths($i)->translatedFormat('M Y');
                $chartValues[] = 0;
             }
        }

        return Inertia::render('Admin/Dashboard', compact(
            'stats',
            'recentTransactions',
            'chartLabels',
            'chartValues',
            'topConcerts',
            'nodeStatus'
        ));
    }
}
