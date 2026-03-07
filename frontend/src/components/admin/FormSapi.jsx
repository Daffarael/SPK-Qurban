'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/services/api';
import SliderKriteria from '@/components/admin/SliderKriteria';
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

    const [form, setForm] = useState({
        kode_sapi: '',
        berat_kg: '',
        harga: '',
        c2_bcs: 3,
        c3_postur: 3,
        c4_vitalitas: 3,
        c5_kaki: 3,
        c6_temperamen: 3
    });

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
                    c2_bcs: sapi.c2_bcs,
                    c3_postur: sapi.c3_postur,
                    c4_vitalitas: sapi.c4_vitalitas,
                    c5_kaki: sapi.c5_kaki,
                    c6_temperamen: sapi.c6_temperamen
                });
                if (sapi.foto_url) {
                    setFotoPreview(`http://localhost:5000${sapi.foto_url}`);
                }
            }
        } catch (err) {
            toast.error('Gagal mengambil data sapi.');
        } finally {
            setLoadingData(false);
        }
    };

    // Preview SAW real-time
    const berat = parseInt(form.berat_kg) || 0;
    const preview = hitungPreviewSAW(berat, form.c2_bcs, form.c3_postur, form.c4_vitalitas, form.c5_kaki, form.c6_temperamen);

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFotoFile(file);
            setFotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('kode_sapi', form.kode_sapi);
            formData.append('berat_kg', form.berat_kg);
            formData.append('harga', form.harga);
            formData.append('c2_bcs', form.c2_bcs);
            formData.append('c3_postur', form.c3_postur);
            formData.append('c4_vitalitas', form.c4_vitalitas);
            formData.append('c5_kaki', form.c5_kaki);
            formData.append('c6_temperamen', form.c6_temperamen);
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
                                        placeholder="SAP-001"
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

                        {/* Kriteria SAW */}
                        <div style={{
                            backgroundColor: 'var(--color-bg-card)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '24px',
                            border: '1px solid var(--color-border-light)',
                            marginBottom: '16px'
                        }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '20px' }}>
                                Kriteria SAW (Geser slider 1-5)
                            </h2>

                            <SliderKriteria
                                label="C2 — Body Condition Score"
                                keterangan="Kondisi tubuh & lemak"
                                value={form.c2_bcs}
                                onChange={(v) => setForm({ ...form, c2_bcs: v })}
                            />
                            <SliderKriteria
                                label="C3 — Konformasi & Postur"
                                keterangan="Bentuk fisik proporsional"
                                value={form.c3_postur}
                                onChange={(v) => setForm({ ...form, c3_postur: v })}
                            />
                            <SliderKriteria
                                label="C4 — Vitalitas & Kesehatan"
                                keterangan="Aktif, sehat, nafsu makan"
                                value={form.c4_vitalitas}
                                onChange={(v) => setForm({ ...form, c4_vitalitas: v })}
                            />
                            <SliderKriteria
                                label="C5 — Kekokohan Kaki"
                                keterangan="Kaki kuat & kokoh"
                                value={form.c5_kaki}
                                onChange={(v) => setForm({ ...form, c5_kaki: v })}
                            />
                            <SliderKriteria
                                label="C6 — Temperamen"
                                keterangan="Jinak & mudah diatur"
                                value={form.c6_temperamen}
                                onChange={(v) => setForm({ ...form, c6_temperamen: v })}
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

                            <label style={{
                                display: 'block',
                                padding: '24px',
                                border: '2px dashed var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                backgroundColor: 'var(--color-bg-secondary)'
                            }}>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleFotoChange}
                                    style={{ display: 'none' }}
                                />
                                {fotoPreview ? (
                                    <img
                                        src={fotoPreview}
                                        alt="Preview"
                                        style={{
                                            maxWidth: '200px',
                                            maxHeight: '150px',
                                            objectFit: 'cover',
                                            borderRadius: 'var(--radius-md)',
                                            margin: '0 auto'
                                        }}
                                    />
                                ) : (
                                    <div>
                                        <div style={{ fontSize: '28px', marginBottom: '8px' }}>📷</div>
                                        <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                                            Klik untuk upload foto (JPG, PNG, WEBP, max 5MB)
                                        </div>
                                    </div>
                                )}
                            </label>
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
