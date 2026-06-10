<?php

namespace App\Services;

use App\Models\Concert;
use Illuminate\Support\Facades\Cache;

class ConcertService
{
    /**
     * Get a list of active unique cities where concerts are held.
     *
     * @return array
     */
    public function getActiveCities(): array
    {
        return Cache::remember('concerts.cities', now()->addMinutes(10), fn () =>
            Concert::active()->distinct()->orderBy('city')->pluck('city')->toArray()
        );
    }

    /**
     * Get a list of active available months for filtering.
     *
     * @return array
     */
    public function getAvailableMonths(): array
    {
        return Cache::remember('concerts.months', now()->addMinutes(10), fn () =>
            Concert::active()
                ->selectRaw("DATE_FORMAT(event_date, '%Y-%m') as month_key, DATE_FORMAT(event_date, '%M %Y') as month_label")
                ->distinct()
                ->get()
                ->sortBy('month_key')
                ->map(fn ($c) => ['month_key' => $c->month_key, 'month_label' => $c->month_label])
                ->values()
                ->toArray()
        );
    }

    /**
     * Get active concerts for the homepage (limit 4).
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getUpcomingConcerts()
    {
        $concertsArray = Cache::remember('home.upcoming_concerts', now()->addMinutes(5), function () {
            return Concert::select(Concert::listingColumns())
                ->with(['ticketCategories:id,concert_id,category_name,price,available_quota'])
                ->active()
                ->orderBy('event_date', 'asc')
                ->limit(4)
                ->get()
                ->toArray();
        });

        return Concert::hydrate($concertsArray)->load('ticketCategories');
    }

    /**
     * Get all active concerts (cached without filters).
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getActiveConcerts()
    {
        $concertsArray = Cache::remember('concerts.active_listing', now()->addMinutes(5), function () {
            return Concert::select(Concert::listingColumns())
                ->with(['ticketCategories:id,concert_id,category_name,price,available_quota'])
                ->active()
                ->orderBy('event_date', 'asc')
                ->get()
                ->toArray();
        });

        return Concert::hydrate($concertsArray)->load('ticketCategories');
    }
}
