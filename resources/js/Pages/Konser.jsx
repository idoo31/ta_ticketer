import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import ConcertCard from '@/Components/ConcertCard';

// Halaman daftar konser dengan filter
// Props dari ConcertPageController: concerts, popularConcerts, cities, availableMonths, keyword, month, city, hasFilter
export default function Konser({ concerts, popularConcerts, cities, availableMonths, keyword, month, city, hasFilter }) {

    // Fungsi untuk hapus filter tertentu dari URL
    function removeFilter(key) {
        const params = new URLSearchParams(window.location.search);
        params.delete(key);
        window.location.href = '/konser?' + params.toString();
    }

    const monthLabel = availableMonths.find(m => m.month_key === month)?.month_label ?? month;

    return (
        <MainLayout title="Daftar Konser">
            {/* Search Bar */}
            <div className="border-b border-gray-100 bg-white">
                <div className="max-w-4xl mx-auto px-4 py-4 md:py-6">
                    <form method="GET" action="/konser" id="search-form">
                        <div className="flex flex-col md:flex-row gap-3">
                            {/* Keyword */}
                            <div className="flex-1 flex items-center px-4 py-3 md:py-2.5 bg-white rounded-xl md:rounded-full border border-gray-200 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all">
                                <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                </svg>
                                <input type="text" name="q" defaultValue={keyword}
                                    placeholder="Nama artis atau konser…"
                                    className="w-full bg-transparent border-none focus:ring-0 text-sm outline-none text-gray-700 placeholder-gray-400"
                                    autoComplete="off" />
                            </div>

                            {/* Bulan */}
                            <div className="flex-1 md:flex-none flex items-center px-4 py-3 md:py-2.5 bg-white rounded-xl md:rounded-full border border-gray-200 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all md:min-w-[170px] relative">
                                <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                                <select name="month" className="w-full bg-transparent border-none focus:ring-0 text-sm text-gray-600 appearance-none outline-none cursor-pointer pr-6"
                                    defaultValue={month}
                                    onChange={e => document.getElementById('search-form').submit()}>
                                    <option value="">Semua Bulan</option>
                                    {availableMonths.map(m => (
                                        <option key={m.month_key} value={m.month_key}>{m.month_label}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                                </div>
                            </div>

                            {/* Kota */}
                            <div className="flex-1 md:flex-none flex items-center px-4 py-3 md:py-2.5 bg-white rounded-xl md:rounded-full border border-gray-200 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all md:min-w-[170px] relative">
                                <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                                <select name="city" className="w-full bg-transparent border-none focus:ring-0 text-sm text-gray-600 appearance-none outline-none cursor-pointer pr-6"
                                    defaultValue={city}
                                    onChange={e => document.getElementById('search-form').submit()}>
                                    <option value="">Semua Kota</option>
                                    {cities.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                                </div>
                            </div>

                            {/* Submit */}
                            <button type="submit"
                                className="w-full md:w-auto px-6 py-3 md:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl md:rounded-full text-sm transition-colors flex items-center justify-center gap-2 flex-shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                </svg>
                                Cari
                            </button>
                        </div>

                        {/* Active filter pills */}
                        {hasFilter && (
                            <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-3">
                                <span className="text-xs text-gray-400 font-medium">Filter aktif:</span>
                                {keyword && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                                        "{keyword}"
                                        <button type="button" onClick={() => removeFilter('q')} className="hover:text-blue-900 focus:outline-none">×</button>
                                    </span>
                                )}
                                {month && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
                                        📅 {monthLabel}
                                        <button type="button" onClick={() => removeFilter('month')} className="hover:text-purple-900 focus:outline-none">×</button>
                                    </span>
                                )}
                                {city && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                                        📍 {city}
                                        <button type="button" onClick={() => removeFilter('city')} className="hover:text-green-900 focus:outline-none">×</button>
                                    </span>
                                )}
                                <a href="/konser" className="text-xs text-gray-400 hover:text-red-500 font-medium ml-1 transition-colors">Hapus semua</a>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* Daftar Konser */}
            <section className="py-10 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 md:mb-8 text-center md:text-left">
                        {hasFilter ? (
                            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">
                                Hasil Pencarian
                                <span className="block md:inline text-sm md:text-base font-normal text-gray-400 md:ml-2 mt-1 md:mt-0">({concerts.length} konser ditemukan)</span>
                            </h1>
                        ) : (
                            <>
                                <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">Koleksi Konser</h1>
                                <p className="text-gray-500 text-sm mt-1">{concerts.length} konser aktif tersedia</p>
                            </>
                        )}
                    </div>

                    {concerts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 mb-8">
                            {concerts.map(concert => (
                                <ConcertCard key={concert.id} concert={concert} />
                            ))}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="py-16 md:py-20 text-center px-4">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
                                <svg className="w-10 h-10 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                </svg>
                            </div>
                            {hasFilter ? (
                                <>
                                    <h3 className="text-lg font-bold text-gray-700 mb-2">Tidak ada konser yang cocok</h3>
                                    <p className="text-sm text-gray-400 max-w-sm mx-auto mb-6">Coba ubah kata kunci, bulan, atau kota yang kamu cari.</p>
                                    <a href="/konser" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors text-sm w-full sm:w-auto justify-center">
                                        Lihat Semua Konser
                                    </a>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-lg font-bold text-gray-700 mb-2">Belum Ada Konser Tersedia</h3>
                                    <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">Saat ini belum ada konser aktif. Silakan kembali nanti!</p>
                                    <a href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors text-sm w-full sm:w-auto justify-center">
                                        Kembali ke Beranda
                                    </a>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Paling Diminati */}
            {!hasFilter && popularConcerts.length > 0 && (
                <section className="py-12 bg-gray-50/50 border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Paling Diminati Minggu Ini</h2>
                            <p className="text-gray-500 text-sm">Jelajahi berbagai pengalaman musik terbaik.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
                            {popularConcerts.map(concert => (
                                <ConcertCard key={concert.id} concert={concert} buttonText="Lihat Ketersediaan" />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </MainLayout>
    );
}
