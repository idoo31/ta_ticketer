import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { usePage, router } from '@inertiajs/react';
import { formatRp, formatPaymentMethod } from '@/utils/formatter';

// Halaman Akun User
// Props dari UserAccountController: user, transactions
export default function AkunUser({ user, transactions }) {
    const { flash } = usePage().props;
    const [cancelModal, setCancelModal] = useState(false);
    const [cancelBlockedModal, setCancelBlockedModal] = useState(false);
    const [cancelAction, setCancelAction] = useState('');
    const [cancelTitle, setCancelTitle] = useState('');

    function openCancelModal(action, title, cancellable) {
        setCancelAction(action);
        setCancelTitle(title);
        if (cancellable) {
            setCancelModal(true);
        } else {
            setCancelBlockedModal(true);
        }
    }

    function handleCancel(e) {
        e.preventDefault();
        router.delete(cancelAction, {
            onSuccess: () => setCancelModal(false),
        });
    }

    const activeTickets = transactions.filter(t => t.status === 'paid');
    const totalTickets = transactions.reduce((sum, t) => sum + t.details.reduce((s, d) => s + d.quantity, 0), 0);
    const totalSpent = transactions
        .filter(t => t.status === 'paid')
        .reduce((sum, t) => sum + (Number(t.grand_total) || 0), 0);

    const statusMap = {
        pending: { label: 'Menunggu Pembayaran', className: 'bg-yellow-100 text-yellow-700' },
        paid: { label: 'Lunas', className: 'bg-green-100 text-green-700' },
        cancelled: { label: 'Dibatalkan', className: 'bg-red-100 text-red-700' },
    };

    return (
        <MainLayout title="Akun Saya">
            {/* Flash Messages */}
            {flash?.success && (
                <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-5 py-3.5 rounded-xl text-sm font-semibold shadow-lg">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-3.5 rounded-xl text-sm font-semibold shadow-lg">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
                    {flash.error}
                </div>
            )}

            <div className="bg-gray-50 min-h-screen">

                {/* Header / Profile */}
                <div className="pt-8 md:pt-12 pb-8 md:pb-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                            {/* Avatar */}
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white border-2 border-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                </svg>
                            </div>
                            <div className="flex flex-col items-center sm:items-start">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">{user.name}</h1>
                                <p className="text-xs sm:text-sm text-gray-500 font-semibold">
                                    {user.email} <span className="hidden sm:inline">•</span>
                                    <span className="block sm:inline mt-1 sm:mt-0"> Bergabung Sejak {user.created_at_year}</span>
                                </p>
                                <span className={`inline-block mt-3 px-3 py-1 text-xs font-semibold rounded-full ${user.is_admin ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {user.is_admin ? 'Admin' : 'Customer'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="pb-16 md:pb-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-8">

                            {/* Sidebar */}
                            <div className="w-full md:w-72 flex-shrink-0">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sticky top-24">
                                    <nav className="flex flex-row md:flex-col gap-2">
                                        <a href="#tiket" className="flex-shrink-0 flex items-center justify-center md:justify-start gap-2 md:gap-3 px-4 py-3 md:py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-sm w-1/2 md:w-full text-sm md:text-base">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>
                                            Dompet Tiket
                                        </a>
                                        <a href="#riwayat" className="flex-shrink-0 flex items-center justify-center md:justify-start gap-2 md:gap-3 px-4 py-3 md:py-4 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-semibold transition-colors w-1/2 md:w-full text-sm md:text-base border border-gray-100 md:border-transparent">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                            Riwayat Pesanan
                                        </a>
                                    </nav>

                                    {/* Stats */}
                                    <div className="mt-6 border-t border-gray-100 pt-4 space-y-3">
                                        <div className="flex justify-between items-center px-2">
                                            <span className="text-xs sm:text-sm text-gray-500">Total Transaksi</span>
                                            <span className="text-xs sm:text-sm font-bold text-gray-900">{transactions.length}</span>
                                        </div>
                                        <div className="flex justify-between items-center px-2">
                                            <span className="text-xs sm:text-sm text-gray-500">Total Tiket</span>
                                            <span className="text-xs sm:text-sm font-bold text-gray-900">{totalTickets}</span>
                                        </div>
                                        <div className="flex justify-between items-center px-2">
                                            <span className="text-xs sm:text-sm text-gray-500">Total Pengeluaran</span>
                                            <span className="text-xs sm:text-sm font-bold text-blue-600">{formatRp(totalSpent)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Area */}
                            <div className="flex-1 space-y-8 md:space-y-12">

                                {/* E-Ticket Aktif */}
                                <div id="tiket" className="scroll-mt-24">
                                    <div className="mb-4 sm:mb-6">
                                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">E-Ticket Aktif Anda</h2>
                                        <p className="text-gray-500 text-xs sm:text-sm">Tunjukkan kode QR atau download PDF tiket untuk masuk ke area acara.</p>
                                    </div>

                                    {activeTickets.length > 0 ? (
                                        <div className="space-y-4">
                                            {activeTickets.map(trx =>
                                                trx.details.map(detail => {
                                                    const concert = detail.ticket_category?.concert;
                                                    if (!concert) return null;
                                                    return (
                                                        <div key={detail.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 relative overflow-hidden group">
                                                            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                            {/* QR Placeholder */}
                                                            <div className="w-full sm:w-20 h-32 sm:h-20 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 border border-dashed border-gray-300">
                                                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
                                                                </svg>
                                                            </div>
                                                            <div className="flex-1 min-w-0 flex flex-col">
                                                                <div className="flex justify-between items-start gap-2 mb-1">
                                                                    <p className="font-bold text-gray-900 truncate text-sm sm:text-base">{concert.title}</p>
                                                                    <span className="px-2.5 py-0.5 text-[10px] sm:text-xs font-bold rounded-full bg-green-100 text-green-700 flex-shrink-0">AKTIF</span>
                                                                </div>
                                                                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{concert.event_date_label} • {concert.venue_name}, {concert.city}</p>
                                                                <div className="mt-2 bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex items-start gap-2">
                                                                    <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                                                                    <div>
                                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Metode Pembayaran</p>
                                                                        <p className="text-xs font-medium text-slate-700">{formatPaymentMethod(trx)}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-auto sm:mt-3">
                                                                    <span className="text-[10px] sm:text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{detail.ticket_category?.category_name}</span>
                                                                    <span className="text-[10px] sm:text-xs text-gray-400 font-medium">{detail.quantity} tiket</span>
                                                                    <span className="text-[10px] sm:text-xs font-bold text-gray-700 bg-gray-50 px-2 py-1 rounded">{trx.trx_code}</span>
                                                                    <button type="button"
                                                                        onClick={() => openCancelModal(
                                                                            `/akun/transaksi/${trx.id}`,
                                                                            concert.title,
                                                                            trx.is_cancellable
                                                                        )}
                                                                        className="ml-auto text-[10px] sm:text-xs font-semibold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-2.5 py-1 rounded-full transition-colors">
                                                                        Batalkan Tiket
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    ) : (
                                        <div className="bg-white rounded-2xl border border-gray-200 py-12 sm:py-16 px-4 text-center">
                                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>
                                            </div>
                                            <p className="text-gray-600 sm:text-gray-500 font-semibold text-sm sm:text-base">Belum ada e-ticket aktif</p>
                                            <p className="text-xs sm:text-sm text-gray-400 mt-1">Beli tiket konser untuk memulai!</p>
                                            <a href="/konser" className="inline-block mt-5 sm:mt-4 px-6 py-2.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-full transition-colors">
                                                Lihat Konser
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Riwayat Pesanan */}
                                <div id="riwayat" className="scroll-mt-24">
                                    <div className="mb-4 sm:mb-6">
                                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Riwayat Pesanan</h2>
                                        <p className="text-gray-500 text-xs sm:text-sm">Semua transaksi yang pernah Anda lakukan.</p>
                                    </div>

                                    {transactions.length > 0 ? (
                                        <div className="space-y-4">
                                            {transactions.map(trx => {
                                                const badge = statusMap[trx.status] ?? { label: trx.status, className: 'bg-gray-100 text-gray-700' };
                                                return (
                                                    <div key={trx.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-5 py-4 border-b border-gray-100 gap-3 sm:gap-0">
                                                            <div>
                                                                <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Kode Transaksi</p>
                                                                <p className="font-bold text-gray-900 text-xs sm:text-sm">{trx.trx_code}</p>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <p className="text-xs text-gray-400">{trx.created_at_label}</p>
                                                                <span className={`inline-block px-2.5 py-1 text-[10px] sm:text-xs font-bold rounded-full ${badge.className}`}>{badge.label}</span>
                                                            </div>
                                                        </div>
                                                        <div className="px-4 sm:px-5 py-3 space-y-3 sm:space-y-2">
                                                            {trx.details.map(detail => {
                                                                const cat = detail.ticket_category;
                                                                const concert = cat?.concert;
                                                                return (
                                                                    <div key={detail.id} className="flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-1 sm:gap-0">
                                                                        <div>
                                                                            <p className="font-semibold text-gray-900 text-sm">{concert?.title ?? '—'}</p>
                                                                            <p className="text-gray-500 sm:text-gray-400 text-xs">{cat?.category_name ?? '—'} × {detail.quantity} tiket</p>
                                                                        </div>
                                                                        <p className="font-bold sm:font-semibold text-gray-700 text-sm">{formatRp(detail.subtotal)}</p>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border-t border-gray-100 gap-2 sm:gap-0">
                                                            <div className="text-xs text-gray-500 flex-1">
                                                                <p className="mb-0.5">Metode Pembayaran:</p>
                                                                <p className="font-semibold text-gray-700">{formatPaymentMethod(trx)}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-xs text-gray-400">Total Bayar</p>
                                                                <p className="text-base sm:text-lg font-black text-blue-600">{formatRp(trx.grand_total)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="bg-white rounded-2xl border border-gray-200 py-12 sm:py-16 px-4 text-center">
                                            <p className="text-gray-500 font-semibold text-sm sm:text-base">Belum ada riwayat pesanan</p>
                                            <p className="text-xs sm:text-sm text-gray-400 mt-1">Mulai pesan tiket konser favoritmu!</p>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal: Konfirmasi Batalkan Tiket */}
            {cancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div onClick={() => setCancelModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm z-10 overflow-hidden">
                        <div className="flex flex-col items-center px-8 pt-8 pb-6 text-center">
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Batalkan Tiket?</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Tiket konser "<span className="font-semibold text-gray-800">{cancelTitle}</span>" akan dibatalkan. Untuk proses refund, silakan hubungi admin setelah pembatalan.
                            </p>
                        </div>
                        <div className="flex gap-3 px-8 pb-6">
                            <button type="button" onClick={() => setCancelModal(false)}
                                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                                Kembali
                            </button>
                            <form onSubmit={handleCancel} className="flex-1">
                                <button type="submit" className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors">
                                    Ya, Batalkan
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Tidak Bisa Dibatalkan */}
            {cancelBlockedModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div onClick={() => setCancelBlockedModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm z-10 overflow-hidden">
                        <div className="flex flex-col items-center px-8 pt-8 pb-6 text-center">
                            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Tidak Dapat Dibatalkan</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Tiket konser "<span className="font-semibold text-gray-800">{cancelTitle}</span>" tidak dapat dibatalkan karena kurang dari 7 hari sebelum konser dilaksanakan.
                            </p>
                        </div>
                        <div className="px-8 pb-6">
                            <button type="button" onClick={() => setCancelBlockedModal(false)}
                                className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-700 transition-colors">
                                Mengerti
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
