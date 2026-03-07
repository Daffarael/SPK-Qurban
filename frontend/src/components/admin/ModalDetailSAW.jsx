'use client';

import Modal from '@/components/common/Modal';

const BOBOT = {
    C1: { nama: 'Bobot Hidup', bobot: 0.30 },
    C2: { nama: 'Body Condition Score', bobot: 0.20 },
    C3: { nama: 'Konformasi & Postur', bobot: 0.15 },
    C4: { nama: 'Vitalitas & Kesehatan', bobot: 0.15 },
    C5: { nama: 'Kekokohan Kaki', bobot: 0.10 },
    C6: { nama: 'Temperamen', bobot: 0.10 }
};

export default function ModalDetailSAW({ isOpen, onClose, sapi }) {
    if (!sapi) return null;

    const kriteria = [
        { kode: 'C1', nilai: sapi.c1_bobot, ...BOBOT.C1 },
        { kode: 'C2', nilai: sapi.c2_bcs, ...BOBOT.C2 },
        { kode: 'C3', nilai: sapi.c3_postur, ...BOBOT.C3 },
        { kode: 'C4', nilai: sapi.c4_vitalitas, ...BOBOT.C4 },
        { kode: 'C5', nilai: sapi.c5_kaki, ...BOBOT.C5 },
        { kode: 'C6', nilai: sapi.c6_temperamen, ...BOBOT.C6 }
    ];

    const cellStyle = {
        padding: '10px 12px',
        fontSize: '13px',
        borderBottom: '1px solid var(--color-border-light)'
    };

    const headerStyle = {
        ...cellStyle,
        fontWeight: 600,
        fontSize: '12px',
        color: 'var(--color-text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        backgroundColor: 'var(--color-bg-secondary)'
    };

    return (
        <Modal judul={`Detail SAW — ${sapi.kode_sapi}`} isOpen={isOpen} onClose={onClose} lebar="600px">
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
                    <div><strong>Grade:</strong> {sapi.grade || 'Tidak Lolos'}</div>
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
                Rumus SAW: Skor = Σ (Nilai / Max × Bobot) × 100 &nbsp;|&nbsp; Max = 5 &nbsp;|&nbsp; Tipe: Benefit
            </div>

            {/* Tabel Perhitungan */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ ...headerStyle, textAlign: 'left' }}>Kriteria</th>
                            <th style={{ ...headerStyle, textAlign: 'center' }}>Nilai</th>
                            <th style={{ ...headerStyle, textAlign: 'center' }}>Normalisasi</th>
                            <th style={{ ...headerStyle, textAlign: 'center' }}>Bobot</th>
                            <th style={{ ...headerStyle, textAlign: 'center' }}>Hasil</th>
                        </tr>
                    </thead>
                    <tbody>
                        {kriteria.map((k) => {
                            const normalisasi = k.nilai / 5;
                            const hasil = normalisasi * k.bobot;

                            return (
                                <tr key={k.kode}>
                                    <td style={{ ...cellStyle, color: 'var(--color-text)' }}>
                                        <strong>{k.kode}</strong> — {k.nama}
                                    </td>
                                    <td style={{ ...cellStyle, textAlign: 'center', fontWeight: 600, color: 'var(--color-primary-500)' }}>
                                        {k.nilai}/5
                                    </td>
                                    <td style={{ ...cellStyle, textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                                        {k.nilai}/5 = {normalisasi.toFixed(2)}
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
                            <td colSpan="4" style={{
                                ...cellStyle,
                                textAlign: 'right',
                                fontWeight: 700,
                                color: 'var(--color-text)',
                                borderBottom: 'none'
                            }}>
                                Total × 100 =
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
                <strong>Ketentuan Grade:</strong> Platinum (&gt;90) • Gold (75-90) • Silver (60-74) • Tidak Lolos (&lt;60)
            </div>
        </Modal>
    );
}
