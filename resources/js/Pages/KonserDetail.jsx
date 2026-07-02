import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { usePage } from '@inertiajs/react';
import { formatRp } from '@/utils/formatter';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Halaman detail konser + pilih tiket
// Props dari ConcertPageController: concert (dengan ticketCategories & artists)
export default function KonserDetail({ concert }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    // State untuk qty tiap kategori tiket
    const [quantities, setQuantities] = useState(
        Object.fromEntries(concert.ticket_categories.map(cat => [cat.id, 0]))
    );

    // Ubah qty (+ atau -)
    function changeQty(id, delta) {
        setQuantities(prev => {
            const val = Math.max(0, Math.min(10, (prev[id] || 0) + delta));
            return { ...prev, [id]: val };
        });
    }

    // Hitung total
    const totalQty = Object.values(quantities).reduce((a, b) => a + b, 0);
    const grandTotal = concert.ticket_categories.reduce((sum, cat) => {
        return sum + (cat.price * (quantities[cat.id] || 0));
    }, 0);


    // Zoom ke zona denah
    function selectZone(catId) {
        const row = document.getElementById(`row-${catId}`);
        if (row) {
            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
            changeQty(catId, 1);
        }
    }

    // Sorted categories untuk denah (harga desc)
    const sortedCats = [...concert.ticket_categories].sort((a, b) => b.price - a.price);
    const zoneMap = [0,1,2,3].map(i => sortedCats[i] ?? sortedCats[sortedCats.length - 1]);

    return (
        <MainLayout title={concert.title}>
            <div className="bg-slate-50 min-h-screen pb-12">

                {/* Breadcrumb */}
                <div className="bg-white border-b border-slate-100">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                            <a href="/" className="hover:text-blue-500 transition-colors">Beranda</a>
                            <span className="text-slate-300">›</span>
                            <a href="/konser" className="hover:text-blue-500 transition-colors">Konser</a>
                            <span className="text-slate-300">›</span>
                            <span className="text-slate-600 font-medium truncate">{concert.title}</span>
                        </nav>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">{concert.title}</h1>
                        {concert.artists && concert.artists.length > 0 && (
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                                {concert.artists.map(artist => (
                                    <div key={artist.id} className="flex items-center gap-2 bg-blue-50 rounded-full pr-4 p-1 border border-blue-100">
                                        {artist.image_url ? (
                                            <img src={artist.image_url} alt={artist.name}
                                                className="w-8 h-8 rounded-full object-cover border-2 border-blue-200 shrink-0" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0 text-xs font-bold text-white">
                                                {artist.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-bold text-blue-900 text-xs sm:text-sm m-0 leading-tight">{artist.name}</p>
                                            {artist.genre && <p className="text-[10px] sm:text-xs text-blue-400 m-0">{artist.genre}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Two-Column Layout */}
                    <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">

                        {/* LEFT COLUMN */}
                        <div className="flex-1 min-w-0 w-full">

                            {/* Concert Info Card */}
                            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col sm:flex-row mb-6 sm:mb-8 shadow-sm">
                                {/* Banner */}
                                <div className="w-full sm:w-48 md:w-64 h-48 sm:h-auto bg-slate-100 shrink-0 overflow-hidden relative">
                                    {concert.banner_url ? (
                                        <img src={concert.banner_url} alt={concert.title} className="absolute inset-0 w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 012 2v3a2 2 0 000 4v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 000-4V7a2 2 0 012-2z"/>
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                {/* Date & Venue */}
                                <div className="flex-1 p-5 sm:p-6 lg:p-8 flex flex-col justify-center gap-4 sm:gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm sm:text-base mb-0.5">{concert.event_date_long}</p>
                                            <p className="text-xs sm:text-sm text-slate-400 m-0">{concert.event_time ?? '19.00'} WIB</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0">
                                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm sm:text-base mb-0.5">{concert.venue_name}</p>
                                            <p className="text-xs sm:text-sm text-slate-400 m-0">{concert.city}</p>
                                        </div>
                                    </div>
                                    {/* Weather Widget */}
                                    {concert.weather && (
                                        <div className="flex items-center gap-4 mt-1 p-3 bg-amber-50/50 border border-amber-100/50 rounded-xl">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-100/50 flex items-center justify-center shrink-0">
                                                <img src={concert.weather.icon_url} alt={concert.weather.description} className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-sm" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm sm:text-base mb-0.5">
                                                    {concert.weather.temp}°C, {concert.weather.description}
                                                </p>
                                                <p className="text-[10px] sm:text-xs text-slate-500 m-0 flex items-center gap-1">
                                                    <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    Prakiraan Cuaca Acara
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Pilih Kategori Tiket */}
                            <div className="flex items-center gap-3 mb-4 sm:mb-5">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-md shadow-blue-500/30">1</div>
                                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 m-0">Pilih Kategori Tiket</h2>
                            </div>

                            <form method="POST" action={`/konser/${concert.id}/checkout`} id="ticket-form">
                                <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.content} />

                                {/* Hidden inputs untuk tiket yang dipilih */}
                                {concert.ticket_categories.map(cat => (
                                    <input key={cat.id} type="hidden" name={`tickets[${cat.id}][qty]`} value={quantities[cat.id] || 0} />
                                ))}

                                <div className="flex flex-col gap-3 mb-6 sm:mb-8">
                                    {concert.ticket_categories.length > 0 ? concert.ticket_categories.map(cat => (
                                        <div key={cat.id} id={`row-${cat.id}`}
                                            className={`category-row bg-white rounded-xl sm:rounded-2xl border-2 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 shadow-sm ${(quantities[cat.id] || 0) > 0 ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100'}`}>
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm sm:text-base mb-1">{cat.category_name}</p>
                                                <p className="text-xs sm:text-sm text-slate-400 m-0">{cat.available_quota} tiket tersedia</p>
                                            </div>
                                            <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 mt-1 sm:mt-0">
                                                <p className="font-bold text-slate-900 text-sm sm:text-base m-0">{formatRp(cat.price)}</p>
                                                <div className="flex items-center gap-2 bg-slate-50 rounded-full p-1 border border-slate-200">
                                                    <button type="button" onClick={() => changeQty(cat.id, -1)}
                                                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-slate-200 text-slate-500 flex items-center justify-center font-bold hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">−</button>
                                                    <span className="w-6 sm:w-8 text-center font-bold text-slate-900 text-sm sm:text-base">{quantities[cat.id] || 0}</span>
                                                    <button type="button" onClick={() => changeQty(cat.id, 1)}
                                                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-slate-200 text-slate-500 flex items-center justify-center font-bold hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">+</button>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-8 sm:p-10 text-center text-slate-400 text-sm sm:text-base">
                                            Belum ada kategori tiket tersedia.
                                        </div>
                                    )}
                                </div>

                                {/* Informasi Pertunjukan */}
                                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
                                    <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2 sm:mb-3">Informasi Pertunjukan</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed m-0">
                                        {concert.description || 'Rasakan pengalaman tata suara terbaik bersama artis favorit Anda.'}
                                    </p>
                                </div>

                                {/* Lokasi Peta */}
                                {concert.latitude && concert.longitude && (
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-6 sm:mt-8 overflow-hidden">
                                        {/* Map Header */}
                                        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-sm sm:text-base font-bold text-slate-900 m-0">Lokasi Venue</h3>
                                                <p className="text-xs text-slate-400 m-0">{concert.venue_name}, {concert.city}</p>
                                            </div>
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${concert.latitude},${concert.longitude}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                                                Buka di Google Maps
                                            </a>
                                        </div>
                                        {/* Map Container */}
                                        <div className="h-[320px] sm:h-[420px] w-full relative">
                                            <MapContainer
                                                center={[parseFloat(concert.latitude), parseFloat(concert.longitude)]}
                                                zoom={16}
                                                scrollWheelZoom={false}
                                                style={{ height: '100%', width: '100%' }}
                                                zoomControl={true}
                                            >
                                                {/* ESRI WorldStreetMap - tampilan mirip Google Maps */}
                                                <TileLayer
                                                    attribution='&copy; Google Maps'
                                                    url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                                                    maxZoom={19}
                                                />
                                                <Marker position={[parseFloat(concert.latitude), parseFloat(concert.longitude)]}>
                                                    <Popup>
                                                        <div style={{ minWidth: '150px' }}>
                                                            <p style={{ fontWeight: 'bold', margin: '0 0 4px 0', fontSize: '13px' }}>{concert.venue_name}</p>
                                                            <p style={{ margin: 0, color: '#6b7280', fontSize: '12px' }}>{concert.city}</p>
                                                        </div>
                                                    </Popup>
                                                </Marker>
                                            </MapContainer>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* RIGHT SIDEBAR */}
                        <div className="w-full md:w-[340px] shrink-0">
                            <div className="sticky top-20 sm:top-24 flex flex-col gap-4 sm:gap-6">

                                {/* Ringkasan */}
                                <div className="bg-[#1a2744] rounded-2xl sm:rounded-[24px] p-5 sm:p-6 text-white shadow-xl shadow-[#1a2744]/20">
                                    <div className="flex items-center gap-3 mb-4 sm:mb-5">
                                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs sm:text-sm font-bold shrink-0">2</div>
                                        <h3 className="font-bold text-sm sm:text-base m-0">Ringkasan</h3>
                                    </div>

                                    <div className="mb-4 sm:mb-5">
                                        <div className="flex justify-between items-center text-xs sm:text-sm text-white/50 pb-3 border-b border-white/10 mb-3">
                                            <span>Pilihan</span>
                                            <span className="font-semibold">{totalQty > 0 ? `${totalQty} tiket` : '—'}</span>
                                        </div>
                                        <div className="flex flex-col gap-2.5">
                                            {concert.ticket_categories.map(cat => (
                                                (quantities[cat.id] || 0) > 0 && (
                                                    <div key={cat.id} className="flex justify-between items-center text-xs sm:text-sm">
                                                        <span className="text-white/60">{quantities[cat.id]} × {cat.category_name}</span>
                                                        <span className="font-semibold text-white">{formatRp(cat.price * quantities[cat.id])}</span>
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-white/10 mb-5 sm:mb-6">
                                        <p className="text-[10px] sm:text-xs text-white/40 mb-1 uppercase tracking-wider font-semibold">Total Tagihan</p>
                                        <p className="text-2xl sm:text-3xl font-black text-blue-400 m-0">{formatRp(grandTotal)}</p>
                                    </div>

                                    {user ? (
                                        user.is_admin ? (
                                            <>
                                                <button type="button" disabled
                                                    className="w-full py-3.5 bg-slate-500/50 cursor-not-allowed text-white/50 font-bold rounded-xl text-sm sm:text-base flex items-center justify-center gap-2 transition-all text-center border border-white/10">
                                                    Preview Mode (Admin)
                                                </button>
                                                <p className="text-[10px] sm:text-xs text-white/40 text-center mt-3 leading-relaxed">
                                                    Sebagai admin, Anda tidak dapat melakukan checkout tiket.
                                                </p>
                                            </>
                                        ) : (
                                            <button type="submit" form="ticket-form"
                                                className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/30 focus:outline-none focus:ring-4 focus:ring-blue-500/50">
                                                Lanjut ke Keranjang
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                                            </button>
                                        )
                                    ) : (
                                        <>
                                            <a href="/login"
                                                className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/30 text-center">
                                                Login untuk Membeli
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                                            </a>
                                            <p className="text-[10px] sm:text-xs text-white/40 text-center mt-3 leading-relaxed">
                                                Anda perlu login terlebih dahulu untuk membeli tiket.
                                            </p>
                                        </>
                                    )}
                                </div>

                                {/* Denah Panggung */}
                                <div className="bg-white rounded-2xl sm:rounded-[24px] border border-slate-100 p-5 sm:p-6 shadow-sm text-center relative overflow-hidden">
                                    <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-4">Denah Panggung & Area</h4>
                                    <div className="w-full relative mx-auto my-4 sm:my-6">
                                        <svg viewBox="-30 -10 460 380" className="w-full h-auto drop-shadow-md font-sans">
                                            {/* STAGE */}
                                            <rect x="150" y="0" width="100" height="40" fill="#0f172a" rx="6"/>
                                            <text x="200" y="25" fill="#ffffff" fontSize="14" fontWeight="900" textAnchor="middle" letterSpacing="2">STAGE</text>
                                            {/* FOH */}
                                            <rect x="180" y="100" width="40" height="40" fill="#0f172a" rx="4"/>
                                            <text x="200" y="125" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">FOH</text>

                                            {zoneMap[0] && (
                                                <g className="cursor-pointer" onClick={() => selectZone(zoneMap[0].id)}>
                                                    <path d="M 140 50 L 260 50 L 260 170 C 260 210, 140 210, 140 170 Z"
                                                        fill={quantities[zoneMap[0].id] > 0 ? '#60a5fa' : '#86efac'} stroke="#ffffff" strokeWidth="4"/>
                                                    <text x="200" y="170" fill="#14532d" fontSize="14" fontWeight="900" textAnchor="middle" className="pointer-events-none">
                                                        {zoneMap[0].category_name.toUpperCase()}
                                                    </text>
                                                </g>
                                            )}
                                            {zoneMap[1] && (<>
                                                <g className="cursor-pointer" onClick={() => selectZone(zoneMap[1].id)}>
                                                    <path d="M 70 70 L 130 50 L 130 170 C 130 210, 90 220, 50 190 Z"
                                                        fill={quantities[zoneMap[1].id] > 0 ? '#60a5fa' : '#d8b4fe'} stroke="#ffffff" strokeWidth="4"/>
                                                    <text x="90" y="145" fill="#581c87" fontSize="12" fontWeight="800" textAnchor="middle" className="pointer-events-none">
                                                        {zoneMap[1].category_name.toUpperCase()}
                                                    </text>
                                                </g>
                                                <g className="cursor-pointer" onClick={() => selectZone(zoneMap[1].id)}>
                                                    <path d="M 330 70 L 270 50 L 270 170 C 270 210, 310 220, 350 190 Z"
                                                        fill={quantities[zoneMap[1].id] > 0 ? '#60a5fa' : '#d8b4fe'} stroke="#ffffff" strokeWidth="4"/>
                                                    <text x="310" y="145" fill="#581c87" fontSize="12" fontWeight="800" textAnchor="middle" className="pointer-events-none">
                                                        {zoneMap[1].category_name.toUpperCase()}
                                                    </text>
                                                </g>
                                            </>)}
                                        </svg>
                                    </div>
                                    <p className="text-xs text-slate-400 mb-2">Klik area pada denah untuk memilih tiket.</p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
