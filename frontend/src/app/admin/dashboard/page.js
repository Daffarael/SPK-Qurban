'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.45, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }
    })
};

function formatRupiah(num) {
    if (!num) return 'Rp 0';
    return 'Rp ' + Number(num).toLocaleString('id-ID');
}

function formatShortRupiah(num) {
    if (!num) return 'Rp 0';
    if (num >= 1_000_000_000) return `Rp ${(num / 1_000_000_000).toFixed(1)}M`;
    if (num >= 1_000_000) return `Rp ${(num / 1_000_000).toFixed(1)}jt`;
    return formatRupiah(num);
}

/* ─── Mini stat card ─── */
function StatCell({ label, value, accent, sub }) {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column', gap: '2px',
            padding: '16px 18px',
        }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                {label}
            </span>
            <span style={{
                fontSize: '22px', fontWeight: 800, lineHeight: 1.2,
                color: accent || 'var(--color-text)',
                letterSpacing: '-0.02em'
            }}>
                {value}
            </span>
            {sub && (
                <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-muted)', marginTop: '1px' }}>
                    {sub}
                </span>
            )}
        </div>
    );
}

/* ─── Grade bar ─── */
function GradeBar({ label, count, total, color }) {
    const pct = total > 0 ? (count / total) * 100 : 0;
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color, width: '68px', flexShrink: 0 }}>
                {label}
            </span>
            <div style={{
                flex: 1, height: '8px', borderRadius: '999px',
                backgroundColor: 'var(--color-border-light)', overflow: 'hidden'
            }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{ height: '100%', borderRadius: '999px', backgroundColor: color }}
                />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)', width: '28px', textAlign: 'right' }}>
                {count}
            </span>
        </div>
    );
}

