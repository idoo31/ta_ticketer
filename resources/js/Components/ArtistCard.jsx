// ArtistCard — kartu artis yang tampil di halaman Artis
export default function ArtistCard({ image, name, genre, origin }) {
    // Ambil huruf pertama nama untuk avatar fallback
    const initial = name ? name.charAt(0).toUpperCase() : '?';

    return (
        <div className="bg-[#f8f9fa] rounded-2xl p-4 border border-gray-100 transition-transform hover:-translate-y-1 hover:shadow-lg duration-300">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-4">
                {image ? (
                    <img src={image} alt={name} className="w-full h-full object-cover" />
                ) : (
                    /* Fallback avatar dengan inisial */
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                        <span className="text-4xl font-black text-blue-400 select-none">
                            {initial}
                        </span>
                    </div>
                )}

                {/* Badge genre */}
                {genre && (
                    <div className="absolute bottom-3 left-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white shadow-sm">
                            {genre}
                        </span>
                    </div>
                )}
            </div>

            <div>
                <h3 className="font-bold text-gray-900 text-base mb-0.5">{name}</h3>
                {origin && (
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        {origin}
                    </p>
                )}
            </div>
        </div>
    );
}
