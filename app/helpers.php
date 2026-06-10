<?php

if (! function_exists('image_url')) {
    /**
     * Menghasilkan URL gambar artis/konser.
     *
     * Backward-compatible:
     * - Path baru (mulai 'images/'): langsung pakai asset()
     * - Path lama (dari storage disk): pakai Storage::url() sebagai fallback
     */
    function image_url(?string $path): string
    {
        if (! $path) {
            return '';
        }

        if (str_starts_with($path, 'images/')) {
            return asset($path);
        }

        // Fallback untuk data lama yang disimpan via Storage::disk('public')
        return \Illuminate\Support\Facades\Storage::url($path);
    }
}
