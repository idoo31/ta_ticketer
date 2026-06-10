import MainLayout from '@/Layouts/MainLayout';
import { usePage, Link } from '@inertiajs/react';

export default function AkunAdmin() {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <MainLayout title="Akun Admin" navbarType="admin">
            <div className="bg-gray-50 min-h-screen">
                {/* Header/Profile Area */}
                <div className="pt-12 pb-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white border-2 border-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                            </div>
                            <div className="flex flex-col items-center sm:items-start">
                                <Link href="/admin" className="inline-flex items-center justify-between gap-4 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl mb-3 shadow-sm transition-colors w-64">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                                        </svg>
                                        Buka Panel Admin
                                    </div>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </Link>
                                <h1 className="text-3xl font-extrabold text-gray-900 mb-1">{user?.name || 'Administrator'}</h1>
                                <p className="text-sm text-gray-500 font-semibold">{user?.email || 'admin@email.com'} • Bergabung Sejak {user ? new Date(user.created_at).getFullYear() : '2026'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="pb-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Sidebar */}
                            <div className="w-full md:w-72 flex-shrink-0">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sticky top-24">
                                    <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-hide">
                                        <a href="#" className="flex-shrink-0 flex items-center justify-center md:justify-start gap-2 md:gap-3 px-4 py-3 md:py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-sm w-1/2 md:w-full text-sm md:text-base">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                                            </svg>
                                            Dompet Tiket
                                        </a>
                                        <a href="#" className="flex-shrink-0 flex items-center justify-center md:justify-start gap-2 md:gap-3 px-4 py-3 md:py-4 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-semibold transition-colors border border-gray-100 md:border-transparent w-1/2 md:w-full text-sm md:text-base">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            Riwayat Pesanan
                                        </a>
                                        <a href="#" className="flex-shrink-0 flex items-center justify-center md:justify-start gap-2 md:gap-3 px-4 py-3 md:py-4 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-semibold transition-colors border border-gray-100 md:border-transparent w-1/2 md:w-full text-sm md:text-base">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                            Pengaturan
                                        </a>
                                    </nav>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1">
                                <div className="mb-6">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">E-Ticket Aktif Anda</h2>
                                    <p className="text-gray-600 font-semibold">Tunjukkan kode QR atau download PDF tiket untuk masuk ke area acara.</p>
                                </div>
                                
                                <div className="bg-gray-100 rounded-2xl border border-gray-200 h-[400px]">
                                    {/* Empty state area as per screenshot */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
