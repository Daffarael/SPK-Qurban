'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/services/api';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import BadgeGrade from '@/components/common/BadgeGrade';
import Modal from '@/components/common/Modal';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const KRITERIA_LABELS = [
    { key: 'c1_bobot', nama: 'Berat Badan', icon: '⚖️' },
    { key: 'c2_bcs', nama: 'Kondisi Tubuh', icon: '💪' },
    { key: 'c3_postur', nama: 'Bentuk & Postur', icon: '📐' },
    { key: 'c4_vitalitas', nama: 'Kesehatan', icon: '❤️' },
    { key: 'c5_kaki', nama: 'Kekuatan Kaki', icon: '🦵' },
    { key: 'c6_temperamen', nama: 'Ketenangan', icon: '🧘' }
];

export default function DetailSapiPage() {
    const params = useParams();
    const router = useRouter();
    const [sapi, setSapi] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPesan, setShowPesan] = useState(false);
    const [formPesan, setFormPesan] = useState({ nama_pelanggan: '', no_wa: '' });
    const [loadingPesan, setLoadingPesan] = useState(false);

    useEffect(() => {
        fetchSapi();
    }, [params.id]);

    const fetchSapi = async () => {
        try {
            const res = await api.get(`/sapi/publik/${params.id}`);
            setSapi(res.data.data);
        } catch (err) {
            toast.error('Sapi tidak ditemukan.');
            router.push('/katalog');
        } finally {
            setLoading(false);
        }
    };

    const handlePesan = async (e) => {
        e.preventDefault();
        setLoadingPesan(true);
        try {
            const res = await api.post('/pemesanan', {
                sapi_id: sapi.id,
                nama_pelanggan: formPesan.nama_pelanggan,
                no_wa: formPesan.no_wa
            });
            const kode = res.data.data.pemesanan.kode_pemesanan;

            // Simpan kode ke localStorage agar user tidak lupa
            try {
                const saved = JSON.parse(localStorage.getItem('riwayat_pemesanan') || '[]');
                saved.unshift({ kode, tanggal: new Date().toISOString() });
                localStorage.setItem('riwayat_pemesanan', JSON.stringify(saved.slice(0, 10))); // max 10
            } catch (e) { }

            router.push(`/pemesanan-sukses?kode=${kode}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal membuat pemesanan.');
        } finally {
            setLoadingPesan(false);
        }
    };

    const fotoUrl = sapi?.foto_url
        ? `http://localhost:5000${sapi.foto_url}`
        : null;

    if (loading) return (
        <>
            <Navbar />
            <div style={{ padding: '80px 24px' }}>
                <LoadingSpinner text="Memuat detail sapi..." />
            </div>
        </>
    );

    if (!sapi) return null;

    const inputStyle = {
        width: '100%',
        padding: '10px 14px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text)',
        fontSize: '14px',
        outline: 'none'
    };

    return (
        <>
            <Navbar />
            <main style={{
                maxWidth: '1000px',
                margin: '0 auto',
                padding: '40px 24px 80px'
            }}>
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => router.push('/katalog')}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-bg-card)',
                        color: 'var(--color-text-secondary)',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        marginBottom: '24px'
                    }}
                >
                    ← Kembali ke Katalog
                </motion.button>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 400px',
                    gap: '28px',
                    alignItems: 'start'
                }}>
                    {/* Kolom Kiri - Foto & Kriteria */}
                    <div>
                        {/* Foto */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{
                                width: '100%',
                                height: '350px',
                                borderRadius: 'var(--radius-xl)',
                                overflow: 'hidden',
                                backgroundColor: 'var(--color-bg-secondary)',
                                marginBottom: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid var(--color-border-light)'
                            }}
                        >
                            {fotoUrl ? (
                                <img src={fotoUrl} alt={sapi.kode_sapi} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                    <div style={{ fontSize: '60px', marginBottom: '8px' }}>🐄</div>
                                    <div style={{ fontSize: '14px' }}>Foto belum tersedia</div>
                                </div>
                            )}
                        </motion.div>

                        {/* Kriteria Detail */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            style={{
                                backgroundColor: 'var(--color-bg-card)',
                                borderRadius: 'var(--radius-xl)',
                                padding: '24px',
                                border: '1px solid var(--color-border-light)'
                            }}
                        >
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: 700,
                                color: 'var(--color-text)',
                                marginBottom: '20px'
                            }}>
                                Penilaian Kualitas
                            </h3>

                            {KRITERIA_LABELS.map((k, i) => {
                                const nilai = sapi[k.key];
                                return (
                                    <motion.div
                                        key={k.kode}
                                        initial={{ opacity: 0, x: -15 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + i * 0.06 }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '14px',
                                            padding: '12px 0',
                                            borderBottom: i < KRITERIA_LABELS.length - 1 ? '1px solid var(--color-border-light)' : 'none'
                                        }}
                                    >
                                        <span style={{ fontSize: '22px' }}>{k.icon}</span>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>
                                                {k.nama}
                                            </div>
                                            <div style={{
                                                marginTop: '6px',
                                                display: 'flex',
                                                gap: '3px'
                                            }}>
                                                {[1, 2, 3, 4, 5].map(n => (
                                                    <div key={n} style={{
                                                        width: '100%',
                                                        height: '6px',
                                                        borderRadius: '999px',
                                                        backgroundColor: n <= nilai ? 'var(--color-primary-500)' : 'var(--color-border-light)',
                                                        transition: 'all 0.3s ease'
                                                    }} />
                                                ))}
                                            </div>
                                        </div>
                                        <span style={{
                                            fontSize: '16px',
                                            fontWeight: 700,
                                            color: 'var(--color-primary-500)',
                                            minWidth: '32px',
                                            textAlign: 'right'
                                        }}>
                                            {nilai}/5
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>

                    {/* Kolom Kanan - Info & Pesan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        style={{ position: 'sticky', top: '90px' }}
                    >
                        <div style={{
                            backgroundColor: 'var(--color-bg-card)',
                            borderRadius: 'var(--radius-xl)',
                            padding: '28px',
                            border: '1px solid var(--color-border-light)',
                            boxShadow: 'var(--shadow-md)'
                        }}>
                            {/* Kode & Grade */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '16px'
                            }}>
                                <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-text)' }}>
                                    {sapi.kode_sapi}
                                </h1>
                                <BadgeGrade grade={sapi.grade} />
                            </div>

                            {/* Jenis Sapi */}
                            {sapi.jenisSapi && (
                                <div style={{
                                    display: 'inline-block',
                                    padding: '5px 14px',
                                    borderRadius: '999px',
                                    backgroundColor: 'var(--color-primary-50)',
                                    color: 'var(--color-primary-700)',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    marginBottom: '16px',
                                    border: '1px solid var(--color-primary-100)'
                                }}>
                                    🏷️ {sapi.jenisSapi.nama}
                                </div>
                            )}

                            {/* SAW Score */}
                            <div style={{
                                textAlign: 'center',
                                padding: '20px',
                                backgroundColor: 'var(--color-bg-secondary)',
                                borderRadius: 'var(--radius-lg)',
                                marginBottom: '20px'
                            }}>
                                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '4px' }}>
                                    SKOR KUALITAS
                                </div>
                                <div style={{
                                    fontSize: '42px',
                                    fontWeight: 800,
                                    background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    lineHeight: 1
                                }}>
                                    {sapi.skor_saw}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                                    dari 100
                                </div>
                            </div>

                            {/* Details */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '12px',
                                marginBottom: '12px'
                            }}>
                                <div style={{
                                    padding: '14px',
                                    backgroundColor: 'var(--color-bg-secondary)',
                                    borderRadius: 'var(--radius-md)',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Berat</div>
                                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)' }}>
                                        {sapi.berat_kg} kg
                                    </div>
                                </div>
                                <div style={{
                                    padding: '14px',
                                    backgroundColor: 'var(--color-bg-secondary)',
                                    borderRadius: 'var(--radius-md)',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Harga</div>
                                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)' }}>
                                        Rp {parseFloat(sapi.harga).toLocaleString('id-ID')}
                                    </div>
                                </div>
                            </div>

                            {/* Jenis Sapi Info Box */}
                            {sapi.jenisSapi && (
                                <div style={{
                                    padding: '14px',
                                    backgroundColor: 'var(--color-bg-secondary)',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '20px'
                                }}>
                                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Jenis/Ras Sapi</div>
                                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)' }}>
                                        {sapi.jenisSapi.nama}
                                    </div>
                                </div>
                            )}

                            {/* Status */}
                            {sapi.status !== 'Available' ? (
                                <div style={{
                                    padding: '14px',
                                    borderRadius: 'var(--radius-md)',
                                    backgroundColor: '#fef3c7',
                                    color: '#92400e',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    textAlign: 'center'
                                }}>
                                    ⚠️ Sapi ini sedang {sapi.status === 'Booked' ? 'dipesan' : 'terjual'}
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowPesan(true)}
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        borderRadius: 'var(--radius-md)',
                                        border: 'none',
                                        background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))',
                                        color: 'white',
                                        fontSize: '15px',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 14px rgba(14, 165, 233, 0.35)',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    Pesan Sekarang
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />

            {/* Modal Pemesanan */}
            <Modal judul="Form Pemesanan" isOpen={showPesan} onClose={() => setShowPesan(false)} lebar="420px">
                <div style={{
                    padding: '8px 0 0',
                    fontSize: '13px',
                    color: 'var(--color-text-secondary)',
                    marginBottom: '20px'
                }}>
                    Anda akan memesan <strong>{sapi.kode_sapi}</strong> ({sapi.grade}).
                    Pemesanan berlaku <strong>48 jam</strong>.
                </div>

                <form onSubmit={handlePesan}>
                    <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                            Nama Lengkap *
                        </label>
                        <input
                            type="text"
                            value={formPesan.nama_pelanggan}
                            onChange={(e) => setFormPesan({ ...formPesan, nama_pelanggan: e.target.value })}
                            placeholder="Masukkan nama lengkap"
                            required
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                            Nomor WhatsApp *
                        </label>
                        <input
                            type="text"
                            value={formPesan.no_wa}
                            onChange={(e) => setFormPesan({ ...formPesan, no_wa: e.target.value })}
                            placeholder="628xxxxxxxxxx"
                            required
                            style={inputStyle}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loadingPesan}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            backgroundColor: loadingPesan ? 'var(--color-primary-300)' : 'var(--color-primary-500)',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: loadingPesan ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loadingPesan ? 'Memproses...' : 'Konfirmasi Pemesanan'}
                    </button>
                </form>
            </Modal>
        </>
    );
}
