<?php

namespace App\Http\Controllers;

use App\Services\ConcertService;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(ConcertService $concertService): Response
    {
        $upcomingConcerts = $concertService->getUpcomingConcerts();
        $cities = $concertService->getActiveCities();
        $availableMonths = $concertService->getAvailableMonths();

        // Serialize concerts to array with computed fields for React
        $concertsData = $upcomingConcerts->map(fn($c) => [
            'id'               => $c->id,
            'title'            => $c->title,
            'description'      => $c->description,
            'city'             => $c->city,
            'venue_name'       => $c->venue_name,
            'event_date_label' => $c->event_date ? $c->event_date->translatedFormat('d M Y') : '',
            'banner_url'       => image_url($c->banner_url),
            'min_price'        => $c->ticketCategories->min('price'),
            'available_quota'  => $c->ticketCategories->sum('available_quota'),
        ])->values()->toArray();

        // Format months for React select
        $monthsData = collect($availableMonths)->map(fn($m) => [
            'month_key'   => $m['month_key'],
            'month_label' => $m['month_label'],
        ])->values()->toArray();

        return Inertia::render('Home', [
            'upcomingConcerts' => $concertsData,
            'cities'           => $cities,
            'availableMonths'  => $monthsData,
        ]);
    }
}
