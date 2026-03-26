'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/common/ThemeToggle';

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const { logout } = useAuth();

    const menuItems = [
        {
            href: '/admin/dashboard',
            label: 'Dashboard',
            icon: '📊'
        },
        {
            href: '/admin/sapi',
            label: 'Daftar Sapi',
            icon: '🐄'
        },
        {
            href: '/admin/jenis-sapi',
            label: 'Jenis Sapi',
            icon: '🏷️'
        },
        {
            href: '/admin/sapi/tambah',
            label: 'Tambah Sapi',
            icon: '➕'
        },
        {
            href: '/admin/sapi/tidak-lolos',
            label: 'Tidak Lolos',
            icon: '⚠️'
        },
        {
            href: '/admin/pemesanan',
            label: 'Pemesanan',
            icon: '📋'
        }
    ];

    return (
        <aside style={{
            width: collapsed ? '72px' : '260px',
            height: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
            backgroundColor: 'var(--color-sidebar-bg)',
            borderRight: '1px solid var(--color-border-light)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.25s ease',
            zIndex: 50,
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                padding: collapsed ? '20px 16px' : '20px',
                borderBottom: '1px solid var(--color-border-light)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                minHeight: '70px'
            }}>
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
                        alt="Logo"
                        width={24}
                        height={24}
                        style={{ objectFit: 'contain' }}
                    />
                </div>
                {!collapsed && (
                    <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>
                            Admin Panel
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                            Ghaffar Farm Bersaudara
                        </div>
                    </div>
                )}
            </div>

            {/* Menu Items */}
            <div style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/admin/dashboard' && pathname.startsWith(item.href) && item.href !== '/admin/sapi' || pathname === item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={collapsed ? item.label : undefined}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: collapsed ? '12px 16px' : '10px 14px',
                                borderRadius: 'var(--radius-md)',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: isActive ? 600 : 500,
                                color: isActive ? 'white' : 'var(--color-text-secondary)',
                                backgroundColor: isActive ? 'var(--color-sidebar-active)' : 'transparent',
                                transition: 'all 0.15s ease',
                                whiteSpace: 'nowrap'
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'var(--color-sidebar-hover)';
                                    e.currentTarget.style.color = 'var(--color-primary-600)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                                }
                            }}
                        >
                            <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.icon}</span>
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </div>

            {/* Bottom Actions */}
            <div style={{
                padding: '12px 8px',
                borderTop: '1px solid var(--color-border-light)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
            }}>
                {/* Theme Toggle */}
                <div style={{
                    display: 'flex',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    padding: collapsed ? '4px' : '4px 6px'
                }}>
                    <ThemeToggle />
                </div>

                {/* Collapse Button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: collapsed ? '10px 16px' : '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'var(--color-text-muted)',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 500,
                        width: '100%',
                        transition: 'all 0.15s ease',
                        justifyContent: collapsed ? 'center' : 'flex-start'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-sidebar-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <span style={{ fontSize: '16px', transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease' }}>
                        ◀
                    </span>
                    {!collapsed && <span>Tutup Sidebar</span>}
                </button>

                {/* Logout */}
                <button
                    onClick={logout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: collapsed ? '10px 16px' : '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'var(--color-danger)',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 500,
                        width: '100%',
                        transition: 'all 0.15s ease',
                        justifyContent: collapsed ? 'center' : 'flex-start'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fef2f2';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                >
                    <span style={{ fontSize: '16px' }}>🚪</span>
                    {!collapsed && <span>Keluar</span>}
                </button>
            </div>
        </aside>
    );
}
