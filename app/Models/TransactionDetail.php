<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransactionDetail extends Model
{
    protected $fillable = [
        'transaction_id',
        'ticket_category_id',
        'quantity',
        'price_per_unit',
        'subtotal',
    ];

    protected function casts(): array
    {
        return [
            'price_per_unit' => 'decimal:2',
            'subtotal'       => 'decimal:2',
            'quantity'       => 'integer',
        ];
    }

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    public function ticketCategory(): BelongsTo
    {
        return $this->belongsTo(TicketCategory::class);
    }
}
