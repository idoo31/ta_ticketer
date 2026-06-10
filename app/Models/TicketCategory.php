<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TicketCategory extends Model
{
    protected $fillable = [
        'concert_id',
        'category_name',
        'price',
        'total_quota',
        'available_quota',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'total_quota' => 'integer',
            'available_quota' => 'integer',
        ];
    }

    public function concert(): BelongsTo
    {
        return $this->belongsTo(Concert::class);
    }

    public function transactionDetails(): HasMany
    {
        return $this->hasMany(TransactionDetail::class);
    }
}
