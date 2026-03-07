'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(username, password);
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan. Coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 30%, #f8fafc 60%, #f0f9ff 100%)',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Floating Background Elements */}
            <motion.div
                animate={{ y: [-15, 15, -15], x: [-8, 8, -8], rotate: [0, 5, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                    position: 'absolute', top: '15%', left: '15%',
                    width: '200px', height: '200px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)',
                    filter: 'blur(40px)'
                }}
            />
            <motion.div
                animate={{ y: [10, -20, 10], x: [5, -10, 5] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                    position: 'absolute', bottom: '20%', right: '15%',
                    width: '250px', height: '250px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)',
                    filter: 'blur(50px)'
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    backgroundColor: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
                    padding: '44px 36px',
                    border: '1px solid rgba(255,255,255,0.6)',
                    position: 'relative',
                    zIndex: 1
                }}
            >
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                    style={{ textAlign: 'center', marginBottom: '28px' }}
                >
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        boxShadow: '0 6px 20px rgba(14,165,233,0.3)'
                    }}>
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={52}
                            height={52}
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)', marginTop: '16px' }}
                    >
                        Panel Admin
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.45 }}
                        style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}
                    >
                        PT Ghaffar Farm Bersaudara
                    </motion.p>
                </motion.div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        style={{
                            padding: '10px 14px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: '#fef2f2',
                            color: 'var(--color-danger)',
                            fontSize: '13px',
                            fontWeight: 500,
                            marginBottom: '20px',
                            border: '1px solid #fecaca'
                        }}
                    >
                        {error}
                    </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        style={{ marginBottom: '16px' }}
                    >
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Masukkan username"
                            required
                            style={{
                                width: '100%', padding: '11px 14px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'rgba(255,255,255,0.7)',
                                color: 'var(--color-text)', fontSize: '14px', outline: 'none',
                                transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                            }}
                            onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary-400)'; e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.1)'; }}
                            onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'none'; }}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        style={{ marginBottom: '24px' }}
                    >
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Masukkan password"
                            required
                            style={{
                                width: '100%', padding: '11px 14px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'rgba(255,255,255,0.7)',
                                color: 'var(--color-text)', fontSize: '14px', outline: 'none',
                                transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                            }}
                            onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary-400)'; e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.1)'; }}
                            onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'none'; }}
                        />
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        whileHover={{ scale: 1.02, boxShadow: '0 6px 20px rgba(14,165,233,0.35)' }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%', padding: '12px',
                            borderRadius: 'var(--radius-md)', border: 'none',
                            background: loading ? 'var(--color-primary-300)' : 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))',
                            color: 'white', fontSize: '14px', fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            boxShadow: '0 4px 14px rgba(14,165,233,0.25)',
                            transition: 'background 0.2s ease'
                        }}
                    >
                        {loading ? 'Memproses...' : 'Masuk'}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
