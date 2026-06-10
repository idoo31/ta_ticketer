<?php

namespace App\Http\Requests\Checkout;

use Illuminate\Foundation\Http\FormRequest;

class ProcessPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'payment_method' => ['required', 'string', 'in:credit_card,transfer,ewallet'],
            
            // Transfer Bank validation
            'bank' => ['required_if:payment_method,transfer', 'string', 'nullable'],
            'account_name' => ['required_if:payment_method,transfer', 'string', 'nullable', 'max:255'],
            'account_number' => ['required_if:payment_method,transfer', 'string', 'nullable', 'max:50'],

            // E-Wallet validation
            'ewallet' => ['required_if:payment_method,ewallet', 'string', 'nullable'],
            'phone_number' => ['required_if:payment_method,ewallet', 'string', 'nullable', 'max:20'],
        ];
    }

    public function messages(): array
    {
        return [
            'payment_method.required' => 'Pilih metode pembayaran.',
            'payment_method.in'       => 'Metode pembayaran tidak valid.',
            'bank.required_if'        => 'Pilih bank untuk transfer.',
            'account_name.required_if' => 'Nama pemilik rekening wajib diisi.',
            'account_number.required_if' => 'Nomor rekening wajib diisi.',
            'ewallet.required_if'     => 'Pilih dompet digital.',
            'phone_number.required_if' => 'Nomor handphone terdaftar wajib diisi.',
        ];
    }
}
