'use client';

export default function BadgeGrade({ grade, size = 'md' }) {
    const config = {
        Platinum: {
            bg: 'var(--color-platinum-bg)',
            text: 'var(--color-platinum)',
            border: 'var(--color-platinum)',
            label: '💎 Platinum'
        },
        Gold: {
            bg: 'var(--color-gold-bg)',
            text: 'var(--color-gold)',
            border: 'var(--color-gold)',
            label: '🥇 Gold'
        },
        Silver: {
            bg: 'var(--color-silver-bg)',
            text: 'var(--color-silver)',
            border: 'var(--color-silver)',
            label: '🥈 Silver'
        }
    };

    const c = config[grade];

    if (!c) {
        return (
            <span
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: size === 'sm' ? '2px 8px' : '4px 12px',
                    fontSize: size === 'sm' ? '11px' : '13px',
                    fontWeight: 600,
                    borderRadius: '999px',
                    backgroundColor: 'var(--color-border-light)',
                    color: 'var(--color-text-muted)',
                }}
            >
                Tidak Lolos
            </span>
        );
    }

    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: size === 'sm' ? '2px 8px' : '4px 12px',
                fontSize: size === 'sm' ? '11px' : '13px',
                fontWeight: 600,
                borderRadius: '999px',
                backgroundColor: c.bg,
                color: c.text,
                border: `1px solid ${c.border}22`
            }}
        >
            {c.label}
        </span>
    );
}
