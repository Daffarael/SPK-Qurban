'use client';

const DESKRIPSI = {
    1: 'Sangat Buruk',
    2: 'Buruk',
    3: 'Cukup',
    4: 'Baik',
    5: 'Sangat Baik'
};

export default function SliderKriteria({ label, keterangan, value, onChange, disabled = false }) {
    return (
        <div style={{ marginBottom: '20px' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
            }}>
                <div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
                        {label}
                    </span>
                    {keterangan && (
                        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginLeft: '6px' }}>
                            ({keterangan})
                        </span>
                    )}
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}>
                    <span style={{
                        fontSize: '20px',
                        fontWeight: 700,
                        color: 'var(--color-primary-500)',
                        minWidth: '20px',
                        textAlign: 'right'
                    }}>
                        {value}
                    </span>
                    <span style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                        backgroundColor: 'var(--color-bg-secondary)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 500
                    }}>
                        {DESKRIPSI[value]}
                    </span>
                </div>
            </div>

            <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                disabled={disabled}
                className="slider-kriteria"
                style={{ width: '100%' }}
            />

            {/* Tick marks */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 2px',
                marginTop: '4px'
            }}>
                {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} style={{
                        fontSize: '11px',
                        color: n === value ? 'var(--color-primary-500)' : 'var(--color-text-muted)',
                        fontWeight: n === value ? 600 : 400,
                        width: '20px',
                        textAlign: 'center'
                    }}>
                        {n}
                    </span>
                ))}
            </div>
        </div>
    );
}
