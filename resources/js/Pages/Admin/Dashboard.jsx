import { useEffect, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Chart from 'chart.js/auto';
import { formatRp } from '@/utils/formatter';

export default function Dashboard({ stats, recentTransactions, chartLabels, chartValues, topConcerts, nodeStatus }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            // Destroy existing chart if any
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const maxVal = Math.max(...chartValues, 1);

            chartInstance.current = new Chart(chartRef.current, {
                type: 'line',
                data: {
                    labels: chartLabels,
                    datasets: [{
                        label: 'Pendapatan (Rp)',
                        data: chartValues,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59,130,246,0.08)',
                        borderWidth: 2.5,
                        pointBackgroundColor: '#3b82f6',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        fill: true,
                        tension: 0.4,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#1e293b',
                            titleFont: { size: 12, weight: '600' },
                            bodyFont: { size: 13, weight: '700' },
                            padding: 12,
                            cornerRadius: 10,
                            callbacks: {
                                label: ctx => 'Rp ' + ctx.parsed.y.toLocaleString('id-ID'),
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: { font: { size: 11, weight: '600' }, color: '#94a3b8' },
                        },
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false },
                            border: { display: false },
                            ticks: {
                                font: { size: 11 },
                                color: '#94a3b8',
                                maxTicksLimit: 5,
                                callback: val => {
                                    if (val >= 1_000_000) return 'Rp ' + (val / 1_000_000).toFixed(1) + 'jt';
                                    if (val >= 1_000)     return 'Rp ' + (val / 1_000).toFixed(0) + 'rb';
                                    return 'Rp ' + val;
                                }
                            }
                        }
                    }
                }
            });
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [chartLabels, chartValues]);

    return (
        <AdminLayout title="Dashboard Utama">
            {/* System Status Bar (Distributed DB) */}
            <div className="flex flex-wrap gap-4 mb-5">
                <div className={`px-4 py-2 rounded-lg flex items-center gap-2 border shadow-sm ${nodeStatus?.node1 ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${nodeStatus?.node1 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-bold">Node 1 (Master): {nodeStatus?.node1 ? 'Connected' : 'Disconnected'}</span>
                </div>
                <div className={`px-4 py-2 rounded-lg flex items-center gap-2 border shadow-sm ${nodeStatus?.node2 ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${nodeStatus?.node2 ? 'bg-green-500 animate-pulse' : 'bg-red-500 animate-pulse'}`}></div>
                    <span className="text-sm font-bold">Node 2 (Transaction): {nodeStatus?.node2 ? 'Connected' : 'Disconnected'}</span>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-[110px]">
                    <div className="flex justify-between items-start">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base">$</div>
                        <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full">Live</span>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 mb-0.5">Total Pendapatan</p>
                        <p className="text-lg font-bold text-gray-900">{formatRp(stats.totalRevenue)}</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-[110px]">
                    <div className="flex justify-between items-start">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>
                        </div>
                        <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full">Live</span>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 mb-0.5">Tiket Terjual</p>
                        <p className="text-lg font-bold text-gray-900">{stats.totalTickets.toLocaleString('id-ID')}</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-[110px]">
                    <div className="flex justify-between items-start">
                        <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        </div>
                        <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full">Live</span>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 mb-0.5">Acara Aktif</p>
                        <p className="text-lg font-bold text-gray-900">{stats.activeConcerts}</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-[110px]">
                    <div className="flex justify-between items-start">
                        <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                        </div>
                        <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full">Live</span>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 mb-0.5">Total Pengguna</p>
                        <p className="text-lg font-bold text-gray-900">{stats.totalUsers.toLocaleString('id-ID')}</p>
                    </div>
                </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-bold text-gray-900 text-base">Pendapatan 6 Bulan Terakhir</h3>
                        <span className="text-xs text-gray-400 font-medium">Hanya transaksi lunas</span>
                    </div>
                    <div className="relative" style={{ height: '220px' }}>
                        <canvas ref={chartRef}></canvas>
                        {chartValues.reduce((a,b) => a+b, 0) === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-gray-400 text-sm">Belum ada data pendapatan</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-bold text-gray-900 text-base">Transaksi Terbaru</h3>
                        <a href="/admin/daftar-transaksi" className="text-xs text-blue-600 font-semibold hover:underline">Lihat semua</a>
                    </div>
                    <div className="space-y-4">
                        {recentTransactions.length > 0 ? recentTransactions.map((trx, i) => {
                            let badge = { class: 'bg-gray-100 text-gray-500', label: trx.status };
                            if (trx.status === 'paid') badge = { class: 'bg-green-50 text-green-700', label: 'Lunas' };
                            if (trx.status === 'pending') badge = { class: 'bg-orange-50 text-orange-600', label: 'Pending' };
                            if (trx.status === 'cancelled') badge = { class: 'bg-red-50 text-red-600', label: 'Batal' };

                            return (
                                <div key={trx.id} className={`flex justify-between items-center ${i > 0 ? 'pt-4 border-t border-gray-50' : ''}`}>
                                    <div>
                                        <p className="font-semibold text-sm text-gray-900 leading-tight">{trx.user?.name || '—'}</p>
                                        <p className="text-[11px] text-gray-400 mt-0.5">{new Date(trx.created_at).toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'})}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm text-gray-900 leading-tight">{formatRp(trx.grand_total)}</p>
                                        <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full ${badge.class} text-[10px] font-bold`}>{badge.label}</span>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="py-10 text-center">
                                <svg className="w-10 h-10 text-gray-200 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                                <p className="text-gray-400 text-sm">Belum ada transaksi</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Row 3 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                    <h3 className="font-bold text-gray-900 text-base">Konser Terlaris</h3>
                    <span className="text-xs text-gray-400">Berdasarkan tiket terjual (transaksi lunas)</span>
                </div>
                {topConcerts.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">#</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Nama Konser</th>
                                    <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Tanggal</th>
                                    <th className="text-right px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Tiket Terjual</th>
                                    <th className="text-right px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Pendapatan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {topConcerts.map((c, i) => (
                                    <tr key={c.id} className="hover:bg-gray-50/70 transition-colors">
                                        <td className="px-6 py-3.5">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                {i + 1}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5"><p className="font-semibold text-gray-900 text-sm">{c.title}</p></td>
                                        <td className="px-6 py-3.5 text-gray-500 text-xs">
                                            {new Date(c.event_date).toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'})}
                                        </td>
                                        <td className="px-6 py-3.5 text-right">
                                            <span className="font-bold text-gray-900">{Number(c.tickets_sold).toLocaleString('id-ID')}</span>
                                            <span className="text-gray-400 text-xs ml-1">tiket</span>
                                        </td>
                                        <td className="px-6 py-3.5 text-right font-bold text-gray-900">{formatRp(c.revenue)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <svg className="w-10 h-10 text-gray-200 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 012 2v3a2 2 0 000 4v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 000-4V7a2 2 0 012-2z"/></svg>
                        <p className="text-gray-400 text-sm">Belum ada data penjualan tiket</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
