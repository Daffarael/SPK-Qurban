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
        Available: { color: '#15803d', dot: '#22c55e', label: 'Tersedia' },
        Booked: { color: '#b45309', dot: '#f59e0b', label: 'Dipesan' },
        Sold: { color: '#b91c1c', dot: '#ef4444', label: 'Terjual' },
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

    const infoLabelStyle = {
        fontSize: '11px',
        fontWeight: 600,
        color: 'var(--color-text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.4px',
        marginBottom: '2px'
    };

    const infoValueStyle = {
        fontSize: '15px',
        fontWeight: 600,
        color: 'var(--color-text)'
    };

    return (
        <>
            <Modal judul={sapi.kode_sapi} isOpen={isOpen} onClose={onClose} lebar="520px">
                {/* Photo */}
                <div
                    onClick={() => { if (fotoSrc) setShowLightbox(true); }}
                    style={{
                        width: '100%',
                        height: '220px',
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
                                transition: 'transform 0.25s ease',
                            }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
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
                        gap: '6px',
                    }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span style={{ fontSize: '12px', fontWeight: 500 }}>Belum ada foto</span>
                    </div>

                    {/* Grade badge */}
                    <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                        <BadgeGrade grade={sapi.grade} size="md" />
                    </div>

                    {/* Zoom hint */}
                    {fotoSrc && (
                        <div style={{
                            position: 'absolute',
                            bottom: '8px',
                            right: '8px',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            borderRadius: '6px',
                            padding: '3px 8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: 'rgba(255,255,255,0.85)',
                            fontSize: '10px',
                            fontWeight: 500,
                            pointerEvents: 'none',
                        }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            Perbesar
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1px',
                    backgroundColor: 'var(--color-border-light)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border-light)',
                }}>
                    {/* Kode Sapi */}
                    <div style={{ padding: '14px 16px', backgroundColor: 'var(--color-bg-card)' }}>
                        <div style={infoLabelStyle}>Kode Sapi</div>
                        <div style={infoValueStyle}>{sapi.kode_sapi}</div>
                    </div>

                    {/* Jenis */}
                    <div style={{ padding: '14px 16px', backgroundColor: 'var(--color-bg-card)' }}>
                        <div style={infoLabelStyle}>Jenis</div>
                        <div style={infoValueStyle}>{sapi.jenisSapi?.nama || '—'}</div>
                    </div>

                    {/* Berat */}
                    <div style={{ padding: '14px 16px', backgroundColor: 'var(--color-bg-card)' }}>
                        <div style={infoLabelStyle}>Berat</div>
                        <div style={infoValueStyle}>
                            {sapi.berat_kg} <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--color-text-muted)' }}>kg</span>
                        </div>
                    </div>

                    {/* Harga */}
                    <div style={{ padding: '14px 16px', backgroundColor: 'var(--color-bg-card)' }}>
                        <div style={infoLabelStyle}>Harga</div>
                        <div style={infoValueStyle}>{formatHarga(sapi.harga)}</div>
                    </div>

                    {/* Status */}
                    <div style={{ padding: '14px 16px', backgroundColor: 'var(--color-bg-card)' }}>
                        <div style={infoLabelStyle}>Status</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: sc.dot }} />
                            <span style={{ fontSize: '13px', fontWeight: 600, color: sc.color }}>{sc.label}</span>
                        </div>
                    </div>

                    {/* Skor SAW */}
                    <div style={{ padding: '14px 16px', backgroundColor: 'var(--color-bg-card)' }}>
                        <div style={infoLabelStyle}>Skor SAW</div>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary-500)', marginTop: '1px' }}>
                            {sapi.skor_saw}
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Lightbox */}
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
                        backgroundColor: 'rgba(0, 0, 0, 0.88)',
                        backdropFilter: 'blur(10px)',
                        cursor: 'zoom-out',
                        animation: 'fadeIn 0.2s ease-out',
                        padding: '40px',
                    }}
                >
                    {/* Close */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowLightbox(false); }}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            border: '1px solid rgba(255,255,255,0.15)',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            color: 'white',
                            fontSize: '16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                    >
                        ✕
                    </button>

                    {/* Caption */}
                    <div style={{
                        position: 'absolute',
                        bottom: '24px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        borderRadius: '8px',
                        padding: '6px 14px',
                        color: 'rgba(255,255,255,0.85)',
                        fontSize: '12px',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                    }}>
                        {sapi.kode_sapi} — {sapi.jenisSapi?.nama || 'Sapi Qurban'}
                    </div>

                    {/* Image */}
                    <img
                        src={fotoSrc}
                        alt={`Foto ${sapi.kode_sapi}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxWidth: '90vw',
                            maxHeight: '85vh',
                            objectFit: 'contain',
                            borderRadius: '10px',
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
