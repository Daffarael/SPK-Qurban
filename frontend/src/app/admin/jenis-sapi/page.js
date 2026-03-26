'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function JenisSapiPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formNama, setFormNama] = useState('');
    const [formDeskripsi, setFormDeskripsi] = useState('');
    const [editId, setEditId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/jenis-sapi');
            setData(res.data.data);
        } catch (err) {
            toast.error('Gagal memuat data jenis sapi.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormNama('');
        setFormDeskripsi('');
        setEditId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formNama.trim()) return;
        setSubmitting(true);

        try {
            if (editId) {
                await api.put(`/jenis-sapi/${editId}`, { nama: formNama, deskripsi: formDeskripsi });
                toast.success('Jenis sapi berhasil diperbarui!');
            } else {
                await api.post('/jenis-sapi', { nama: formNama, deskripsi: formDeskripsi });
                toast.success('Jenis sapi berhasil ditambahkan!');
            }
            resetForm();
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Terjadi kesalahan.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (item) => {
        setEditId(item.id);
        setFormNama(item.nama);
        setFormDeskripsi(item.deskripsi || '');
    };

    const handleDelete = async (id, nama) => {
        if (!confirm(`Hapus jenis sapi "${nama}"?`)) return;

        try {
            await api.delete(`/jenis-sapi/${id}`);
            toast.success('Jenis sapi berhasil dihapus.');
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal menghapus.');
        }
    };

    const cardStyle = {
        backgroundColor: 'var(--color-bg-card)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        border: '1px solid var(--color-border-light)'
    };

    const inputStyle = {
        width: '100%',
        padding: '10px 14px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text)',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s ease'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '13px',
        fontWeight: 600,
        color: 'var(--color-text-secondary)',
        marginBottom: '6px'
    };

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text)' }}>
                    Daftar Jenis Sapi
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    Kelola jenis/ras sapi yang tersedia di peternakan.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px', alignItems: 'start' }}>
                {/* Form Tambah/Edit */}
                <div style={cardStyle}>
                    <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '20px' }}>
                        {editId ? '✏️ Edit Jenis Sapi' : '➕ Tambah Jenis Sapi'}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '14px' }}>
                            <label style={labelStyle}>Nama Jenis Sapi *</label>
                            <input
                                type="text"
                                value={formNama}
                                onChange={(e) => setFormNama(e.target.value)}
                                placeholder="Contoh: Limousin"
                                required
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: '18px' }}>
                            <label style={labelStyle}>Deskripsi (opsional)</label>
                            <textarea
                                value={formDeskripsi}
                                onChange={(e) => setFormDeskripsi(e.target.value)}
                                placeholder="Deskripsi singkat tentang jenis sapi ini..."
                                rows={3}
                                style={{ ...inputStyle, resize: 'vertical', minHeight: '70px' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                type="submit"
                                disabled={submitting}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: 'var(--radius-md)',
                                    border: 'none',
                                    backgroundColor: submitting ? 'var(--color-primary-300)' : 'var(--color-primary-500)',
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    cursor: submitting ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {submitting ? 'Menyimpan...' : (editId ? 'Simpan Perubahan' : 'Tambah')}
                            </button>
                            {editId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    style={{
                                        padding: '10px 18px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--color-border)',
                                        backgroundColor: 'transparent',
                                        color: 'var(--color-text-secondary)',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Batal
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Tabel Daftar */}
                <div style={cardStyle}>
                    <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '20px' }}>
                        📋 Daftar Jenis Sapi ({data.length})
                    </h2>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                            Memuat data...
                        </div>
                    ) : data.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            color: 'var(--color-text-muted)',
                            backgroundColor: 'var(--color-bg-secondary)',
                            borderRadius: 'var(--radius-md)'
                        }}>
                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏷️</div>
                            <div>Belum ada jenis sapi. Tambahkan yang pertama!</div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {data.map((item) => (
                                <div
                                    key={item.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '14px 16px',
                                        backgroundColor: editId === item.id ? 'var(--color-primary-50)' : 'var(--color-bg-secondary)',
                                        borderRadius: 'var(--radius-md)',
                                        border: editId === item.id ? '1px solid var(--color-primary-200)' : '1px solid transparent',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    <div>
                                        <div style={{
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: 'var(--color-text)',
                                            marginBottom: item.deskripsi ? '2px' : 0
                                        }}>
                                            {item.nama}
                                        </div>
                                        {item.deskripsi && (
                                            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                                                {item.deskripsi}
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                                        <button
                                            onClick={() => handleEdit(item)}
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: 'var(--radius-sm)',
                                                border: '1px solid var(--color-border)',
                                                backgroundColor: 'var(--color-bg)',
                                                color: 'var(--color-primary-600)',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id, item.nama)}
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: 'var(--radius-sm)',
                                                border: '1px solid #fecaca',
                                                backgroundColor: '#fef2f2',
                                                color: 'var(--color-danger)',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            🗑️ Hapus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
