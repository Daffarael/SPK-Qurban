'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/services/api';
import BadgeGrade from '@/components/common/BadgeGrade';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ModalDetailSAW from '@/components/admin/ModalDetailSAW';
import ModalDetailSapi from '@/components/admin/ModalDetailSapi';
import toast from 'react-hot-toast';

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.45, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }
    })
};

const rowVariant = {
    hidden: { opacity: 0, y: 10 },
    show: (i) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.35, delay: 0.15 + i * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }
    })
};

export default function DaftarSapiPage() {
    const [daftarSapi, setDaftarSapi] = useState([]);
    const [semuaSapi, setSemuaSapi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSapi, setSelectedSapi] = useState(null);
    const [showSAW, setShowSAW] = useState(false);
    const [detailSapi, setDetailSapi] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    useEffect(() => {
        fetchSapi();
    }, []);

    const fetchSapi = async () => {
        try {
            const res = await api.get('/sapi');
            const semua = res.data.data || [];
            setSemuaSapi(semua);
            setDaftarSapi(semua);
        } catch (err) {
            toast.error('Gagal mengambil data sapi.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, kode) => {
        if (!confirm(`Hapus sapi ${kode}? Data tidak bisa dikembalikan.`)) return;
        try {
            await api.delete(`/sapi/${id}`);
            toast.success(`Sapi ${kode} berhasil dihapus.`);
            fetchSapi();
        } catch (err) {
            toast.error('Gagal menghapus sapi.');
        }
    };

    const statusConfig = {
        Available: { bg: '#dcfce7', color: '#15803d', dot: '#22c55e' },
        Booked: { bg: '#fef3c7', color: '#b45309', dot: '#f59e0b' },
        Sold: { bg: '#fee2e2', color: '#b91c1c', dot: '#ef4444' }
    };

    const getRankStyle = (idx) => {
        if (idx === 0) return { bg: 'linear-gradient(145deg, #fbbf24, #d97706)', shadow: '0 2px 8px rgba(217,119,6,0.35)' };
        if (idx === 1) return { bg: 'linear-gradient(145deg, #cbd5e1, #94a3b8)', shadow: '0 2px 8px rgba(148,163,184,0.35)' };
        if (idx === 2) return { bg: 'linear-gradient(145deg, #d97706, #a16207)', shadow: '0 2px 8px rgba(161,98,7,0.3)' };
        return { bg: 'var(--color-primary-500)', shadow: 'none' };
    };

    if (loading) return <LoadingSpinner text="Memuat daftar sapi..." />;

    return (
        <div>
            {/* Header */}
            <motion.div
                variants={fadeUp} custom={0} initial="hidden" animate="show"
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px'
                }}
            >
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
                        Daftar Sapi
                    </h1>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        {daftarSapi.length} sapi terdaftar · Diurutkan skor tertinggi
                    </p>
                </div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link href="/admin/sapi/tambah" style={{
                        padding: '9px 18px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-primary-500)',
                        color: 'white',
                        textDecoration: 'none',
                        fontSize: '13px',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease'
                    }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Tambah Sapi
                    </Link>
                </motion.div>
            </motion.div>

            {daftarSapi.length === 0 ? (
                <motion.div
                    variants={fadeUp} custom={1} initial="hidden" animate="show"
                    style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        backgroundColor: 'var(--color-bg-card)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--color-border-light)',
                        boxShadow: 'var(--shadow-card)'
                    }}
                >
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>🐄</div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text)' }}>
                        Belum ada sapi yang diinputkan.
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        Klik tombol &quot;Tambah Sapi&quot; untuk menambahkan sapi pertama.
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    variants={fadeUp} custom={1} initial="hidden" animate="show"
                    style={{
                        backgroundColor: 'var(--color-bg-card)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--color-border-light)',
                        boxShadow: 'var(--shadow-card)',
                        overflow: 'hidden'
                    }}
                >
                    {/* Table Header */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '52px 1fr 100px 110px 90px 160px 160px',
                        padding: '12px 20px',
                        borderBottom: '1px solid var(--color-border-light)',
                        backgroundColor: 'var(--color-bg-secondary)',
                        gap: '12px',
                        alignItems: 'center'
                    }}>
                        {['#', 'Kode Sapi', 'Berat', 'Harga', 'Status', 'Skor SAW', 'Aksi'].map(h => (
                            <span key={h} style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                color: 'var(--color-text-muted)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                {h}
                            </span>
                        ))}
                    </div>

                    {/* Table Rows */}
                    {daftarSapi.map((sapi, idx) => {
                        const sc = statusConfig[sapi.status] || statusConfig.Available;
                        const rankStyle = getRankStyle(idx);

                        return (
                            <motion.div
                                key={sapi.id}
                                variants={rowVariant}
                                custom={idx}
                                initial="hidden"
                                animate="show"
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '52px 1fr 100px 110px 90px 160px 160px',
                                    padding: '14px 20px',
                                    borderBottom: idx < daftarSapi.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                                    gap: '12px',
                                    alignItems: 'center',
                                    transition: 'background 0.15s ease',
                                    cursor: 'default'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg-secondary)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                {/* Rank */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{
                                        width: '28px', height: '28px',
                                        borderRadius: idx < 3 ? '50%' : '8px',
                                        background: rankStyle.bg,
                                        color: 'white',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '12px', fontWeight: 800,
                                        boxShadow: rankStyle.shadow,
                                        border: idx < 3 ? '2px solid rgba(255,255,255,0.3)' : 'none',
                                        flexShrink: 0
                                    }}>
                                        {idx + 1}
                                    </div>
                                </div>

                                {/* Kode Sapi + Grade */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>
                                        {sapi.kode_sapi}
                                    </span>
                                    <BadgeGrade grade={sapi.grade} size="sm" />
                                </div>

                                {/* Berat */}
                                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>
                                    {sapi.berat_kg} kg
                                </span>

                                {/* Harga */}
                                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>
                                    {parseFloat(sapi.harga / 1000000).toFixed(1)}jt
                                </span>

                                {/* Status badge */}
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    padding: '4px 10px',
                                    borderRadius: '999px',
                                    backgroundColor: sc.bg,
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: sc.color,
                                    width: 'fit-content'
                                }}>
                                    <div style={{
                                        width: '5px', height: '5px',
                                        borderRadius: '50%',
                                        backgroundColor: sc.dot,
                                        flexShrink: 0
                                    }} />
                                    {sapi.status}
                                </div>

                                {/* Score bar */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                        flex: 1, height: '6px',
                                        backgroundColor: 'var(--color-border-light)',
                                        borderRadius: '999px', overflow: 'hidden'
                                    }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${sapi.skor_saw}%` }}
                                            transition={{ duration: 0.8, delay: 0.2 + idx * 0.04 }}
                                            style={{
                                                height: '100%',
                                                background: sapi.skor_saw >= 90
                                                    ? 'linear-gradient(90deg, #818cf8, #6366f1)'
                                                    : sapi.skor_saw >= 75
                                                    ? 'linear-gradient(90deg, #34d399, #10b981)'
                                                    : sapi.skor_saw >= 60
                                                    ? 'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-600))'
                                                    : 'linear-gradient(90deg, #cd7f32, #b8690a)',
                                                borderRadius: '999px'
                                            }}
                                        />
                                    </div>
                                    <span style={{
                                        fontSize: '12px',
                                        fontWeight: 700,
                                        color: 'var(--color-primary-600)',
                                        minWidth: '32px',
                                        textAlign: 'right'
                                    }}>
                                        {sapi.skor_saw}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                    {/* Lihat Detail */}
                                    <button
                                        onClick={() => { setDetailSapi(sapi); setShowDetail(true); }}
                                        title="Lihat Detail Sapi"
                                        style={{
                                            width: '32px', height: '32px',
                                            borderRadius: '8px',
                                            border: '1px solid var(--color-border-light)',
                                            backgroundColor: 'transparent',
                                            color: 'var(--color-text-muted)',
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'all 0.15s ease'
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.borderColor = 'var(--color-primary-400)';
                                            e.currentTarget.style.color = 'var(--color-primary-600)';
                                            e.currentTarget.style.background = 'var(--color-primary-50)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.borderColor = 'var(--color-border-light)';
                                            e.currentTarget.style.color = 'var(--color-text-muted)';
                                            e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    </button>
                                    {/* Detail SAW */}
                                    <button
                                        onClick={() => { setSelectedSapi(sapi); setShowSAW(true); }}
                                        title="Lihat Detail SAW"
                                        style={{
                                            width: '32px', height: '32px',
                                            borderRadius: '8px',
                                            border: '1px solid var(--color-border-light)',
                                            backgroundColor: 'transparent',
                                            color: 'var(--color-text-muted)',
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'all 0.15s ease'
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.borderColor = 'var(--color-primary-400)';
                                            e.currentTarget.style.color = 'var(--color-primary-600)';
                                            e.currentTarget.style.background = 'var(--color-primary-50)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.borderColor = 'var(--color-border-light)';
                                            e.currentTarget.style.color = 'var(--color-text-muted)';
                                            e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
                                        </svg>
                                    </button>
                                    <Link href={`/admin/sapi/edit/${sapi.id}`}>
                                        <div
                                            title="Edit"
                                            style={{
                                                width: '32px', height: '32px',
                                                borderRadius: '8px',
                                                border: '1px solid var(--color-border-light)',
                                                backgroundColor: 'transparent',
                                                color: 'var(--color-text-muted)',
                                                fontSize: '14px',
                                                cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                transition: 'all 0.15s ease'
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.borderColor = 'var(--color-primary-400)';
                                                e.currentTarget.style.color = 'var(--color-primary-600)';
                                                e.currentTarget.style.background = 'var(--color-primary-50)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.borderColor = 'var(--color-border-light)';
                                                e.currentTarget.style.color = 'var(--color-text-muted)';
                                                e.currentTarget.style.background = 'transparent';
                                            }}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                            </svg>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(sapi.id, sapi.kode_sapi)}
                                        title="Hapus"
                                        style={{
                                            width: '32px', height: '32px',
                                            borderRadius: '8px',
                                            border: '1px solid var(--color-border-light)',
                                            backgroundColor: 'transparent',
                                            color: 'var(--color-text-muted)',
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'all 0.15s ease'
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.borderColor = '#fca5a5';
                                            e.currentTarget.style.color = '#dc2626';
                                            e.currentTarget.style.background = '#fef2f2';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.borderColor = 'var(--color-border-light)';
                                            e.currentTarget.style.color = 'var(--color-text-muted)';
                                            e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                        </svg>
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}

                    {/* Footer */}
                    <div style={{
                        padding: '12px 20px',
                        borderTop: '1px solid var(--color-border-light)',
                        backgroundColor: 'var(--color-bg-secondary)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                            Menampilkan {daftarSapi.length} sapi berkualitas
                        </span>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            {[
                                { label: 'Platinum', count: daftarSapi.filter(s => s.grade === 'Platinum').length, color: '#818cf8' },
                                { label: 'Gold', count: daftarSapi.filter(s => s.grade === 'Gold').length, color: '#f59e0b' },
                                { label: 'Silver', count: daftarSapi.filter(s => s.grade === 'Silver').length, color: '#94a3b8' },
                                { label: 'Bronze', count: daftarSapi.filter(s => s.grade === 'Bronze').length, color: '#cd7f32' }
                            ].filter(g => g.count > 0).map(g => (
                                <div key={g.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: g.color }} />
                                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                                        {g.count} {g.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            <ModalDetailSAW isOpen={showSAW} onClose={() => setShowSAW(false)} sapi={selectedSapi} semuaSapi={semuaSapi} />
            <ModalDetailSapi isOpen={showDetail} onClose={() => setShowDetail(false)} sapi={detailSapi} />
        </div>
    );
}
