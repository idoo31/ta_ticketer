<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Concert>
 */
class ConcertFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake('id_ID')->sentence(3) . ' Live in ' . fake('id_ID')->city(),
            'venue_name' => 'Stadion ' . fake('id_ID')->city(),
            'city' => fake('id_ID')->city(),
            'event_date' => fake('id_ID')->dateTimeBetween('+1 week', '+1 year')->format('Y-m-d'),
            'event_time' => fake('id_ID')->time('H:00:00'),
            'description' => fake('id_ID')->paragraph(),
            'banner_url' => fake('id_ID')->imageUrl(800, 400, 'concert', true),
            'status' => fake('id_ID')->randomElement(['active', 'draft', 'completed']),
        ];
    }
}
