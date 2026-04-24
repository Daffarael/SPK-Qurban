'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api, { BACKEND_URL } from '@/services/api';
import ChecklistKriteria from '@/components/admin/ChecklistKriteria';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import BadgeGrade from '@/components/common/BadgeGrade';
import toast from 'react-hot-toast';

// Fungsi SAW (mirror backend — normalisasi dinamis)
function getSkorBobot(beratKg) {
    if (beratKg > 600) return 5;
    if (beratKg >= 500) return 4;
    if (beratKg >= 400) return 3;
    if (beratKg >= 300) return 2;
    return 1;
}

function hitungPreviewSAW(berat, c2, c3, c4, c5, c6, semuaSapi, editId) {
    const c1 = getSkorBobot(berat);
    if (c1 === 0 && c2 === 1 && c3 === 1 && c4 === 1 && c5 === 1 && c6 === 1 && semuaSapi.length === 0) {
        return { c1: 0, skor: 0, grade: null };
    }

    const bobot = { c1: 0.25, c2: 0.20, c3: 0.15, c4: 0.25, c5: 0.10, c6: 0.05 };

    // Gabungkan data sapi yang ada + sapi yang sedang diedit/dibuat
    const sapiLain = semuaSapi
        .filter(s => !editId || s.id !== parseInt(editId))
        .map(s => ({
            c1: s.c1_bobot, c2: s.c2_bcs, c3: s.c3_postur,
            c4: s.c4_vitalitas, c5: s.c5_kaki, c6: s.c6_temperamen
        }));

    const sapiIni = { c1, c2, c3, c4, c5, c6 };
    const gabungan = [...sapiLain, sapiIni];

    // Cari max dari gabungan
    const maxValues = {
        c1: Math.max(...gabungan.map(s => s.c1)),
        c2: Math.max(...gabungan.map(s => s.c2)),
        c3: Math.max(...gabungan.map(s => s.c3)),
        c4: Math.max(...gabungan.map(s => s.c4)),
        c5: Math.max(...gabungan.map(s => s.c5)),
        c6: Math.max(...gabungan.map(s => s.c6))
    };

    // Hitung skor untuk sapi ini
    const skor = (
        (maxValues.c1 > 0 ? c1 / maxValues.c1 : 0) * bobot.c1 +
        (maxValues.c2 > 0 ? c2 / maxValues.c2 : 0) * bobot.c2 +
        (maxValues.c3 > 0 ? c3 / maxValues.c3 : 0) * bobot.c3 +
        (maxValues.c4 > 0 ? c4 / maxValues.c4 : 0) * bobot.c4 +
        (maxValues.c5 > 0 ? c5 / maxValues.c5 : 0) * bobot.c5 +
        (maxValues.c6 > 0 ? c6 / maxValues.c6 : 0) * bobot.c6
    ) * 100;
    const skorRound = Math.round(skor * 100) / 100;
    let grade = 'Bronze';
    if (skorRound > 90) grade = 'Platinum';
    else if (skorRound >= 75) grade = 'Gold';
    else if (skorRound >= 60) grade = 'Silver';
    return { c1, skor: skorRound, grade };
}

