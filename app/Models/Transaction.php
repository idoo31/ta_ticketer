<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaction extends Model
{
    protected $connection = 'mysql_node2';


    protected $fillable = [
        'trx_code',
        'user_id',
        'subtotal',
        'service_fee',
        'tax',
        'grand_total',
        'payment_method',
        'payment_provider',
        'payment_details',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'subtotal'     => 'decimal:2',
            'service_fee'  => 'decimal:2',
            'tax'          => 'decimal:2',
            'grand_total'  => 'decimal:2',
            'payment_details' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function details(): HasMany
    {
        return $this->hasMany(TransactionDetail::class);
    }

    /**
     * Cek apakah transaksi masih bisa dibatalkan.
     * Syarat: status 'paid' dan konser masih > 7 hari lagi.
     */
    public function isCancellable(): bool
    {
        if ($this->status !== 'paid') {
            return false;
        }

        // Ambil tanggal konser dari detail pertama yang tersedia
        $concert = $this->details->first()?->ticketCategory?->concert;

        if (! $concert) {
            return false;
        }

        // Hitung selisih hari antara hari ini dan tanggal konser
        $daysUntilEvent = now()->startOfDay()->diffInDays(
            $concert->event_date->startOfDay(),
            false // false = bisa negatif jika sudah lewat
        );

        return $daysUntilEvent > 7;
    }
}

