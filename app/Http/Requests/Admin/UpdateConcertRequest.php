<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateConcertRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title'                              => ['required', 'string', 'max:150'],
            'venue_name'                         => ['required', 'string', 'max:100'],
            'city'                               => ['required', 'string', 'max:100'],
            'event_date'                         => ['required', 'date'],
            'event_time'                         => ['required', 'date_format:H:i'],
            'description'                        => ['nullable', 'string'],
            'status'                             => ['required', 'in:active,draft,completed'],
            'banner'                             => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'artist_ids'                         => ['required', 'array', 'min:1'],
            'artist_ids.*'                       => ['integer', 'exists:artists,id'],
            'ticket_categories'                  => ['required', 'array', 'min:1'],
            'ticket_categories.*.category_name'  => ['required', 'string', 'max:50'],
            'ticket_categories.*.price'          => ['required', 'numeric', 'min:0'],
            'ticket_categories.*.total_quota'    => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'                             => 'Judul konser wajib diisi.',
            'venue_name.required'                        => 'Nama venue wajib diisi.',
            'city.required'                              => 'Kota wajib diisi.',
            'event_date.required'                        => 'Tanggal acara wajib diisi.',
            'event_time.required'                        => 'Waktu acara wajib diisi.',
            'event_time.date_format'                     => 'Format waktu tidak valid (HH:MM).',
            'status.required'                            => 'Status wajib dipilih.',
            'status.in'                                  => 'Status tidak valid.',
            'banner.image'                               => 'File gambar tidak valid.',
            'banner.mimes'                               => 'Format gambar harus JPG, PNG, atau WebP.',
            'banner.max'                                 => 'Ukuran gambar maksimal 2 MB.',
            'ticket_categories.required'                 => 'Minimal tambahkan 1 kategori tiket.',
            'ticket_categories.*.category_name.required' => 'Nama kategori tiket wajib diisi.',
            'ticket_categories.*.price.required'         => 'Harga tiket wajib diisi.',
            'ticket_categories.*.price.numeric'          => 'Harga tiket harus berupa angka.',
            'ticket_categories.*.price.min'              => 'Harga tiket tidak boleh negatif.',
            'ticket_categories.*.total_quota.required'   => 'Kuota tiket wajib diisi.',
            'ticket_categories.*.total_quota.integer'    => 'Kuota tiket harus berupa angka bulat.',
            'ticket_categories.*.total_quota.min'        => 'Kuota tiket minimal 1.',
            'artist_ids.required'                        => 'Pilih minimal 1 artis yang tampil.',
            'artist_ids.min'                             => 'Pilih minimal 1 artis yang tampil.',
            'artist_ids.*.exists'                        => 'Artis yang dipilih tidak valid.',
        ];
    }
}
