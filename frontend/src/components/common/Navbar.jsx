'use client';

import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from '@/components/common/ThemeToggle';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    const links = [
        { href: '/', label: 'Beranda' },
        { href: '/katalog', label: 'Katalog Sapi' },
        { href: '/cek-pemesanan', label: 'Cek Pemesanan' }
    ];

    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backgroundColor: 'var(--color-bg)',
            borderBottom: '1px solid var(--color-border-light)',
            backdropFilter: 'blur(12px)',
            transition: 'all 0.3s ease'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 24px',
                height: '70px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                {/* Logo */}
                <Link href="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    textDecoration: 'none',
                    color: 'var(--color-text)'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
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
                            width={28}
                            height={28}
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                    <div>
                        <div style={{
                            fontSize: '15px',
                            fontWeight: 700,
                            lineHeight: 1.2,
                            color: 'var(--color-text)'
                        }}>
                            Ghaffar Farm Bersaudara
                        </div>
                        <div style={{
                            fontSize: '11px',
                            color: 'var(--color-text-muted)',
                            fontWeight: 500
                        }}>
                            SPK Sapi Qurban
                        </div>
                    </div>
                </Link>

                {/* Navigation Links */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '14px',
                                    fontWeight: isActive ? 600 : 500,
                                    textDecoration: 'none',
                                    color: isActive ? 'var(--color-primary-600)' : 'var(--color-text-secondary)',
                                    backgroundColor: isActive ? 'var(--color-primary-50)' : 'transparent',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {link.label}
                            </Link>
                        );
                    })}

                    <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)', margin: '0 8px' }} />
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
}
