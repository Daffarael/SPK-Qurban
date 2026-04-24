'use client';

function GradeIcon({ grade, size }) {
    const s = size === 'sm' ? 12 : 14;

    if (grade === 'Platinum') {
        // Bintang berlian / kristal
        return (
            <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M12 2L14.5 8.5L21 9.5L16.5 14.5L17.5 21L12 18L6.5 21L7.5 14.5L3 9.5L9.5 8.5L12 2Z"
                    fill="currentColor" opacity="0.95" />
            </svg>
        );
    }

    if (grade === 'Gold') {
        // Trofi / mahkota
        return (
            <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5Z" fill="currentColor" opacity="0.95" />
                <rect x="4" y="17" width="16" height="3" rx="1.5" fill="currentColor" opacity="0.75" />
            </svg>
        );
    }

    if (grade === 'Silver') {
        // Medali perak — lingkaran dengan tanda centang
        return (
            <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.2" />
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                <path d="M8.5 12L11 14.5L15.5 9.5" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }

    // Bronze — medali perunggu dengan angka 3
    return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.18" />
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            <path d="M10 8h2.5a1.5 1.5 0 0 1 0 3H10m2.5 0H10m2.5 0a1.5 1.5 0 0 1 0 3H10"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

export default function BadgeGrade({ grade, size = 'md' }) {
    const config = {
        Platinum: {
            bg: 'var(--color-platinum-bg)',
            text: 'var(--color-platinum)',
            border: 'rgba(129, 140, 248, 0.35)',
            shadow: '0 0 8px rgba(129, 140, 248, 0.2)',
            label: 'Platinum'
        },
        Gold: {
            bg: 'var(--color-gold-bg)',
            text: 'var(--color-gold)',
            border: 'rgba(202, 138, 4, 0.35)',
            shadow: '0 0 8px rgba(234, 179, 8, 0.15)',
            label: 'Gold'
        },
        Silver: {
            bg: 'var(--color-silver-bg)',
            text: 'var(--color-silver)',
            border: 'rgba(100, 116, 139, 0.4)',
            shadow: 'none',
            label: 'Silver'
        },
        Bronze: {
            bg: 'var(--color-bronze-bg)',
            text: 'var(--color-bronze-accent, #d97706)',
            border: 'rgba(217, 119, 6, 0.35)',
            shadow: 'none',
            label: 'Bronze'
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
                —
            </span>
        );
    }

    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: size === 'sm' ? '2px 9px' : '4px 12px',
                fontSize: size === 'sm' ? '11px' : '12px',
                fontWeight: 700,
                letterSpacing: '0.3px',
                borderRadius: '999px',
                backgroundColor: c.bg,
                color: c.text,
                border: `1.5px solid ${c.border}`,
                boxShadow: c.shadow,
            }}
        >
            <GradeIcon grade={grade} size={size} />
            {c.label}
        </span>
    );
}
