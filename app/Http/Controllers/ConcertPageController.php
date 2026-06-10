<?php

namespace App\Http\Controllers;

use App\Models\Concert;
use App\Services\ConcertService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ConcertPageController extends Controller
{
    public function index(Request $request, ConcertService $concertService): Response
    {
        $keyword = trim($request->input('q', ''));
        $month   = trim($request->input('month', ''));
        $city    = trim($request->input('city', ''));

        $hasFilter = $keyword !== '' || $month !== '' || $city !== '';

        $cities = $concertService->getActiveCities();
        $availableMonths = $concertService->getAvailableMonths();

        if ($hasFilter) {
            $concerts = Concert::select(Concert::listingColumns())
                ->with(['ticketCategories:id,concert_id,category_name,price,available_quota'])
                ->active()
                ->filter(compact('keyword', 'month', 'city'))
                ->orderBy('event_date', 'asc')
                ->get();
        } else {
            $concerts = $concertService->getActiveConcerts();
        }

        $popularConcerts = $hasFilter
            ? collect()
            : $concerts->sortByDesc('created_at')->take(4)->values();

        // Serialize concerts for React
        $serializeConcert = fn($c) => [
            'id'               => $c->id,
            'title'            => $c->title,
            'description'      => $c->description,
            'city'             => $c->city,
            'venue_name'       => $c->venue_name,
            'event_date_label' => $c->event_date ? $c->event_date->translatedFormat('d M Y') : '',
            'banner_url'       => image_url($c->banner_url),
            'min_price'        => $c->ticketCategories->min('price'),
            'available_quota'  => $c->ticketCategories->sum('available_quota'),
        ];

        return Inertia::render('Konser', [
            'concerts'        => $concerts->map($serializeConcert)->values()->toArray(),
            'popularConcerts' => $popularConcerts->map($serializeConcert)->values()->toArray(),
            'cities'          => $cities,
            'availableMonths' => collect($availableMonths)->map(fn($m) => [
                'month_key'   => $m['month_key'],
                'month_label' => $m['month_label'],
            ])->values()->toArray(),
            'keyword'   => $keyword,
            'month'     => $month,
            'city'      => $city,
            'hasFilter' => $hasFilter,
        ]);
    }

    public function show(Concert $concert): Response
    {
        $concert->load('ticketCategories', 'artists');

        return Inertia::render('KonserDetail', [
            'concert' => [
                'id'                  => $concert->id,
                'title'               => $concert->title,
                'description'         => $concert->description,
                'city'                => $concert->city,
                'venue_name'          => $concert->venue_name,
                'event_date_label'    => $concert->event_date ? $concert->event_date->translatedFormat('d M Y') : '',
                'event_date_long'     => $concert->event_date ? $concert->event_date->translatedFormat('l, d F Y') : '',
                'event_time'          => $concert->event_time,
                'banner_url'          => image_url($concert->banner_url),
                'ticket_categories'   => $concert->ticketCategories->map(fn($cat) => [
                    'id'              => $cat->id,
                    'category_name'   => $cat->category_name,
                    'price'           => $cat->price,
                    'available_quota' => $cat->available_quota,
                ])->values()->toArray(),
                'artists'             => $concert->artists->map(fn($a) => [
                    'id'        => $a->id,
                    'name'      => $a->name,
                    'genre'     => $a->genre,
                    'image_url' => image_url($a->image_url),
                ])->values()->toArray(),
            ],
        ]);
    }
}
