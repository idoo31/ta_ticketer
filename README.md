# 🎫 TA Ticketer — Platform Penjualan Tiket Konser Online

Platform pembelian tiket konser berbasis web yang dibangun dengan **Laravel 13**, **React (Inertia.js)**, dan arsitektur **database multi-node**.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Backend | Laravel 13 (PHP 8.3) |
| Frontend | React 19 + Inertia.js |
| Bundler | Vite 8 |
| Database | MySQL (2 node terpisah) |
| Styling | Tailwind CSS / Vanilla CSS |

---

## ✨ Fitur Utama

- 🎟️ Sistem pembelian tiket multi-kategori dengan keranjang belanja
- 🌤️ **Widget cuaca otomatis** per konser (OpenWeatherMap API)
- 🗺️ **Peta interaktif lokasi venue** (OpenStreetMap + Leaflet.js)
- 🔍 Pencarian venue otomatis via Nominatim Geocoding API
- 👤 Autentikasi pengguna + panel admin lengkap
- 🗄️ Arsitektur database terdistribusi (Node 1: Konser, Node 2: Transaksi)
- 📄 Cetak E-Ticket setelah pembayaran berhasil

---

## 🌐 Microservice API yang Digunakan

| # | API | Fungsi | API Key |
|---|---|---|---|
| 1 | **OpenWeatherMap** | Prakiraan cuaca di halaman konser | ✅ **Wajib daftar** (Gratis) |
| 2 | **Nominatim (OSM)** | Pencarian venue otomatis di admin | ❌ Tidak perlu |
| 3 | **OpenStreetMap Tiles** | Peta interaktif di halaman konser | ❌ Tidak perlu |

> **Catatan:** Hanya OpenWeatherMap yang membutuhkan API Key. Nominatim dan OpenStreetMap sepenuhnya gratis tanpa pendaftaran.

---

## ⚙️ Cara Setup Lokal (Setelah Clone)

### 1. Clone Repository

```bash
git clone https://github.com/USERNAME/ta_ticketer.git
cd ta_ticketer
```

### 2. Install Dependencies

```bash
composer install
npm install
```

### 3. Buat File `.env`

```bash
cp .env.example .env
php artisan key:generate
```

### 4. Konfigurasi `.env`

Buka file `.env` dan isi bagian berikut:

```env
# --- Database Node 1 (Data Konser, User, dll.) ---
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ticketer
DB_USERNAME=root
DB_PASSWORD=

# --- Database Node 2 (Transaksi) ---
DB_NODE2_HOST=127.0.0.1
DB_NODE2_PORT=3306
DB_NODE2_DATABASE=ta_ticketer_node2
DB_NODE2_USERNAME=root
DB_NODE2_PASSWORD=

# --- Microservice API Key ---
OPENWEATHER_API_KEY=ISI_API_KEY_KAMU_DISINI
```

### 5. Cara Mendapatkan OpenWeatherMap API Key (Gratis)

1. Buka: **https://home.openweathermap.org/users/sign_up**
2. Daftar akun gratis (cukup email + password)
3. Cek email untuk verifikasi akun
4. Login, lalu buka: **https://home.openweathermap.org/api_keys**
5. Copy API Key yang tertera, lalu paste ke `.env` pada baris `OPENWEATHER_API_KEY=`

> ⚠️ API Key baru biasanya aktif dalam **10–60 menit** setelah pendaftaran.

### 6. Buat Database & Jalankan Migrasi

Buat dua database di MySQL (misalnya via phpMyAdmin atau HeidiSQL):
- `ticketer` (untuk Node 1)
- `ta_ticketer_node2` (untuk Node 2)

Lalu jalankan:

```bash
php artisan migrate --database=mysql
php artisan migrate --database=mysql_node2
```

Opsional — isi data contoh:

```bash
php artisan db:seed
```

### 7. Buat Storage Link

```bash
php artisan storage:link
```

### 8. Jalankan Aplikasi

Buka **dua terminal** secara bersamaan:

**Terminal 1 — Backend (PHP):**
```bash
php artisan serve
```

**Terminal 2 — Frontend (React/Vite):**
```bash
npm run dev
```

Akses aplikasi di: **http://127.0.0.1:8000**

---

## 👤 Akun Default (Setelah Seeder)

| Role | Email | Password |
|---|---|---|
| Admin | admin@ticketer.com | password |
| Customer | user@ticketer.com | password |

---

## 📁 Struktur File Penting

```
ta_ticketer/
├── app/
│   ├── Http/Controllers/
│   │   ├── Admin/ConcertController.php   ← CRUD konser + validasi cross-db
│   │   ├── Admin/DashboardController.php ← Statistik multi-node
│   │   └── CheckoutController.php        ← Alur pembelian tiket
│   └── Services/
│       └── WeatherService.php            ← Integrasi OpenWeatherMap API
├── resources/js/
│   ├── Components/
│   │   └── VenueSearchPicker.jsx         ← Nominatim + Leaflet (Admin)
│   └── Pages/
│       └── KonserDetail.jsx              ← Peta + Widget Cuaca (Publik)
└── .env.example                          ← Template konfigurasi
```

---

## 📝 Catatan Teknis

- **Cuaca** hanya ditampilkan jika tanggal konser **dalam 5 hari ke depan** (batas API gratis OpenWeatherMap).
- **Peta & Geocoding** (Nominatim + OpenStreetMap) sepenuhnya **gratis dan open-source**, tidak ada batas request yang ketat.
- Database Node 1 dan Node 2 **tidak boleh di-join** secara SQL karena beda server. Seluruh relasi lintas database diproses di level PHP (Laravel Collection).

---

## 📄 Lisensi

Didistribusikan di bawah lisensi **MIT License**.

```
MIT License

Copyright (c) 2026 TA Ticketer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<p align="center">
  Dibuat dengan ❤️ menggunakan <strong>Laravel</strong> + <strong>React</strong>
  <br/>
  <sub>⭐ Jangan lupa beri bintang jika project ini membantu kamu!</sub>
</p>
