'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/services/api';
import KartuStatistik from '@/components/admin/KartuStatistik';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.07, delayChildren: 0.1 }
    }
};

const item = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }
};

export default function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [sapiRes, pemesananRes] = await Promise.all([
                api.get('/sapi'),
                api.get('/pemesanan')
            ]);

            const daftarSapi = sapiRes.data.data || [];
            const daftarPemesanan = pemesananRes.data.data || [];

            const today = new Date().toDateString();
            const pemesananHariIni = daftarPemesanan.filter(p =>
                new Date(p.createdAt).toDateString() === today
            );

            setStats({
                totalSapi: daftarSapi.length,
                available: daftarSapi.filter(s => s.status === 'Available').length,
                booked: daftarSapi.filter(s => s.status === 'Booked').length,
                sold: daftarSapi.filter(s => s.status === 'Sold').length,
                platinum: daftarSapi.filter(s => s.grade === 'Platinum').length,
                gold: daftarSapi.filter(s => s.grade === 'Gold').length,
                silver: daftarSapi.filter(s => s.grade === 'Silver').length,
                tidakLolos: daftarSapi.filter(s => !s.skor_saw || s.skor_saw < 60).length,
                totalPemesanan: daftarPemesanan.length,
                pending: daftarPemesanan.filter(p => p.status === 'Pending').length,
                confirmed: daftarPemesanan.filter(p => p.status === 'Confirmed').length,
                pemesananHariIni: pemesananHariIni.length
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner text="Memuat dashboard..." />;

    return (
        <div>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ marginBottom: '28px' }}
            >
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-text)' }}>
                    Dashboard
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    Selamat datang di panel admin PT Ghaffar Farm Bersaudara
                </p>
            </motion.div>

            {/* Statistik Sapi */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                style={{ marginBottom: '8px' }}
            >
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>
                    STATISTIK SAPI
                </span>
            </motion.div>
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '14px',
                    marginBottom: '28px'
                }}
            >
                <motion.div variants={item}><KartuStatistik icon="🐄" label="Total Sapi" value={stats?.totalSapi || 0} /></motion.div>
                <motion.div variants={item}><KartuStatistik icon="✅" label="Available" value={stats?.available || 0} /></motion.div>
                <motion.div variants={item}><KartuStatistik icon="📌" label="Booked" value={stats?.booked || 0} /></motion.div>
                <motion.div variants={item}><KartuStatistik icon="🏷️" label="Sold" value={stats?.sold || 0} /></motion.div>
            </motion.div>

            {/* Grade Distribution */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{ marginBottom: '8px' }}
            >
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>
                    DISTRIBUSI GRADE
                </span>
            </motion.div>
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '14px',
                    marginBottom: '28px'
                }}
            >
                <motion.div variants={item}><KartuStatistik icon="💎" label="Platinum" value={stats?.platinum || 0} /></motion.div>
                <motion.div variants={item}><KartuStatistik icon="🥇" label="Gold" value={stats?.gold || 0} /></motion.div>
                <motion.div variants={item}><KartuStatistik icon="🥈" label="Silver" value={stats?.silver || 0} /></motion.div>
                <motion.div variants={item}><KartuStatistik icon="⚠️" label="Tidak Lolos" value={stats?.tidakLolos || 0} /></motion.div>
            </motion.div>

            {/* Pemesanan */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                style={{ marginBottom: '8px' }}
            >
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>
                    PEMESANAN
                </span>
            </motion.div>
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '14px'
                }}
            >
                <motion.div variants={item}><KartuStatistik icon="📦" label="Total Pesanan" value={stats?.totalPemesanan || 0} /></motion.div>
                <motion.div variants={item}><KartuStatistik icon="⏳" label="Pending" value={stats?.pending || 0} /></motion.div>
                <motion.div variants={item}><KartuStatistik icon="✅" label="Confirmed" value={stats?.confirmed || 0} /></motion.div>
                <motion.div variants={item}><KartuStatistik icon="📅" label="Hari Ini" value={stats?.pemesananHariIni || 0} /></motion.div>
            </motion.div>
        </div>
    );
}
