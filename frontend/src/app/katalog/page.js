'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import api, { BACKEND_URL } from '@/services/api';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import BadgeGrade from '@/components/common/BadgeGrade';
import LoadingSpinner from '@/components/common/LoadingSpinner';

function KartuSapi({ sapi, rank, delay = 0 }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-30px' });

    const fotoUrl = sapi.foto_url
        ? `${BACKEND_URL}${sapi.foto_url}`
        : null;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay }}
        >
            <Link href={`/katalog/${sapi.id}`} style={{ textDecoration: 'none' }}>
                <motion.div
                    whileHover={{ y: -6, boxShadow: '0 12px 30px rgba(0,0,0,0.1)' }}
                    transition={{ duration: 0.2 }}
                    style={{
                        backgroundColor: 'var(--color-bg-card)',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--color-border-light)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-card)',
                        transition: 'border-color 0.2s ease',
                        position: 'relative'
                    }}
                >
                    {/* Rank Badge */}
                    <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        zIndex: 10,
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: rank <= 3
                            ? 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))'
                            : 'var(--color-bg-secondary)',
                        color: rank <= 3 ? 'white' : 'var(--color-text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: 800,
                        boxShadow: 'var(--shadow-md)',
                        border: rank <= 3 ? 'none' : '1px solid var(--color-border)'
                    }}>
                        {rank}
                    </div>

                    {/* Foto */}
                    <div style={{
                        width: '100%',
                        height: '200px',
                        backgroundColor: 'var(--color-bg-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}>
                        {fotoUrl ? (
                            <img
                                src={fotoUrl}
                                alt={sapi.kode_sapi}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <div style={{
                                textAlign: 'center',
                                color: 'var(--color-text-muted)'
                            }}>
                                <div style={{ fontSize: '40px', marginBottom: '4px' }}>🐄</div>
                                <div style={{ fontSize: '12px' }}>Foto belum tersedia</div>
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div style={{ padding: '18px 20px' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '10px'
                        }}>
                            <span style={{
                                fontSize: '15px',
                                fontWeight: 700,
                                color: 'var(--color-text)'
                            }}>
                                {sapi.kode_sapi}
                            </span>
                            <BadgeGrade grade={sapi.grade} size="sm" />
                        </div>

                        {/* Jenis Sapi */}
                        {sapi.jenisSapi && (
                            <div style={{
                                display: 'inline-block',
                                padding: '3px 10px',
                                borderRadius: '999px',
                                backgroundColor: 'var(--color-primary-50)',
                                color: 'var(--color-primary-700)',
                                fontSize: '11px',
                                fontWeight: 600,
                                marginBottom: '10px',
                                border: '1px solid var(--color-primary-100)'
                            }}>
                                🏷️ {sapi.jenisSapi.nama}
                            </div>
                        )}

                        {/* Score Bar */}
                        <div style={{ marginBottom: '12px' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '4px'
                            }}>
                                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                                    Skor Kualitas
                                </span>
                                <span style={{
                                    fontSize: '14px',
                                    fontWeight: 700,
                                    color: 'var(--color-primary-500)'
                                }}>
                                    {sapi.skor_saw}/100
                                </span>
                            </div>
                            <div style={{
                                width: '100%',
                                height: '5px',
                                backgroundColor: 'var(--color-border-light)',
                                borderRadius: '999px',
                                overflow: 'hidden'
                            }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={isInView ? { width: `${sapi.skor_saw}%` } : {}}
                                    transition={{ duration: 0.8, delay: delay + 0.3 }}
                                    style={{
                                        height: '100%',
                                        borderRadius: '999px',
                                        background: 'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-600))'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Details */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '13px',
                            color: 'var(--color-text-secondary)'
                        }}>
                            <span>⚖️ {sapi.berat_kg} kg</span>
                            <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                                Rp {parseFloat(sapi.harga).toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </Link>
        </motion.div>
    );
}

export default function KatalogPage() {
    const [daftarSapi, setDaftarSapi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterGrade, setFilterGrade] = useState('Semua');
    const [filterJenis, setFilterJenis] = useState('Semua');
    const [sortBy, setSortBy] = useState('skor');

    useEffect(() => {
        fetchSapi();
    }, []);

    const fetchSapi = async () => {
        try {
            const res = await api.get('/sapi/publik');
            setDaftarSapi(res.data.data || []);
        } catch (err) {
            console.error('Gagal mengambil data:', err);
        } finally {
            setLoading(false);
        }
    };

    const grades = ['Semua', 'Platinum', 'Gold', 'Silver'];

    // Get unique jenis sapi from data
    const jenisOptions = ['Semua', ...Array.from(
        new Set(daftarSapi.filter(s => s.jenisSapi).map(s => s.jenisSapi.nama))
    )];

    // Apply filters
    let filtered = daftarSapi;
    if (filterGrade !== 'Semua') {
        filtered = filtered.filter(s => s.grade === filterGrade);
    }
    if (filterJenis !== 'Semua') {
        filtered = filtered.filter(s => s.jenisSapi && s.jenisSapi.nama === filterJenis);
    }

    // Apply sort
    filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
            case 'harga_asc': return parseFloat(a.harga) - parseFloat(b.harga);
            case 'harga_desc': return parseFloat(b.harga) - parseFloat(a.harga);
            case 'berat_desc': return b.berat_kg - a.berat_kg;
            case 'skor':
            default: return b.skor_saw - a.skor_saw;
        }
    });

    const sortLabel = {
        skor: '⭐ Kualitas Terbaik',
        harga_asc: '💰 Harga Terendah',
        harga_desc: '💰 Harga Tertinggi',
        berat_desc: '⚖️ Berat Terbesar'
    };

    return (
        <>
            <Navbar />
            <main style={{
                maxWidth: '1100px',
                margin: '0 auto',
                padding: '40px 24px 80px'
            }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ marginBottom: '32px' }}
                >
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 800,
                        color: 'var(--color-text)',
                        marginBottom: '6px'
                    }}>
                        Katalog Sapi Qurban
                    </h1>
                    <p style={{
                        fontSize: '15px',
                        color: 'var(--color-text-secondary)'
                    }}>
                        {daftarSapi.length} sapi tersedia — Pilih yang paling sesuai untuk Anda
                    </p>
                </motion.div>

                {/* Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        marginBottom: '28px'
                    }}
                >
                    {/* Row 1: Grade Filter */}
                    <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '8px', letterSpacing: '0.5px' }}>
                            KELAS KUALITAS
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {grades.map(g => (
                                <button
                                    key={g}
                                    onClick={() => setFilterGrade(g)}
                                    style={{
                                        padding: '8px 18px',
                                        borderRadius: '999px',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        border: '1px solid',
                                        borderColor: filterGrade === g ? 'var(--color-primary-500)' : 'var(--color-border)',
                                        backgroundColor: filterGrade === g ? 'var(--color-primary-500)' : 'var(--color-bg-card)',
                                        color: filterGrade === g ? 'white' : 'var(--color-text-secondary)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {g === 'Semua' ? '🐄 Semua' : g === 'Platinum' ? '💎 Platinum' : g === 'Gold' ? '🥇 Gold' : '🥈 Silver'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Row 2: Jenis Sapi + Sort */}
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        {/* Jenis Sapi Filter */}
                        {jenisOptions.length > 2 && (
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '8px', letterSpacing: '0.5px' }}>
                                    JENIS SAPI
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {jenisOptions.map(j => (
                                        <button
                                            key={j}
                                            onClick={() => setFilterJenis(j)}
                                            style={{
                                                padding: '7px 14px',
                                                borderRadius: '999px',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                border: '1px solid',
                                                borderColor: filterJenis === j ? 'var(--color-primary-500)' : 'var(--color-border)',
                                                backgroundColor: filterJenis === j ? 'var(--color-primary-500)' : 'var(--color-bg-card)',
                                                color: filterJenis === j ? 'white' : 'var(--color-text-secondary)',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            {j === 'Semua' ? '🏷️ Semua Jenis' : j}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sort Dropdown */}
                        <div style={{ minWidth: '200px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '8px', letterSpacing: '0.5px' }}>
                                URUTKAN
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '9px 14px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-border)',
                                    backgroundColor: 'var(--color-bg-card)',
                                    color: 'var(--color-text)',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    outline: 'none',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2394a3b8' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 12px center'
                                }}
                            >
                                {Object.entries(sortLabel).map(([val, label]) => (
                                    <option key={val} value={val}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Active filters indicator */}
                    {(filterGrade !== 'Semua' || filterJenis !== 'Semua') && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                                Menampilkan {filtered.length} dari {daftarSapi.length} sapi
                            </span>
                            <button
                                onClick={() => { setFilterGrade('Semua'); setFilterJenis('Semua'); setSortBy('skor'); }}
                                style={{
                                    padding: '4px 12px',
                                    borderRadius: '999px',
                                    border: '1px solid var(--color-border)',
                                    backgroundColor: 'var(--color-bg-secondary)',
                                    color: 'var(--color-text-muted)',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                ✕ Reset Filter
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* Loading */}
                {loading ? (
                    <LoadingSpinner text="Memuat katalog sapi..." />
                ) : filtered.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '80px 20px',
                        color: 'var(--color-text-muted)'
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🐄</div>
                        <div style={{ fontSize: '16px', fontWeight: 600 }}>Belum ada sapi yang tersedia.</div>
                        <div style={{ fontSize: '13px', marginTop: '4px' }}>Hubungi admin untuk informasi lebih lanjut.</div>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '20px'
                    }}>
                        {filtered.map((sapi, idx) => (
                            <KartuSapi
                                key={sapi.id}
                                sapi={sapi}
                                rank={idx + 1}
                                delay={Math.min(idx * 0.06, 0.3)}
                            />
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
