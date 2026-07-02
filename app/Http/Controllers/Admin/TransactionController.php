<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Resources\TransactionResource;

class TransactionController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Transaction::with([
            'user:id,name,email',
            'details:id,transaction_id,ticket_category_id,quantity,price_per_unit,subtotal',
            'details.ticketCategory:id,concert_id,category_name,price',
            'details.ticketCategory.concert:id,title,venue_name,city,event_date'
        ])
            ->latest();

        if ($request->filled('q')) {
            $keyword = $request->q;
            
            // Cari user IDs terlebih dahulu dari mysql_node1 (karena Transaction di mysql_node2)
            $userIds = \App\Models\User::where('name', 'like', "%{$keyword}%")
                ->orWhere('email', 'like', "%{$keyword}%")
                ->pluck('id');

            $query->where(function($q) use ($keyword, $userIds) {
                $q->where('trx_code', 'like', "%{$keyword}%")
                  ->orWhereIn('user_id', $userIds);
            });
        }

        $transactions = $query->paginate(15);

        return Inertia::render('Admin/DaftarTransaksi', [
            'transactions' => TransactionResource::collection($transactions),
            'filters' => $request->only('q')
        ]);
    }
}
