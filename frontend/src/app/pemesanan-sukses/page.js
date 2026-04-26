'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

function SuksesContent() {
    const searchParams = useSearchParams();
    const kode = searchParams.get('kode');
    const metode = searchParams.get('metode'); // 'midtrans' atau 'ditempat'
    const pending = searchParams.get('pending'); // '1' jika midtrans belum selesai

    const isMidtrans = metode === 'midtrans';
    const isPending = pending === '1';

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
            {/* Success Animation */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                style={{
                    width: '100px', height: '100px', borderRadius: '50%',
                    background: isPending
                        ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                        : 'linear-gradient(135deg, #10b981, #059669)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px', fontSize: '48px',
                    boxShadow: isPending
                        ? '0 8px 25px rgba(245, 158, 11, 0.3)'
                        : '0 8px 25px rgba(16, 185, 129, 0.3)'
                }}
            >
                {isPending ? '⏳' : '✓'}
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-text)', marginBottom: '8px' }}
            >
                {isPending ? 'Menunggu Pembayaran' : 'Pemesanan Berhasil!'}
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{ fontSize: '15px', color: 'var(--color-text-secondary)', marginBottom: '28px', lineHeight: 1.6 }}
            >
                {isPending
                    ? 'Pembayaran Anda sedang diproses. Kami akan mengirim notifikasi ke WhatsApp setelah pembayaran dikonfirmasi.'
                    : isMidtrans
                        ? 'Pembayaran berhasil! Notifikasi telah dikirim ke WhatsApp Anda.'
                        : 'Pesanan Anda telah tercatat. Notifikasi telah dikirim ke WhatsApp Anda.'}
            </motion.p>

            {/* Kode Pemesanan */}
            {kode && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{
                        padding: '20px', backgroundColor: 'var(--color-bg-secondary)',
                        borderRadius: 'var(--radius-lg)', border: '2px dashed var(--color-primary-300)',
                        marginBottom: '24px'
                    }}
                >
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '6px' }}>
                        KODE PEMESANAN ANDA
                    </div>
                    <div style={{
                        fontSize: '28px', fontWeight: 800, color: 'var(--color-primary-500)',
                        fontFamily: 'monospace', letterSpacing: '2px'
                    }}>
                        {kode}
                    </div>
                </motion.div>
            )}

            {/* Metode Badge */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px', borderRadius: '999px', marginBottom: '20px',
                    backgroundColor: isMidtrans ? '#eff6ff' : '#f0fdf4',
                    color: isMidtrans ? '#2563eb' : '#16a34a',
                    fontSize: '13px', fontWeight: 600,
                    border: `1px solid ${isMidtrans ? '#bfdbfe' : '#bbf7d0'}`
                }}
            >
                {isMidtrans ? '💳 Pembayaran Online' : '🏪 Bayar di Tempat'}
            </motion.div>

            {/* Info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{
                    padding: '16px', backgroundColor: '#fffbeb', borderRadius: 'var(--radius-md)',
                    border: '1px solid #fde68a', fontSize: '13px', color: '#92400e',
                    textAlign: 'left', marginBottom: '24px', lineHeight: 1.6
                }}
            >
                ⚠️ <strong>Penting:</strong>
                <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
                    {isMidtrans ? (
                        <>
                            <li>Notifikasi pembayaran dikirim ke WhatsApp Anda</li>
                            <li>Simpan kode pemesanan untuk cek status</li>
                        </>
                    ) : (
                        <>
                            <li>Pemesanan berlaku selama <strong>48 jam</strong></li>
                            <li>Silakan datang ke peternakan untuk konfirmasi pembayaran</li>
                            <li>📍 <strong>Marang, Tanjung Balik Kec. Pangkalan Kab. Limapuluh Kota</strong></li>
                            <li>Simpan kode pemesanan untuk cek status</li>
                        </>
                    )}
                </ul>
            </motion.div>

            {/* Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}
            >
                <Link href="/cek-pemesanan" style={{
                    padding: '12px 24px', borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-primary-500)', color: 'white',
                    textDecoration: 'none', fontSize: '14px', fontWeight: 600
                }}>
                    Cek Status Pemesanan
                </Link>
                <Link href="/katalog" style={{
                    padding: '12px 24px', borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)',
                    color: 'var(--color-text)', textDecoration: 'none', fontSize: '14px', fontWeight: 600
                }}>
                    Kembali ke Katalog
                </Link>
            </motion.div>
        </div>
    );
}

export default function PemesananSuksesPage() {
    return (
        <>
            <Navbar />
            <main style={{
                minHeight: '70vh', display: 'flex', alignItems: 'center',
                justifyContent: 'center', padding: '60px 24px'
            }}>
                <Suspense>
                    <SuksesContent />
                </Suspense>
            </main>
            <Footer />
        </>
    );
}
