<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\ArtistController;
use App\Http\Controllers\Admin\ConcertController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\ArtistPageController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ConcertPageController;
use App\Http\Controllers\UserAccountController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\TransactionController;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/konser', [ConcertPageController::class, 'index']);
Route::get('/konser/{concert}', [ConcertPageController::class, 'show'])->name('concert.detail');

Route::get('/artis', [ArtistPageController::class, 'index'])->name('artis.index');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'authenticate']);

    Route::get('/register', [AuthController::class, 'showRegistrationForm'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/akun', [UserAccountController::class, 'index'])->name('akun')->middleware('auth');
Route::delete('/akun/transaksi/{transaction}', [TransactionController::class, 'cancel'])->name('transaksi.cancel')->middleware('auth');

// Checkout (Step 1 → 2 → 3)
Route::get('/konser/{concert}/checkout', [CheckoutController::class, 'cart'])->name('checkout.cart');
Route::post('/konser/{concert}/checkout', [CheckoutController::class, 'saveCart'])->name('checkout.cart.save');
Route::get('/konser/{concert}/checkout/payment', [CheckoutController::class, 'payment'])->name('checkout.payment')->middleware('auth');
Route::post('/konser/{concert}/checkout/payment', [CheckoutController::class, 'processPayment'])->name('checkout.payment.process')->middleware('auth');
Route::get('/konser/{concert}/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success')->middleware('auth');


// Admin Routes — dilindungi dengan middleware auth + admin role check
Route::prefix('admin')->middleware(['auth', 'admin'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('admin.dashboard');

    Route::get('/akun', function () {
        return Inertia\Inertia::render('Admin/AkunAdmin');
    });

    Route::get('/layanan-konser', [ConcertController::class, 'index'])->name('admin.concerts.index');
    Route::post('/layanan-konser', [ConcertController::class, 'store'])->name('admin.concerts.store');
    Route::get('/layanan-konser/{concert}/edit', [ConcertController::class, 'edit'])->name('admin.concerts.edit');
    Route::put('/layanan-konser/{concert}', [ConcertController::class, 'update'])->name('admin.concerts.update');
    Route::delete('/layanan-konser/{concert}', [ConcertController::class, 'destroy'])->name('admin.concerts.destroy');

    Route::get('/daftar-transaksi', [App\Http\Controllers\Admin\TransactionController::class, 'index'])->name('admin.transactions.index');

    // Manajemen Artis
    Route::get('/artis', [ArtistController::class, 'index'])->name('admin.artists.index');
    Route::post('/artis', [ArtistController::class, 'store'])->name('admin.artists.store');
    Route::get('/artis/search', [ArtistController::class, 'search'])->name('admin.artists.search');
    Route::get('/artis/{artis}/edit', [ArtistController::class, 'edit'])->name('admin.artists.edit');
    Route::put('/artis/{artis}', [ArtistController::class, 'update'])->name('admin.artists.update');
    Route::delete('/artis/{artis}', [ArtistController::class, 'destroy'])->name('admin.artists.destroy');
});
