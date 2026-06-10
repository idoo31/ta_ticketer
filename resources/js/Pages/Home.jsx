import MainLayout from '@/Layouts/MainLayout';
import ConcertCard from '@/Components/ConcertCard';

// Halaman Home — menampilkan hero section + konser mendatang
// Props dari HomeController: upcomingConcerts, cities, availableMonths
export default function Home({ upcomingConcerts, cities, availableMonths }) {
    return (
        <MainLayout>
            {/* Hero Section */}
            <section className="pt-20 pb-24 text-center px-4 relative overflow-hidden bg-gradient-to-b from-blue-50/50 to-white">
                <div className="max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-8">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        Platform Tiket Konser Terpercaya #1 Indonesia
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
                        Pesan Tiket Konser <br className="hidden sm:block" />
                        <span className="text-blue-600">Artis Favoritmu!</span>
                    </h1>

                    <p className="text-base md:text-lg text-gray-600 mb-12 max-w-2xl mx-auto px-4">
                        Jangan lewatkan daftar konser terbaru yang akan segera hadir!
                    </p>

                    {/* Search Bar */}
                    <form method="GET" action="/konser" id="hero-search-form"
                        className="bg-white p-3 md:p-2 rounded-3xl md:rounded-full shadow-lg border border-gray-200 max-w-4xl mx-auto flex flex-col md:flex-row gap-3 md:gap-2">

                        {/* Keyword */}
                        <div className="flex-1 flex items-center px-4 py-3 md:py-2 bg-white rounded-2xl md:rounded-full border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                            <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                            <input type="text" name="q" placeholder="Nama artis, konser, venue…"
                                className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-500 text-sm outline-none"
                                autoComplete="off" />
                        </div>

                        {/* Bulan */}
                        <div className="flex-1 flex items-center px-4 py-3 md:py-2 bg-white rounded-2xl md:rounded-full border border-gray-200 relative">
                            <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            <select name="month" className="w-full bg-transparent border-none focus:ring-0 text-gray-500 text-sm appearance-none outline-none cursor-pointer pr-6">
                                <option value="">Kapan saja</option>
                                {availableMonths.map(m => (
                                    <option key={m.month_key} value={m.month_key}>{m.month_label}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                            </div>
                        </div>

                        {/* Kota */}
                        <div className="flex-1 flex items-center px-4 py-3 md:py-2 bg-white rounded-2xl md:rounded-full border border-gray-200 relative">
                            <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            <select name="city" className="w-full bg-transparent border-none focus:ring-0 text-gray-500 text-sm appearance-none outline-none cursor-pointer pr-6">
                                <option value="">Semua kota</option>
                                {cities.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                            </div>
                        </div>

                        {/* Submit */}
                        <button type="submit"
                            className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3.5 md:py-3 rounded-2xl md:rounded-full font-semibold transition-colors w-full md:w-auto flex-shrink-0 text-sm flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                            Cari Tiket
                        </button>
                    </form>
                </div>
            </section>

            {/* Upcoming Concerts Section */}
            <section className="py-12 border-t border-gray-100 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 sm:gap-0">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Konser Mendatang</h2>
                            <p className="text-sm text-gray-500">
                                {upcomingConcerts.length > 0
                                    ? `${upcomingConcerts.length} konser tersedia untuk Anda`
                                    : 'Belum ada konser aktif saat ini'}
                            </p>
                        </div>
                        <a href="/konser" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 transition-colors bg-blue-50 sm:bg-transparent px-4 py-2 sm:p-0 rounded-lg sm:rounded-none w-full sm:w-auto justify-center sm:justify-start">
                            Lihat Semua
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </div>

                    {upcomingConcerts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {upcomingConcerts.map(concert => (
                                    <ConcertCard key={concert.id} concert={concert} />
                                ))}
                            </div>
                            <div className="mt-12 text-center">
                                <a href="/konser" className="inline-flex items-center gap-2 px-8 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-900 font-semibold rounded-xl transition-colors w-full sm:w-auto justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                    </svg>
                                    Lihat Semua Konser
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                                </a>
                            </div>
                        </>
                    ) : (
                        /* Empty State */
                        <div className="py-20 text-center px-4">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
                                <svg className="w-10 h-10 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-700 mb-2">Belum Ada Konser Aktif</h3>
                            <p className="text-sm text-gray-400 max-w-sm mx-auto">
                                Konser akan segera hadir. Pantau terus halaman ini untuk update terbaru!
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </MainLayout>
    );
}
