'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/admin/Sidebar';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function AdminLayout({ children }) {
    const { admin, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !admin) {
            router.push('/gfb-panel');
        }
    }, [admin, loading, router]);

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LoadingSpinner text="Memuat panel admin..." />
            </div>
        );
    }

    if (!admin) return null;

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <main style={{
                flex: 1,
                marginLeft: '260px',
                padding: '28px 32px',
                backgroundColor: 'var(--color-bg-secondary)',
                transition: 'all 0.25s ease',
                minHeight: '100vh'
            }}>
                {children}
            </main>
        </div>
    );
}
