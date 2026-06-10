import { usePage, router } from '@inertiajs/react';
import { useState } from 'react';

// Navbar utama — ditampilkan di semua halaman (bukan admin)
export default function Navbar() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [menuOpen, setMenuOpen] = useState(false);

    // Tentukan tipe berdasarkan user yang login
    const type = user ? (user.is_admin ? 'admin' : 'user') : 'guest';

    // Cek halaman aktif berdasarkan URL
    const path = window.location.pathname;
    const isActive = (p) => path === p || path.startsWith(p + '/');

    function handleLogout(e) {
        e.preventDefault();
        router.post('/logout');
    }

    return (
        <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-4">
                        <a href="/" className="flex items-center gap-2">
                            <img src="/logo.svg" alt="Ticketer Logo" className="h-7 w-7 md:h-8 md:w-8" />
                            <span className="font-bold text-xl md:text-2xl tracking-tight text-gray-900">TICKETER</span>
                        </a>
                    </div>

                    {/* Navigation Links (Desktop) */}
                    <nav className="hidden md:flex space-x-8">
                        <a href="/" className={`${path === '/' ? 'text-blue-600 font-semibold' : 'text-gray-500 hover:text-gray-900 font-medium'} transition-colors`}>Beranda</a>
                        <a href="/konser" className={`${isActive('/konser') ? 'text-blue-600 font-semibold' : 'text-gray-500 hover:text-gray-900 font-medium'} transition-colors`}>Konser</a>
                        <a href="/artis" className={`${isActive('/artis') ? 'text-blue-600 font-semibold' : 'text-gray-500 hover:text-gray-900 font-medium'} transition-colors`}>Artis</a>
                    </nav>

                    {/* Desktop Action Buttons + Hamburger */}
                    <div className="flex items-center gap-3">
                        {/* Desktop Buttons */}
                        <div className="hidden md:flex items-center gap-3">
                            {type === 'guest' ? (
                                <a href="/login" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-transparent text-sm font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    Masuk/Daftar
                                </a>
                            ) : (
                                <>
                                    {type === 'admin' ? (
                                        <a href="/admin" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-transparent text-sm font-semibold rounded-full text-white bg-blue-500 hover:bg-blue-600 transition-colors shadow-sm">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                            Portal Admin
                                        </a>
                                    ) : (
                                        <a href="/akun" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-transparent text-sm font-semibold rounded-full text-white bg-blue-500 hover:bg-blue-600 transition-colors shadow-sm">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                            Akun saya
                                        </a>
                                    )}
                                    <form onSubmit={handleLogout} className="inline">
                                        <button type="submit" className="inline-flex items-center justify-center px-5 py-2.5 border border-red-50 text-sm font-semibold rounded-full text-red-600 hover:bg-red-50 transition-colors">
                                            Keluar
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>

                        {/* Hamburger Button (Mobile) */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none"
                            aria-label="Buka menu navigasi"
                        >
                            {menuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {menuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
                    <a href="/" className={`${path === '/' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'} flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                        Beranda
                    </a>
                    <a href="/konser" className={`${isActive('/konser') ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'} flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 012 2v3a2 2 0 000 4v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 000-4V7a2 2 0 012-2z"/></svg>
                        Konser
                    </a>
                    <a href="/artis" className={`${isActive('/artis') ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'} flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                        Artis
                    </a>

                    <div className="border-t border-gray-100 my-2"></div>

                    {type === 'guest' ? (
                        <a href="/login" className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            Masuk / Daftar
                        </a>
                    ) : (
                        <>
                            {type === 'admin' ? (
                                <a href="/admin" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                    Portal Admin
                                </a>
                            ) : (
                                <a href="/akun" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    Akun Saya
                                </a>
                            )}
                            <form onSubmit={handleLogout}>
                                <button type="submit" className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl text-sm font-semibold transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                                    Keluar
                                </button>
                            </form>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}
