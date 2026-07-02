import MainLayout from '@/Layouts/MainLayout';
// Halaman Sukses Pembayaran
export default function Success({ trxCode }) {

    return (
        <MainLayout title="Pembayaran Berhasil">
            <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '24px 0' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>

                    {/* Stepper */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', border: '2px solid #22c55e', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                            </div>
                            <span style={{ fontWeight: 500, color: '#94a3b8', fontSize: '13px' }}>Keranjang</span>
                        </div>
                        <div style={{ height: '2px', width: '56px', background: '#22c55e' }}></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', border: '2px solid #22c55e', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                            </div>
                            <span style={{ fontWeight: 500, color: '#94a3b8', fontSize: '13px' }}>Pembayaran</span>
                        </div>
                        <div style={{ height: '2px', width: '56px', background: '#22c55e' }}></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, boxShadow: '0 2px 8px rgba(34,197,94,0.35)' }}>3</div>
                            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '13px' }}>Selesai</span>
                        </div>
                    </div>

                    {/* Success Card */}
                    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                        <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9', padding: '40px 36px', textAlign: 'center' }}>

                            {/* Animated Checkmark */}
                            <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 24px' }}>
                                <div style={{ position: 'absolute', inset: '8px', borderRadius: '50%', background: '#f0fdf4', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.06)' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(34,197,94,0.4)' }}>
                                        <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="#fff" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: '0 0 10px', letterSpacing: '-0.02em' }}>Pembayaran Berhasil!</h1>
                            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.7, maxWidth: '340px', margin: '0 auto 28px' }}>
                                Tiket Anda telah diterbitkan. E-Ticket telah dikirim ke email dan dapat diakses kapan saja melalui dasbor pengguna.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                <a href="/akun"
                                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', maxWidth: '300px', padding: '13px 20px', background: '#22c55e', color: '#fff', fontWeight: 700, borderRadius: '12px', textDecoration: 'none', fontSize: '14px', boxShadow: '0 4px 12px rgba(34,197,94,0.35)' }}>
                                    <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 012 2v3a2 2 0 000 4v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 000-4V7a2 2 0 012-2z"/></svg>
                                    Akses Tiket Digital
                                </a>
                                <a href="/"
                                    style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    Kembali ke Beranda
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </MainLayout>
    );
}