export default function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [topSapi, setTopSapi] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => { fetchStats(); }, []);

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

            const confirmedOrders = daftarPemesanan.filter(p => p.status === 'Confirmed');
            const totalRevenue = confirmedOrders.reduce((sum, p) =>
                sum + (p.sapi ? parseFloat(p.sapi.harga || 0) : 0), 0);

            const pendingRevenue = daftarPemesanan
                .filter(p => p.status === 'Pending')
                .reduce((sum, p) => sum + (p.sapi ? parseFloat(p.sapi.harga || 0) : 0), 0);

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
                bronze: daftarSapi.filter(s => s.grade === 'Bronze').length,
                totalPemesanan: daftarPemesanan.length,
                pending: daftarPemesanan.filter(p => p.status === 'Pending').length,
                confirmed: daftarPemesanan.filter(p => p.status === 'Confirmed').length,
                pemesananHariIni: pemesananHariIni.length,
                totalRevenue,
                pendingRevenue,
                avgScore
            });

            const sorted = [...daftarPemesanan].sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setRecentOrders(sorted.slice(0, 5));

            const topScored = [...daftarSapi]
                .filter(s => s.status === 'Available' && s.skor_saw)
                .sort((a, b) => b.skor_saw - a.skor_saw)
                .slice(0, 5);
            setTopSapi(topScored);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const statusColors = {
        Pending: { bg: '#fef3c7', color: '#b45309', dot: '#f59e0b' },
        Confirmed: { bg: '#dcfce7', color: '#15803d', dot: '#22c55e' },
        Cancelled: { bg: '#fee2e2', color: '#b91c1c', dot: '#ef4444' },
        Expired: { bg: '#f1f5f9', color: '#475569', dot: '#94a3b8' }
    };

    if (loading) return <LoadingSpinner text="Memuat dashboard..." />;

    const totalGraded = stats?.totalSapi || 0;

    return (
        <div>
            {/* ─── Header ─── */}
            <motion.div
                variants={fadeUp} custom={0} initial="hidden" animate="show"
                style={{ marginBottom: '28px' }}
            >
                <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
                    Dashboard
                </h1>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    Ringkasan data PT Ghaffar Farm Bersaudara
                </p>
            </motion.div>

            {/* ═══════════════════════════════════════════
                ROW 1 — Key Metrics (4 columns)
               ═══════════════════════════════════════════ */}
            <motion.div
                variants={fadeUp} custom={1} initial="hidden" animate="show"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    backgroundColor: 'var(--color-bg-card)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border-light)',
                    boxShadow: 'var(--shadow-card)',
                    marginBottom: '20px',
                    overflow: 'hidden'
                }}
            >
                <div style={{ borderRight: '1px solid var(--color-border-light)' }}>
                    <StatCell label="Total Sapi" value={stats?.totalSapi || 0} sub={`${stats?.available || 0} tersedia`} />
                </div>
                <div style={{ borderRight: '1px solid var(--color-border-light)' }}>
                    <StatCell label="Pesanan" value={stats?.totalPemesanan || 0} sub={`${stats?.pemesananHariIni || 0} hari ini`} />
                </div>
                <div style={{ borderRight: '1px solid var(--color-border-light)' }}>
                    <StatCell label="Revenue" value={formatShortRupiah(stats?.totalRevenue)} accent="#10b981" sub="terkonfirmasi" />
                </div>
                <div>
                    <StatCell label="Potensi" value={formatShortRupiah(stats?.pendingRevenue)} accent="#f59e0b" sub="pending" />
                </div>
            </motion.div>

            {/* ═══════════════════════════════════════════
                ROW 2 — Status Sapi + Distribusi Grade
               ═══════════════════════════════════════════ */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginBottom: '20px'
            }}>
                {/* Status Sapi */}
                <motion.div
                    variants={fadeUp} custom={2} initial="hidden" animate="show"
                    style={{
                        backgroundColor: 'var(--color-bg-card)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--color-border-light)',
                        boxShadow: 'var(--shadow-card)',
                        padding: '20px 22px'
                    }}
                >
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '18px' }}>
                        Status Sapi
                    </div>
                    <div style={{ display: 'flex', gap: '0', marginBottom: '18px' }}>
                        {[
                            { label: 'Available', count: stats?.available || 0, color: '#22c55e' },
                            { label: 'Booked', count: stats?.booked || 0, color: '#f59e0b' },
                            { label: 'Sold', count: stats?.sold || 0, color: '#ef4444' },
                        ].map((s, i) => {
                            const pct = (stats?.totalSapi || 0) > 0 ? (s.count / stats.totalSapi) * 100 : 0;
                            return pct > 0 ? (
                                <motion.div
                                    key={s.label}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.8, delay: 0.1 * i }}
                                    style={{
                                        height: '10px', backgroundColor: s.color,
                                        borderRadius: i === 0 ? '999px 0 0 999px' : i === 2 ? '0 999px 999px 0' : '0'
                                    }}
                                />
                            ) : null;
                        })}
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        {[
                            { label: 'Available', value: stats?.available || 0, color: '#22c55e' },
                            { label: 'Booked', value: stats?.booked || 0, color: '#f59e0b' },
                            { label: 'Sold', value: stats?.sold || 0, color: '#ef4444' }
                        ].map(s => (
                            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: s.color, flexShrink: 0 }} />
                                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                                    {s.label}
                                </span>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>
                                    {s.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Grade Distribution */}
                <motion.div
                    variants={fadeUp} custom={3} initial="hidden" animate="show"
                    style={{
                        backgroundColor: 'var(--color-bg-card)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--color-border-light)',
                        boxShadow: 'var(--shadow-card)',
                        padding: '20px 22px'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>
                            Distribusi Grade
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-muted)' }}>
                            {totalGraded} sapi
                        </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <GradeBar label="Platinum" count={stats?.platinum || 0} total={totalGraded} color="#818cf8" />
                        <GradeBar label="Gold" count={stats?.gold || 0} total={totalGraded} color="#eab308" />
                        <GradeBar label="Silver" count={stats?.silver || 0} total={totalGraded} color="#94a3b8" />
                        <GradeBar label="Bronze" count={stats?.bronze || 0} total={totalGraded} color="#b45309" />
                    </div>

                </motion.div>
            </div>

            {/* ═══════════════════════════════════════════
                ROW 3 — Recent Orders + Top Sapi + Quick Actions
               ═══════════════════════════════════════════ */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '20px'
            }}>
                {/* Pesanan Terbaru */}
                <motion.div
                    variants={fadeUp} custom={4} initial="hidden" animate="show"
                    style={{
                        backgroundColor: 'var(--color-bg-card)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--color-border-light)',
                        boxShadow: 'var(--shadow-card)',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{
                        padding: '16px 20px',
                        borderBottom: '1px solid var(--color-border-light)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>
                            Pesanan Terbaru
                        </span>
                        <button
                            onClick={() => router.push('/admin/pemesanan')}
                            style={{
                                fontSize: '11px', color: 'var(--color-primary-500)', fontWeight: 600,
                                background: 'none', border: 'none', cursor: 'pointer',
                                padding: '4px 8px', borderRadius: '6px',
                                transition: 'background 0.15s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-50)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                            Lihat Semua →
                        </button>
                    </div>

                    {recentOrders.length === 0 ? (
                        <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                            Belum ada pesanan.
                        </div>
                    ) : (
                        <div>
                            {recentOrders.map((p, i) => {
                                const sc = statusColors[p.status] || statusColors.Pending;
                                return (
                                    <div key={p.id} style={{
                                        padding: '12px 20px',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        borderBottom: i < recentOrders.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                                        transition: 'background 0.15s'
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-secondary)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '32px', height: '32px', borderRadius: '50%',
                                                backgroundColor: 'var(--color-primary-50)',
                                                color: 'var(--color-primary-600)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '12px', fontWeight: 700, flexShrink: 0
                                            }}>
                                                {p.nama_pelanggan?.charAt(0)?.toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.3 }}>
                                                    {p.nama_pelanggan}
                                                </div>
                                                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                                                    {p.sapi ? p.sapi.kode_sapi : '—'} · {new Date(p.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '6px',
                                            padding: '3px 10px', borderRadius: '999px',
                                            backgroundColor: sc.bg, fontSize: '11px', fontWeight: 600, color: sc.color
                                        }}>
                                            <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: sc.dot }} />
                                            {p.status}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>

                {/* Right column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Top Sapi */}
                    <motion.div
                        variants={fadeUp} custom={5} initial="hidden" animate="show"
                        style={{
                            backgroundColor: 'var(--color-bg-card)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--color-border-light)',
                            boxShadow: 'var(--shadow-card)',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            padding: '16px 20px',
                            borderBottom: '1px solid var(--color-border-light)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>
                                Sapi Unggulan
                            </span>
                            <button
                                onClick={() => router.push('/admin/sapi')}
                                style={{
                                    fontSize: '11px', color: 'var(--color-primary-500)', fontWeight: 600,
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    padding: '4px 8px', borderRadius: '6px',
                                    transition: 'background 0.15s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-50)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'none'}
                            >
                                Lihat Semua →
                            </button>
                        </div>

                        {topSapi.length === 0 ? (
                            <div style={{ padding: '24px 20px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                                Belum ada data sapi.
                            </div>
                        ) : topSapi.map((s, i) => {
                            const gradeColor = s.grade === 'Platinum' ? '#818cf8' : s.grade === 'Gold' ? '#eab308' : s.grade === 'Bronze' ? '#b45309' : '#94a3b8';
                            return (
                                <div key={s.id} style={{
                                    padding: '10px 20px',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    borderBottom: i < topSapi.length - 1 ? '1px solid var(--color-border-light)' : 'none'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{
                                            width: '22px', height: '22px', borderRadius: '6px',
                                            backgroundColor: i < 3 ? 'var(--color-primary-500)' : 'var(--color-bg-secondary)',
                                            color: i < 3 ? 'white' : 'var(--color-text-muted)',
                                            fontSize: '11px', fontWeight: 700,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            {i + 1}
                                        </span>
                                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>
                                            {s.kode_sapi}
                                        </span>
                                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                                            {s.berat_kg}kg
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{
                                            fontSize: '10px', fontWeight: 700, color: gradeColor,
                                            padding: '2px 8px', borderRadius: '999px',
                                            backgroundColor: `${gradeColor}12`
                                        }}>
                                            {s.grade}
                                        </span>
                                        <span style={{
                                            fontSize: '13px', fontWeight: 700, color: 'var(--color-primary-600)',
                                            minWidth: '28px', textAlign: 'right'
                                        }}>
                                            {s.skor_saw}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        variants={fadeUp} custom={6} initial="hidden" animate="show"
                        style={{
                            backgroundColor: 'var(--color-bg-card)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--color-border-light)',
                            boxShadow: 'var(--shadow-card)',
                            padding: '18px 20px'
                        }}
                    >
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '12px' }}>
                            Aksi Cepat
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            {[
                                { label: 'Tambah Sapi', path: '/admin/sapi/tambah', icon: (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                )},
                                { label: 'Lihat Pesanan', path: '/admin/pemesanan', icon: (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8"/><path d="M8 8h8"/><path d="M8 16h4"/></svg>
                                )},
                                { label: 'Kelola Sapi', path: '/admin/sapi', icon: (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                                )},
                                { label: 'Jenis Sapi', path: '/admin/jenis-sapi', icon: (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2z" /><circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" /></svg>
                                )}
                            ].map(action => (
                                <button
                                    key={action.path}
                                    onClick={() => router.push(action.path)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-primary-400)';
                                        e.currentTarget.style.color = 'var(--color-primary-600)';
                                        e.currentTarget.style.background = 'var(--color-primary-50)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-border)';
                                        e.currentTarget.style.color = 'var(--color-text-secondary)';
                                        e.currentTarget.style.background = 'transparent';
                                    }}
                                    style={{
                                        padding: '10px 12px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--color-border)',
                                        backgroundColor: 'transparent',
                                        color: 'var(--color-text-secondary)',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {action.icon}
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
