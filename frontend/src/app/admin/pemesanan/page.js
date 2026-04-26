'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/services/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Modal from '@/components/common/Modal';
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

export default function PemesananPage() {
    const [daftar, setDaftar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('Semua');

    // Modal WA Manual
    const [showWAModal, setShowWAModal] = useState(false);
    const [waTarget, setWaTarget] = useState(null);
    const [waPesan, setWaPesan] = useState('');
    const [loadingWA, setLoadingWA] = useState(false);

    useEffect(() => { fetchPemesanan(); }, []);

    const fetchPemesanan = async () => {
        try {
            const res = await api.get('/pemesanan');
            setDaftar(res.data.data || []);
        } catch (err) {
            toast.error('Gagal mengambil data pemesanan.');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        const aksi = status === 'Confirmed' ? 'mengkonfirmasi' : 'membatalkan';
        if (!confirm(`Yakin ingin ${aksi} pemesanan ini?`)) return;

        try {
            await api.put(`/pemesanan/${id}/status`, { status });
            toast.success(status === 'Confirmed'
                ? 'Pemesanan dikonfirmasi! Notifikasi WA dikirim.'
                : 'Pemesanan dibatalkan. Notifikasi WA dikirim.');
            fetchPemesanan();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal update status.');
        }
    };

    const openWAModal = (p) => {
        setWaTarget(p);
        setWaPesan('');
        setShowWAModal(true);
    };

    const kirimWA = async () => {
        if (!waPesan.trim()) return toast.error('Pesan tidak boleh kosong.');
        setLoadingWA(true);
        try {
            await api.post(`/pemesanan/${waTarget.id}/kirim-wa`, { pesan: waPesan });
            toast.success(`Pesan WA terkirim ke ${waTarget.nama_pelanggan}!`);
            setShowWAModal(false);
        } catch (err) {
            toast.error('Gagal mengirim pesan WA.');
        } finally {
            setLoadingWA(false);
        }
    };

    const statusConfig = {
        'Menunggu Pembayaran': { bg: '#dbeafe', color: '#2563eb', label: '💳 Menunggu Pembayaran', border: '#bfdbfe' },
        Pending: { bg: '#fef3c7', color: '#d97706', label: '⏳ Pending', border: '#fde68a' },
        Confirmed: { bg: '#dcfce7', color: '#16a34a', label: '✅ Dikonfirmasi', border: '#bbf7d0' },
        Cancelled: { bg: '#fee2e2', color: '#dc2626', label: '❌ Dibatalkan', border: '#fecaca' },
        Expired: { bg: '#f1f5f9', color: '#64748b', label: '⏰ Kadaluarsa', border: '#e2e8f0' }
    };

    const statusTabs = ['Semua', 'Pending', 'Menunggu Pembayaran', 'Confirmed', 'Cancelled', 'Expired'];

    const filtered = filterStatus === 'Semua'
        ? daftar
        : daftar.filter(p => p.status === filterStatus);

    if (loading) return <LoadingSpinner text="Memuat pemesanan..." />;

    return (
        <div>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ marginBottom: '20px' }}
            >
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text)' }}>
                    Manajemen Pemesanan
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    {daftar.length} total pemesanan
                </p>
            </motion.div>

            {/* Filter Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}
            >
                {statusTabs.map(s => {
                    const count = s === 'Semua' ? daftar.length : daftar.filter(p => p.status === s).length;
                    return (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            style={{
                                padding: '7px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 600,
                                border: '1px solid',
                                borderColor: filterStatus === s ? 'var(--color-primary-500)' : 'var(--color-border)',
                                backgroundColor: filterStatus === s ? 'var(--color-primary-500)' : 'var(--color-bg-card)',
                                color: filterStatus === s ? 'white' : 'var(--color-text-secondary)',
                                cursor: 'pointer', transition: 'all 0.2s ease'
                            }}
                        >
                            {s} ({count})
                        </button>
                    );
                })}
            </motion.div>

            {filtered.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                        textAlign: 'center', padding: '60px 20px',
                        backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)'
                    }}
                >
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text)' }}>
                        {filterStatus === 'Semua' ? 'Belum ada pemesanan.' : `Tidak ada pemesanan ${filterStatus}.`}
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    variants={container} initial="hidden" animate="show"
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}
                >
                    {filtered.map((p) => {
                        const sc = statusConfig[p.status] || statusConfig.Pending;
                        const sisaMs = new Date(p.kadaluarsa_pada).getTime() - Date.now();
                        const sisaJam = Math.max(0, Math.floor(sisaMs / (1000 * 60 * 60)));
                        const sisaMenit = Math.max(0, Math.floor((sisaMs % (1000 * 60 * 60)) / (1000 * 60)));
                        const canConfirm = p.status === 'Pending';
                        const canCancel = ['Pending', 'Menunggu Pembayaran'].includes(p.status);

                        return (
                            <motion.div
                                key={p.id} variants={item}
                                whileHover={{ y: -6, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-xl)',
                                    border: '1px solid var(--color-border-light)', overflow: 'hidden',
                                    boxShadow: 'var(--shadow-card)', cursor: 'default'
                                }}
                            >
                                {/* Status Header */}
                                <div style={{
                                    padding: '12px 18px', backgroundColor: sc.bg, borderBottom: `1px solid ${sc.border}`,
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                }}>
                                    <span style={{ fontSize: '13px', fontWeight: 700, color: sc.color }}>{sc.label}</span>
                                    <span style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'monospace', color: sc.color, opacity: 0.8 }}>
                                        {p.kode_pemesanan}
                                    </span>
                                </div>

                                {/* Body */}
                                <div style={{ padding: '18px' }}>
                                    {/* Pelanggan + Metode */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                                        <div>
                                            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '2px' }}>PELANGGAN</div>
                                            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)' }}>{p.nama_pelanggan}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>📱 {p.no_wa}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '4px' }}>METODE</div>
                                            <span style={{
                                                padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                                                backgroundColor: p.metode_pembayaran === 'midtrans' ? '#eff6ff' : '#f0fdf4',
                                                color: p.metode_pembayaran === 'midtrans' ? '#2563eb' : '#16a34a',
                                                border: `1px solid ${p.metode_pembayaran === 'midtrans' ? '#bfdbfe' : '#bbf7d0'}`
                                            }}>
                                                {p.metode_pembayaran === 'midtrans' ? '💳 Online' : '🏪 Di Tempat'}
                                            </span>
                                            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                                                {new Date(p.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sapi Info */}
                                    {p.sapi && (
                                        <div style={{
                                            padding: '12px 14px', backgroundColor: 'var(--color-bg-secondary)',
                                            borderRadius: 'var(--radius-md)', marginBottom: '14px',
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                        }}>
                                            <div>
                                                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>🐄 {p.sapi.kode_sapi}</span>
                                                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginLeft: '8px' }}>Skor {p.sapi.skor_saw}</span>
                                            </div>
                                            <span style={{
                                                padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 700,
                                                backgroundColor: p.sapi.grade === 'Platinum' ? 'var(--color-platinum-bg)' : p.sapi.grade === 'Gold' ? 'var(--color-gold-bg)' : p.sapi.grade === 'Bronze' ? 'var(--color-bronze-bg)' : 'var(--color-silver-bg)',
                                                color: p.sapi.grade === 'Platinum' ? 'var(--color-platinum)' : p.sapi.grade === 'Gold' ? 'var(--color-gold)' : p.sapi.grade === 'Bronze' ? 'var(--color-bronze)' : 'var(--color-silver)'
                                            }}>
                                                {p.sapi.grade}
                                            </span>
                                        </div>
                                    )}

                                    {/* Countdown */}
                                    {['Pending', 'Menunggu Pembayaran'].includes(p.status) && (
                                        <div style={{
                                            padding: '8px 12px', backgroundColor: sisaMs > 0 ? '#fffbeb' : '#fef2f2',
                                            borderRadius: 'var(--radius-sm)', fontSize: '12px',
                                            color: sisaMs > 0 ? '#92400e' : '#dc2626',
                                            fontWeight: 500, marginBottom: '14px', textAlign: 'center'
                                        }}>
                                            {sisaMs > 0 ? `⏰ Sisa waktu: ${sisaJam}j ${sisaMenit}m` : '⚠️ Waktu booking sudah habis!'}
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    {(canConfirm || canCancel) && (
                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                            {canConfirm && (
                                                <motion.button
                                                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                                    onClick={() => updateStatus(p.id, 'Confirmed')}
                                                    style={{
                                                        flex: 1, padding: '10px', borderRadius: 'var(--radius-md)',
                                                        border: 'none', backgroundColor: '#10b981', color: 'white',
                                                        fontSize: '13px', fontWeight: 600, cursor: 'pointer'
                                                    }}
                                                >
                                                    ✓ Konfirmasi
                                                </motion.button>
                                            )}
                                            {canCancel && (
                                                <motion.button
                                                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                                    onClick={() => updateStatus(p.id, 'Cancelled')}
                                                    style={{
                                                        flex: 1, padding: '10px', borderRadius: 'var(--radius-md)',
                                                        border: '1px solid #fecaca', backgroundColor: '#fef2f2',
                                                        color: '#dc2626', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
                                                    }}
                                                >
                                                    ✕ Batalkan
                                                </motion.button>
                                            )}
                                        </div>
                                    )}

                                    {/* Tombol Kirim WA */}
                                    <button
                                        onClick={() => openWAModal(p)}
                                        style={{
                                            width: '100%', padding: '8px', borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)',
                                            color: 'var(--color-text-secondary)', fontSize: '12px', fontWeight: 600,
                                            cursor: 'pointer', transition: 'all 0.2s ease'
                                        }}
                                    >
                                        📱 Kirim Pesan WA
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}

            {/* Modal Kirim WA Manual */}
            <Modal judul="Kirim Pesan WhatsApp" isOpen={showWAModal} onClose={() => setShowWAModal(false)} lebar="420px">
                {waTarget && (
                    <div>
                        <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                            Kirim pesan ke <strong>{waTarget.nama_pelanggan}</strong> ({waTarget.no_wa})
                        </div>
                        <textarea
                            value={waPesan}
                            onChange={(e) => setWaPesan(e.target.value)}
                            placeholder="Tulis pesan untuk customer..."
                            rows={5}
                            style={{
                                width: '100%', padding: '12px', borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)',
                                color: 'var(--color-text)', fontSize: '14px', outline: 'none',
                                resize: 'vertical', fontFamily: 'inherit'
                            }}
                        />
                        <button
                            onClick={kirimWA}
                            disabled={loadingWA || !waPesan.trim()}
                            style={{
                                width: '100%', padding: '12px', marginTop: '12px',
                                borderRadius: 'var(--radius-md)', border: 'none',
                                backgroundColor: loadingWA || !waPesan.trim() ? 'var(--color-primary-300)' : '#25D366',
                                color: 'white', fontSize: '14px', fontWeight: 600,
                                cursor: loadingWA || !waPesan.trim() ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loadingWA ? 'Mengirim...' : '📱 Kirim via WhatsApp'}
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
}
