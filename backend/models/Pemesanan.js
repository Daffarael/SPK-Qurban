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
            type: DataTypes.STRING(15),
            allowNull: false,
            defaultValue: 'Pending',
            validate: {
                isIn: {
                    args: [['Pending', 'Confirmed', 'Cancelled', 'Expired']],
                    msg: 'Status harus Pending, Confirmed, Cancelled, atau Expired.'
                }
            }
        }
    }, {
        tableName: 'pemesanan',
        timestamps: true
    });

    return Pemesanan;
};
