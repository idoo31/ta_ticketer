import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { usePage } from '@inertiajs/react';
import { formatRp } from '@/utils/formatter';

// Halaman Pembayaran
// Props dari CheckoutController: concert, lineItems, subtotal, serviceFee, tax, grandTotal
export default function Payment({ concert, lineItems, subtotal, serviceFee, tax, grandTotal }) {
    const { errors, auth } = usePage().props;
    const [method, setMethod] = useState('credit_card');
    const [selectedBank, setSelectedBank] = useState(null);
    const [selectedWallet, setSelectedWallet] = useState(null);

    const methodOptions = [
        {
            key: 'credit_card',
            label: 'Kartu Kredit / Debit',
            sub: 'Visa, Mastercard, JCB',
            color: 'blue',
            icon: (
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                </svg>
            ),
        },
        {
            key: 'transfer',
            label: 'Transfer Bank',
            sub: 'Akun Virtual (BCA, Mandiri, BNI)',
            color: 'green',
            icon: (
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/>
                </svg>
            ),
        },
        {
            key: 'ewallet',
            label: 'Dompet Digital',
            sub: 'GoPay, OVO, Dana',
            color: 'purple',
            icon: (
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            ),
        },
    ];

    return (
        <MainLayout title="Pembayaran">
            <div className="bg-slate-50 min-h-screen py-6 sm:py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Stepper */}
                    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 flex-wrap">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-blue-500 text-blue-500 flex items-center justify-center">
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                            </div>
                            <span className="font-bold text-slate-900 text-xs sm:text-sm">Keranjang</span>
                        </div>
                        <div className="h-0.5 w-6 sm:w-10 bg-blue-500 hidden sm:block"></div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs sm:text-sm font-bold shadow-md shadow-blue-500/30">2</div>
                            <span className="font-bold text-slate-900 text-xs sm:text-sm">Pembayaran</span>
                        </div>
                        <div className="h-0.5 w-6 sm:w-10 bg-slate-200 hidden sm:block"></div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-slate-200 text-slate-300 flex items-center justify-center text-xs sm:text-sm font-bold">3</div>
                            <span className="font-medium text-slate-300 text-xs sm:text-sm">Selesai</span>
                        </div>
                    </div>

                    {/* Error */}
                    {errors && Object.keys(errors).length > 0 && (
                        <div className="mb-5 sm:mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 sm:p-4 text-xs sm:text-sm flex items-center gap-2 sm:gap-3">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                            <span>{Object.values(errors)[0]}</span>
                        </div>
                    )}

                    <form method="POST" action={`/konser/${concert.id}/checkout/payment`} id="payment-form">
                        <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.content} />
                        <input type="hidden" name="payment_method" value={method} />

                        <div className="flex flex-col md:flex-row gap-6 items-start">

                            {/* LEFT: Metode Pembayaran */}
                            <div className="flex-1 min-w-0 w-full">
                                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-4">Metode Pembayaran</h2>

                                <div className="flex flex-col gap-3 mb-5 sm:mb-6">
                                    {methodOptions.map(opt => (
                                        <label key={opt.key}
                                            onClick={() => setMethod(opt.key)}
                                            className={`flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 border-2 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-200 ${method === opt.key ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                                            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-${opt.color}-100 flex items-center justify-center shrink-0`}>
                                                {opt.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-slate-900 text-sm sm:text-base mb-0.5 truncate">{opt.label}</p>
                                                <p className="text-xs sm:text-sm text-slate-400 m-0 truncate">{opt.sub}</p>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${method === opt.key ? 'border-blue-500' : 'border-slate-200'}`}>
                                                {method === opt.key && <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>}
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                {/* Credit Card Form */}
                                {method === 'credit_card' && (
                                    <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-sm mb-6">
                                        <div>
                                            <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nomor Kartu</label>
                                            <input type="text" placeholder="0000 0000 0000 0000" maxLength="19"
                                                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all outline-none text-sm sm:text-base text-slate-700 placeholder-slate-400"
                                                onInput={e => {
                                                    let v = e.target.value.replace(/\D/g,'').substring(0,16);
                                                    e.target.value = v.replace(/(.{4})/g,'$1 ').trim();
                                                }} />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nama Pemegang Kartu</label>
                                            <input type="text" placeholder={auth?.user?.name ?? 'Budi Santoso'}
                                                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all outline-none text-sm sm:text-base text-slate-700 placeholder-slate-400" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                            <div>
                                                <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Berlaku Sampai</label>
                                                <input type="text" placeholder="MM/YY" maxLength="5"
                                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all outline-none text-sm sm:text-base text-slate-700 placeholder-slate-400" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">CVV</label>
                                                <input type="password" placeholder="•••" maxLength="4"
                                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all outline-none text-sm sm:text-base text-slate-700 placeholder-slate-400" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Transfer Form */}
                                {method === 'transfer' && (
                                    <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm mb-6">
                                        <p className="font-bold text-slate-900 text-sm sm:text-base mb-3 sm:mb-4">Pilih Bank</p>
                                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                            {['BCA','Mandiri','BNI'].map(bank => (
                                                <button key={bank} type="button"
                                                    className={`px-2 py-3 border-2 rounded-xl font-semibold text-xs sm:text-sm focus:outline-none transition-all text-center ${selectedBank === bank ? 'border-blue-400 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50'}`}
                                                    onClick={() => setSelectedBank(bank)}>
                                                    {bank}
                                                </button>
                                            ))}
                                        </div>
                                        {errors.bank && <p className="mt-1 text-[10px] text-red-500">{errors.bank}</p>}
                                        
                                        {selectedBank && (
                                            <div className="mt-5 space-y-4 border-t border-slate-100 pt-5">
                                                <div>
                                                    <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nama Pemilik Rekening</label>
                                                    <input type="text" name="account_name" placeholder="Misal: Budi Santoso"
                                                        className={`w-full bg-slate-50 border-2 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all outline-none text-sm sm:text-base text-slate-700 placeholder-slate-400 ${errors.account_name ? 'border-red-400' : 'border-slate-200'}`} />
                                                    {errors.account_name && <p className="mt-1 text-[10px] text-red-500">{errors.account_name}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nomor Rekening Anda</label>
                                                    <input type="number" name="account_number" placeholder="Misal: 1234567890"
                                                        className={`w-full bg-slate-50 border-2 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all outline-none text-sm sm:text-base text-slate-700 placeholder-slate-400 ${errors.account_number ? 'border-red-400' : 'border-slate-200'}`} />
                                                    {errors.account_number && <p className="mt-1 text-[10px] text-red-500">{errors.account_number}</p>}
                                                </div>
                                            </div>
                                        )}
                                        
                                        <p className="text-xs sm:text-sm text-slate-400 mt-4 leading-relaxed">
                                            Nomor virtual account akan digenerate secara otomatis setelah konfirmasi.
                                        </p>
                                        <input type="hidden" name="bank" value={selectedBank || ''} />
                                    </div>
                                )}

                                {/* E-Wallet Form */}
                                {method === 'ewallet' && (
                                    <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm mb-6">
                                        <p className="font-bold text-slate-900 text-sm sm:text-base mb-3 sm:mb-4">Pilih Dompet Digital</p>
                                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                            {['GoPay','OVO','Dana'].map(wallet => (
                                                <button key={wallet} type="button"
                                                    className={`px-2 py-3 border-2 rounded-xl font-semibold text-xs sm:text-sm focus:outline-none transition-all text-center ${selectedWallet === wallet ? 'border-blue-400 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50'}`}
                                                    onClick={() => setSelectedWallet(wallet)}>
                                                    {wallet}
                                                </button>
                                            ))}
                                        </div>
                                        {errors.ewallet && <p className="mt-1 text-[10px] text-red-500">{errors.ewallet}</p>}

                                        {selectedWallet && (
                                            <div className="mt-5 border-t border-slate-100 pt-5">
                                                <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nomor Handphone Terdaftar</label>
                                                <input type="number" name="phone_number" placeholder="Misal: 08123456789"
                                                    className={`w-full bg-slate-50 border-2 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all outline-none text-sm sm:text-base text-slate-700 placeholder-slate-400 ${errors.phone_number ? 'border-red-400' : 'border-slate-200'}`} />
                                                {errors.phone_number && <p className="mt-1 text-[10px] text-red-500">{errors.phone_number}</p>}
                                            </div>
                                        )}

                                        <p className="text-xs sm:text-sm text-slate-400 mt-4 leading-relaxed">
                                            Anda akan diarahkan ke aplikasi dompet digital yang dipilih untuk menyelesaikan transaksi.
                                        </p>
                                        <input type="hidden" name="ewallet" value={selectedWallet || ''} />
                                    </div>
                                )}
                            </div>

                            {/* RIGHT: Ringkasan */}
                            <div className="w-full md:w-[320px] shrink-0">
                                <div className="bg-[#1a2744] rounded-[24px] p-5 sm:p-6 text-white sticky top-20 sm:top-24 shadow-xl shadow-[#1a2744]/20">
                                    <h3 className="font-extrabold text-sm sm:text-base mb-4 sm:mb-5">Ringkasan Tiket</h3>

                                    <div className="flex flex-col gap-3 mb-4 sm:mb-5">
                                        {lineItems.map((item, idx) => (
                                            <div key={idx}>
                                                <div className="flex justify-between items-start text-xs sm:text-sm mb-0.5">
                                                    <span className="text-white/60 truncate pr-2">{concert.title}</span>
                                                    <span className="font-semibold text-white shrink-0">{formatRp(item.subtotal)}</span>
                                                </div>
                                                <div className="text-[10px] sm:text-xs text-white/40">{item.qty}× Tiket {item.category.category_name}</div>
                                            </div>
                                        ))}
                                        <div className="border-t border-white/10 my-1"></div>
                                        <div className="flex justify-between items-center text-xs sm:text-sm">
                                            <span className="text-white/50">Pajak & Biaya Sistem</span>
                                            <span className="font-semibold text-white/70">{formatRp(tax + serviceFee)}</span>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 sm:p-4 mb-4 sm:mb-5">
                                        <p className="text-[10px] sm:text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Total Tagihan</p>
                                        <p className="text-2xl sm:text-3xl font-black text-blue-400 m-0">{formatRp(grandTotal)}</p>
                                    </div>

                                    <button type="submit"
                                        className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-sm sm:text-base transition-all shadow-lg shadow-blue-500/30 focus:outline-none focus:ring-4 focus:ring-blue-500/50 mb-4">
                                        Konfirmasi & Bayar
                                    </button>

                                    <div className="flex items-start gap-2.5 sm:gap-3 bg-white/5 border border-white/10 rounded-xl p-3 sm:p-3.5">
                                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                            </svg>
                                        </div>
                                        <p className="text-[10px] sm:text-xs text-white/40 m-0 leading-relaxed">
                                            Dengan melanjutkan, Anda menyetujui Ketentuan Layanan. Transaksi dilindungi enkripsi 256-bit.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
