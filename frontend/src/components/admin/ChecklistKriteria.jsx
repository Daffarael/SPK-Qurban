'use client';

import { FiCheck } from 'react-icons/fi';

const DESKRIPSI_SKOR = {
    1: 'Sangat Buruk',
    2: 'Buruk',
    3: 'Cukup',
    4: 'Baik',
    5: 'Sangat Baik'
};

/**
 * ChecklistKriteria — Smart Checklist UI (Card-based toggles)
 * 
 * Props:
 * - label: string — judul kriteria
 * - items: string[] — 4 pernyataan checkbox
 * - checked: boolean[] — status checked [true, false, ...]
 * - onChange: (newChecked: boolean[]) => void
 * - skorTersimpan: number|null — skor lama untuk info saat edit
 */
export default function ChecklistKriteria({ label, items, checked, onChange, skorTersimpan = null }) {
    const jumlahChecked = checked.filter(Boolean).length;
    const skor = jumlahChecked + 1; // 0→1, 1→2, 2→3, 3→4, 4→5

    const handleToggle = (index) => {
        const newChecked = [...checked];
        newChecked[index] = !newChecked[index];
        onChange(newChecked);
    };

    // Warna badge skor
    const getSkorColor = (s) => {
        if (s >= 5) return { bg: '#059669', text: '#ffffff' };
        if (s >= 4) return { bg: '#2563eb', text: '#ffffff' };
        if (s >= 3) return { bg: '#d97706', text: '#ffffff' };
        return { bg: '#dc2626', text: '#ffffff' };
    };

    const skorColor = getSkorColor(skor);

    return (
        <div style={{ marginBottom: '20px' }}>
            {/* Header: Label + Skor Preview */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
            }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
                    {label}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                        fontSize: '12px',
                        color: 'var(--color-text-muted)',
                        fontWeight: 500
                    }}>
                        Skor:
                    </span>
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: 700,
                        backgroundColor: skorColor.bg,
                        color: skorColor.text,
                        transition: 'all 0.3s ease',
                        minWidth: '42px',
                        justifyContent: 'center'
                    }}>
                        {skor}/5
                    </span>
                    <span style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                        backgroundColor: 'var(--color-bg-secondary)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 500
                    }}>
                        {DESKRIPSI_SKOR[skor]}
                    </span>
                </div>
            </div>

            {/* Info skor tersimpan (mode edit, data lama) */}
            {skorTersimpan !== null && (
                <div style={{
                    padding: '8px 12px',
                    marginBottom: '10px',
                    backgroundColor: 'var(--color-primary-50)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-primary-200)',
                    fontSize: '12px',
                    color: 'var(--color-primary-700)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}>
                    <span style={{ fontSize: '14px' }}>ℹ️</span>
                    Skor tersimpan sebelumnya: <strong>{skorTersimpan}/5</strong>
                    {jumlahChecked === 0 && ' — Ceklis ulang untuk memperbarui.'}
                </div>
            )}

            {/* Checkbox Cards */}
            <div style={{ display: 'grid', gap: '8px' }}>
                {items.map((item, index) => {
                    const isChecked = checked[index];
                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleToggle(index)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                width: '100%',
                                padding: '14px 16px',
                                minHeight: '52px',
                                borderRadius: 'var(--radius-md)',
                                border: `2px solid ${isChecked ? 'var(--color-primary-500)' : 'var(--color-border)'}`,
                                backgroundColor: isChecked ? 'var(--color-primary-50)' : 'var(--color-bg)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                textAlign: 'left',
                                outline: 'none'
                            }}
                        >
                            {/* Custom Checkbox */}
                            <div style={{
                                width: '28px',
                                height: '28px',
                                minWidth: '28px',
                                borderRadius: '8px',
                                border: `2px solid ${isChecked ? 'var(--color-primary-500)' : 'var(--color-border)'}`,
                                backgroundColor: isChecked ? 'var(--color-primary-500)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                            }}>
                                {isChecked && (
                                    <FiCheck
                                        size={16}
                                        color="#ffffff"
                                        strokeWidth={3}
                                    />
                                )}
                            </div>

                            {/* Label */}
                            <span style={{
                                fontSize: '14px',
                                fontWeight: isChecked ? 600 : 400,
                                color: isChecked ? 'var(--color-primary-700)' : 'var(--color-text)',
                                lineHeight: 1.4,
                                transition: 'all 0.2s ease'
                            }}>
                                {item}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Progress bar */}
            <div style={{
                marginTop: '10px',
                height: '4px',
                borderRadius: '2px',
                backgroundColor: 'var(--color-bg-secondary)',
                overflow: 'hidden'
            }}>
                <div style={{
                    height: '100%',
                    width: `${(jumlahChecked / 4) * 100}%`,
                    backgroundColor: skorColor.bg,
                    borderRadius: '2px',
                    transition: 'all 0.3s ease'
                }} />
            </div>
        </div>
    );
}
