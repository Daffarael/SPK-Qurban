'use strict';

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Pemesanan = sequelize.define('Pemesanan', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        kode_pemesanan: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
            comment: 'Format: GHF-QURBAN-001'
        },
        sapi_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'sapi',
                key: 'id'
            }
        },
        nama_pelanggan: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Nama pelanggan tidak boleh kosong.' },
                len: { args: [2, 100], msg: 'Nama pelanggan harus 2-100 karakter.' }
            }
        },
        no_wa: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Nomor WhatsApp tidak boleh kosong.' }
            }
        },
        metode_pembayaran: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'ditempat',
            validate: {
                isIn: {
                    args: [['midtrans', 'ditempat']],
                    msg: 'Metode pembayaran harus midtrans atau ditempat.'
                }
            },
            comment: 'midtrans atau ditempat'
        },
        midtrans_order_id: {
            type: DataTypes.STRING(50),
            allowNull: true,
            defaultValue: null,
            comment: 'Order ID di Midtrans'
        },
        tanggal_pemesanan: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        kadaluarsa_pada: {
            type: DataTypes.DATE,
            allowNull: false,
            comment: 'tanggal_pemesanan + 48 jam'
        },
        status: {
            type: DataTypes.STRING(25),
            allowNull: false,
            defaultValue: 'Pending',
            validate: {
                isIn: {
                    args: [['Pending', 'Menunggu Pembayaran', 'Confirmed', 'Cancelled', 'Expired']],
                    msg: 'Status harus Pending, Menunggu Pembayaran, Confirmed, Cancelled, atau Expired.'
                }
            }
        }
    }, {
        tableName: 'pemesanan',
        timestamps: true
    });

    return Pemesanan;
};
