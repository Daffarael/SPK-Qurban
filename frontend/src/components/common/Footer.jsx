'use client';

import Image from 'next/image';

export default function Footer() {
    return (
        <footer style={{
            borderTop: '1px solid var(--color-border-light)',
            backgroundColor: 'var(--color-bg-secondary)',
            padding: '40px 24px',
            transition: 'all 0.3s ease'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px'
            }}>
                {/* Logo & Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <Image
                            src="/logo.png"
                            alt="PT Ghaffar Farm Bersaudara"
                            width={24}
                            height={24}
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                    <div>
                        <div style={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: 'var(--color-text)'
                        }}>
                            PT Ghaffar Farm Bersaudara
                        </div>
                        <div style={{
                            fontSize: '12px',
                            color: 'var(--color-text-muted)'
                        }}>
                            Baru Setiap Hari (Since 2012)
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div style={{
                    fontSize: '12px',
                    color: 'var(--color-text-muted)'
                }}>
                    © {new Date().getFullYear()} PT Ghaffar Farm Bersaudara. Baru Setiap Hari.
                </div>
            </div>
        </footer>
    );
}
