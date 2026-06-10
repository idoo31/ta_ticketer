<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Resources\TransactionResource;

class UserAccountController extends Controller
{
    /**
     * Show the user account / profile page.
     */
    public function index(): Response
    {
        $user = Auth::user();

        // Ambil semua transaksi beserta detail tiket dan info konser
        $transactions = $user->transactions()
            ->with([
                'details:id,transaction_id,ticket_category_id,quantity,price_per_unit,subtotal',
                'details.ticketCategory:id,concert_id,category_name,price',
                'details.ticketCategory.concert:id,title,venue_name,city,event_date,banner_url',
            ])
            ->latest()
            ->get();

        // Serialize for React menggunakan Resource
        $transactionsData = TransactionResource::collection($transactions)->resolve();

        return Inertia::render('AkunUser', [
            'user' => [
                'id'              => $user->id,
                'name'            => $user->name,
                'email'           => $user->email,
                'role'            => $user->role,
                'is_admin'        => $user->isAdmin(),
                'created_at_year' => $user->created_at->translatedFormat('Y'),
            ],
            'transactions' => $transactionsData,
        ]);
    }
}
