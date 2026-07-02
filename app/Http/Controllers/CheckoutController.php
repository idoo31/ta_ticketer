<?php

namespace App\Http\Controllers;

use App\Http\Requests\Checkout\SaveCartRequest;
use App\Http\Requests\Checkout\ProcessPaymentRequest;
use App\Models\Concert;
use App\Services\CheckoutService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    /**
     * Step 1 – Cart: tampilkan pilihan tiket dari concert detail.
     */
    public function cart(Request $request, Concert $concert, CheckoutService $checkoutService): Response|RedirectResponse
    {
        if (!Auth::check()) {
            return redirect()->route('login')
                ->with('info', 'Silakan login terlebih dahulu untuk membeli tiket.');
        }

        $concert->load('ticketCategories', 'artists');

        // Ambil pilihan tiket dari session (jika ada)
        $cart = session()->get("cart.{$concert->id}", []);

        if (empty($cart)) {
            return redirect()->route('concert.detail', $concert)
                ->with('info', 'Pilih tiket terlebih dahulu.');
        }

        // Hitung ringkasan
        $lineItems = $checkoutService->buildLineItems($concert, $cart);
        $totals = $checkoutService->calculateTotals($lineItems);

        // Serialize concert & lineItems for React
        $concertData = [
            'id'               => $concert->id,
            'title'            => $concert->title,
            'city'             => $concert->city,
            'venue_name'       => $concert->venue_name,
            'event_date_label' => $concert->event_date ? $concert->event_date->translatedFormat('D, d M Y') : '',
            'banner_url'       => image_url($concert->banner_url),
        ];

        $lineItemsData = collect($lineItems)->map(fn($item) => [
            'qty'      => $item['qty'],
            'subtotal' => $item['subtotal'],
            'category' => [
                'id'            => $item['category']->id,
                'category_name' => $item['category']->category_name,
                'price'         => $item['category']->price,
            ],
        ])->values()->toArray();

        return Inertia::render('Checkout/Cart', array_merge([
            'concert'   => $concertData,
            'lineItems' => $lineItemsData,
        ], $totals));
    }

    /**
     * Step 1 → Step 1.5 (Review Cart): simpan pilihan ke session, lanjut ke review keranjang.
     */
    public function saveCart(SaveCartRequest $request, Concert $concert): RedirectResponse
    {
        if (Auth::check() && Auth::user()->isAdmin()) {
            return back()->withErrors(['tickets' => 'Sebagai admin, Anda tidak dapat melakukan pembelian tiket.']);
        }

        $validated = $request->validated();

        // Hanya simpan tiket dengan qty > 0
        $selected = [];
        foreach ($validated['tickets'] as $catId => $data) {
            $qty = (int) ($data['qty'] ?? 0);
            if ($qty > 0) {
                $selected[$catId] = ['qty' => $qty];
            }
        }

        if (empty($selected)) {
            return back()->withErrors(['tickets' => 'Pilih minimal 1 tiket dengan jumlah lebih dari 0.']);
        }

        session()->put("cart.{$concert->id}", $selected);

        return redirect()->route('checkout.cart', $concert);
    }

    /**
     * Step 2 – Payment: tampilkan metode pembayaran + ringkasan.
     */
    public function payment(Concert $concert, CheckoutService $checkoutService): Response|RedirectResponse
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $cart = session()->get("cart.{$concert->id}", []);
        if (empty($cart)) {
            return redirect()->route('checkout.cart', $concert)
                ->withErrors(['tickets' => 'Keranjang kosong, pilih tiket terlebih dahulu.']);
        }

        $concert->load('ticketCategories');

        // Hitung ringkasan
        $lineItems = $checkoutService->buildLineItems($concert, $cart);
        $totals = $checkoutService->calculateTotals($lineItems);

        $concertData = [
            'id'               => $concert->id,
            'title'            => $concert->title,
            'city'             => $concert->city,
            'venue_name'       => $concert->venue_name,
            'event_date_label' => $concert->event_date ? $concert->event_date->translatedFormat('D, d M Y') : '',
            'banner_url'       => image_url($concert->banner_url),
        ];

        $lineItemsData = collect($lineItems)->map(fn($item) => [
            'qty'      => $item['qty'],
            'subtotal' => $item['subtotal'],
            'category' => [
                'id'            => $item['category']->id,
                'category_name' => $item['category']->category_name,
                'price'         => $item['category']->price,
            ],
        ])->values()->toArray();

        return Inertia::render('Checkout/Payment', array_merge([
            'concert'   => $concertData,
            'lineItems' => $lineItemsData,
        ], $totals));
    }

    /**
     * Step 2 → Step 3: proses transaksi, simpan ke DB.
     */
    public function processPayment(ProcessPaymentRequest $request, Concert $concert, CheckoutService $checkoutService): RedirectResponse
    {
        $cart = session()->get("cart.{$concert->id}", []);
        if (empty($cart)) {
            return redirect()->route('checkout.cart', $concert);
        }

        $concert->load('ticketCategories');
        $lineItems = $checkoutService->buildLineItems($concert, $cart);
        $totals = $checkoutService->calculateTotals($lineItems);

        // Validate quota
        $quotaErrors = $checkoutService->validateQuotas($lineItems);
        if ($quotaErrors) {
            return back()->withErrors($quotaErrors);
        }

        $validated = $request->validated();
        
        $paymentProvider = null;
        $paymentDetails = null;

        if ($validated['payment_method'] === 'transfer') {
            $paymentProvider = $validated['bank'] ?? null;
            $paymentDetails = [
                'account_name' => $validated['account_name'] ?? null,
                'account_number' => $validated['account_number'] ?? null,
            ];
        } elseif ($validated['payment_method'] === 'ewallet') {
            $paymentProvider = $validated['ewallet'] ?? null;
            $paymentDetails = [
                'phone_number' => $validated['phone_number'] ?? null,
            ];
        }

        // Process payment
        $transaction = $checkoutService->processPayment(
            Auth::id(),
            $validated['payment_method'],
            $paymentProvider,
            $paymentDetails,
            $lineItems,
            $totals
        );

        // Bersihkan cart setelah berhasil
        session()->forget("cart.{$concert->id}");

        // Redirect ke halaman success
        return redirect()->route('checkout.success', [
            'concert' => $concert->id,
            'trx_code' => $transaction->trx_code
        ])->with('success', 'Pembayaran berhasil dan tiket telah terbit.');
    }

    /**
     * Step 3 – Halaman sukses.
     */
    public function success(Request $request, Concert $concert): Response
    {
        return Inertia::render('Checkout/Success', [
            'trxCode' => $request->query('trx_code')
        ]);
    }
}
