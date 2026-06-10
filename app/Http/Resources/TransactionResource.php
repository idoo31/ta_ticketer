<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'trx_code' => $this->trx_code,
            'user' => $this->whenLoaded('user', function () {
                return ['name' => $this->user->name, 'email' => $this->user->email];
            }),
            'subtotal' => $this->subtotal,
            'service_fee' => $this->service_fee,
            'tax' => $this->tax,
            'grand_total' => $this->grand_total,
            'payment_method' => $this->payment_method,
            'payment_provider' => $this->payment_provider,
            'payment_details' => $this->payment_details,
            'status' => $this->status,
            'is_cancellable' => $this->isCancellable(), // added safely
            'created_at_label' => $this->created_at->translatedFormat('d M Y, H:i'),
            'details' => $this->whenLoaded('details', function () {
                return $this->details->map(function ($d) {
                    $cat = $d->ticketCategory;
                    $concert = $cat ? $cat->concert : null;
                    return [
                        'id' => $d->id,
                        'quantity' => $d->quantity,
                        'price_per_unit' => $d->price_per_unit,
                        'subtotal' => $d->subtotal,
                        'concert_title' => $concert ? $concert->title : '—',
                        'category_name' => $cat ? $cat->category_name : '—',
                        'ticket_category' => $cat ? [
                            'category_name' => $cat->category_name,
                            'concert' => $concert ? [
                                'title' => $concert->title,
                                'event_date_label' => $concert->event_date ? $concert->event_date->translatedFormat('d M Y') : '',
                                'venue_name' => $concert->venue_name,
                                'city' => $concert->city,
                                'banner_url' => image_url($concert->banner_url),
                            ] : null,
                        ] : null,
                    ];
                });
            }),
        ];
    }
}
