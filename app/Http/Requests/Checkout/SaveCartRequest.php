<?php

namespace App\Http\Requests\Checkout;

use Illuminate\Foundation\Http\FormRequest;

class SaveCartRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tickets'      => ['required', 'array'],
            'tickets.*.qty'=> ['required', 'integer', 'min:0', 'max:10'],
        ];
    }

    public function messages(): array
    {
        return [
            'tickets.required'      => 'Pilih minimal 1 tiket.',
            'tickets.*.qty.max'     => 'Maksimal pembelian 10 tiket per kategori.',
        ];
    }
}
