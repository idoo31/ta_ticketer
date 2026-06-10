<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreConcertRequest;
use App\Http\Requests\Admin\UpdateConcertRequest;
use App\Models\Artist;
use App\Models\Concert;
use App\Models\TicketCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ConcertController extends Controller
{
    /**
     * Display a listing of all concerts, with optional title search.
     */
    public function index(Request $request): Response
    {
        $keyword = trim($request->input('q', ''));

        $concerts = Concert::select(['id', 'title', 'venue_name', 'city', 'event_date', 'event_time', 'status', 'banner_url', 'created_at'])
            ->with([
                'ticketCategories:id,concert_id,category_name,price,total_quota,available_quota',
                'ticketCategories.transactionDetails:id,ticket_category_id',
                'artists:id,name,image_url',
            ])
            ->when($keyword, fn($q) => $q->where('title', 'like', "%{$keyword}%"))
            ->latest()
            ->get();

        $artists = Artist::active()->orderBy('name')->get(['id', 'name', 'genre']);

        return Inertia::render('Admin/LayananKonser', [
            'concerts' => $concerts->map(function ($c) {
                return [
                    'id' => $c->id,
                    'title' => $c->title,
                    'venue_name' => $c->venue_name,
                    'city' => $c->city,
                    'event_date' => $c->event_date,
                    'event_date_label' => $c->event_date ? $c->event_date->translatedFormat('d M Y') : '',
                    'event_time' => $c->event_time,
                    'status' => $c->status,
                    'banner_url' => image_url($c->banner_url),
                    'created_at' => $c->created_at,
                    'artists' => $c->artists,
                    'ticket_categories' => $c->ticketCategories->map(fn($tc) => [
                        'id' => $tc->id,
                        'category_name' => $tc->category_name,
                        'price' => $tc->price,
                        'total_quota' => $tc->total_quota,
                        'available_quota' => $tc->available_quota,
                        'has_transactions' => $tc->transactionDetails->count() > 0,
                    ]),
                    'total_quota' => $c->ticketCategories->sum('total_quota'),
                    'tickets_sold' => $c->ticketCategories->sum(fn($cat) => $cat->total_quota - $cat->available_quota),
                    'min_price' => $c->ticketCategories->min('price'),
                ];
            }),
            'filters' => ['q' => $keyword],
            'artists' => $artists,
        ]);
    }

    /**
     * Store a newly created concert in storage.
     */
    public function store(StoreConcertRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        // Handle banner upload
        $bannerUrl = null;
        if ($request->hasFile('banner')) {
            $file     = $request->file('banner');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('images/concerts'), $filename);
            $bannerUrl = 'images/concerts/' . $filename;
        }

        // Create the concert
        $concert = Concert::create([
            'title'       => $validated['title'],
            'venue_name'  => $validated['venue_name'],
            'city'        => $validated['city'],
            'event_date'  => $validated['event_date'],
            'event_time'  => $validated['event_time'],
            'description' => $validated['description'] ?? null,
            'status'      => $validated['status'],
            'banner_url'  => $bannerUrl,
        ]);

        // --- BULK INSERT: satu query untuk semua kategori tiket ---
        $now = now();
        $categoryRows = array_map(fn($cat) => [
            'concert_id'      => $concert->id,
            'category_name'   => $cat['category_name'],
            'price'           => $cat['price'],
            'total_quota'     => $cat['total_quota'],
            'available_quota' => $cat['total_quota'],
            'created_at'      => $now,
            'updated_at'      => $now,
        ], $validated['ticket_categories']);

        TicketCategory::insert($categoryRows);

        // Sync artis dengan urutan tampil
        if (isset($validated['artist_ids'])) {
            $artistIds = collect($validated['artist_ids'])
                ->values()
                ->mapWithKeys(fn($id, $index) => [$id => ['order' => $index]])
                ->toArray();
            $concert->artists()->sync($artistIds);
        }

        return redirect()
            ->route('admin.concerts.index')
            ->with('success', 'Konser "' . $concert->title . '" berhasil ditambahkan.');
    }

    /**
     * Show the edit form for a concert.
     */
    public function edit(Concert $concert): Response
    {
        $concert->load(['ticketCategories', 'artists']);
        $artists = Artist::active()->orderBy('name')->get(['id', 'name', 'genre']);
        
        $concertData = [
            'id' => $concert->id,
            'title' => $concert->title,
            'venue_name' => $concert->venue_name,
            'city' => $concert->city,
            'event_date' => $concert->event_date ? $concert->event_date->format('Y-m-d') : '',
            'event_time' => $concert->event_time ? substr($concert->event_time, 0, 5) : '',
            'description' => $concert->description,
            'status' => $concert->status,
            'banner_url' => image_url($concert->banner_url),
            'artists' => $concert->artists->map(fn($a) => ['id' => $a->id, 'name' => $a->name])->toArray(),
            'ticket_categories' => $concert->ticketCategories->map(fn($tc) => [
                'id' => $tc->id,
                'category_name' => $tc->category_name,
                'price' => $tc->price,
                'total_quota' => $tc->total_quota,
            ])->toArray()
        ];
        
        return Inertia::render('Admin/EditKonser', [
            'concert' => $concertData,
            'artists' => $artists
        ]);
    }

    /**
     * Update a concert in storage.
     */
    public function update(UpdateConcertRequest $request, Concert $concert): RedirectResponse
    {
        $validated = $request->validated();

        // Handle banner upload — replace old one if new file uploaded
        $bannerUrl = $concert->banner_url;
        if ($request->hasFile('banner')) {
            if ($concert->banner_url) {
                if (str_starts_with($concert->banner_url, 'images/')) {
                    @unlink(public_path($concert->banner_url));
                } else {
                    Storage::disk('public')->delete($concert->banner_url);
                }
            }
            $file     = $request->file('banner');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('images/concerts'), $filename);
            $bannerUrl = 'images/concerts/' . $filename;
        }

        // Update the concert
        $concert->update([
            'title'       => $validated['title'],
            'venue_name'  => $validated['venue_name'],
            'city'        => $validated['city'],
            'event_date'  => $validated['event_date'],
            'event_time'  => $validated['event_time'],
            'description' => $validated['description'] ?? null,
            'status'      => $validated['status'],
            'banner_url'  => $bannerUrl,
        ]);

        // --- UPDATE KATEGORI TIKET ---
        $existingCategories = $concert->ticketCategories()->withCount('transactionDetails')->get();
        $newCategories       = array_values($validated['ticket_categories']);

        $deletable = $existingCategories->filter(fn($c) => $c->transaction_details_count === 0);
        $protected = $existingCategories->filter(fn($c) => $c->transaction_details_count  > 0)->values();

        if ($deletable->isNotEmpty()) {
            TicketCategory::whereIn('id', $deletable->pluck('id'))->delete();
        }

        $now       = now();
        $toInsert  = [];

        foreach ($newCategories as $i => $cat) {
            if (isset($protected[$i])) {
                $protected[$i]->update([
                    'category_name'   => $cat['category_name'],
                    'price'           => $cat['price'],
                    'total_quota'     => $cat['total_quota'],
                    'available_quota' => max(0, $cat['total_quota'] - ($protected[$i]->total_quota - $protected[$i]->available_quota)),
                ]);
            } else {
                $toInsert[] = [
                    'concert_id'      => $concert->id,
                    'category_name'   => $cat['category_name'],
                    'price'           => $cat['price'],
                    'total_quota'     => $cat['total_quota'],
                    'available_quota' => $cat['total_quota'],
                    'created_at'      => $now,
                    'updated_at'      => $now,
                ];
            }
        }

        if (!empty($toInsert)) {
            TicketCategory::insert($toInsert);
        }

        // Sync artis dengan urutan tampil
        if (isset($validated['artist_ids'])) {
            $artistIds = collect($validated['artist_ids'])
                ->values()
                ->mapWithKeys(fn($id, $index) => [$id => ['order' => $index]])
                ->toArray();
            $concert->artists()->sync($artistIds);
        } else {
            $concert->artists()->sync([]);
        }

        return redirect()
            ->route('admin.concerts.index')
            ->with('success', 'Konser "' . $concert->title . '" berhasil diperbarui.');
    }

    /**
     * Delete a concert.
     */
    public function destroy(Concert $concert): RedirectResponse
    {
        // Cek apakah ada tiket kategori yang sudah memiliki transaksi
        $hasTransactions = $concert->ticketCategories()->whereHas('transactionDetails')->exists();

        if ($hasTransactions) {
            return redirect()
                ->route('admin.concerts.index')
                ->with('error', 'Konser "' . $concert->title . '" tidak dapat dihapus karena sudah memiliki data transaksi.');
        }

        if ($concert->banner_url) {
            if (str_starts_with($concert->banner_url, 'images/')) {
                @unlink(public_path($concert->banner_url));
            } else {
                Storage::disk('public')->delete($concert->banner_url);
            }
        }

        $title = $concert->title;
        $concert->delete();

        return redirect()
            ->route('admin.concerts.index')
            ->with('success', 'Konser "' . $title . '" berhasil dihapus.');
    }
}
