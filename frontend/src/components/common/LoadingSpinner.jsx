'use client';

export default function LoadingSpinner({ text = 'Memuat...' }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '40px',
            color: 'var(--color-text-secondary)'
        }}>
            <div style={{
                width: '36px',
                height: '36px',
                border: '3px solid var(--color-border)',
                borderTopColor: 'var(--color-primary-500)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
            }} />
            <span style={{ fontSize: '14px', fontWeight: 500 }}>{text}</span>

            <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
