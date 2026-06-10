import MainLayout from '@/Layouts/MainLayout';
import { formatRp } from '@/utils/formatter';

// Halaman Keranjang Belanja
// Props dari CheckoutController: concert, lineItems, subtotal, serviceFee, tax, grandTotal
export default function Cart({ concert, lineItems, subtotal, serviceFee, tax, grandTotal }) {

    const totalQty = lineItems.reduce((sum, item) => sum + item.qty, 0);

    return (
        <MainLayout title="Keranjang Belanja">
            <div className="bg-slate-50 min-h-screen py-6 sm:py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Stepper */}
                    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 flex-wrap">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs sm:text-sm font-bold shadow-md shadow-blue-500/30">1</div>
                            <span className="font-bold text-slate-900 text-xs sm:text-sm">Keranjang</span>
                        </div>
                        <div className="h-0.5 w-6 sm:w-10 bg-slate-300 hidden sm:block"></div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-slate-200 text-slate-300 flex items-center justify-center text-xs sm:text-sm font-bold">2</div>
                            <span className="font-medium text-slate-300 text-xs sm:text-sm">Pembayaran</span>
                        </div>
                        <div className="h-0.5 w-6 sm:w-10 bg-slate-200 hidden sm:block"></div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-slate-200 text-slate-300 flex items-center justify-center text-xs sm:text-sm font-bold">3</div>
                            <span className="font-medium text-slate-300 text-xs sm:text-sm">Selesai</span>
                        </div>
                    </div>

                    {/* Two-Column Layout */}
                    <div className="flex flex-col md:flex-row gap-6 items-start">

                        {/* LEFT: Tiket Anda */}
                        <div className="flex-1 min-w-0 w-full">
                            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-4">Tiket Anda</h2>

                            <div className="flex flex-col gap-3 sm:gap-4">
                                {lineItems.map((item, idx) => (
                                    <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4 relative overflow-hidden">
                                        {/* Image */}
                                        <div className="w-full sm:w-20 h-32 sm:h-20 bg-slate-100 rounded-xl flex-shrink-0 overflow-hidden relative border border-slate-200 sm:border-none">
                                            {concert.banner_url ? (
                                                <img src={concert.banner_url} alt={concert.title} className="absolute inset-0 w-full h-full object-cover" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 012 2v3a2 2 0 000 4v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 000-4V7a2 2 0 012-2z"/>
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="min-w-0 flex-1">
                                                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-500 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                                                        {item.category.category_name}
                                                    </span>
                                                    <h3 className="font-bold text-slate-900 text-sm sm:text-base m-0 truncate pr-2">{concert.title}</h3>
                                                    <p className="text-xs text-slate-400 mt-0.5 m-0">{concert.event_date_label} • {concert.city}</p>
                                                </div>
                                            </div>

                                            <div className="border-t border-dashed border-slate-100 my-3 sm:hidden"></div>

                                            <div className="flex justify-between items-center sm:pt-2 sm:border-t sm:border-slate-50 mt-auto sm:mt-1">
                                                <div className="flex items-center gap-2 bg-slate-50 rounded-full p-1 border border-slate-200">
                                                    <span className="w-6 sm:w-8 text-center font-bold text-slate-900 text-sm sm:text-base px-2">{item.qty}</span>
                                                    <span className="text-xs text-slate-400 pr-2">tiket</span>
                                                </div>
                                                <p className="font-extrabold text-slate-900 text-sm sm:text-base m-0">{formatRp(item.subtotal)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: Ringkasan Pesanan */}
                        <div className="w-full md:w-[320px] shrink-0">
                            <div className="bg-[#1a2744] rounded-[24px] p-5 sm:p-6 text-white sticky top-20 sm:top-24 shadow-xl shadow-[#1a2744]/20">
                                <h3 className="font-extrabold text-sm sm:text-base mb-4 sm:mb-5">Ringkasan Pesanan</h3>

                                <div className="flex flex-col gap-2.5 sm:gap-3 mb-4 sm:mb-5">
                                    <div className="flex justify-between items-center text-xs sm:text-sm">
                                        <span className="text-white/50">Subtotal ({totalQty} tiket)</span>
                                        <span className="font-semibold text-white">{formatRp(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs sm:text-sm">
                                        <span className="text-white/50">Biaya Layanan (5%)</span>
                                        <span className="font-semibold text-white">{formatRp(serviceFee)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs sm:text-sm">
                                        <span className="text-white/50">Pajak (10%)</span>
                                        <span className="font-semibold text-white">{formatRp(tax)}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/10 mb-5 sm:mb-6">
                                    <p className="text-[10px] sm:text-xs text-white/40 mb-1 uppercase tracking-wider font-semibold">Total Tagihan</p>
                                    <p className="text-2xl sm:text-3xl font-black text-blue-400 m-0">{formatRp(grandTotal)}</p>
                                </div>

                                <a href={`/konser/${concert.id}/checkout/payment`}
                                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-sm sm:text-base transition-all shadow-lg shadow-blue-500/30 focus:outline-none focus:ring-4 focus:ring-blue-500/50">
                                    Lanjut Pembayaran
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
