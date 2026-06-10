import MainLayout from '@/Layouts/MainLayout';
import { usePage, useForm } from '@inertiajs/react';

// Halaman Login
export default function Login() {
    const { errors } = usePage().props;
    const { data, setData, post, processing } = useForm({
        email: '',
        password: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post('/login');
    }

    return (
        <MainLayout title="Masuk" hideNavbar={false} hideFooter={false}>
            <div className="min-h-screen flex flex-col justify-between bg-[#fcfcfc]">

                <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="bg-white p-10 rounded-[2rem] max-w-md w-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <img src="/logo.svg" alt="Ticketer Logo" className="h-16 w-16 md:h-20 md:w-20" />
                        </div>

                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Selamat Datang</h2>
                            <p className="text-sm text-gray-600">Masuk untuk mengelola pesanan anda</p>
                        </div>

                        {/* Error */}
                        {errors.email && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                                {errors.email}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-xs font-bold text-gray-700 tracking-wide uppercase mb-2">Alamat Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                        </svg>
                                    </div>
                                    <input id="email" name="email" type="email" autoComplete="email" required
                                        value={data.email} onChange={e => setData('email', e.target.value)}
                                        className="block w-full pl-11 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-[#fafafa]"
                                        placeholder="admin@contoh.com" />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label htmlFor="password" className="block text-xs font-bold text-gray-700 tracking-wide uppercase">Kata Sandi</label>
                                    <a href="#" className="text-xs font-semibold text-gray-600 hover:text-blue-600">Lupa sandi?</a>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                        </svg>
                                    </div>
                                    <input id="password" name="password" type="password" autoComplete="current-password" required
                                        value={data.password} onChange={e => setData('password', e.target.value)}
                                        className="block w-full pl-11 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-[#fafafa]"
                                        placeholder="masukkan kata sandi anda" />
                                </div>
                            </div>

                            <div>
                                <button type="submit" disabled={processing}
                                    className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50">
                                    {processing ? 'Memproses...' : 'Masuk →'}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <p className="text-sm text-gray-600">
                                Belum memiliki akun? <a href="/register" className="font-bold text-gray-900 hover:text-blue-600">Buat Akun</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
