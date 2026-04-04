'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
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

    // Top 3 rank colors
    const rankStyle = rank === 1
        ? { bg: '#fffbeb', color: '#b45309', border: '#fde68a' }
        : rank === 2
        ? { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' }
        : rank === 3
        ? { bg: '#fef3c7', color: '#92400e', border: '#fde68a' }
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
                    whileHover={{ y: -4, boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}
                    transition={{ duration: 0.2 }}
                    style={{
                        backgroundColor: 'var(--color-bg-card)',
                        borderRadius: '16px',
                        border: '1px solid var(--color-border-light)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-card)',
                        transition: 'border-color 0.2s ease',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%'
                    }}
                >
                    {/* Image */}
                    <div style={{
                        width: '100%',
                        height: '200px',
                        backgroundColor: 'var(--color-bg-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        {fotoUrl ? (
                            <img
                                src={fotoUrl}
                                alt={sapi.kode_sapi}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                <div style={{ fontSize: '40px', marginBottom: '4px' }}>🐄</div>
                                <div style={{ fontSize: '12px' }}>Foto belum tersedia</div>
                            </div>
                        )}

                        {/* Rank Badge — overlay on image */}
                        {rankStyle ? (
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                left: '10px',
                                backgroundColor: rankStyle.bg,
                                color: rankStyle.color,
                                border: `1.5px solid ${rankStyle.border}`,
                                borderRadius: '8px',
                                padding: '3px 10px',
                                fontSize: '12px',
                                fontWeight: 700,
                                letterSpacing: '0.3px',
                                backdropFilter: 'blur(6px)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <span style={{ fontSize: '11px', opacity: 0.6 }}>#</span>{rank}
                            </div>
                        ) : (
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                left: '10px',
                                width: '28px',
                                height: '28px',
                                borderRadius: '8px',
                                backgroundColor: 'rgba(255,255,255,0.85)',
                                backdropFilter: 'blur(6px)',
                                color: 'var(--color-text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 700,
                                border: '1px solid rgba(0,0,0,0.06)'
                            }}>
                                {rank}
                            </div>
                        )}

                        {/* Grade badge on image */}
                        <div style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px'
                        }}>
                            <BadgeGrade grade={sapi.grade} size="sm" />
                        </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        {/* Title row */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px'
                        }}>
                            <span style={{
                                fontSize: '15px',
                                fontWeight: 700,
                                color: 'var(--color-text)'
                            }}>
                                {sapi.kode_sapi}
                            </span>
                            {sapi.jenisSapi && (
                                <span style={{
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: 'var(--color-primary-600)',
                                    backgroundColor: 'var(--color-primary-50)',
                                    padding: '2px 8px',
                                    borderRadius: '6px'
                                }}>
                                    {sapi.jenisSapi.nama}
                                </span>
                            )}
                        </div>

                        {/* Score */}
                        <div style={{ marginBottom: '14px', marginTop: 'auto' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'baseline',
                                marginBottom: '6px'
                            }}>
                                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                                    Skor Kualitas
                                </span>
                                <span style={{
                                    fontSize: '14px',
                                    fontWeight: 700,
                                    color: 'var(--color-primary-600)'
                                }}>
                                    {sapi.skor_saw}
                                    <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-text-muted)' }}>/100</span>
                                </span>
                            </div>
                            <div style={{
                                width: '100%',
                                height: '4px',
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

                        {/* Footer */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingTop: '12px',
                            borderTop: '1px solid var(--color-border-light)',
                            fontSize: '13px'
                        }}>
                            <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>
                                {sapi.berat_kg} kg
                            </span>
                            <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>
                                Rp {parseFloat(sapi.harga).toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </Link>
        </motion.div>
    );
}

