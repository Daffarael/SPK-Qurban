'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp, FiEdit3 } from 'react-icons/fi';

const KODE_KRITERIA = ['c2', 'c3', 'c4', 'c5', 'c6'];
const LABEL_DEFAULT = {
    c2: 'Body Condition Score',
    c3: 'Konformasi & Postur',
    c4: 'Vitalitas & Kesehatan',
    c5: 'Kekokohan Kaki',
    c6: 'Temperamen'
};

// Item umum yang akan di-prefill untuk jenis sapi baru
const ITEMS_DEFAULT = {
    c2: [
        'Tulang rusuk tidak terlihat dan tidak mudah teraba',
        'Daging paha dan pantat membulat penuh',
        'Lapisan lemak subkutan teraba merata di seluruh badan',
        'Perut proporsional (tidak buncit/kembung)',
        'Area pangkal ekor tertutup lemak'
    ],
    c3: [
        'Punggung lurus sempurna (tidak lordosis/kifosis)',
        'Dada dalam dan lebar',
        'Kepala proporsional dengan ukuran badan',
        'Pinggul lebar dan simetris',
        'Tanduk/bekas tanduk utuh dan simetris'
    ],
    c4: [
        'Mata bening, bersinar, dan tidak berair/belekan',
        'Napas teratur, tidak ngos-ngosan saat istirahat',
        'Area anus bersih (tidak ada tanda diare)',
        'Bulu mengkilap, kulit lentur, bebas parasit eksternal',
        'Hidung lembab dan bersih (tidak berlendir berlebihan)'
    ],
    c5: [
        'Keempat kaki tegak lurus (tidak X-leg atau O-leg)',
        'Kuku utuh, keras, dan bebas infeksi',
        'Langkah mantap dan seimbang (tidak pincang)',
        'Berdiri kokoh tanpa gemetar',
        'Persendian tidak bengkak atau meradang'
    ],
    c6: [
        'Tenang saat didekati banyak orang',
        'Mudah dikendalikan dengan tali kekang',
        'Tidak menunjukkan gestur agresif/menyeruduk',
        'Tidak gelisah berlebihan saat diperiksa',
        'Tetap tenang saat lingkungan ramai'
    ]
};

function buatKriteriaDefault() {
    return KODE_KRITERIA.map(kode => ({
        kode_kriteria: kode,
        label: LABEL_DEFAULT[kode],
        items: [...ITEMS_DEFAULT[kode]]
    }));
}