export default function FormSapi({ mode = 'tambah' }) {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(mode === 'edit');
    const [fotoPreview, setFotoPreview] = useState(null);
    const [fotoFile, setFotoFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [daftarJenisSapi, setDaftarJenisSapi] = useState([]);
    const [semuaSapi, setSemuaSapi] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [kriteriaTemplates, setKriteriaTemplates] = useState([]);
    const [loadingKriteria, setLoadingKriteria] = useState(false);
    const dropdownRef = useRef(null);
    const skipKriteriaFetch = useRef(false);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const [form, setForm] = useState({
        kode_sapi: '',
        berat_kg: '',
        harga: '',
        jenis_sapi_id: ''
    });

    // Checklist state: dinamis berdasarkan jenis sapi
    const [checklist, setChecklist] = useState({
        c2: [],
        c3: [],
        c4: [],
        c5: [],
        c6: []
    });

    // Skor tersimpan (untuk info di mode edit, data lama tanpa checklist)
    const [skorTersimpan, setSkorTersimpan] = useState({
        c2: null, c3: null, c4: null, c5: null, c6: null
    });

    // Fetch kriteria templates saat jenis sapi berubah
    useEffect(() => {
        if (skipKriteriaFetch.current) {
            skipKriteriaFetch.current = false;
            return;
        }
        if (!form.jenis_sapi_id) {
            setKriteriaTemplates([]);
            setChecklist({ c2: [], c3: [], c4: [], c5: [], c6: [] });
            return;
        }
        setLoadingKriteria(true);
        api.get(`/jenis-sapi/${form.jenis_sapi_id}`)
            .then(res => {
                const templates = res.data.data.kriteriaTemplates || [];
                setKriteriaTemplates(templates);
                // Reset checklist sesuai jumlah item baru
                const newChecklist = { c2: [], c3: [], c4: [], c5: [], c6: [] };
                templates.forEach(t => {
                    newChecklist[t.kode_kriteria] = new Array(t.items.length).fill(false);
                });
                setChecklist(newChecklist);
            })
            .catch(() => {
                toast.error('Gagal memuat kriteria untuk jenis sapi ini.');
            })
            .finally(() => setLoadingKriteria(false));
    }, [form.jenis_sapi_id]);

    // Build CHECKLIST_ITEMS dari kriteriaTemplates
    const CHECKLIST_ITEMS = {};
    kriteriaTemplates.forEach(t => {
        CHECKLIST_ITEMS[t.kode_kriteria] = t.items;
    });

    // Hitung skor dari checklist: count(true) + 1
    const getSkorFromChecklist = (arr) => arr.filter(Boolean).length + 1;

    // Load data jenis sapi + semua sapi (untuk preview max dinamis)
    useEffect(() => {
        api.get('/jenis-sapi').then(res => {
            setDaftarJenisSapi(res.data.data);
        }).catch(() => {});

        api.get('/sapi').then(res => {
            setSemuaSapi(res.data.data || []);
        }).catch(() => {});
    }, []);

    // Load data sapi jika mode edit
    useEffect(() => {
        if (mode === 'edit' && params?.id) {
            fetchSapi();
        }
    }, [mode, params?.id]);

    const fetchSapi = async () => {
        try {
            const res = await api.get('/sapi');
            const sapi = res.data.data.find(s => s.id === parseInt(params.id));
            if (sapi) {
                // Load kriteria templates jika punya jenis sapi
                if (sapi.jenis_sapi_id) {
                    try {
                        const jenisRes = await api.get(`/jenis-sapi/${sapi.jenis_sapi_id}`);
                        const templates = jenisRes.data.data.kriteriaTemplates || [];
                        setKriteriaTemplates(templates);
                    } catch {}
                }

                // Skip the useEffect fetch triggered by setting jenis_sapi_id
                skipKriteriaFetch.current = true;

                setForm({
                    kode_sapi: sapi.kode_sapi,
                    berat_kg: sapi.berat_kg.toString(),
                    harga: sapi.harga.toString(),
                    jenis_sapi_id: sapi.jenis_sapi_id ? sapi.jenis_sapi_id.toString() : ''
                });

                // Load checklist data jika ada, atau set skorTersimpan
                const loadedChecklist = { ...checklist };
                const loadedSkorTersimpan = { c2: null, c3: null, c4: null, c5: null, c6: null };

                const keys = [
                    { ck: 'c2', skor: 'c2_bcs', cl: 'c2_checklist' },
                    { ck: 'c3', skor: 'c3_postur', cl: 'c3_checklist' },
                    { ck: 'c4', skor: 'c4_vitalitas', cl: 'c4_checklist' },
                    { ck: 'c5', skor: 'c5_kaki', cl: 'c5_checklist' },
                    { ck: 'c6', skor: 'c6_temperamen', cl: 'c6_checklist' }
                ];

                keys.forEach(({ ck, skor, cl }) => {
                    if (sapi[cl] && Array.isArray(sapi[cl])) {
                        loadedChecklist[ck] = sapi[cl];
                    } else {
                        // Data lama tanpa checklist — tampilkan info skor
                        loadedSkorTersimpan[ck] = sapi[skor];
                    }
                });

                setChecklist(loadedChecklist);
                setSkorTersimpan(loadedSkorTersimpan);
                if (sapi.foto_url) {
                    setFotoPreview(`${BACKEND_URL}${sapi.foto_url}`);
                }
            }
        } catch (err) {
            toast.error('Gagal mengambil data sapi.');
        } finally {
            setLoadingData(false);
        }
    };

    // Preview SAW real-time (skor dari checklist + max dinamis PER JENIS)
    const berat = parseInt(form.berat_kg) || 0;
    const skorC2 = getSkorFromChecklist(checklist.c2);
    const skorC3 = getSkorFromChecklist(checklist.c3);
    const skorC4 = getSkorFromChecklist(checklist.c4);
    const skorC5 = getSkorFromChecklist(checklist.c5);
    const skorC6 = getSkorFromChecklist(checklist.c6);
    // Filter hanya sapi sejenis untuk preview ranking yang akurat
    const sapiSejenis = form.jenis_sapi_id
        ? semuaSapi.filter(s => s.jenis_sapi_id && s.jenis_sapi_id.toString() === form.jenis_sapi_id.toString())
        : semuaSapi;
    const preview = hitungPreviewSAW(berat, skorC2, skorC3, skorC4, skorC5, skorC6, sapiSejenis, params?.id);

    const processFile = (file) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast.error('Format file tidak valid. Gunakan JPG, PNG, atau WEBP.');
            return;
        }
        if (file.size > 20 * 1024 * 1024) {
            toast.error('Ukuran file maksimal 20MB.');
            return;
        }
        setFotoFile(file);
        setFotoPreview(URL.createObjectURL(file));
    };

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) processFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    };

    const handleRemoveFoto = () => {
        setFotoFile(null);
        setFotoPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('kode_sapi', form.kode_sapi);
            formData.append('berat_kg', form.berat_kg);
            formData.append('harga', form.harga);
            formData.append('c2_bcs', getSkorFromChecklist(checklist.c2));
            formData.append('c3_postur', getSkorFromChecklist(checklist.c3));
            formData.append('c4_vitalitas', getSkorFromChecklist(checklist.c4));
            formData.append('c5_kaki', getSkorFromChecklist(checklist.c5));
            formData.append('c6_temperamen', getSkorFromChecklist(checklist.c6));
            formData.append('c2_checklist', JSON.stringify(checklist.c2));
            formData.append('c3_checklist', JSON.stringify(checklist.c3));
            formData.append('c4_checklist', JSON.stringify(checklist.c4));
            formData.append('c5_checklist', JSON.stringify(checklist.c5));
            formData.append('c6_checklist', JSON.stringify(checklist.c6));
            formData.append('jenis_sapi_id', form.jenis_sapi_id);
            if (fotoFile) formData.append('foto', fotoFile);

            if (mode === 'edit') {
                await api.put(`/sapi/${params.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Data sapi berhasil diperbarui!');
            } else {
                await api.post('/sapi', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Sapi berhasil ditambahkan!');
            }

            router.push('/admin/sapi');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Terjadi kesalahan.');
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) return <LoadingSpinner text="Memuat data sapi..." />;

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
                    {mode === 'edit' ? 'Edit Data Sapi' : 'Tambah Sapi Baru'}
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    {mode === 'edit' ? 'Perbarui data dan kriteria sapi.' : 'Masukkan data sapi dan kriteria SAW.'}
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 360px',
                    gap: '24px',
                    alignItems: 'start'
                }}>
                    {/* Kolom Kiri - Data & Kriteria */}
                    <div>
                        {/* Data Dasar */}
                        <div style={{
                            backgroundColor: 'var(--color-bg-card)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '24px',
                            border: '1px solid var(--color-border-light)',
                            marginBottom: '16px'
                        }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '20px' }}>
                                Data Dasar
                            </h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={labelStyle}>Kode Sapi *</label>
                                    <input
                                        type="text"
                                        value={form.kode_sapi}
                                        onChange={(e) => setForm({ ...form, kode_sapi: e.target.value })}
                                        placeholder="SAPI-001"
                                        required
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Berat (kg) *</label>
                                    <input
                                        type="number"
                                        value={form.berat_kg}
                                        onChange={(e) => setForm({ ...form, berat_kg: e.target.value })}
                                        placeholder="500"
                                        required
                                        min="1"
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Harga (Rp) *</label>
                                    <input
                                        type="number"
                                        value={form.harga}
                                        onChange={(e) => setForm({ ...form, harga: e.target.value })}
                                        placeholder="35000000"
                                        required
                                        min="0"
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            {/* Jenis Sapi - Custom Dropdown */}
                            <div style={{ marginTop: '16px' }}>
                                <label style={labelStyle}>Jenis Sapi *</label>
                                <div ref={dropdownRef} style={{ position: 'relative' }}>
                                    {/* Trigger Button */}
                                    <button
                                        type="button"
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        style={{
                                            ...inputStyle,
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            paddingRight: '40px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative'
                                        }}
                                    >
                                        <span style={{ flex: 1, textAlign: 'center' }}>
                                            {form.jenis_sapi_id
                                                ? daftarJenisSapi.find(j => j.id.toString() === form.jenis_sapi_id.toString())?.nama || '— Pilih Jenis Sapi —'
                                                : '— Pilih Jenis Sapi —'
                                            }
                                        </span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#94a3b8"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            style={{
                                                position: 'absolute',
                                                right: '16px',
                                                top: '50%',
                                                transform: `translateY(-50%) rotate(${dropdownOpen ? '180deg' : '0deg'})`,
                                                transition: 'transform 0.2s ease'
                                            }}
                                        >
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </button>

                                    {/* Dropdown List */}
                                    {dropdownOpen && (
                                        <div style={{
                                            position: 'absolute',
                                            top: 'calc(100% + 4px)',
                                            left: 0,
                                            right: 0,
                                            backgroundColor: 'var(--color-bg-card)',
                                            border: '1px solid var(--color-border)',
                                            borderRadius: 'var(--radius-md)',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                                            zIndex: 50,
                                            maxHeight: '260px',
                                            overflowY: 'auto',
                                            animation: 'fadeIn 0.15s ease'
                                        }}>
                                            {/* Default option */}
                                            <div
                                                onClick={() => {
                                                    setForm({ ...form, jenis_sapi_id: '' });
                                                    setDropdownOpen(false);
                                                }}
                                                style={{
                                                    padding: '10px 14px',
                                                    textAlign: 'center',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    color: 'var(--color-text-muted)',
                                                    backgroundColor: form.jenis_sapi_id === '' ? 'var(--color-primary-500)' : 'transparent',
                                                    ...(form.jenis_sapi_id === '' && { color: 'white', fontWeight: 600 }),
                                                    transition: 'background-color 0.15s ease'
                                                }}
                                                onMouseEnter={(e) => { if (form.jenis_sapi_id !== '') e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)'; }}
                                                onMouseLeave={(e) => { if (form.jenis_sapi_id !== '') e.currentTarget.style.backgroundColor = 'transparent'; }}
                                            >
                                                — Pilih Jenis Sapi —
                                            </div>
                                            {daftarJenisSapi.map((j) => {
                                                const isSelected = form.jenis_sapi_id.toString() === j.id.toString();
                                                return (
                                                    <div
                                                        key={j.id}
                                                        onClick={() => {
                                                            setForm({ ...form, jenis_sapi_id: j.id.toString() });
                                                            setDropdownOpen(false);
                                                        }}
                                                        style={{
                                                            padding: '10px 14px',
                                                            textAlign: 'center',
                                                            cursor: 'pointer',
                                                            fontSize: '14px',
                                                            color: isSelected ? 'white' : 'var(--color-text)',
                                                            backgroundColor: isSelected ? 'var(--color-primary-500)' : 'transparent',
                                                            fontWeight: isSelected ? 600 : 400,
                                                            transition: 'background-color 0.15s ease'
                                                        }}
                                                        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)'; }}
                                                        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                                    >
                                                        {j.nama}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* C1 Auto */}
                            {berat > 0 && (
                                <div style={{
                                    marginTop: '16px',
                                    padding: '12px 16px',
                                    backgroundColor: 'var(--color-primary-50)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-primary-200)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <span style={{ fontSize: '13px', color: 'var(--color-primary-700)' }}>
                                        C1 (Bobot Hidup) otomatis dari berat: <strong>Skor {preview.c1}/5</strong>
                                    </span>
                                </div>
                            )}
                        </div>

                        <div style={{
                            backgroundColor: 'var(--color-bg-card)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '24px',
                            border: '1px solid var(--color-border-light)',
                            marginBottom: '16px'
                        }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '20px' }}>
                                Ceklis Kondisi Fisik Sapi
                            </h2>

                            {!form.jenis_sapi_id ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '40px 20px',
                                    color: 'var(--color-text-muted)',
                                    backgroundColor: 'var(--color-bg-secondary)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px dashed var(--color-border)'
                                }}>
                                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>🐄</div>
                                    <div style={{ fontSize: '14px', fontWeight: 500 }}>Pilih jenis sapi terlebih dahulu</div>
                                    <div style={{ fontSize: '12px', marginTop: '4px' }}>Checklist akan muncul sesuai jenis sapi yang dipilih.</div>
                                </div>
                            ) : loadingKriteria ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '30px',
                                    color: 'var(--color-text-muted)'
                                }}>
                                    Memuat kriteria...
                                </div>
                            ) : kriteriaTemplates.length === 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '30px',
                                    color: 'var(--color-warning)',
                                    backgroundColor: '#fef3c7',
                                    borderRadius: 'var(--radius-md)'
                                }}>
                                    ⚠️ Jenis sapi ini belum memiliki kriteria. Tambahkan kriteria di halaman Jenis Sapi.
                                </div>
                            ) : (
                                <>
                                    {kriteriaTemplates.map(t => (
                                        <ChecklistKriteria
                                            key={t.kode_kriteria}
                                            label={`${t.kode_kriteria.toUpperCase()} — ${t.label}`}
                                            items={t.items}
                                            checked={checklist[t.kode_kriteria] || []}
                                            onChange={(v) => setChecklist({ ...checklist, [t.kode_kriteria]: v })}
                                            skorTersimpan={skorTersimpan[t.kode_kriteria]}
                                        />
                                    ))}
                                </>
                            )}
                        </div>

                        {/* Foto */}
                        <div style={{
                            backgroundColor: 'var(--color-bg-card)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '24px',
                            border: '1px solid var(--color-border-light)'
                        }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '16px' }}>
                                Foto Sapi
                            </h2>

                            <label
                                onDragOver={handleDragOver}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                style={{
                                    display: 'block',
                                    padding: '32px 24px',
                                    border: `2px dashed ${isDragging ? 'var(--color-primary-500)' : 'var(--color-border)'}`,
                                    borderRadius: 'var(--radius-md)',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    backgroundColor: isDragging ? 'var(--color-primary-50)' : 'var(--color-bg-secondary)',
                                    transform: isDragging ? 'scale(1.01)' : 'scale(1)'
                                }}
                            >
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleFotoChange}
                                    style={{ display: 'none' }}
                                />
                                {fotoPreview ? (
                                    <div>
                                        <img
                                            src={fotoPreview}
                                            alt="Preview"
                                            style={{
                                                maxWidth: '240px',
                                                maxHeight: '180px',
                                                objectFit: 'cover',
                                                borderRadius: 'var(--radius-md)',
                                                margin: '0 auto',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                            }}
                                        />
                                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '10px' }}>
                                            Klik atau drag foto baru untuk mengganti
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div style={{ fontSize: '36px', marginBottom: '10px' }}>{isDragging ? '📥' : '📷'}</div>
                                        <div style={{ fontSize: '14px', fontWeight: 500, color: isDragging ? 'var(--color-primary-500)' : 'var(--color-text)' }}>
                                            {isDragging ? 'Lepaskan file di sini...' : 'Drag & drop foto di sini'}
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                                            atau klik untuk memilih file (JPG, PNG, WEBP, max 20MB)
                                        </div>
                                    </div>
                                )}
                            </label>
                            {fotoPreview && (
                                <button
                                    type="button"
                                    onClick={handleRemoveFoto}
                                    style={{
                                        marginTop: '10px',
                                        padding: '6px 16px',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        color: 'var(--color-danger)',
                                        backgroundColor: 'transparent',
                                        border: '1px solid var(--color-danger)',
                                        borderRadius: 'var(--radius-md)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'block',
                                        margin: '10px auto 0'
                                    }}
                                >
                                    Hapus Foto
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Kolom Kanan - Preview & Submit */}
                    <div style={{ position: 'sticky', top: '100px' }}>
                        {/* Preview SAW */}
                        <div style={{
                            backgroundColor: 'var(--color-bg-card)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '24px',
                            border: '1px solid var(--color-border-light)',
                            marginBottom: '16px',
                            textAlign: 'center'
                        }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                                Preview Skor SAW
                            </h3>

                            <div style={{
                                fontSize: '48px',
                                fontWeight: 800,
                                color: preview.grade ? 'var(--color-primary-500)' : 'var(--color-danger)',
                                lineHeight: 1,
                                marginBottom: '8px'
                            }}>
                                {berat > 0 ? preview.skor : '—'}
                            </div>

                            {berat > 0 && (
                                <>
                                    <BadgeGrade grade={preview.grade} />
                                    <div style={{
                                        fontSize: '12px',
                                        color: 'var(--color-text-muted)',
                                        marginTop: '12px'
                                    }}>
                                        {`Grade: ${preview.grade}`}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: 'var(--radius-md)',
                                border: 'none',
                                backgroundColor: loading ? 'var(--color-primary-300)' : 'var(--color-primary-500)',
                                color: 'white',
                                fontSize: '15px',
                                fontWeight: 600,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                                marginBottom: '8px'
                            }}
                        >
                            {loading ? 'Menyimpan...' : (mode === 'edit' ? 'Simpan Perubahan' : 'Tambah Sapi')}
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push('/admin/sapi')}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'transparent',
                                color: 'var(--color-text-secondary)',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Batal
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
