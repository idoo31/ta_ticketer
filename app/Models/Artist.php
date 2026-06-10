<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Artist extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'genre',
        'origin',
        'image_url',
        'instagram_url',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * Scope: artis aktif (tidak dihapus & is_active = true).
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function concerts(): BelongsToMany
    {
        return $this->belongsToMany(Concert::class, 'concert_artists')
                    ->withPivot('order');
    }
}