export default function JenisSapiPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formNama, setFormNama] = useState('');
    const [formDeskripsi, setFormDeskripsi] = useState('');
    const [formKriteria, setFormKriteria] = useState(buatKriteriaDefault());
    const [openSections, setOpenSections] = useState({});
    const [editId, setEditId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [expandedDetail, setExpandedDetail] = useState(null);

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
        setFormKriteria(buatKriteriaDefault());
        setEditId(null);
        setOpenSections({});
    };

    const toggleSection = (kode) => {
        setOpenSections(prev => ({ ...prev, [kode]: !prev[kode] }));
    };

    // Update label kriteria
    const updateLabel = (kode, value) => {
        setFormKriteria(prev => prev.map(k =>
            k.kode_kriteria === kode ? { ...k, label: value } : k
        ));
    };

    // Update item checklist
    const updateItem = (kode, index, value) => {
        setFormKriteria(prev => prev.map(k =>
            k.kode_kriteria === kode
                ? { ...k, items: k.items.map((item, i) => i === index ? value : item) }
                : k
        ));
    };

    // Tambah item baru
    const tambahItem = (kode) => {
        setFormKriteria(prev => prev.map(k =>
            k.kode_kriteria === kode
                ? { ...k, items: [...k.items, ''] }
                : k
        ));
    };

    // Hapus item (minimal 5)
    const hapusItem = (kode, index) => {
        setFormKriteria(prev => prev.map(k => {
            if (k.kode_kriteria !== kode) return k;
            if (k.items.length <= 5) {
                toast.error('Minimal 5 item per kriteria!');
                return k;
            }
            return { ...k, items: k.items.filter((_, i) => i !== index) };
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formNama.trim()) return;

        // Validasi semua kriteria
        for (const k of formKriteria) {
            if (!k.label.trim()) {
                toast.error(`Label untuk ${k.kode_kriteria.toUpperCase()} wajib diisi!`);
                return;
            }
            const itemsValid = k.items.filter(item => item.trim());
            if (itemsValid.length < 5) {
                toast.error(`${k.kode_kriteria.toUpperCase()} harus punya minimal 5 item (sekarang ${itemsValid.length}).`);
                return;
            }
        }

        setSubmitting(true);

        const payload = {
            nama: formNama,
            deskripsi: formDeskripsi,
            kriteria: formKriteria.map(k => ({
                kode_kriteria: k.kode_kriteria,
                label: k.label.trim(),
                items: k.items.filter(item => item.trim()).map(item => item.trim())
            }))
        };

        try {
            if (editId) {
                await api.put(`/jenis-sapi/${editId}`, payload);
                toast.success('Jenis sapi berhasil diperbarui!');
            } else {
                await api.post('/jenis-sapi', payload);
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

        // Load kriteria dari data
        if (item.kriteriaTemplates && item.kriteriaTemplates.length > 0) {
            const kriteria = KODE_KRITERIA.map(kode => {
                const found = item.kriteriaTemplates.find(kt => kt.kode_kriteria === kode);
                return found
                    ? { kode_kriteria: kode, label: found.label, items: [...found.items] }
                    : { kode_kriteria: kode, label: LABEL_DEFAULT[kode], items: [...ITEMS_DEFAULT[kode]] };
            });
            setFormKriteria(kriteria);
        } else {
            setFormKriteria(buatKriteriaDefault());
        }

        // Buka semua section saat edit
        const allOpen = {};
        KODE_KRITERIA.forEach(k => allOpen[k] = true);
        setOpenSections(allOpen);

        // Scroll ke form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id, nama) => {
        if (!confirm(`Hapus jenis sapi "${nama}" beserta semua kriterianya?`)) return;

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
        padding: '28px',
        border: '1px solid var(--color-border-light)',
        boxShadow: 'var(--shadow-sm)'
    };

    const inputStyle = {
        width: '100%',
        padding: '10px 14px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-text)',
        fontSize: '13px',
        outline: 'none',
        transition: 'border-color 0.2s ease'
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

    const kodeColor = { c2: '#0ea5e9', c3: '#8b5cf6', c4: '#10b981', c5: '#f59e0b', c6: '#ec4899' };

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-text)' }}>
                    Jenis Sapi & Kriteria
                </h1>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    Kelola jenis sapi beserta checklist kriteria penilaian (C2–C6).
                </p>
            </div>

            {/* Form Tambah/Edit */}
            <div style={{ ...cardStyle, marginBottom: '24px' }}>
                <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '20px',
                    paddingBottom: '14px', borderBottom: '1px solid var(--color-border-light)' }}>
                    {editId ? 'Edit Jenis Sapi' : 'Tambah Jenis Sapi Baru'}
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Nama & Deskripsi */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                        <div>
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
                        <div>
                            <label style={labelStyle}>Deskripsi (opsional)</label>
                            <input
                                type="text"
                                value={formDeskripsi}
                                onChange={(e) => setFormDeskripsi(e.target.value)}
                                placeholder="Deskripsi singkat..."
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Kriteria Sections */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ ...labelStyle, marginBottom: '12px' }}>
                            Kriteria Penilaian (C2–C6)
                        </label>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {formKriteria.map((kriteria) => {
                                const isOpen = openSections[kriteria.kode_kriteria];
                                const kode = kriteria.kode_kriteria;
                                const accent = kodeColor[kode] || 'var(--color-primary-500)';

                                return (
                                    <div
                                        key={kode}
                                        style={{
                                            border: '1px solid var(--color-border)',
                                            borderRadius: 'var(--radius-md)',
                                            overflow: 'hidden',
                                            borderLeft: `3px solid ${accent}`
                                        }}
                                    >
                                        {/* Header */}
                                        <div
                                            onClick={() => toggleSection(kode)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '10px 14px',
                                                backgroundColor: 'var(--color-bg-secondary)',
                                                cursor: 'pointer',
                                                userSelect: 'none'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span style={{
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    color: accent,
                                                    letterSpacing: '0.5px'
                                                }}>
                                                    {kode.toUpperCase()}
                                                </span>
                                                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text)' }}>
                                                    {kriteria.label || LABEL_DEFAULT[kode]}
                                                </span>
                                                <span style={{
                                                    fontSize: '11px',
                                                    color: 'var(--color-text-muted)',
                                                    backgroundColor: 'var(--color-bg)',
                                                    padding: '1px 7px',
                                                    borderRadius: '10px',
                                                    border: '1px solid var(--color-border-light)'
                                                }}>
                                                    {kriteria.items.length}
                                                </span>
                                            </div>
                                            <FiChevronDown
                                                size={16}
                                                color="var(--color-text-muted)"
                                                style={{
                                                    transition: 'transform 0.2s ease',
                                                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                                                }}
                                            />
                                        </div>

                                        {/* Body */}
                                        {isOpen && (
                                            <div style={{ padding: '16px' }}>
                                                {/* Label input */}
                                                <div style={{ marginBottom: '14px' }}>
                                                    <label style={{ ...labelStyle, fontSize: '12px' }}>Label Kriteria</label>
                                                    <input
                                                        type="text"
                                                        value={kriteria.label}
                                                        onChange={(e) => updateLabel(kode, e.target.value)}
                                                        placeholder={LABEL_DEFAULT[kode]}
                                                        style={{ ...inputStyle, fontSize: '13px' }}
                                                    />
                                                </div>

                                                {/* Items */}
                                                <label style={{ ...labelStyle, fontSize: '12px' }}>Item Checklist</label>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                    {kriteria.items.map((item, idx) => (
                                                        <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                            <span style={{
                                                                fontSize: '11px',
                                                                color: 'var(--color-text-muted)',
                                                                minWidth: '20px',
                                                                textAlign: 'right'
                                                            }}>
                                                                {idx + 1}.
                                                            </span>
                                                            <input
                                                                type="text"
                                                                value={item}
                                                                onChange={(e) => updateItem(kode, idx, e.target.value)}
                                                                placeholder={`Item checklist ke-${idx + 1}...`}
                                                                style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px' }}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => hapusItem(kode, idx)}
                                                                title="Hapus item"
                                                                style={{
                                                                    padding: '6px',
                                                                    borderRadius: 'var(--radius-sm)',
                                                                    border: '1px solid var(--color-border)',
                                                                    backgroundColor: 'transparent',
                                                                    color: 'var(--color-text-muted)',
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    flexShrink: 0,
                                                                    transition: 'all 0.15s ease'
                                                                }}
                                                                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-danger)'; e.currentTarget.style.borderColor = '#fca5a5'; }}
                                                                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                                                            >
                                                                <FiTrash2 size={13} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Tambah Item */}
                                                <button
                                                    type="button"
                                                    onClick={() => tambahItem(kode)}
                                                    style={{
                                                        marginTop: '10px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        padding: '6px 12px',
                                                        borderRadius: 'var(--radius-sm)',
                                                        border: '1px dashed var(--color-border)',
                                                        backgroundColor: 'transparent',
                                                        color: 'var(--color-primary-600)',
                                                        fontSize: '12px',
                                                        fontWeight: 600,
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <FiPlus size={14} /> Tambah Item
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Submit */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                padding: '10px 24px',
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
                            {submitting ? 'Menyimpan...' : (editId ? 'Simpan Perubahan' : 'Tambah Jenis Sapi')}
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

            {/* Daftar Jenis Sapi */}
            <div style={cardStyle}>
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: '20px', paddingBottom: '14px',
                    borderBottom: '1px solid var(--color-border-light)'
                }}>
                    <div>
                        <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
                            Daftar Jenis Sapi
                        </h2>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
                            {data.length} jenis terdaftar
                        </p>
                    </div>
                </div>

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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {data.map((item) => {
                            const isExpanded = expandedDetail === item.id;
                            const kriteriaCount = item.kriteriaTemplates?.length || 0;
                            const totalItems = item.kriteriaTemplates?.reduce((sum, kt) => sum + (kt.items?.length || 0), 0) || 0;

                            return (
                                <div
                                    key={item.id}
                                    style={{
                                        backgroundColor: editId === item.id ? 'var(--color-primary-50)' : 'var(--color-bg-secondary)',
                                        borderRadius: 'var(--radius-md)',
                                        border: editId === item.id ? '1px solid var(--color-primary-200)' : '1px solid transparent',
                                        overflow: 'hidden',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    {/* Header Row */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '14px 16px'
                                    }}>
                                        <div
                                            style={{ flex: 1, cursor: 'pointer' }}
                                            onClick={() => setExpandedDetail(isExpanded ? null : item.id)}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{
                                                    fontSize: '14px',
                                                    fontWeight: 600,
                                                    color: 'var(--color-text)'
                                                }}>
                                                    {item.nama}
                                                </div>
                                                <span style={{
                                                    fontSize: '11px',
                                                    padding: '2px 8px',
                                                    borderRadius: '10px',
                                                    backgroundColor: 'var(--color-bg)',
                                                    color: 'var(--color-text-muted)',
                                                    border: '1px solid var(--color-border-light)',
                                                    fontWeight: 500
                                                }}>
                                                    {kriteriaCount}/5 kriteria · {totalItems} item
                                                </span>
                                            </div>
                                            {item.deskripsi && (
                                                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
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
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}
                                            >
                                                <FiEdit3 size={12} /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id, item.nama)}
                                                style={{
                                                    padding: '6px 12px',
                                                    borderRadius: 'var(--radius-sm)',
                                                    border: '1px solid var(--color-border)',
                                                    backgroundColor: 'var(--color-bg)',
                                                    color: 'var(--color-text-muted)',
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    transition: 'all 0.15s ease'
                                                }}
                                            >
                                                <FiTrash2 size={12} /> Hapus
                                            </button>
                                        </div>
                                    </div>

                                    {/* Detail Kriteria (Expanded) */}
                                    {isExpanded && item.kriteriaTemplates && (
                                        <div style={{
                                            padding: '0 16px 16px',
                                            borderTop: '1px solid var(--color-border-light)'
                                        }}>
                                            <div style={{ paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {item.kriteriaTemplates.map(kt => {
                                                    const accent = kodeColor[kt.kode_kriteria] || 'var(--color-primary-500)';
                                                    return (
                                                    <div key={kt.id} style={{
                                                        padding: '10px 14px',
                                                        backgroundColor: 'var(--color-bg)',
                                                        borderRadius: 'var(--radius-sm)',
                                                        border: '1px solid var(--color-border-light)',
                                                        borderLeft: `3px solid ${accent}`
                                                    }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                                            <span style={{
                                                                fontSize: '11px',
                                                                fontWeight: 700,
                                                                color: accent,
                                                                letterSpacing: '0.5px'
                                                            }}>
                                                                {kt.kode_kriteria.toUpperCase()}
                                                            </span>
                                                            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text)' }}>
                                                                {kt.label}
                                                            </span>
                                                        </div>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '2px' }}>
                                                            {kt.items.map((itm, idx) => (
                                                                <div key={idx} style={{
                                                                    fontSize: '12px',
                                                                    color: 'var(--color-text-secondary)',
                                                                    display: 'flex',
                                                                    gap: '6px',
                                                                    lineHeight: '1.6'
                                                                }}>
                                                                    <span style={{ color: 'var(--color-text-muted)', minWidth: '16px', textAlign: 'right' }}>
                                                                        {idx + 1}.
                                                                    </span>
                                                                    {itm}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
