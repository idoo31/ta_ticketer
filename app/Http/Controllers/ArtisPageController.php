<?php

namespace App\Http\Controllers;

use App\Models\Artist;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArtistPageController extends Controller
{
    public function index(Request $request): Response
    {
        $keyword = trim($request->input('q', ''));

        $artists = Artist::active()
            ->when($keyword, fn($q) => $q->where('name', 'like', "%{$keyword}%"))
            ->orderBy('name')
            ->get(['id', 'name', 'genre', 'origin', 'image_url']);

        return Inertia::render('Artis', [
            'artists' => $artists->map(fn($a) => [
                'id'        => $a->id,
                'name'      => $a->name,
                'genre'     => $a->genre,
                'origin'    => $a->origin,
                'image_url' => image_url($a->image_url),
            ])->values()->toArray(),
            'keyword' => $keyword,
        ]);
    }
}
