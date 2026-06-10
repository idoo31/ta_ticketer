<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Observers\ConcertObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;

#[ObservedBy([ConcertObserver::class])]
class Concert extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'venue_name',
        'city',
        'event_date',
        'event_time',
        'description',
        'banner_url',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
        ];
    }

    /**
     * Kolom yang diperlukan untuk listing card (tidak perlu description).
     */
    public static function listingColumns(): array
    {
        return ['id', 'title', 'venue_name', 'city', 'event_date', 'event_time', 'banner_url', 'status', 'created_at'];
    }

    /**
     * Scope: konser aktif yang belum lewat tanggalnya.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active')
                     ->whereDate('event_date', '>=', now());
    }

    /**
     * Scope: filter konser berdasarkan pencarian, bulan, dan kota.
     */
    public function scopeFilter(Builder $query, array $filters): Builder
    {
        $query->when($filters['keyword'] ?? null, function ($q, $keyword) {
            $q->where(function ($sub) use ($keyword) {
                $sub->where('title', 'like', "%{$keyword}%")
                    ->orWhere('venue_name', 'like', "%{$keyword}%")
                    ->orWhereHas('artists', fn ($a) => $a->where('name', 'like', "%{$keyword}%"));
            });
        });

        $query->when($filters['month'] ?? null, function ($q, $month) {
            if (preg_match('/^\d{4}-\d{2}$/', $month)) {
                [$year, $mon] = explode('-', $month);
                $q->whereYear('event_date', (int) $year)
                  ->whereMonth('event_date', (int) $mon);
            }
        });

        $query->when($filters['city'] ?? null, function ($q, $city) {
            $q->where('city', $city);
        });

        return $query;
    }

    public function ticketCategories(): HasMany
    {
        return $this->hasMany(TicketCategory::class);
    }

    public function artists(): BelongsToMany
    {
        return $this->belongsToMany(Artist::class, 'concert_artists')
                    ->withPivot('order')
                    ->orderByPivot('order');
    }
}
