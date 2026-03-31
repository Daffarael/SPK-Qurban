'use client';

function GradeIcon({ grade, size }) {
    const s = size === 'sm' ? 12 : 14;
    if (grade === 'Platinum') {
        return (
            <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M12 2L14.5 8.5L21 9.5L16.5 14.5L17.5 21L12 18L6.5 21L7.5 14.5L3 9.5L9.5 8.5L12 2Z" fill="currentColor" opacity="0.9"/>
            </svg>
        );
    }
    if (grade === 'Gold') {
        return (
            <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5Z" fill="currentColor" opacity="0.9"/>
                <rect x="4" y="17" width="16" height="3" rx="1" fill="currentColor" opacity="0.7"/>
            </svg>
        );
    }
    // Silver
    return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M12 3L20 7V13C20 17.4 16.5 21.5 12 22.5C7.5 21.5 4 17.4 4 13V7L12 3Z" fill="currentColor" opacity="0.9"/>
        </svg>
    );
}

export default function BadgeGrade({ grade, size = 'md' }) {
    const config = {
        Platinum: {
            bg: 'var(--color-platinum-bg)',
            text: 'var(--color-platinum)',
            border: 'var(--color-platinum)',
            label: 'Platinum'
        },
        Gold: {
            bg: 'var(--color-gold-bg)',
            text: 'var(--color-gold)',
            border: 'var(--color-gold)',
            label: 'Gold'
        },
        Silver: {
            bg: 'var(--color-silver-bg)',
            text: 'var(--color-silver)',
            border: 'var(--color-silver)',
            label: 'Silver'
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
            <GradeIcon grade={grade} size={size} />
            {c.label}
        </span>
    );
}

