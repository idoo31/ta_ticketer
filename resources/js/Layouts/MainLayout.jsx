import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { Head } from '@inertiajs/react';

// Layout utama — membungkus semua halaman publik (Home, Konser, Artis, dll)
// Props:
//   title  — judul halaman (opsional, default: 'TICKETER')
//   hideNavbar / hideFooter — untuk menyembunyikan navbar/footer (misal di halaman auth)
//   children — konten halaman
export default function MainLayout({ title, hideNavbar = false, hideFooter = false, children }) {
    return (
        <>
            <Head title={title ? `${title} - TICKETER` : 'TICKETER - Pesan Tiket Konser'} />
            <div className="min-h-screen flex flex-col text-gray-900">
                {!hideNavbar && <Navbar />}
                <main className="flex-grow">
                    {children}
                </main>
                {!hideFooter && <Footer />}
            </div>
        </>
    );
}
