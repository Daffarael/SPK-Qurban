'use client';

import { useEffect, useRef } from 'react';

export default function Modal({ judul, isOpen, onClose, children, lebar = '500px' }) {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleBackdropClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            onClick={handleBackdropClick}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(4px)',
                padding: '20px',
                animation: 'fadeIn 0.2s ease-out'
            }}
        >
            <div
                ref={modalRef}
                style={{
                    backgroundColor: 'var(--color-bg-card)',
                    borderRadius: 'var(--radius-xl)',
                    maxWidth: lebar,
                    width: '100%',
                    maxHeight: '85vh',
                    overflow: 'auto',
                    boxShadow: 'var(--shadow-lg)',
                    animation: 'fadeIn 0.25s ease-out'
                }}
            >
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px 24px 16px',
                    borderBottom: '1px solid var(--color-border-light)'
                }}>
                    <h3 style={{
                        fontSize: '17px',
                        fontWeight: 700,
                        color: 'var(--color-text)'
                    }}>
                        {judul}
                    </h3>
                    <button
                        onClick={onClose}
                        style={{
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: 'var(--color-border-light)',
                            color: 'var(--color-text-secondary)',
                            cursor: 'pointer',
                            fontSize: '18px',
                            transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'var(--color-danger)';
                            e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'var(--color-border-light)';
                            e.target.style.color = 'var(--color-text-secondary)';
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '20px 24px 24px' }}>
                    {children}
                </div>
            </div>
        </div>
    );
}
