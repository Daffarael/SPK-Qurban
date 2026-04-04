'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

/* ─── SVG Icon Components ─── */
const icons = {
    dashboard: (active) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? 'currentColor' : 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
    ),
    cow: (active) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 9V6a2 2 0 0 1 2-2h1l1-2h2l1 2h6l1-2h2l1 2h1a2 2 0 0 1 2 2v3" />
            <path d="M2 9a8 8 0 0 0 3.2 6.4L4 22h16l-1.2-6.6A8 8 0 0 0 22 9" />
            <circle cx="9" cy="10" r="1" fill="currentColor" />
            <circle cx="15" cy="10" r="1" fill="currentColor" />
        </svg>
    ),
    tag: (active) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2z" />
            <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
        </svg>
    ),
    plus: (active) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
    ),
    warning: (active) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    ),
    order: (active) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </svg>
    ),
    collapse: (active) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
            <polyline points="14 8 17 12 14 16" />
        </svg>
    ),
    expand: (active) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
            <polyline points="17 8 14 12 17 16" />
        </svg>
    ),
    logout: (active) => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
    ),
    sun: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
    ),
    moon: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    ),
};

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const pathname = usePathname();
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const menuItems = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
        { href: '/admin/sapi', label: 'Daftar Sapi', icon: 'cow' },
        { href: '/admin/jenis-sapi', label: 'Jenis Sapi', icon: 'tag' },
        { href: '/admin/sapi/tambah', label: 'Tambah Sapi', icon: 'plus' },
        { href: '/admin/pemesanan', label: 'Pemesanan', icon: 'order' },
    ];

    const isItemActive = (item) => {
        if (item.href === '/admin/dashboard') return pathname === item.href;
        if (item.href === '/admin/sapi') return pathname === item.href;
        return pathname === item.href || pathname.startsWith(item.href);
    };

    return (
        <aside style={{
            width: collapsed ? '76px' : '264px',
            height: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
            backgroundColor: 'var(--color-sidebar-bg)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 50,
            overflow: 'hidden',
            borderRight: '1px solid var(--color-border-light)',
        }}>

            {/* ─── Header / Brand ─── */}
            <div style={{
                padding: collapsed ? '20px 12px' : '20px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                minHeight: '72px',
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: '1px solid var(--color-border-light)',
                }}>
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={26}
                        height={26}
                        style={{ objectFit: 'contain' }}
                    />
                </div>
                {!collapsed && (
                    <div style={{
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        opacity: collapsed ? 0 : 1,
                        transition: 'opacity 0.2s ease',
                    }}>
                        <div style={{
                            fontSize: '15px',
                            fontWeight: 700,
                            color: 'var(--color-text)',
                            letterSpacing: '-0.3px',
                            lineHeight: 1.3,
                        }}>
                            Ghaffar Farm
                        </div>
                        <div style={{
                            fontSize: '11px',
                            color: 'var(--color-text-muted)',
                            fontWeight: 500,
                            letterSpacing: '0.2px',
                        }}>
                            Admin Panel
                        </div>
                    </div>
                )}
            </div>

            {/* ─── Section Label ─── */}
            {!collapsed && (
                <div style={{
                    padding: '4px 24px 8px',
                    fontSize: '10px',
                    fontWeight: 600,
                    color: 'var(--color-text-muted)',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                }}>
                    Menu
                </div>
            )}

            {/* ─── Navigation ─── */}
            <nav style={{
                flex: 1,
                padding: collapsed ? '4px 10px' : '4px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                overflowY: 'auto',
            }}>
                {menuItems.map((item) => {
                    const isActive = isItemActive(item);
                    const isHovered = hoveredItem === item.href;
                    const IconComponent = icons[item.icon];

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={collapsed ? item.label : undefined}
                            onMouseEnter={() => setHoveredItem(item.href)}
                            onMouseLeave={() => setHoveredItem(null)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: collapsed ? '11px 0' : '10px 14px',
                                borderRadius: '10px',
                                textDecoration: 'none',
                                fontSize: '13.5px',
                                fontWeight: isActive ? 600 : 500,
                                color: isActive
                                    ? 'white'
                                    : isHovered
                                        ? 'var(--color-primary-600)'
                                        : 'var(--color-text-secondary)',
                                backgroundColor: isActive
                                    ? 'var(--color-primary-500)'
                                    : isHovered
                                        ? 'var(--color-sidebar-hover)'
                                        : 'transparent',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                whiteSpace: 'nowrap',
                                position: 'relative',
                                justifyContent: collapsed ? 'center' : 'flex-start',
                                boxShadow: isActive ? '0 2px 8px rgba(14, 165, 233, 0.3)' : 'none',
                            }}
                        >
                            <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                width: '22px',
                                height: '22px',
                                transition: 'transform 0.2s ease',
                                transform: isHovered && !isActive ? 'scale(1.1)' : 'scale(1)',
                            }}>
                                {IconComponent && IconComponent(isActive)}
                            </span>
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* ─── Bottom Actions ─── */}
            <div style={{
                padding: collapsed ? '12px 10px' : '12px',
                borderTop: '1px solid var(--color-border-light)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
            }}>
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    title={theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
                    onMouseEnter={() => setHoveredItem('theme')}
                    onMouseLeave={() => setHoveredItem(null)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: collapsed ? '10px 0' : '10px 14px',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: hoveredItem === 'theme' ? 'var(--color-sidebar-hover)' : 'transparent',
                        color: hoveredItem === 'theme' ? 'var(--color-primary-600)' : 'var(--color-text-muted)',
                        cursor: 'pointer',
                        fontSize: '13.5px',
                        fontWeight: 500,
                        width: '100%',
                        transition: 'all 0.2s ease',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        fontFamily: 'inherit',
                    }}
                >
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px' }}>
                        {theme === 'light' ? icons.moon() : icons.sun()}
                    </span>
                    {!collapsed && <span>{theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}</span>}
                </button>

                {/* Collapse Button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    onMouseEnter={() => setHoveredItem('collapse')}
                    onMouseLeave={() => setHoveredItem(null)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: collapsed ? '10px 0' : '10px 14px',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: hoveredItem === 'collapse' ? 'var(--color-sidebar-hover)' : 'transparent',
                        color: hoveredItem === 'collapse' ? 'var(--color-primary-600)' : 'var(--color-text-muted)',
                        cursor: 'pointer',
                        fontSize: '13.5px',
                        fontWeight: 500,
                        width: '100%',
                        transition: 'all 0.2s ease',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        fontFamily: 'inherit',
                    }}
                >
                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '22px',
                        height: '22px',
                        transition: 'transform 0.3s ease',
                    }}>
                        {collapsed ? icons.collapse() : icons.expand()}
                    </span>
                    {!collapsed && <span>Tutup Sidebar</span>}
                </button>

                {/* Logout */}
                <button
                    onClick={logout}
                    onMouseEnter={() => setHoveredItem('logout')}
                    onMouseLeave={() => setHoveredItem(null)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: collapsed ? '10px 0' : '10px 14px',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: hoveredItem === 'logout' ? 'rgba(239, 68, 68, 0.08)' : 'transparent',
                        color: hoveredItem === 'logout' ? 'var(--color-danger)' : 'var(--color-text-muted)',
                        cursor: 'pointer',
                        fontSize: '13.5px',
                        fontWeight: 500,
                        width: '100%',
                        transition: 'all 0.2s ease',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        fontFamily: 'inherit',
                    }}
                >
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px' }}>
                        {icons.logout()}
                    </span>
                    {!collapsed && <span>Keluar</span>}
                </button>
            </div>
        </aside>
    );
}
