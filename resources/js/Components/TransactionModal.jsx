import { formatRp, formatPaymentMethod } from '@/utils/formatter';

export default function TransactionModal({ selectedTrx, onClose, badgeColors, badgeLabels }) {
    if (!selectedTrx) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-[24px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
                {/* Modal Header */}
                <div className="p-6 sm:p-8 pb-4 flex items-start justify-between">
                    <div>
                        <h3 className="text-xl font-extrabold text-slate-900 mb-1">Detail Transaksi</h3>
                        <p className="text-sm text-slate-500 font-medium">{selectedTrx.trx_code}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 sm:p-8 pt-2 space-y-6 flex-1">
                    {/* Info Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                            <p className="text-xs font-semibold text-slate-400 mb-3">Informasi Pembeli</p>
                            <p className="font-bold text-slate-900 text-sm sm:text-base mb-1">{selectedTrx.user?.name}</p>
                            <p className="text-sm text-slate-500">{selectedTrx.user?.email}</p>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                            <p className="text-xs font-semibold text-slate-400 mb-3">Status Pembayaran</p>
                            <div className="mb-3">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${badgeColors[selectedTrx.status] || 'bg-gray-100 text-gray-700'}`}>
                                    {badgeLabels[selectedTrx.status] || selectedTrx.status}
                                </span>
                            </div>
                            <p className="text-xs font-medium text-slate-600 mb-1">Metode: <span className="font-bold text-slate-900">{formatPaymentMethod(selectedTrx)}</span></p>
                            <p className="text-xs font-medium text-slate-600">Tanggal: <span className="font-bold text-slate-900">{selectedTrx.created_at_label}</span></p>
                        </div>
                    </div>

                    {/* Item List */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-4">Item Pesanan</h4>
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                <div className="col-span-6 sm:col-span-5">ITEM</div>
                                <div className="col-span-2 text-center">QTY</div>
                                <div className="col-span-4 sm:col-span-2 text-right">HARGA</div>
                                <div className="hidden sm:block sm:col-span-3 text-right">SUBTOTAL</div>
                            </div>
                            {/* Table Body */}
                            <div className="divide-y divide-slate-50">
                                {selectedTrx.details.map((item, idx) => (
                                    <div key={idx} className="grid grid-cols-12 gap-4 px-5 py-4 items-center">
                                        <div className="col-span-6 sm:col-span-5">
                                            <p className="font-bold text-slate-900 text-sm mb-1">{item.concert_title}</p>
                                            <p className="text-xs text-slate-500">{item.category_name}</p>
                                        </div>
                                        <div className="col-span-2 text-center font-semibold text-slate-700 text-sm">{item.quantity}</div>
                                        <div className="col-span-4 sm:col-span-2 text-right text-sm font-medium text-slate-600">
                                            {formatRp(item.price_per_unit || 0)}
                                            <p className="sm:hidden text-xs font-bold text-slate-900 mt-1">{formatRp(item.subtotal)}</p>
                                        </div>
                                        <div className="hidden sm:block sm:col-span-3 text-right font-bold text-slate-900 text-sm">
                                            {formatRp(item.subtotal)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-100 space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-medium">Subtotal</span>
                            <span className="font-semibold text-slate-900">{formatRp(selectedTrx.subtotal)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-medium">Pajak (10%)</span>
                            <span className="font-semibold text-slate-900">{formatRp(selectedTrx.tax)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-medium">Biaya Layanan</span>
                            <span className="font-semibold text-slate-900">{formatRp(selectedTrx.service_fee)}</span>
                        </div>
                        <div className="pt-3 mt-3 border-t border-slate-200 flex justify-between items-center">
                            <span className="font-bold text-slate-900 text-base">Total Pembayaran</span>
                            <span className="font-black text-blue-600 text-lg sm:text-xl">{formatRp(selectedTrx.grand_total)}</span>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 sm:p-8 pt-4 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-sm">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
