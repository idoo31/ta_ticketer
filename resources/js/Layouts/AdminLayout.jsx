import { useState } from "react";
import { Head, router } from "@inertiajs/react";

// Layout Admin — sidebar + topbar + content area
// Props:
//   title — judul halaman (tampil di topbar & browser tab)
//   children — konten halaman admin
export default function AdminLayout({ title = "Dashboard", children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const path = window.location.pathname;
    const isActive = (p) => path === p || path.startsWith(p + "/");

    function handleLogout(e) {
        e.preventDefault();
        router.post("/logout");
    }

    return (
        <>
            <Head title={`${title} - TICKETER ADMIN`} />
            <div className="bg-[#eef3ff] text-slate-900 font-sans antialiased flex h-screen overflow-hidden">
                {/* Mobile sidebar backdrop */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-20 bg-gray-900/50 backdrop-blur-sm md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-30 w-[280px] bg-white border-r border-gray-200 flex flex-col justify-between flex-shrink-0 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <div>
                        {/* Logo */}
                        <div className="h-[70px] md:h-[80px] flex items-center justify-between px-6 md:px-8 border-b border-gray-200">
                            <a
                                href="/admin"
                                className="flex items-center gap-2"
                            >
                                <img
                                    src="/logo.svg"
                                    alt="Ticketer Logo"
                                    className="h-6 w-6"
                                />
                                <span className="font-bold text-lg md:text-xl tracking-tight text-gray-900">
                                    TICKETER.
                                    <span className="text-black font-black">
                                        ADMIN
                                    </span>
                                </span>
                            </a>
                            {/* Close Button (Mobile) */}
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(false)}
                                className="md:hidden text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-lg p-1.5 focus:outline-none"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Navigation */}
                        <div className="px-4 md:px-6 py-6 overflow-y-auto">
                            <div className="bg-[#f8f9fa] rounded-2xl p-2 border border-gray-100 flex flex-col gap-1">
                                <a
                                    href="/admin"
                                    className={`${path === "/admin" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"} flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors`}
                                >
                                    <svg
                                        className={`w-5 h-5 ${path === "/admin" ? "text-white" : "text-gray-500"}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                        />
                                    </svg>
                                    Dashboard
                                </a>
                                <a
                                    href="/admin/layanan-konser"
                                    className={`${isActive("/admin/layanan-konser") ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"} flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors`}
                                >
                                    <svg
                                        className={`w-5 h-5 ${isActive("/admin/layanan-konser") ? "text-white" : "text-gray-500"}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Layanan Konser
                                </a>
                                <a
                                    href="/admin/artis"
                                    className={`${isActive("/admin/artis") ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"} flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors`}
                                >
                                    <svg
                                        className={`w-5 h-5 ${isActive("/admin/artis") ? "text-white" : "text-gray-500"}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    Artis
                                </a>
                                <a
                                    href="/admin/daftar-transaksi"
                                    className={`${isActive("/admin/daftar-transaksi") ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"} flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors`}
                                >
                                    <svg
                                        className={`w-5 h-5 ${isActive("/admin/daftar-transaksi") ? "text-white" : "text-gray-500"}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 10h16M4 14h16M4 18h16"
                                        />
                                    </svg>
                                    Daftar Transaksi
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Links */}
                    <div className="px-6 md:px-8 pb-6 md:pb-8 flex flex-col gap-4">
                        <a
                            href="/"
                            className="flex items-center gap-3 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <svg
                                className="w-5 h-5 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            Kembali ke Website
                        </a>
                        <form onSubmit={handleLogout}>
                            <button
                                type="submit"
                                className="flex items-center gap-3 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                            >
                                <svg
                                    className="w-5 h-5 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                                Keluar sesi
                            </button>
                        </form>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 bg-[#eef3ff]">
                    {/* Topbar */}
                    <header className="h-[70px] md:h-[80px] bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10 w-full">
                        <div className="flex items-center gap-3">
                            {/* Hamburger Button (Mobile) */}
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(true)}
                                className="md:hidden text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                            <h1 className="text-base md:text-lg font-bold text-gray-900 truncate max-w-[150px] sm:max-w-xs">
                                {title}
                            </h1>
                        </div>

                        <div className="flex items-center gap-2 md:gap-4 shrink-0">
                            {/* Status Badge */}
                            <div className="hidden sm:flex px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-600 text-xs font-semibold items-center gap-2">
                                Sistem Daring
                            </div>
                            {/* Mini indicator mobile */}
                            <div
                                className="sm:hidden w-3 h-3 rounded-full bg-green-500 border border-green-200"
                                title="Sistem Daring"
                            ></div>
                            {/* Avatar */}
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs md:text-sm shadow-sm cursor-pointer">
                                AD
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 relative">
                        {children}
                    </div>
                </main>
            </div>
        </>
    );
}
