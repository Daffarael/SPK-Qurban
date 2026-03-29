'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api, { BACKEND_URL } from '@/services/api';
import ChecklistKriteria from '@/components/admin/ChecklistKriteria';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import BadgeGrade from '@/components/common/BadgeGrade';
import toast from 'react-hot-toast';

// Fungsi SAW (mirror backend)
function getSkorBobot(beratKg) {
    if (beratKg > 600) return 5;
    if (beratKg >= 500) return 4;
    if (beratKg >= 400) return 3;
    if (beratKg >= 300) return 2;
    return 1;
}

function hitungPreviewSAW(berat, c2, c3, c4, c5, c6) {
    const c1 = getSkorBobot(berat);
    const bobot = { c1: 0.30, c2: 0.20, c3: 0.15, c4: 0.15, c5: 0.10, c6: 0.10 };
    const skor = ((c1 / 5) * bobot.c1 + (c2 / 5) * bobot.c2 + (c3 / 5) * bobot.c3 + (c4 / 5) * bobot.c4 + (c5 / 5) * bobot.c5 + (c6 / 5) * bobot.c6) * 100;
    const skorRound = Math.round(skor * 100) / 100;
    let grade = null;
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
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

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

    // Checklist state: 5 kriteria × 4 pernyataan
    const [checklist, setChecklist] = useState({
        c2: [false, false, false, false],
        c3: [false, false, false, false],
        c4: [false, false, false, false],
        c5: [false, false, false, false],
        c6: [false, false, false, false]
    });

    // Skor tersimpan (untuk info di mode edit, data lama tanpa checklist)
    const [skorTersimpan, setSkorTersimpan] = useState({
        c2: null, c3: null, c4: null, c5: null, c6: null
    });

    // Definisi pernyataan checklist
    const CHECKLIST_ITEMS = {
        c2: [
            'Tulang rusuk tidak terlihat/teraba',
            'Pangkal ekor tertutup lemak tebal',
            'Leher terlihat penuh dan tebal',
            'Daging paha membulat penuh'
        ],
        c3: [
            'Punggung lurus sempurna (tidak melengkung/bengkok)',
            'Dada terlihat dalam dan lebar',
            'Tanduk utuh dan simetris',
            'Postur badan panjang dan proporsional (berbentuk balok)'
        ],
        c4: [
            'Mata bening, bersinar, dan tidak berair/belekan',
            'Napas teratur (tidak ngos-ngosan saat cuaca normal)',
            'Area anus dan pencernaan bersih (tidak mencret)',
            'Bulu mengkilap, kulit lentur, bebas kutu/jamur'
        ],
        c5: [
            'Keempat kaki tegak lurus sempurna (tidak bentuk X atau O)',
            'Kuku utuh, keras, dan tidak ada infeksi/pembengkakan',
            'Langkah berjalan mantap (tidak diseret/pincang)',
            'Berdiri kokoh (kaki tidak gemetar saat menopang badan)'
        ],
        c6: [
            'Tenang saat didekati banyak orang',
            'Kepala mudah dikendalikan saat dipegang tali keluhnya',
            'Tidak sering menghentakkan kaki ke tanah',
            'Tidak menunjukkan gestur agresif/menyeruduk'
        ]
    };

    // Hitung skor dari checklist: count(true) + 1
    const getSkorFromChecklist = (arr) => arr.filter(Boolean).length + 1;

    // Load data jenis sapi
    useEffect(() => {
        api.get('/jenis-sapi').then(res => {
            setDaftarJenisSapi(res.data.data);
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

    // Preview SAW real-time (skor dari checklist)
    const berat = parseInt(form.berat_kg) || 0;
    const skorC2 = getSkorFromChecklist(checklist.c2);
    const skorC3 = getSkorFromChecklist(checklist.c3);
    const skorC4 = getSkorFromChecklist(checklist.c4);
    const skorC5 = getSkorFromChecklist(checklist.c5);
    const skorC6 = getSkorFromChecklist(checklist.c6);
    const preview = hitungPreviewSAW(berat, skorC2, skorC3, skorC4, skorC5, skorC6);

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
            if (form.jenis_sapi_id) formData.append('jenis_sapi_id', form.jenis_sapi_id);
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
                                <label style={labelStyle}>Jenis Sapi</label>
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

                            <ChecklistKriteria
                                label="C2 — Body Condition Score (Kepadatan Daging)"
                                items={CHECKLIST_ITEMS.c2}
                                checked={checklist.c2}
                                onChange={(v) => setChecklist({ ...checklist, c2: v })}
                                skorTersimpan={skorTersimpan.c2}
                            />
                            <ChecklistKriteria
                                label="C3 — Konformasi & Postur Tubuh"
                                items={CHECKLIST_ITEMS.c3}
                                checked={checklist.c3}
                                onChange={(v) => setChecklist({ ...checklist, c3: v })}
                                skorTersimpan={skorTersimpan.c3}
                            />
                            <ChecklistKriteria
                                label="C4 — Vitalitas & Kesehatan Klinis"
                                items={CHECKLIST_ITEMS.c4}
                                checked={checklist.c4}
                                onChange={(v) => setChecklist({ ...checklist, c4: v })}
                                skorTersimpan={skorTersimpan.c4}
                            />
                            <ChecklistKriteria
                                label="C5 — Kekokohan Kaki & Kuku"
                                items={CHECKLIST_ITEMS.c5}
                                checked={checklist.c5}
                                onChange={(v) => setChecklist({ ...checklist, c5: v })}
                                skorTersimpan={skorTersimpan.c5}
                            />
                            <ChecklistKriteria
                                label="C6 — Temperamen / Karakter Perilaku"
                                items={CHECKLIST_ITEMS.c6}
                                checked={checklist.c6}
                                onChange={(v) => setChecklist({ ...checklist, c6: v })}
                                skorTersimpan={skorTersimpan.c6}
                            />
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
                                        {preview.grade ? `Lolos syarat — grade ${preview.grade}` : 'Tidak memenuhi syarat (skor < 60)'}
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
