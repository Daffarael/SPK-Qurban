'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import KartuStatistik from '@/components/admin/KartuStatistik';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.07, delayChildren: 0.1 }
    }
};

const item = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }
};

function formatRupiah(num) {
    if (!num) return 'Rp 0';
    return 'Rp ' + Number(num).toLocaleString('id-ID');
}

export default function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [topSapi, setTopSapi] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [sapiRes, pemesananRes] = await Promise.all([
                api.get('/sapi'),
                api.get('/pemesanan')
            ]);

            const daftarSapi = sapiRes.data.data || [];
            const daftarPemesanan = pemesananRes.data.data || [];

            const today = new Date().toDateString();
            const pemesananHariIni = daftarPemesanan.filter(p =>
                new Date(p.createdAt).toDateString() === today
            );

            // Revenue calculations
            const confirmedOrders = daftarPemesanan.filter(p => p.status === 'Confirmed');
            const totalRevenue = confirmedOrders.reduce((sum, p) => {
                return sum + (p.sapi ? parseFloat(p.sapi.harga || 0) : 0);
            }, 0);

            const pendingRevenue = daftarPemesanan
                .filter(p => p.status === 'Pending')
                .reduce((sum, p) => sum + (p.sapi ? parseFloat(p.sapi.harga || 0) : 0), 0);

            // Average skor
            const sapiWithScore = daftarSapi.filter(s => s.skor_saw);
            const avgScore = sapiWithScore.length > 0
                ? Math.round(sapiWithScore.reduce((s, x) => s + x.skor_saw, 0) / sapiWithScore.length)
                : 0;

            setStats({
                totalSapi: daftarSapi.length,
                available: daftarSapi.filter(s => s.status === 'Available').length,
                booked: daftarSapi.filter(s => s.status === 'Booked').length,
                sold: daftarSapi.filter(s => s.status === 'Sold').length,
                platinum: daftarSapi.filter(s => s.grade === 'Platinum').length,
                gold: daftarSapi.filter(s => s.grade === 'Gold').length,
                silver: daftarSapi.filter(s => s.grade === 'Silver').length,
                tidakLolos: daftarSapi.filter(s => !s.skor_saw || s.skor_saw < 60).length,
                totalPemesanan: daftarPemesanan.length,
                pending: daftarPemesanan.filter(p => p.status === 'Pending').length,
                confirmed: daftarPemesanan.filter(p => p.status === 'Confirmed').length,
                pemesananHariIni: pemesananHariIni.length,
                totalRevenue,
                pendingRevenue,
                avgScore
            });

            // Recent 5 orders
            const sorted = [...daftarPemesanan].sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setRecentOrders(sorted.slice(0, 5));

            // Top 3 sapi by score
            const topScored = [...daftarSapi]
                .filter(s => s.status === 'Available' && s.skor_saw)
                .sort((a, b) => b.skor_saw - a.skor_saw)
                .slice(0, 3);
            setTopSapi(topScored);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const statusConfig = {
        Pending: { bg: '#fef3c7', color: '#d97706', label: '⏳ Pending' },
        Confirmed: { bg: '#dcfce7', color: '#16a34a', label: '✅ Dikonfirmasi' },
        Cancelled: { bg: '#fee2e2', color: '#dc2626', label: '❌ Dibatalkan' },
        Expired: { bg: '#f1f5f9', color: '#64748b', label: '⏰ Kadaluarsa' }
    };

    if (loading) return <LoadingSpinner text="Memuat dashboard..." />;

    return (
        <div>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ marginBottom: '28px' }}
            >
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text)' }}>
                    Dashboard
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    Selamat datang di panel admin PT Ghaffar Farm Bersaudara
                </p>
            </motion.div>

            {/* Highlight Cards Row */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{ marginBottom: '8px' }}
            >
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>
                    RINGKASAN
                </span>
            </motion.div>
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '14px',
                    marginBottom: '28px'
                }}
            >
                <motion.div variants={item}>
                    <KartuStatistik icon="🐄" label="Total Sapi" value={stats?.totalSapi || 0} />
                </motion.div>
                <motion.div variants={item}>
                    <KartuStatistik icon="📦" label="Total Pesanan" value={stats?.totalPemesanan || 0} />
                </motion.div>
                <motion.div variants={item}>
                    <div style={{
                        backgroundColor: 'var(--color-bg-card)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '24px',
                        border: '1px solid var(--color-border-light)',
                        boxShadow: 'var(--shadow-card)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px'
                    }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
                            backgroundColor: '#10b98115', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: '22px', flexShrink: 0
                        }}>💰</div>
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: '2px' }}>
                                Revenue Terkonfirmasi
                            </div>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: '#10b981', lineHeight: 1.2 }}>
                                {formatRupiah(stats?.totalRevenue)}
                            </div>
                        </div>
                    </div>
                </motion.div>
                <motion.div variants={item}>
                    <div style={{
                        backgroundColor: 'var(--color-bg-card)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '24px',
                        border: '1px solid var(--color-border-light)',
                        boxShadow: 'var(--shadow-card)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px'
                    }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
                            backgroundColor: '#f59e0b15', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: '22px', flexShrink: 0
                        }}>⏳</div>
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: '2px' }}>
                                Potensi (Pending)
                            </div>
                            <div style={{ fontSize: '18px', fontWeight: 700, color: '#f59e0b', lineHeight: 1.2 }}>
                                {formatRupiah(stats?.pendingRevenue)}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Statistik Sapi */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                style={{ marginBottom: '8px' }}
            >
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>
                    STATISTIK SAPI
                </span>
            </motion.div>
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '14px',
                    marginBottom: '28px'
                }}
            >
                <motion.div variants={item}><KartuStatistik icon="✅" label="Available" value={stats?.available || 0} /></motion.div>
                <motion.div variants={item}><KartuStatistik icon="📌" label="Booked" value={stats?.booked || 0} /></motion.div>
                <motion.div variants={item}><KartuStatistik icon="🏷️" label="Sold" value={stats?.sold || 0} /></motion.div>
                <motion.div variants={item}><KartuStatistik icon="📊" label="Rata-rata Skor" value={stats?.avgScore || 0} /></motion.div>
            </motion.div>

            {/* Grade Distribution */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{ marginBottom: '8px' }}
            >
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>
                    DISTRIBUSI GRADE
                </span>
            </motion.div>
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '14px',
                    marginBottom: '28px'
                }}
            >
                <motion.div variants={item}><KartuStatistik icon="💎" label="Platinum" value={stats?.platinum || 0} /></motion.div>
                <motion.div variants={item}><KartuStatistik icon="🥇" label="Gold" value={stats?.gold || 0} /></motion.div>
                <motion.div variants={item}><KartuStatistik icon="🥈" label="Silver" value={stats?.silver || 0} /></motion.div>
                <motion.div variants={item}><KartuStatistik icon="⚠️" label="Tidak Lolos" value={stats?.tidakLolos || 0} /></motion.div>
            </motion.div>

            {/* Bottom Row: Recent Orders + Top Sapi + Quick Actions */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginTop: '8px'
            }}>
                {/* Recent Orders */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    style={{
                        backgroundColor: 'var(--color-bg-card)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--color-border-light)',
                        boxShadow: 'var(--shadow-card)',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{
                        padding: '18px 20px 14px',
                        borderBottom: '1px solid var(--color-border-light)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>
                            📋 Pesanan Terbaru
                        </span>
                        <button
                            onClick={() => router.push('/admin/pemesanan')}
                            style={{
                                fontSize: '12px', color: 'var(--color-primary-500)', fontWeight: 600,
                                background: 'none', border: 'none', cursor: 'pointer'
                            }}
                        >
                            Lihat Semua →
                        </button>
                    </div>
                    <div style={{ padding: '8px 0' }}>
                        {recentOrders.length === 0 ? (
                            <div style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                                Belum ada pesanan.
                            </div>
                        ) : recentOrders.map((p, i) => {
                            const sc = statusConfig[p.status] || statusConfig.Pending;
                            return (
                                <div key={p.id} style={{
                                    padding: '10px 20px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderBottom: i < recentOrders.length - 1 ? '1px solid var(--color-border-light)' : 'none'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>
                                            {p.nama_pelanggan}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                                            {p.sapi ? `🐄 ${p.sapi.kode_sapi}` : '-'} • {new Date(p.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                        </div>
                                    </div>
                                    <span style={{
                                        padding: '3px 10px',
                                        borderRadius: '999px',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        backgroundColor: sc.bg,
                                        color: sc.color
                                    }}>
                                        {sc.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Right Column: Top Sapi + Quick Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Top Sapi */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        style={{
                            backgroundColor: 'var(--color-bg-card)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--color-border-light)',
                            boxShadow: 'var(--shadow-card)',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            padding: '18px 20px 14px',
                            borderBottom: '1px solid var(--color-border-light)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>
                                🏆 Sapi Unggulan
                            </span>
                            <button
                                onClick={() => router.push('/admin/sapi')}
                                style={{
                                    fontSize: '12px', color: 'var(--color-primary-500)', fontWeight: 600,
                                    background: 'none', border: 'none', cursor: 'pointer'
                                }}
                            >
                                Lihat Semua →
                            </button>
                        </div>
                        <div style={{ padding: '8px 0' }}>
                            {topSapi.length === 0 ? (
                                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                                    Belum ada data sapi.
                                </div>
                            ) : topSapi.map((s, i) => (
                                <div key={s.id} style={{
                                    padding: '10px 20px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderBottom: i < topSapi.length - 1 ? '1px solid var(--color-border-light)' : 'none'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{
                                            width: '24px', height: '24px', borderRadius: '50%',
                                            backgroundColor: 'var(--color-primary-500)', color: 'white',
                                            fontSize: '12px', fontWeight: 700, display: 'flex',
                                            alignItems: 'center', justifyContent: 'center'
                                        }}>{i + 1}</span>
                                        <div>
                                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>
                                                {s.kode_sapi}
                                            </span>
                                            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginLeft: '6px' }}>
                                                {s.berat_kg}kg
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{
                                            padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 700,
                                            backgroundColor: s.grade === 'Platinum' ? 'var(--color-platinum-bg)' : s.grade === 'Gold' ? 'var(--color-gold-bg)' : 'var(--color-silver-bg)',
                                            color: s.grade === 'Platinum' ? 'var(--color-platinum)' : s.grade === 'Gold' ? 'var(--color-gold)' : 'var(--color-silver)'
                                        }}>{s.grade}</span>
                                        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary-500)' }}>
                                            {s.skor_saw}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        style={{
                            backgroundColor: 'var(--color-bg-card)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--color-border-light)',
                            boxShadow: 'var(--shadow-card)',
                            padding: '20px'
                        }}
                    >
                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '14px' }}>
                            ⚡ Aksi Cepat
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            {[
                                { label: '➕ Tambah Sapi', path: '/admin/sapi/tambah' },
                                { label: '📦 Lihat Pesanan', path: '/admin/pemesanan' },
                                { label: '🐄 Kelola Sapi', path: '/admin/sapi' },
                                { label: '⚠️ Tidak Lolos', path: '/admin/sapi/tidak-lolos' }
                            ].map(action => (
                                <button
                                    key={action.path}
                                    onClick={() => router.push(action.path)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-primary-500)';
                                        e.currentTarget.style.color = 'var(--color-primary-500)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-border)';
                                        e.currentTarget.style.color = 'var(--color-text-secondary)';
                                    }}
                                    style={{
                                        padding: '12px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--color-border)',
                                        backgroundColor: 'transparent',
                                        color: 'var(--color-text-secondary)',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        textAlign: 'center'
                                    }}
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
