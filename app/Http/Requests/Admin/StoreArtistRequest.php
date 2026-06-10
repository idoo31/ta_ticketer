<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreArtistRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'          => ['required', 'string', 'max:100', Rule::unique('artists', 'name')->whereNull('deleted_at')],
            'slug'          => ['required', 'string', 'max:120', Rule::unique('artists', 'slug')->whereNull('deleted_at')],
            'photo'         => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'genre'         => ['nullable', 'string', 'max:50'],
            'origin'        => ['nullable', 'string', 'max:100'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
            'is_active'     => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'      => 'Nama artis wajib diisi.',
            'name.unique'        => 'Nama artis sudah terdaftar, gunakan nama lain.',
            'name.max'           => 'Nama artis maksimal 100 karakter.',
            'slug.required'      => 'Slug wajib diisi.',
            'slug.unique'        => 'Slug sudah digunakan, gunakan slug lain.',
            'photo.required'     => 'Foto artis wajib diupload.',
            'photo.image'        => 'File harus berupa gambar.',
            'photo.mimes'        => 'Format foto harus JPG atau PNG.',
            'photo.max'          => 'Ukuran foto maksimal 2 MB.',
            'instagram_url.url'  => 'Format URL tidak valid.',
        ];
    }
}
