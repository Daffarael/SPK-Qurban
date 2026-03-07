'use client';

import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            title={theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
            style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text)',
                cursor: 'pointer',
                fontSize: '18px',
                transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-primary-50)';
                e.target.style.borderColor = 'var(--color-primary-300)';
            }}
            onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--color-bg)';
                e.target.style.borderColor = 'var(--color-border)';
            }}
        >
            {theme === 'light' ? '🌙' : '☀️'}
        </button>
    );
}
