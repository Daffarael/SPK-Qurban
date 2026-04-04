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

export default function SapiTidakLolosPage() {
    const [daftarSapi, setDaftarSapi] = useState([]);
    const [semuaSapi, setSemuaSapi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSapi, setSelectedSapi] = useState(null);
    const [showSAW, setShowSAW] = useState(false);

    useEffect(() => {
        fetchSapi();
    }, []);

    const fetchSapi = async () => {
        try {
            const res = await api.get('/sapi');
            const semua = res.data.data || [];
            const tidakLolos = semua.filter(s => !s.skor_saw || s.skor_saw < 60);
            setSemuaSapi(semua);
            setDaftarSapi(tidakLolos);
        } catch (err) {
            toast.error('Gagal mengambil data.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, kode) => {
        if (!confirm(`Hapus sapi ${kode}?`)) return;
        try {
            await api.delete(`/sapi/${id}`);
            toast.success(`Sapi ${kode} berhasil dihapus.`);
            fetchSapi();
        } catch (err) {
            toast.error('Gagal menghapus.');
        }
    };

    if (loading) return <LoadingSpinner text="Memuat data..." />;

    return (
        <div>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ marginBottom: '24px' }}
            >
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text)' }}>
                    ⚠️ Sapi Tidak Lolos Syarat
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    {daftarSapi.length} sapi dengan skor SAW &lt; 60 — Edit data untuk meningkatkan skor
                </p>
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
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text)' }}>
                        Semua sapi memenuhi syarat!
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        Tidak ada sapi dengan skor di bawah 60.
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '16px'
                    }}
                >
                    {daftarSapi.map((sapi) => (
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
                            {/* Score Header - merah karena tidak lolos */}
                            <div style={{
                                padding: '12px 18px',
                                background: 'linear-gradient(135deg, #fef2f2, #fff1f2)',
                                borderBottom: '1px solid #fecaca',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
                                    {sapi.kode_sapi}
                                </span>
                                <span style={{
                                    padding: '3px 10px',
                                    borderRadius: '999px',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    backgroundColor: '#fee2e2',
                                    color: '#dc2626'
                                }}>
                                    Skor: {sapi.skor_saw || 0}
                                </span>
                            </div>

                            {/* Body */}
                            <div style={{ padding: '18px' }}>
                                {/* Info Grid */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '12px',
                                    marginBottom: '14px'
                                }}>
                                    <div style={{
                                        padding: '10px 12px',
                                        backgroundColor: 'var(--color-bg-secondary)',
                                        borderRadius: 'var(--radius-md)',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>BERAT</div>
                                        <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)', marginTop: '2px' }}>
                                            {sapi.berat_kg} kg
                                        </div>
                                    </div>
                                    <div style={{
                                        padding: '10px 12px',
                                        backgroundColor: 'var(--color-bg-secondary)',
                                        borderRadius: 'var(--radius-md)',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>HARGA</div>
                                        <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)', marginTop: '2px' }}>
                                            Rp {parseFloat(sapi.harga).toLocaleString('id-ID')}
                                        </div>
                                    </div>
                                </div>

                                {/* Score Bar */}
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                                        <span>Skor SAW</span>
                                        <span style={{ color: '#dc2626', fontWeight: 600 }}>{sapi.skor_saw || 0}/100 (Min. 60)</span>
                                    </div>
                                    <div style={{
                                        width: '100%', height: '6px',
                                        backgroundColor: 'var(--color-border-light)',
                                        borderRadius: '999px', overflow: 'hidden'
                                    }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${sapi.skor_saw || 0}%` }}
                                            transition={{ duration: 0.8, delay: 0.3 }}
                                            style={{
                                                height: '100%',
                                                background: 'linear-gradient(90deg, #ef4444, #f97316)',
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
                                            flex: 0, padding: '8px 14px',
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
                                            ✏️ Edit Sapi
                                        </motion.div>
                                    </Link>
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => handleDelete(sapi.id, sapi.kode_sapi)}
                                        style={{
                                            flex: 0, padding: '8px 14px',
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
                    ))}
                </motion.div>
            )}

            <ModalDetailSAW isOpen={showSAW} onClose={() => setShowSAW(false)} sapi={selectedSapi} semuaSapi={semuaSapi} />
        </div>
    );
}
