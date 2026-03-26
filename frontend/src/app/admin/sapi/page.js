'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/services/api';
import BadgeGrade from '@/components/common/BadgeGrade';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ModalDetailSAW from '@/components/admin/ModalDetailSAW';
import toast from 'react-hot-toast';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.06, delayChildren: 0.1 }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }
};

export default function DaftarSapiPage() {
    const [daftarSapi, setDaftarSapi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSapi, setSelectedSapi] = useState(null);
    const [showSAW, setShowSAW] = useState(false);

    useEffect(() => {
        fetchSapi();
    }, []);

    const fetchSapi = async () => {
        try {
            const res = await api.get('/sapi');
            const lolos = (res.data.data || []).filter(s => s.skor_saw >= 60);
            setDaftarSapi(lolos);
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
        Available: { bg: '#dcfce7', color: '#16a34a', label: '✅ Available' },
        Booked: { bg: '#fef3c7', color: '#d97706', label: '📌 Booked' },
        Sold: { bg: '#fee2e2', color: '#dc2626', label: '🏷️ Sold' }
    };

    if (loading) return <LoadingSpinner text="Memuat daftar sapi..." />;

    return (
        <div>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px'
                }}
            >
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text)' }}>
                        Daftar Sapi — Ranking SAW
                    </h1>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        {daftarSapi.length} sapi lolos syarat (skor ≥ 60), diurutkan skor tertinggi
                    </p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/admin/sapi/tambah" style={{
                        padding: '10px 20px',
                        borderRadius: 'var(--radius-md)',
                        background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))',
                        color: 'white',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: 600,
                        boxShadow: '0 4px 14px rgba(14,165,233,0.25)',
                        display: 'inline-block'
                    }}>
                        + Tambah Sapi
                    </Link>
                </motion.div>
            </motion.div>

            {daftarSapi.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -8, boxShadow: '0 14px 35px rgba(0,0,0,0.08)' }}
                    transition={{ duration: 0.2 }}
                    style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        backgroundColor: 'var(--color-bg-card)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--color-border-light)',
                        boxShadow: 'var(--shadow-card)',
                        cursor: 'default'
                    }}
                >
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>🐄</div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text)' }}>
                        Belum ada sapi yang diinputkan.
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        Klik tombol &quot;Tambah Sapi&quot; untuk menambahkan sapi pertama.
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '16px'
                    }}
                >
                    {daftarSapi.map((sapi, idx) => {
                        const sc = statusConfig[sapi.status] || statusConfig.Available;
                        const gradeColors = {
                            Platinum: { bg: 'linear-gradient(135deg, #e0e7ff, #ede9fe)', border: '#c7d2fe' },
                            Gold: { bg: 'linear-gradient(135deg, #fef9c3, #fef3c7)', border: '#fde68a' },
                            Silver: { bg: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', border: '#cbd5e1' }
                        };
                        const gc = gradeColors[sapi.grade] || gradeColors.Silver;

                        return (
                            <motion.div
                                key={sapi.id}
                                variants={item}
                                whileHover={{ y: -6, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    backgroundColor: 'var(--color-bg-card)',
                                    borderRadius: 'var(--radius-xl)',
                                    border: '1px solid var(--color-border-light)',
                                    overflow: 'hidden',
                                    boxShadow: 'var(--shadow-card)',
                                    cursor: 'default'
                                }}
                            >
                                {/* Header with rank + grade */}
                                <div style={{
                                    padding: '14px 18px',
                                    background: gc.bg,
                                    borderBottom: `1px solid ${gc.border}`,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{
                                            width: '32px', height: '32px',
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--color-primary-500)',
                                            color: 'white',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '14px', fontWeight: 800
                                        }}>
                                            {idx + 1}
                                        </div>
                                        <span style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
                                            {sapi.kode_sapi}
                                        </span>
                                    </div>
                                    <BadgeGrade grade={sapi.grade} size="sm" />
                                </div>

                                {/* Body */}
                                <div style={{ padding: '18px' }}>
                                    {/* Info Grid */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr 1fr',
                                        gap: '10px',
                                        marginBottom: '14px'
                                    }}>
                                        <div style={{
                                            padding: '10px',
                                            backgroundColor: 'var(--color-bg-secondary)',
                                            borderRadius: 'var(--radius-md)',
                                            textAlign: 'center'
                                        }}>
                                            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>BERAT</div>
                                            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)', marginTop: '2px' }}>
                                                {sapi.berat_kg} kg
                                            </div>
                                        </div>
                                        <div style={{
                                            padding: '10px',
                                            backgroundColor: 'var(--color-bg-secondary)',
                                            borderRadius: 'var(--radius-md)',
                                            textAlign: 'center'
                                        }}>
                                            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>HARGA</div>
                                            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)', marginTop: '2px' }}>
                                                {parseFloat(sapi.harga / 1000000).toFixed(1)}jt
                                            </div>
                                        </div>
                                        <div style={{
                                            padding: '10px',
                                            backgroundColor: sc.bg,
                                            borderRadius: 'var(--radius-md)',
                                            textAlign: 'center'
                                        }}>
                                            <div style={{ fontSize: '11px', color: sc.color, fontWeight: 600 }}>STATUS</div>
                                            <div style={{ fontSize: '12px', fontWeight: 700, color: sc.color, marginTop: '2px' }}>
                                                {sapi.status}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Score Bar */}
                                    <div style={{ marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                                            <span>Skor SAW</span>
                                            <span style={{ color: 'var(--color-primary-600)', fontWeight: 700 }}>{sapi.skor_saw}/100</span>
                                        </div>
                                        <div style={{
                                            width: '100%', height: '6px',
                                            backgroundColor: 'var(--color-border-light)',
                                            borderRadius: '999px', overflow: 'hidden'
                                        }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${sapi.skor_saw}%` }}
                                                transition={{ duration: 0.8, delay: 0.2 + idx * 0.05 }}
                                                style={{
                                                    height: '100%',
                                                    background: 'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-600))',
                                                    borderRadius: '999px'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => { setSelectedSapi(sapi); setShowSAW(true); }}
                                            style={{
                                                padding: '8px 14px',
                                                borderRadius: 'var(--radius-md)',
                                                border: '1px solid var(--color-primary-300)',
                                                backgroundColor: 'var(--color-primary-50)',
                                                color: 'var(--color-primary-600)',
                                                fontSize: '12px', fontWeight: 600, cursor: 'pointer'
                                            }}
                                        >
                                            ? Detail
                                        </motion.button>
                                        <Link href={`/admin/sapi/edit/${sapi.id}`} style={{ flex: 1 }}>
                                            <motion.div
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                style={{
                                                    padding: '8px 14px',
                                                    borderRadius: 'var(--radius-md)',
                                                    backgroundColor: 'var(--color-primary-500)',
                                                    color: 'white',
                                                    fontSize: '12px', fontWeight: 600,
                                                    textAlign: 'center', cursor: 'pointer'
                                                }}
                                            >
                                                ✏️ Edit
                                            </motion.div>
                                        </Link>
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => handleDelete(sapi.id, sapi.kode_sapi)}
                                            style={{
                                                padding: '8px 14px',
                                                borderRadius: 'var(--radius-md)',
                                                border: '1px solid #fecaca',
                                                backgroundColor: '#fef2f2',
                                                color: '#dc2626',
                                                fontSize: '12px', fontWeight: 600, cursor: 'pointer'
                                            }}
                                        >
                                            🗑️
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}

            <ModalDetailSAW isOpen={showSAW} onClose={() => setShowSAW(false)} sapi={selectedSapi} />
        </div>
    );
}
