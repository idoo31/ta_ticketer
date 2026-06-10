// ConcertCard — kartu konser yang tampil di halaman Home, Konser, dll
// Props: concert object (dari controller via Inertia)
import { formatRp } from '@/utils/formatter';
export default function ConcertCard({ concert, buttonText = 'Pilih & Beli Tiket' }) {

    // Hitung data dari concert
    const image      = concert.banner_url || null;
    const title      = concert.title;
    const subtitle   = concert.description
        ? concert.description.substring(0, 60) + (concert.description.length > 60 ? '...' : '')
        : concert.venue_name;
    const dateCity   = concert.event_date_label + ' · ' + concert.city;
    const minPrice   = concert.min_price;
    const remaining  = concert.available_quota;

    return (
        <div className="bg-[#f8f9fa] rounded-2xl p-4 border border-gray-100 transition-transform hover:-translate-y-1 hover:shadow-lg duration-300">
            {/* Banner Image */}
            <div className="aspect-[4/3] w-full rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-blue-100 to-blue-200">
                {image ? (
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z"/>
                        </svg>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="mb-4">
                <h3 className="font-bold text-gray-900 text-lg mb-1">{title}</h3>
                <p className="text-sm text-gray-500 mb-2">{subtitle}</p>
                <p className="text-xs text-gray-500">{dateCity}</p>
            </div>

            {/* Price & Button */}
            {minPrice && (
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Mulai dari</p>
                        <p className="font-semibold text-gray-900 text-sm">{formatRp(minPrice)}</p>
                    </div>
                    {remaining && (
                        <p className="text-xs text-gray-500">{remaining} tersisa</p>
                    )}
                </div>
            )}

            <a
                href={`/konser/${concert.id}`}
                className="concert-btn w-full py-2.5 px-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 flex items-center justify-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                {buttonText}
            </a>
        </div>
    );
}
