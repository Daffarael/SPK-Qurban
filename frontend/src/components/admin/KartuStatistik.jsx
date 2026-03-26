'use client';

export default function KartuStatistik({ icon, label, nilai, value, warna = 'var(--color-primary-500)' }) {
    const displayValue = nilai ?? value ?? 0;
    return (
        <div style={{
            backgroundColor: 'var(--color-bg-card)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            border: '1px solid var(--color-border-light)',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            transition: 'all 0.2s ease'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: `${warna}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                flexShrink: 0
            }}>
                {icon}
            </div>
            <div>
                <div style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--color-text-muted)',
                    marginBottom: '2px'
                }}>
                    {label}
                </div>
                <div style={{
                    fontSize: '26px',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    lineHeight: 1.2
                }}>
                    {displayValue}
                </div>
            </div>
        </div>
    );
}
