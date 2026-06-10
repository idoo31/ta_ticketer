<?php

namespace App\Observers;

use App\Models\Concert;
use Illuminate\Support\Facades\Cache;

class ConcertObserver
{
    /**
     * Clear caches whenever a concert is created, updated, or deleted.
     */
    private function clearCaches(): void
    {
        Cache::forget('home.upcoming_concerts');
        Cache::forget('concerts.active_listing');
        Cache::forget('concerts.cities');
        Cache::forget('concerts.months');
    }

    public function created(Concert $concert): void
    {
        $this->clearCaches();
    }

    public function updated(Concert $concert): void
    {
        $this->clearCaches();
    }

    public function deleted(Concert $concert): void
    {
        $this->clearCaches();
    }

    public function restored(Concert $concert): void
    {
        $this->clearCaches();
    }

    public function forceDeleted(Concert $concert): void
    {
        $this->clearCaches();
    }
}
