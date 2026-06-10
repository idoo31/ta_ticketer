<?php

namespace App\Services;

use App\Models\Concert;
use App\Models\TicketCategory;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CheckoutService
{
    /**
     * Build line items from cart session data.
     *
     * @param Concert $concert
     * @param array $cart
     * @return array
     */
    public function buildLineItems(Concert $concert, array $cart): array
    {
        $categoryIds = array_keys($cart);
        $categories  = TicketCategory::whereIn('id', $categoryIds)
            ->where('concert_id', $concert->id)
            ->get()
            ->keyBy('id');

        $lineItems = [];
        foreach ($cart as $catId => $data) {
            $category = $categories->get($catId);
            if (!$category) {
                continue;
            }
            $qty      = (int) $data['qty'];
            $lineItems[] = [
                'category' => $category,
                'qty'      => $qty,
                'price'    => (float) $category->price,
                'subtotal' => (float) $category->price * $qty,
            ];
        }

        return $lineItems;
    }

    /**
     * Calculate subtotal, service fee, tax, and grand total.
     *
     * @param array $lineItems
     * @return array{subtotal: int, serviceFee: int, tax: int, grandTotal: int}
     */
    public function calculateTotals(array $lineItems): array
    {
        $subtotal   = collect($lineItems)->sum('subtotal');
        $serviceFee = (int) round($subtotal * 0.05);   // 5%
        $tax        = (int) round($subtotal * 0.10);   // 10%
        $grandTotal = $subtotal + $serviceFee + $tax;

        return compact('subtotal', 'serviceFee', 'tax', 'grandTotal');
    }

    /**
     * Validate if the requested quotas are available.
     *
     * @param array $lineItems
     * @return array|null Returns array of errors if validation fails, null otherwise.
     */
    public function validateQuotas(array $lineItems): ?array
    {
        foreach ($lineItems as $item) {
            $category = $item['category'];
            if ($category->available_quota < $item['qty']) {
                return [
                    'tickets' => "Kuota tiket '{$category->category_name}' tidak mencukupi. Tersisa: {$category->available_quota}.",
                ];
            }
        }
        return null;
    }

    /**
     * Process the payment and save the transaction.
     *
     * @param int $userId
     * @param string $paymentMethod
     * @param string|null $paymentProvider
     * @param array|null $paymentDetails
     * @param array $lineItems
     * @param array $totals
     * @return Transaction
     */
    public function processPayment(int $userId, string $paymentMethod, ?string $paymentProvider, ?array $paymentDetails, array $lineItems, array $totals): Transaction
    {
        return DB::transaction(function () use ($userId, $paymentMethod, $paymentProvider, $paymentDetails, $lineItems, $totals) {
            $transaction = Transaction::create([
                'trx_code'         => 'TRX-' . strtoupper(Str::random(8)),
                'user_id'          => $userId,
                'subtotal'         => $totals['subtotal'],
                'service_fee'      => $totals['serviceFee'],
                'tax'              => $totals['tax'],
                'grand_total'      => $totals['grandTotal'],
                'payment_method'   => $paymentMethod,
                'payment_provider' => $paymentProvider,
                'payment_details'  => $paymentDetails,
                'status'           => 'paid',
            ]);

            $now        = now();
            $detailRows = [];
            foreach ($lineItems as $item) {
                $detailRows[] = [
                    'transaction_id'     => $transaction->id,
                    'ticket_category_id' => $item['category']->id,
                    'quantity'           => $item['qty'],
                    'price_per_unit'     => $item['price'],
                    'subtotal'           => $item['subtotal'],
                    'created_at'         => $now,
                    'updated_at'         => $now,
                ];
                $item['category']->decrement('available_quota', $item['qty']);
            }
            TransactionDetail::insert($detailRows);

            return $transaction;
        });
    }
}
