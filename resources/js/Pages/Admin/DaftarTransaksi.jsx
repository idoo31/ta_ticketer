import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { router } from '@inertiajs/react';
import { formatRp, formatPaymentMethod } from '@/utils/formatter';
import TransactionModal from '@/Components/TransactionModal';

export default function DaftarTransaksi({ transactions, filters }) {
    const [search, setSearch] = useState(filters?.q || '');
    const [selectedTrx, setSelectedTrx] = useState(null);


    function handleSearch(e) {
        e.preventDefault();
        router.get('/admin/daftar-transaksi', { q: search }, { preserveState: true });
    }

    const badgeColors = {
        paid: 'bg-green-100 text-green-700',
        pending: 'bg-orange-100 text-orange-700',
        cancelled: 'bg-red-100 text-red-700',
        failed: 'bg-red-100 text-red-700',
    };
    const badgeLabels = {
        paid: 'Success',
        pending: 'Pending',
        cancelled: 'Batal',
        failed: 'Gagal',
    };

    return (
        <AdminLayout title="Management Transaksi">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 items-center justify-between">
                <form onSubmit={handleSearch} className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex items-center px-4 py-2 bg-white rounded-2xl border border-gray-200 w-full sm:w-[320px] shadow-sm">
                        <svg className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Cari ID resi atau ID pengguna..."
                            className="w-full bg-transparent border-none focus:ring-0 text-sm outline-none text-gray-900 placeholder-gray-400"
                        />
                    </div>
                </form>
                <button
                    onClick={() => router.get('/admin/daftar-transaksi', {}, { preserveState: false })}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl font-semibold text-sm transition-colors shadow-sm"
                >
                    Semua situs
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="min-w-[900px]">
                        {/* Header biru */}
                        <div className="bg-blue-600 px-6 py-4 grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-3 text-sm font-semibold text-white">ID & Tanggal Resi</div>
                            <div className="col-span-3 text-sm font-semibold text-white">Kredensial Pengguna</div>
                            <div className="col-span-3 text-sm font-semibold text-white">Informasi Item</div>
                            <div className="col-span-2 text-sm font-semibold text-white">Pendapatan</div>
                            <div className="col-span-1 text-sm font-semibold text-white">Status Validasi</div>
                        </div>

                        {/* Rows */}
                        <div className="divide-y divide-gray-50">
                            {transactions.data.length > 0 ? transactions.data.map(trx => (
                                <div key={trx.id} onClick={() => setSelectedTrx(trx)} className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-blue-50/30 transition-colors cursor-pointer">
                                    {/* ID & Tanggal */}
                                    <div className="col-span-3">
                                        <p className="font-bold text-sm text-gray-900">{trx.trx_code}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{trx.created_at_label}</p>
                                    </div>
                                    {/* Pengguna */}
                                    <div className="col-span-3">
                                        <p className="font-semibold text-sm text-gray-800">{trx.user?.name || '—'}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{trx.user?.email || '—'}</p>
                                    </div>
                                    {/* Informasi Item */}
                                    <div className="col-span-3 space-y-1.5">
                                        {trx.details.map((d, i) => (
                                            <div key={i} className="text-sm leading-snug">
                                                <span className="text-blue-600 font-semibold">{d.quantity}x </span>
                                                <span className="text-gray-800">{d.concert_title}</span>
                                                {d.category_name && (
                                                    <span className="text-gray-400"> ({d.category_name})</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {/* Pendapatan */}
                                    <div className="col-span-2">
                                        <p className="font-bold text-sm text-gray-900">{formatRp(trx.grand_total)}</p>
                                        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{formatPaymentMethod(trx)}</p>
                                    </div>
                                    {/* Status */}
                                    <div className="col-span-1">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${badgeColors[trx.status] || 'bg-gray-100 text-gray-700'}`}>
                                            {badgeLabels[trx.status] || trx.status}
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <div className="px-6 py-16 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                                    </svg>
                                    <p className="text-base font-semibold text-gray-900">Tidak ada transaksi ditemukan</p>
                                    <p className="text-sm text-gray-500 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                {transactions.links && transactions.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="hidden sm:block text-sm text-gray-500">
                            Menampilkan <span className="font-semibold text-gray-900">{transactions.from || 0}</span> sampai <span className="font-semibold text-gray-900">{transactions.to || 0}</span> dari <span className="font-semibold text-gray-900">{transactions.total}</span> data
                        </div>
                        <div className="flex gap-1">
                            {transactions.links.map((link, i) => {
                                if (link.url === null) {
                                    return <span key={i} className="px-3 py-1.5 text-sm font-medium text-gray-400 bg-white border border-gray-200 rounded-lg cursor-not-allowed" dangerouslySetInnerHTML={{ __html: link.label }} />;
                                }
                                return (
                                    <button key={i} onClick={() => router.get(link.url, { q: search }, { preserveState: true })}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${link.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-blue-600'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }} />
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Detail Transaksi */}
            <TransactionModal 
                selectedTrx={selectedTrx} 
                onClose={() => setSelectedTrx(null)} 
                badgeColors={badgeColors} 
                badgeLabels={badgeLabels} 
            />
        </AdminLayout>
    );
}
