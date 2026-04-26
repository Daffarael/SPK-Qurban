'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/services/api';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import BadgeGrade from '@/components/common/BadgeGrade';
import toast from 'react-hot-toast';

export default function CekPemesananPage() {
    const [mode, setMode] = useState('kode'); // 'kode' atau 'wa'
    const [input, setInput] = useState('');
    const [results, setResults] = useState([]); // array: bisa 1 atau banyak
    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [riwayatKode, setRiwayatKode] = useState([]);

    // Load riwayat kode dari localStorage
    useEffect(() => {
        const saved = localStorage.getItem('riwayat_pemesanan');
        if (saved) {
            try {
                setRiwayatKode(JSON.parse(saved));
            } catch (e) { }
        }
    }, []);

    const handleCek = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setLoading(true);
        setResults([]);
        setNotFound(false);

        try {
            if (mode === 'kode') {
                const res = await api.get(`/pemesanan/cek/${input.trim()}`);
                setResults([res.data.data]);
            } else {
                const res = await api.get(`/pemesanan/cek-wa/${input.trim()}`);
                setResults(res.data.data.map(p => ({
                    ...p,
                    kode_pemesanan: p.kode_pemesanan,
                    nama_pelanggan: p.nama_pelanggan,
                    no_wa: p.no_wa,
                    status: p.status,
                    kadaluarsa_pada: p.kadaluarsa_pada,
                    tanggal_pemesanan: p.tanggal_pemesanan
                })));
            }
        } catch (err) {
            setNotFound(true);
            toast.error(mode === 'kode' ? 'Kode pemesanan tidak ditemukan.' : 'Tidak ada pemesanan dengan nomor WA tersebut.');
        } finally {
            setLoading(false);
        }
    };

    // Cek cepat dari riwayat
    const cekDariRiwayat = async (kode) => {
        setMode('kode');
        setInput(kode);
        setLoading(true);
        setResults([]);
        setNotFound(false);

        try {
            const res = await api.get(`/pemesanan/cek/${kode}`);
            setResults([res.data.data]);
        } catch {
            setNotFound(true);
        } finally {
            setLoading(false);
        }
    };

    const statusConfig = {
        'Menunggu Pembayaran': { bg: '#dbeafe', color: '#2563eb', label: 'Menunggu Pembayaran', icon: '💳' },
        Pending: { bg: '#fef3c7', color: '#d97706', label: 'Menunggu Konfirmasi', icon: '⏳' },
        Confirmed: { bg: '#dcfce7', color: '#16a34a', label: 'Dikonfirmasi', icon: '✅' },
        Cancelled: { bg: '#fee2e2', color: '#dc2626', label: 'Dibatalkan', icon: '❌' },
        Expired: { bg: '#f1f5f9', color: '#64748b', label: 'Kadaluarsa', icon: '⏰' }
    };

    return (
        <>
            <Navbar />
            <main style={{
                maxWidth: '650px',
                margin: '0 auto',
                padding: '60px 24px 80px',
                minHeight: 'calc(100vh - 140px)'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: '28px' }}
                >
                    <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text)', marginBottom: '6px' }}>
                        Cek Status Pemesanan
                    </h1>
                    <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)' }}>
                        Cek status pemesanan Anda menggunakan kode atau nomor WhatsApp
                    </p>
                </motion.div>

                {/* Toggle Mode */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{
                        display: 'flex',
                        gap: '4px',
                        padding: '4px',
                        backgroundColor: 'var(--color-bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '16px',
                        border: '1px solid var(--color-border-light)'
                    }}
                >
                    <button
                        onClick={() => { setMode('kode'); setInput(''); setResults([]); setNotFound(false); }}
                        style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: 'var(--radius-sm)',
                            border: 'none',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            backgroundColor: mode === 'kode' ? 'var(--color-bg-card)' : 'transparent',
                            color: mode === 'kode' ? 'var(--color-primary-500)' : 'var(--color-text-muted)',
                            boxShadow: mode === 'kode' ? 'var(--shadow-sm)' : 'none',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        🔑 Kode Pemesanan
                    </button>
                    <button
                        onClick={() => { setMode('wa'); setInput(''); setResults([]); setNotFound(false); }}
                        style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: 'var(--radius-sm)',
                            border: 'none',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            backgroundColor: mode === 'wa' ? 'var(--color-bg-card)' : 'transparent',
                            color: mode === 'wa' ? 'var(--color-primary-500)' : 'var(--color-text-muted)',
                            boxShadow: mode === 'wa' ? 'var(--shadow-sm)' : 'none',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        📱 Nomor WhatsApp
                    </button>
                </motion.div>

                {/* Search Form */}
                <motion.form
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    onSubmit={handleCek}
                    style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(mode === 'kode' ? e.target.value.toUpperCase() : e.target.value)}
                        placeholder={mode === 'kode'
                            ? 'Masukkan kode (contoh: GHF-QURBAN-001)'
                            : 'Masukkan nomor WA (contoh: 628xxxxxxxxxx)'
                        }
                        style={{
                            flex: 1,
                            padding: '12px 16px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)',
                            backgroundColor: 'var(--color-bg)',
                            color: 'var(--color-text)',
                            fontSize: '14px',
                            outline: 'none',
                            fontFamily: mode === 'kode' ? 'monospace' : 'inherit',
                            letterSpacing: mode === 'kode' ? '1px' : 'normal'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '12px 24px',
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            backgroundColor: 'var(--color-primary-500)',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {loading ? '...' : 'Cek'}
                    </button>
                </motion.form>

                {/* Riwayat Pemesanan dari localStorage */}
                {riwayatKode.length > 0 && results.length === 0 && !notFound && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            padding: '16px',
                            backgroundColor: 'var(--color-bg-card)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--color-border-light)',
                            marginBottom: '20px'
                        }}
                    >
                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '10px' }}>
                            📋 RIWAYAT PEMESANAN ANDA
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {riwayatKode.map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => cekDariRiwayat(item.kode)}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '10px 14px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--color-border-light)',
                                        backgroundColor: 'var(--color-bg-secondary)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <span style={{
                                        fontFamily: 'monospace',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        color: 'var(--color-primary-500)'
                                    }}>
                                        {item.kode}
                                    </span>
                                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                                        {new Date(item.tanggal).toLocaleDateString('id-ID')}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Not Found */}
                {notFound && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            textAlign: 'center',
                            padding: '40px',
                            backgroundColor: 'var(--color-bg-card)',
                            borderRadius: 'var(--radius-xl)',
                            border: '1px solid var(--color-border-light)'
                        }}
                    >
                        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text)' }}>
                            Pemesanan tidak ditemukan
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                            {mode === 'kode'
                                ? 'Pastikan kode pemesanan yang Anda masukkan benar.'
                                : 'Pastikan nomor WhatsApp yang Anda masukkan sesuai saat memesan.'}
                        </div>
                    </motion.div>
                )}

                {/* Results */}
                {results.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {mode === 'wa' && results.length > 1 && (
                            <div style={{
                                fontSize: '13px',
                                color: 'var(--color-text-secondary)',
                                fontWeight: 500
                            }}>
                                Ditemukan <strong>{results.length}</strong> pemesanan
                            </div>
                        )}

                        {results.map((data, idx) => {
                            const item = data.pemesanan || data;
                            const sapi = data.sapi || item.sapi;
                            const sc = statusConfig[item.status] || statusConfig.Pending;

                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.08 }}
                                    style={{
                                        backgroundColor: 'var(--color-bg-card)',
                                        borderRadius: 'var(--radius-xl)',
                                        border: '1px solid var(--color-border-light)',
                                        overflow: 'hidden',
                                        boxShadow: 'var(--shadow-md)'
                                    }}
                                >
                                    {/* Status Banner */}
                                    <div style={{
                                        padding: '16px 20px',
                                        backgroundColor: sc.bg,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        borderBottom: `2px solid ${sc.color}30`
                                    }}>
                                        <span style={{ fontSize: '24px' }}>{sc.icon}</span>
                                        <div>
                                            <div style={{ fontSize: '16px', fontWeight: 700, color: sc.color }}>
                                                {sc.label}
                                            </div>
                                            <div style={{ fontSize: '12px', color: `${sc.color}cc` }}>
                                                {item.kode_pemesanan}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div style={{ padding: '20px' }}>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '14px',
                                            marginBottom: '14px'
                                        }}>
                                            <div>
                                                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Nama</div>
                                                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
                                                    {item.nama_pelanggan}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>WhatsApp</div>
                                                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
                                                    {item.no_wa}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Tanggal Pesan</div>
                                                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
                                                    {new Date(item.tanggal_pemesanan || item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Berlaku Hingga</div>
                                                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
                                                    {item.kadaluarsa_pada
                                                        ? new Date(item.kadaluarsa_pada).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                                                        : '-'
                                                    }
                                                </div>
                                            </div>
                                            {item.metode_pembayaran && (
                                                <div>
                                                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Metode</div>
                                                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
                                                        {item.metode_pembayaran === 'midtrans' ? '💳 Online' : '🏪 Di Tempat'}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {sapi && (
                                            <div style={{
                                                padding: '14px',
                                                backgroundColor: 'var(--color-bg-secondary)',
                                                borderRadius: 'var(--radius-md)'
                                            }}>
                                                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                                                    SAPI YANG DIPESAN
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div>
                                                        <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)' }}>
                                                            {sapi.kode_sapi}
                                                        </span>
                                                        <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginLeft: '8px' }}>
                                                            {sapi.berat_kg} kg — Rp {parseFloat(sapi.harga).toLocaleString('id-ID')}
                                                        </span>
                                                    </div>
                                                    <BadgeGrade grade={sapi.grade} size="sm" />
                                                </div>
                                            </div>
                                        )}

                                        {['Pending', 'Menunggu Pembayaran'].includes(item.status) && item.kadaluarsa_pada && (
                                            <div style={{
                                                marginTop: '12px',
                                                padding: '10px 14px',
                                                backgroundColor: '#fffbeb',
                                                borderRadius: 'var(--radius-md)',
                                                border: '1px solid #fde68a',
                                                fontSize: '12px',
                                                color: '#92400e'
                                            }}>
                                                ⏰ Segera hubungi admin untuk konfirmasi pembayaran sebelum masa booking habis.
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
