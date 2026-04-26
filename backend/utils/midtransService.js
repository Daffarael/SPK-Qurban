/**
 * Midtrans Snap Service
 * Menggunakan fetch langsung (tanpa library midtrans-client)
 */

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true';

const SNAP_URL = IS_PRODUCTION
    ? 'https://app.midtrans.com/snap/v1/transactions'
    : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

/**
 * Buat transaksi Midtrans Snap
 * @param {string} orderId - ID order unik (kode_pemesanan)
 * @param {number} grossAmount - Total harga (integer)
 * @param {object} customer - { nama, no_wa }
 * @returns {{ token: string, redirect_url: string }}
 */
async function buatTransaksiSnap(orderId, grossAmount, customer) {
    const auth = Buffer.from(MIDTRANS_SERVER_KEY + ':').toString('base64');

    const payload = {
        transaction_details: {
            order_id: orderId,
            gross_amount: Math.round(grossAmount) // Midtrans butuh integer
        },
        customer_details: {
            first_name: customer.nama,
            phone: customer.no_wa
        },
        callbacks: {
            finish: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pemesanan-sukses?kode=${orderId}`
        }
    };

    const response = await fetch(SNAP_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Basic ${auth}`
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
        console.error('❌ Midtrans Snap error:', data);
        throw new Error(data.error_messages?.[0] || 'Gagal membuat transaksi Midtrans.');
    }

    console.log('✅ Midtrans Snap token created:', data.token);
    return data; // { token, redirect_url }
}

/**
 * Verifikasi signature webhook dari Midtrans
 * @param {object} notification - Body dari webhook Midtrans
 * @returns {boolean}
 */
function verifikasiSignature(notification) {
    const crypto = require('crypto');
    const { order_id, status_code, gross_amount, signature_key } = notification;

    const hash = crypto
        .createHash('sha512')
        .update(order_id + status_code + gross_amount + MIDTRANS_SERVER_KEY)
        .digest('hex');

    return hash === signature_key;
}

module.exports = { buatTransaksiSnap, verifikasiSignature };