// Helper: format rupiah singkat
function formatRupiah(val) {
    if (val >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(val % 1_000_000 === 0 ? 0 : 1)}jt`;
    if (val >= 1_000) return `Rp ${(val / 1_000).toFixed(0)}rb`;
    return `Rp ${val}`;
}

export default function KatalogPage() {
    const [daftarSapi, setDaftarSapi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterGrade, setFilterGrade] = useState('Semua');
    const [filterJenis, setFilterJenis] = useState('Semua');
    const [sortBy, setSortBy] = useState('skor');

    // Range filter states
    const [rangeHarga, setRangeHarga] = useState([0, 0]);
    const [rangeSkor, setRangeSkor] = useState([0, 100]);
    const [rangeInitialized, setRangeInitialized] = useState(false);

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

    // Compute min/max bounds from data
    const bounds = useMemo(() => {
        if (daftarSapi.length === 0) return { hargaMin: 0, hargaMax: 100_000_000, skorMin: 0, skorMax: 100 };
        const hargaList = daftarSapi.map(s => parseFloat(s.harga));
        const skorList = daftarSapi.map(s => s.skor_saw);
        return {
            hargaMin: Math.floor(Math.min(...hargaList)),
            hargaMax: Math.ceil(Math.max(...hargaList)),
            skorMin: Math.floor(Math.min(...skorList)),
            skorMax: Math.ceil(Math.max(...skorList))
        };
    }, [daftarSapi]);

    // Initialize ranges once data loads
    useEffect(() => {
        if (daftarSapi.length > 0 && !rangeInitialized) {
            setRangeHarga([bounds.hargaMin, bounds.hargaMax]);
            setRangeSkor([bounds.skorMin, bounds.skorMax]);
            setRangeInitialized(true);
        }
    }, [daftarSapi, bounds, rangeInitialized]);

    const grades = ['Semua', 'Platinum', 'Gold', 'Silver', 'Bronze'];

    // Get unique jenis sapi from data
    const jenisOptions = ['Semua', ...Array.from(
        new Set(daftarSapi.filter(s => s.jenisSapi).map(s => s.jenisSapi.nama))
    )];

    // Check if range filters are active (not at full bounds)
    const isHargaFiltered = rangeInitialized && (rangeHarga[0] !== bounds.hargaMin || rangeHarga[1] !== bounds.hargaMax);
    const isSkorFiltered = rangeInitialized && (rangeSkor[0] !== bounds.skorMin || rangeSkor[1] !== bounds.skorMax);

    // Apply filters
    let filtered = daftarSapi;
    if (filterGrade !== 'Semua') {
        filtered = filtered.filter(s => s.grade === filterGrade);
    }
    if (filterJenis !== 'Semua') {
        filtered = filtered.filter(s => s.jenisSapi && s.jenisSapi.nama === filterJenis);
    }
    if (isHargaFiltered) {
        filtered = filtered.filter(s => {
            const h = parseFloat(s.harga);
            return h >= rangeHarga[0] && h <= rangeHarga[1];
        });
    }
    if (isSkorFiltered) {
        filtered = filtered.filter(s => s.skor_saw >= rangeSkor[0] && s.skor_saw <= rangeSkor[1]);
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
                                    {g === 'Semua' ? '🐄 Semua' : g === 'Platinum' ? '💎 Platinum' : g === 'Gold' ? '🥇 Gold' : g === 'Silver' ? '🥈 Silver' : '🥉 Bronze'}
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

                    {/* Range Sliders Row */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                        padding: '18px 20px',
                        backgroundColor: 'var(--color-bg-card)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--color-border-light)',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        {/* Harga Range */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>
                                    💰 RENTANG HARGA
                                </span>
                                {isHargaFiltered && (
                                    <button
                                        onClick={() => setRangeHarga([bounds.hargaMin, bounds.hargaMax])}
                                        style={{
                                            fontSize: '10px', fontWeight: 600, color: 'var(--color-primary-500)',
                                            background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px'
                                        }}
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                            <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                fontSize: '13px', fontWeight: 600,
                                color: isHargaFiltered ? 'var(--color-primary-600)' : 'var(--color-text-secondary)',
                                marginBottom: '0'
                            }}>
                                <span>{formatRupiah(rangeHarga[0])}</span>
                                <span>{formatRupiah(rangeHarga[1])}</span>
                            </div>
                            <div className="dual-range-wrap">
                                <div className="dual-range-track" />
                                <div
                                    className="dual-range-fill"
                                    style={{
                                        left: `${((rangeHarga[0] - bounds.hargaMin) / (bounds.hargaMax - bounds.hargaMin || 1)) * 100}%`,
                                        right: `${100 - ((rangeHarga[1] - bounds.hargaMin) / (bounds.hargaMax - bounds.hargaMin || 1)) * 100}%`
                                    }}
                                />
                                <input
                                    type="range"
                                    min={bounds.hargaMin}
                                    max={bounds.hargaMax}
                                    step={100000}
                                    value={rangeHarga[0]}
                                    onChange={(e) => {
                                        const v = Number(e.target.value);
                                        setRangeHarga([Math.min(v, rangeHarga[1] - 100000), rangeHarga[1]]);
                                    }}
                                />
                                <input
                                    type="range"
                                    min={bounds.hargaMin}
                                    max={bounds.hargaMax}
                                    step={100000}
                                    value={rangeHarga[1]}
                                    onChange={(e) => {
                                        const v = Number(e.target.value);
                                        setRangeHarga([rangeHarga[0], Math.max(v, rangeHarga[0] + 100000)]);
                                    }}
                                />
                            </div>
                        </div>

                        {/* Skor Range */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>
                                    ⭐ RENTANG SKOR
                                </span>
                                {isSkorFiltered && (
                                    <button
                                        onClick={() => setRangeSkor([bounds.skorMin, bounds.skorMax])}
                                        style={{
                                            fontSize: '10px', fontWeight: 600, color: 'var(--color-primary-500)',
                                            background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px'
                                        }}
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                            <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                fontSize: '13px', fontWeight: 600,
                                color: isSkorFiltered ? 'var(--color-primary-600)' : 'var(--color-text-secondary)',
                                marginBottom: '0'
                            }}>
                                <span>{rangeSkor[0]}</span>
                                <span>{rangeSkor[1]}</span>
                            </div>
                            <div className="dual-range-wrap">
                                <div className="dual-range-track" />
                                <div
                                    className="dual-range-fill"
                                    style={{
                                        left: `${((rangeSkor[0] - bounds.skorMin) / (bounds.skorMax - bounds.skorMin || 1)) * 100}%`,
                                        right: `${100 - ((rangeSkor[1] - bounds.skorMin) / (bounds.skorMax - bounds.skorMin || 1)) * 100}%`
                                    }}
                                />
                                <input
                                    type="range"
                                    min={bounds.skorMin}
                                    max={bounds.skorMax}
                                    step={1}
                                    value={rangeSkor[0]}
                                    onChange={(e) => {
                                        const v = Number(e.target.value);
                                        setRangeSkor([Math.min(v, rangeSkor[1] - 1), rangeSkor[1]]);
                                    }}
                                />
                                <input
                                    type="range"
                                    min={bounds.skorMin}
                                    max={bounds.skorMax}
                                    step={1}
                                    value={rangeSkor[1]}
                                    onChange={(e) => {
                                        const v = Number(e.target.value);
                                        setRangeSkor([rangeSkor[0], Math.max(v, rangeSkor[0] + 1)]);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Active filters indicator */}
                    {(filterGrade !== 'Semua' || filterJenis !== 'Semua' || isHargaFiltered || isSkorFiltered) && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                                Menampilkan {filtered.length} dari {daftarSapi.length} sapi
                            </span>
                            <button
                                onClick={() => {
                                    setFilterGrade('Semua');
                                    setFilterJenis('Semua');
                                    setSortBy('skor');
                                    setRangeHarga([bounds.hargaMin, bounds.hargaMax]);
                                    setRangeSkor([bounds.skorMin, bounds.skorMax]);
                                }}
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
                                ✕ Reset Semua Filter
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
