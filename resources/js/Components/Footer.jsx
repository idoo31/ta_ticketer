// Footer — ditampilkan di bawah semua halaman publik
export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <a href="/" className="flex items-center gap-2 mb-4">
                            <img src="/logo.svg" alt="Ticketer Logo" className="h-8 w-8" />
                            <span className="font-bold text-xl tracking-tight text-gray-900">TICKETER</span>
                        </a>
                        <p className="text-sm text-gray-600 leading-relaxed pr-4">
                            Platform tiket konser global untuk pengalaman langsung terbaik. Cari, pesan, dan hadir di konser favoritmu!
                        </p>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase mb-3">PERUSAHAAN</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Tentang Kami</a></li>
                            <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Hubungi Kami</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase mb-3">BANTUAN</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Dukungan Akun</a></li>
                            <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Info Tiket</a></li>
                            <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Pusat Bantuan</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase mb-3">LEGALITAS</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Syarat Penggunaan</a></li>
                            <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Kebijakan Privasi</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-600">
                        &copy; 2026 TICKETER. Hak Cipta Dilindungi.
                    </p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Ketentuan</a>
                        <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Privasi</a>
                        <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
