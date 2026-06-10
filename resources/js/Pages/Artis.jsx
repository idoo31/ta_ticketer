import MainLayout from '@/Layouts/MainLayout';
import ArtistCard from '@/Components/ArtistCard';

// Halaman daftar artis
// Props dari ArtistPageController: artists, keyword
export default function Artis({ artists, keyword }) {
    return (
        <MainLayout title="Eksplorasi Artis">
            {/* Search Bar */}
            <div className="border-b border-gray-100 bg-white">
                <div className="max-w-2xl mx-auto px-4 py-6">
                    <form method="GET" action="/artis">
                        <div className="flex items-center px-4 py-3 bg-white rounded-xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                            <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                            <input type="text" name="q" defaultValue={keyword}
                                placeholder="Ketik nama artis atau band"
                                className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-500 text-sm outline-none" />
                            {keyword && (
                                <a href="/artis" className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </a>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* Artists Section */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Eksplorasi Artis</h1>
                        <p className="text-gray-600">Temukan jadwal tour lineup musik paling ikonik sedunia.</p>
                    </div>

                    {artists.length > 0 ? (
                        <>
                            {keyword && (
                                <p className="text-sm text-gray-500 mb-6 text-center">
                                    Menampilkan <strong>{artists.length}</strong> artis untuk "<strong>{keyword}</strong>"
                                </p>
                            )}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                                {artists.map(artist => (
                                    <ArtistCard key={artist.id}
                                        image={artist.image_url}
                                        name={artist.name}
                                        genre={artist.genre}
                                        origin={artist.origin} />
                                ))}
                            </div>
                        </>
                    ) : (
                        /* Empty State */
                        <div className="text-center py-24">
                            <svg className="w-20 h-20 text-gray-200 mx-auto mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                            {keyword ? (
                                <>
                                    <p className="text-gray-500 font-semibold text-lg mb-2">Artis tidak ditemukan</p>
                                    <p className="text-gray-400 text-sm mb-6">Tidak ada artis dengan nama "<strong>{keyword}</strong>".</p>
                                    <a href="/artis" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                                        Lihat Semua Artis
                                    </a>
                                </>
                            ) : (
                                <>
                                    <p className="text-gray-500 font-semibold text-lg mb-2">Belum ada artis</p>
                                    <p className="text-gray-400 text-sm">Data artis akan muncul setelah admin menambahkannya.</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </MainLayout>
    );
}
