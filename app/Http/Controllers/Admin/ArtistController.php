<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreArtistRequest;
use App\Http\Requests\Admin\UpdateArtistRequest;
use App\Models\Artist;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ArtistController extends Controller
{
    /**
     * Daftar artis dengan pencarian & filter genre.
     */
    public function index(Request $request): Response
    {
        $keyword = trim($request->input('q', ''));
        $genre   = trim($request->input('genre', ''));

        $artists = Artist::query()
            ->when($keyword, fn($q) => $q->where('name', 'like', "%{$keyword}%"))
            ->when($genre,   fn($q) => $q->where('genre', $genre))
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        $artists->getCollection()->transform(function ($a) {
            $a->image_url = image_url($a->image_url);
            return $a;
        });

        // Daftar genre unik untuk filter dropdown
        $genres = Artist::whereNotNull('genre')->distinct()->orderBy('genre')->pluck('genre');

        return Inertia::render('Admin/Artis', [
            'artists' => $artists,
            'filters' => ['q' => $keyword, 'genre' => $genre],
            'genres'  => $genres
        ]);
    }

    /**
     * Endpoint AJAX — kembalikan artis aktif dalam format JSON.
     * Digunakan oleh form tambah/edit konser untuk pencarian artis real-time.
     */
    public function search(Request $request)
    {
        $q = trim($request->input('q', ''));

        $artists = Artist::active()
            ->when($q, fn($query) => $query->where('name', 'like', "%{$q}%"))
            ->orderBy('name')
            ->get(['id', 'name', 'genre']);

        return response()->json($artists);
    }

    /**
     * Simpan artis baru.
     */
    public function store(StoreArtistRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $photoUrl = null;
        if ($request->hasFile('photo')) {
            $file     = $request->file('photo');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('images/artists'), $filename);
            $photoUrl = 'images/artists/' . $filename;
        }

        Artist::create([
            'name'          => $validated['name'],
            'slug'          => $validated['slug'],
            'genre'         => $validated['genre'] ?? null,
            'origin'        => $validated['origin'] ?? null,
            'image_url'     => $photoUrl,
            'instagram_url' => $validated['instagram_url'] ?? null,
            'is_active'     => $request->boolean('is_active', true),
        ]);

        return redirect()
            ->route('admin.artists.index')
            ->with('success', 'Artis "' . $validated['name'] . '" berhasil ditambahkan.');
    }

    /**
     * Form edit artis.
     */
    public function edit(Artist $artis): Response
    {
        $concertsCount = $artis->concerts()->count();
        $artistData = $artis->toArray();
        $artistData['image_url'] = image_url($artis->image_url);
        return Inertia::render('Admin/EditArtis', [
            'artist' => $artistData,
            'concertsCount' => $concertsCount,
        ]);
    }

    /**
     * Simpan perubahan artis.
     */
    public function update(UpdateArtistRequest $request, Artist $artis): RedirectResponse
    {
        $validated = $request->validated();

        $photoUrl = $artis->getRawOriginal('image_url');
        if ($request->hasFile('photo')) {
            // Hapus foto lama jika ada
            $oldPath = $artis->getRawOriginal('image_url');
            if ($oldPath) {
                if (str_starts_with($oldPath, 'images/')) {
                    @unlink(public_path($oldPath));
                } else {
                    Storage::disk('public')->delete($oldPath);
                }
            }
            $file     = $request->file('photo');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('images/artists'), $filename);
            $photoUrl = 'images/artists/' . $filename;
        }

        $artis->update([
            'name'          => $validated['name'],
            'slug'          => $validated['slug'],
            'genre'         => $validated['genre'] ?? null,
            'origin'        => $validated['origin'] ?? null,
            'image_url'     => $photoUrl,
            'instagram_url' => $validated['instagram_url'] ?? null,
            'is_active'     => $request->boolean('is_active', true),
        ]);

        return redirect()
            ->route('admin.artists.index')
            ->with('success', 'Artis "' . $artis->name . '" berhasil diperbarui.');
    }

    /**
     * Hapus artis (soft delete, setelah peringatan via JS).
     * Jika artis terhubung ke konser, soft-delete agar data historis terjaga.
     */
    public function destroy(Artist $artis): RedirectResponse
    {
        $concertCount = $artis->concerts()->count();

        // Soft delete artis — relasi pivot tetap ada, data historis konser aman
        $name = $artis->name;
        $artis->delete();

        $message = $concertCount > 0
            ? "Artis \"{$name}\" berhasil dinonaktifkan (terhubung {$concertCount} konser)."
            : "Artis \"{$name}\" berhasil dihapus.";

        return redirect()
            ->route('admin.artists.index')
            ->with('success', $message);
    }
}
