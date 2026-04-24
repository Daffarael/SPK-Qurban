'use client';

import Modal from '@/components/common/Modal';

const BOBOT = {
    C1: { nama: 'Bobot Hidup', bobot: 0.25 },
    C2: { nama: 'Body Condition Score', bobot: 0.20 },
    C3: { nama: 'Konformasi & Postur', bobot: 0.15 },
    C4: { nama: 'Vitalitas & Kesehatan', bobot: 0.25 },
    C5: { nama: 'Kekokohan Kaki', bobot: 0.10 },
    C6: { nama: 'Temperamen', bobot: 0.05 }
};

/**
 * Hitung max values dari daftar semua sapi
 */
function hitungMaxValues(semuaSapi) {
    if (!semuaSapi || semuaSapi.length === 0) {
        return { c1: 1, c2: 1, c3: 1, c4: 1, c5: 1, c6: 1 };
    }
    return {
        c1: Math.max(...semuaSapi.map(s => s.c1_bobot || 0)),
        c2: Math.max(...semuaSapi.map(s => s.c2_bcs || 0)),
        c3: Math.max(...semuaSapi.map(s => s.c3_postur || 0)),
        c4: Math.max(...semuaSapi.map(s => s.c4_vitalitas || 0)),
        c5: Math.max(...semuaSapi.map(s => s.c5_kaki || 0)),
        c6: Math.max(...semuaSapi.map(s => s.c6_temperamen || 0))
    };
}

export default function ModalDetailSAW({ isOpen, onClose, sapi, semuaSapi }) {
    if (!sapi) return null;

    // Filter hanya sapi sejenis untuk perhitungan max (karena ranking per jenis)
    const sapiSejenis = sapi.jenis_sapi_id
        ? (semuaSapi || []).filter(s => s.jenis_sapi_id === sapi.jenis_sapi_id)
        : semuaSapi;

    const maxValues = hitungMaxValues(sapiSejenis);

    const kriteria = [
        { kode: 'C1', nilai: sapi.c1_bobot, max: maxValues.c1, ...BOBOT.C1 },
        { kode: 'C2', nilai: sapi.c2_bcs, max: maxValues.c2, ...BOBOT.C2 },
        { kode: 'C3', nilai: sapi.c3_postur, max: maxValues.c3, ...BOBOT.C3 },
        { kode: 'C4', nilai: sapi.c4_vitalitas, max: maxValues.c4, ...BOBOT.C4 },
        { kode: 'C5', nilai: sapi.c5_kaki, max: maxValues.c5, ...BOBOT.C5 },
        { kode: 'C6', nilai: sapi.c6_temperamen, max: maxValues.c6, ...BOBOT.C6 }
    ];

    const cellStyle = {
        padding: '10px 12px',
        fontSize: '13px',
        borderBottom: '1px solid var(--color-border-light)'
    };

    const headerStyle = {
        ...cellStyle,
        fontWeight: 600,
        fontSize: '11px',
        color: 'var(--color-text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        backgroundColor: 'var(--color-bg-secondary)'
    };

    return (
        <Modal judul={`Detail SAW — ${sapi.kode_sapi}`} isOpen={isOpen} onClose={onClose} lebar="660px">
            {/* Info Sapi */}
            <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '20px',
                padding: '14px',
                backgroundColor: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-md)'
            }}>
                <div style={{ flex: 1, fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                    <div><strong>Kode:</strong> {sapi.kode_sapi}</div>
                    <div><strong>Berat:</strong> {sapi.berat_kg} kg</div>
                </div>
                <div style={{ flex: 1, fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                    <div><strong>Skor SAW:</strong> <span style={{ fontWeight: 700, color: 'var(--color-primary-500)' }}>{sapi.skor_saw}</span></div>
                    <div><strong>Grade:</strong> {sapi.grade}</div>
                </div>
            </div>

            {/* Rumus */}
            <div style={{
                padding: '10px 14px',
                backgroundColor: 'var(--color-primary-50)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '16px',
                fontSize: '12px',
                color: 'var(--color-primary-700)',
                fontWeight: 500
            }}>
                Rumus SAW: Skor = Σ (Nilai / <strong>Max</strong> × Bobot) × 100 &nbsp;|&nbsp; Max = <strong>dari data</strong> &nbsp;|&nbsp; Tipe: Benefit
            </div>

            {/* Tabel Perhitungan */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ ...headerStyle, textAlign: 'left' }}>Kriteria</th>
                            <th style={{ ...headerStyle, textAlign: 'center' }}>Nilai</th>
                            <th style={{ ...headerStyle, textAlign: 'center' }}>Max</th>
                            <th style={{ ...headerStyle, textAlign: 'center' }}>Normalisasi</th>
                            <th style={{ ...headerStyle, textAlign: 'center' }}>Bobot</th>
                            <th style={{ ...headerStyle, textAlign: 'center' }}>Hasil</th>
                        </tr>
                    </thead>
                    <tbody>
                        {kriteria.map((k) => {
                            const normalisasi = k.max > 0 ? k.nilai / k.max : 0;
                            const hasil = normalisasi * k.bobot;

                            return (
                                <tr key={k.kode}>
                                    <td style={{ ...cellStyle, color: 'var(--color-text)' }}>
                                        <strong>{k.kode}</strong> — {k.nama}
                                    </td>
                                    <td style={{ ...cellStyle, textAlign: 'center', fontWeight: 600, color: 'var(--color-primary-500)' }}>
                                        {k.nilai}
                                    </td>
                                    <td style={{ ...cellStyle, textAlign: 'center', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                                        {k.max}
                                    </td>
                                    <td style={{ ...cellStyle, textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '12px' }}>
                                        {k.nilai}/{k.max} = {normalisasi.toFixed(4)}
                                    </td>
                                    <td style={{ ...cellStyle, textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                                        {(k.bobot * 100).toFixed(0)}%
                                    </td>
                                    <td style={{ ...cellStyle, textAlign: 'center', fontWeight: 600, color: 'var(--color-text)' }}>
                                        {hasil.toFixed(4)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="5" style={{
                                ...cellStyle,
                                textAlign: 'right',
                                fontWeight: 600,
                                color: 'var(--color-text-secondary)'
                            }}>
                                Total Asli (Σ Hasil) =
                            </td>
                            <td style={{
                                ...cellStyle,
                                textAlign: 'center',
                                fontWeight: 700,
                                color: 'var(--color-text)'
                            }}>
                                {(sapi.skor_saw / 100).toFixed(4)}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="5" style={{
                                ...cellStyle,
                                textAlign: 'right',
                                fontWeight: 700,
                                color: 'var(--color-text)',
                                borderBottom: 'none'
                            }}>
                                Total × 100 (Skor SAW) =
                            </td>
                            <td style={{
                                ...cellStyle,
                                textAlign: 'center',
                                fontWeight: 800,
                                fontSize: '18px',
                                color: 'var(--color-primary-500)',
                                borderBottom: 'none'
                            }}>
                                {sapi.skor_saw}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Grade Explanation */}
            <div style={{
                marginTop: '16px',
                padding: '12px 14px',
                backgroundColor: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-md)',
                fontSize: '12px',
                color: 'var(--color-text-muted)'
            }}>
                <strong>Ketentuan Grade:</strong> Platinum (&gt;90) • Gold (75-90) • Silver (60-74) • Bronze (&lt;60)
            </div>
        </Modal>
    );
}
