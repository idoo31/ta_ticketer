<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Carbon\Carbon;

class WeatherService
{
    /**
     * Get weather forecast for a specific location and date.
     * Supports both coordinates (lat/lon) and city name lookup.
     */
    public function getForecastForEvent(string $city, Carbon $eventDate, ?float $latitude = null, ?float $longitude = null)
    {
        $apiKey = env('OPENWEATHER_API_KEY');
        
        if (empty($apiKey)) {
            Log::warning('OpenWeatherMap: API key tidak ditemukan di .env');
            return null;
        }

        // Cek apakah tanggal acara masih dalam jangkauan 5 hari dari sekarang
        $now = now();
        if ($eventDate->isAfter($now->copy()->addDays(5))) {
            return null; // Terlalu jauh, API hanya mendukung 5 hari
        }

        try {
            // Cache key berdasarkan kota (agar tidak request berulang)
            $cacheKey = 'owm_forecast_' . Str::slug($city);

            $data = Cache::remember($cacheKey, now()->addHours(3), function () use ($city, $apiKey, $latitude, $longitude) {
                return $this->fetchForecastData($city, $apiKey, $latitude, $longitude);
            });

            if (!$data || !isset($data['list'])) {
                // Cache mungkin menyimpan null dari percobaan gagal sebelumnya.
                // Hapus cache dan coba sekali lagi.
                Cache::forget($cacheKey);
                return null;
            }

            return $this->findClosestForecast($data, $eventDate);
        } catch (\Exception $e) {
            Log::error('OpenWeatherMap Error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Fetch forecast data from OpenWeatherMap API.
     * Tries coordinates first (more reliable), falls back to city name.
     */
    private function fetchForecastData(string $city, string $apiKey, ?float $latitude, ?float $longitude): ?array
    {
        // Strategi 1: Gunakan koordinat (lat/lon) jika tersedia — lebih akurat & reliable
        if ($latitude && $longitude) {
            $response = Http::timeout(15)
                ->retry(2, 1000)
                ->get('https://api.openweathermap.org/data/2.5/forecast', [
                    'lat'   => $latitude,
                    'lon'   => $longitude,
                    'appid' => $apiKey,
                    'units' => 'metric',
                    'lang'  => 'id',
                ]);

            if ($response->successful()) {
                Log::info("OpenWeatherMap: Berhasil fetch via koordinat ({$latitude},{$longitude})");
                return $response->json();
            }

            Log::warning("OpenWeatherMap: Gagal fetch via koordinat, HTTP {$response->status()}");
        }

        // Strategi 2: Fallback ke nama kota
        $response = Http::timeout(15)
            ->retry(2, 1000)
            ->get('https://api.openweathermap.org/data/2.5/forecast', [
                'q'     => $city . ',ID',
                'appid' => $apiKey,
                'units' => 'metric',
                'lang'  => 'id',
            ]);

        if ($response->successful()) {
            Log::info("OpenWeatherMap: Berhasil fetch via kota '{$city}'");
            return $response->json();
        }

        Log::warning("OpenWeatherMap: Gagal fetch via kota '{$city}', HTTP {$response->status()}");
        return null;
    }

    /**
     * Find the forecast entry closest to the event date/time.
     */
    private function findClosestForecast(array $data, Carbon $eventDate): ?array
    {
        $targetTimestamp = $eventDate->timestamp;
        
        $closestForecast = null;
        $smallestDiff = PHP_INT_MAX;

        foreach ($data['list'] as $forecast) {
            $diff = abs($forecast['dt'] - $targetTimestamp);
            if ($diff < $smallestDiff) {
                $smallestDiff = $diff;
                $closestForecast = $forecast;
            }
        }

        // Pastikan selisih waktu tidak terlalu jauh (maksimal 12 jam)
        if ($closestForecast && $smallestDiff <= (12 * 3600)) {
            return [
                'temp'        => round($closestForecast['main']['temp']),
                'description' => ucfirst($closestForecast['weather'][0]['description']),
                'icon_url'    => 'https://openweathermap.org/img/wn/' . $closestForecast['weather'][0]['icon'] . '@2x.png',
                'humidity'    => $closestForecast['main']['humidity'],
                'wind_speed'  => $closestForecast['wind']['speed'],
                'is_forecast' => true,
            ];
        }

        return null;
    }
}
