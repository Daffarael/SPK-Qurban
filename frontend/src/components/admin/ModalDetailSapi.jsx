'use client';

import { useState } from 'react';
import Modal from '@/components/common/Modal';
import BadgeGrade from '@/components/common/BadgeGrade';
import { BACKEND_URL } from '@/services/api';

export default function ModalDetailSapi({ isOpen, onClose, sapi }) {
    const [showLightbox, setShowLightbox] = useState(false);

    if (!sapi) return null;

    const fotoSrc = sapi.foto_url ? `${BACKEND_URL}${sapi.foto_url}` : null;

    const statusConfig = {
        Available: { bg: '#dcfce7', color: '#15803d', dot: '#22c55e', label: 'Tersedia' },
        Booked: { bg: '#fef3c7', color: '#b45309', dot: '#f59e0b', label: 'Dipesan' },
        Sold: { bg: '#fee2e2', color: '#b91c1c', dot: '#ef4444', label: 'Terjual' },
    };

    const sc = statusConfig[sapi.status] || statusConfig.Available;

    const formatHarga = (harga) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(harga);
    };

    return (
        <>
            <Modal judul={`Detail Sapi — ${sapi.kode_sapi}`} isOpen={isOpen} onClose={onClose} lebar="580px">
                {/* ─── Photo Section ─── */}
                <div
                    onClick={() => { if (fotoSrc) setShowLightbox(true); }}
                    style={{
                        width: '100%',
                        height: '240px',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        marginBottom: '20px',
                        backgroundColor: 'var(--color-bg-secondary)',
                        position: 'relative',
                        cursor: fotoSrc ? 'zoom-in' : 'default',
                    }}
                >
                    {fotoSrc ? (
                        <img
                            src={fotoSrc}
                            alt={`Foto ${sapi.kode_sapi}`}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.2s ease',
                            }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                    ) : null}
                    <div style={{
                        display: fotoSrc ? 'none' : 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: 'var(--color-text-muted)',
                        gap: '8px',
                    }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span style={{ fontSize: '13px', fontWeight: 500 }}>Belum ada foto</span>
                    </div>

                    {/* Grade badge overlay */}
                    <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                    }}>
                        <BadgeGrade grade={sapi.grade} size="md" />
                    </div>

                    {/* Zoom hint */}
                    {fotoSrc && (
                        <div style={{
                            position: 'absolute',
                            bottom: '10px',
                            right: '10px',
                            backgroundColor: 'rgba(0,0,0,0.55)',
                            borderRadius: '8px',
                            padding: '5px 10px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            color: 'white',
                            fontSize: '11px',
                            fontWeight: 500,
                            backdropFilter: 'blur(4px)',
                            pointerEvents: 'none',
                        }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
                            </svg>
                            Klik untuk lihat utuh
                        </div>
                    )}
                </div>

                {/* ─── Info Grid ─── */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '20px',
                }}>
                    {/* Kode Sapi */}
                    <div style={{
                        padding: '14px 16px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border-light)',
                    }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                            Kode Sapi
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)' }}>
                            {sapi.kode_sapi}
                        </div>
                    </div>

                    {/* Jenis Sapi */}
                    <div style={{
                        padding: '14px 16px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border-light)',
                    }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                            Jenis Sapi
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)' }}>
                            {sapi.jenisSapi?.nama || '—'}
                        </div>
                    </div>

                    {/* Berat */}
                    <div style={{
                        padding: '14px 16px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border-light)',
                    }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                            Berat
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)' }}>
                            {sapi.berat_kg} <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>kg</span>
                        </div>
                    </div>

                    {/* Harga */}
                    <div style={{
                        padding: '14px 16px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border-light)',
                    }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                            Harga
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)' }}>
                            {formatHarga(sapi.harga)}
                        </div>
                    </div>
                </div>

                {/* ─── Status & Skor Row ─── */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '20px',
                }}>
                    {/* Status */}
                    <div style={{
                        flex: 1,
                        padding: '14px 16px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Status
                        </span>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 12px',
                            borderRadius: '999px',
                            backgroundColor: sc.bg,
                            fontSize: '12px',
                            fontWeight: 600,
                            color: sc.color,
                        }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: sc.dot, flexShrink: 0 }} />
                            {sc.label}
                        </div>
                    </div>

                    {/* Skor SAW */}
                    <div style={{
                        flex: 1,
                        padding: '14px 16px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Skor SAW
                        </span>
                        <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-primary-500)' }}>
                            {sapi.skor_saw}
                        </span>
                    </div>
                </div>
            </Modal>

            {/* ─── Lightbox (Full Image Viewer) ─── */}
            {showLightbox && fotoSrc && (
                <div
                    onClick={() => setShowLightbox(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 2000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        backdropFilter: 'blur(8px)',
                        cursor: 'zoom-out',
                        animation: 'fadeIn 0.2s ease-out',
                        padding: '40px',
                    }}
                >
                    {/* Close button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowLightbox(false); }}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            color: 'white',
                            fontSize: '20px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background-color 0.2s ease',
                            backdropFilter: 'blur(4px)',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
                    >
                        ✕
                    </button>

                    {/* Caption */}
                    <div style={{
                        position: 'absolute',
                        bottom: '24px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        borderRadius: '10px',
                        padding: '8px 18px',
                        color: 'white',
                        fontSize: '13px',
                        fontWeight: 600,
                        backdropFilter: 'blur(4px)',
                        whiteSpace: 'nowrap',
                    }}>
                        {sapi.kode_sapi} — {sapi.jenisSapi?.nama || 'Sapi Qurban'}
                    </div>

                    {/* Full Image */}
                    <img
                        src={fotoSrc}
                        alt={`Foto ${sapi.kode_sapi}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxWidth: '90vw',
                            maxHeight: '85vh',
                            objectFit: 'contain',
                            borderRadius: '12px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                            cursor: 'default',
                            animation: 'fadeIn 0.25s ease-out',
                        }}
                    />
                </div>
            )}
        </>
    );
}
