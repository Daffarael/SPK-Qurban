'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { FiUser, FiLock, FiArrowRight } from 'react-icons/fi';

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

    const inputStyle = {
        width: '100%',
        padding: '11px 14px 11px 40px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text)',
        fontSize: '13px',
        outline: 'none',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '12px',
        fontWeight: 600,
        color: 'var(--color-text-muted)',
        marginBottom: '6px',
        letterSpacing: '0.3px',
        textTransform: 'uppercase'
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-bg)',
            padding: '20px'
        }}>
            <div className="animate-fade-in" style={{
                width: '100%',
                maxWidth: '380px',
                backgroundColor: 'var(--color-bg-card)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 0 0 1px var(--color-border-light)',
                padding: '36px 32px'
            }}>
                {/* Logo & Title */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '14px',
                        backgroundColor: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto'
                    }}>
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={32}
                            height={32}
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                    <h1 style={{
                        fontSize: '18px',
                        fontWeight: 700,
                        color: 'var(--color-text)',
                        marginTop: '14px',
                        letterSpacing: '-0.2px'
                    }}>
                        Panel Admin
                    </h1>
                    <p style={{
                        fontSize: '12px',
                        color: 'var(--color-text-muted)',
                        marginTop: '3px'
                    }}>
                        PT Ghaffar Farm Bersaudara
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'rgba(239,68,68,0.06)',
                        color: 'var(--color-danger)',
                        fontSize: '12px',
                        fontWeight: 500,
                        marginBottom: '18px',
                        border: '1px solid rgba(239,68,68,0.15)'
                    }}>
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '14px' }}>
                        <label style={labelStyle}>Username</label>
                        <div style={{ position: 'relative' }}>
                            <FiUser
                                size={15}
                                style={{
                                    position: 'absolute',
                                    left: '13px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--color-text-muted)',
                                    pointerEvents: 'none'
                                }}
                            />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Masukkan username"
                                required
                                style={inputStyle}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'var(--color-primary-400)';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.08)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'var(--color-border)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '22px' }}>
                        <label style={labelStyle}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <FiLock
                                size={15}
                                style={{
                                    position: 'absolute',
                                    left: '13px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--color-text-muted)',
                                    pointerEvents: 'none'
                                }}
                            />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Masukkan password"
                                required
                                style={inputStyle}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'var(--color-primary-400)';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(14,165,233,0.08)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'var(--color-border)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '11px',
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            backgroundColor: loading ? 'var(--color-primary-300)' : 'var(--color-primary-500)',
                            color: 'white',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) e.target.style.backgroundColor = 'var(--color-primary-600)';
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) e.target.style.backgroundColor = 'var(--color-primary-500)';
                        }}
                    >
                        {loading ? 'Memproses...' : 'Masuk'}
                        {!loading && <FiArrowRight size={14} />}
                    </button>
                </form>
            </div>
        </div>
    );
}
