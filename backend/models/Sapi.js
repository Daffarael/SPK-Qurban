'use strict';

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Sapi = sequelize.define('Sapi', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        kode_sapi: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: { msg: 'Kode sapi tidak boleh kosong.' }
            }
        },
        berat_kg: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: { msg: 'Berat harus berupa angka bulat.' },
                min: { args: [100], msg: 'Berat minimal 100 kg.' },
                max: { args: [1500], msg: 'Berat maksimal 1500 kg.' }
            }
        },
        harga: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            validate: {
                isDecimal: { msg: 'Harga harus berupa angka.' },
                min: { args: [0], msg: 'Harga tidak boleh negatif.' }
            }
        },
        // ==============================
        // KRITERIA SAW (C1: 1-5, C2-C6: 1-8)
        // ==============================
        c1_bobot: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Auto-calculated dari berat_kg',
            validate: {
                min: { args: [1], msg: 'Skor C1 minimal 1.' },
                max: { args: [5], msg: 'Skor C1 maksimal 5.' }
            }
        },
        c2_bcs: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Body Condition Score',
            validate: {
                min: { args: [1], msg: 'Skor C2 minimal 1.' },
                max: { args: [8], msg: 'Skor C2 maksimal 8.' }
            }
        },
        c3_postur: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Konformasi & Postur',
            validate: {
                min: { args: [1], msg: 'Skor C3 minimal 1.' },
                max: { args: [8], msg: 'Skor C3 maksimal 8.' }
            }
        },
        c4_vitalitas: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Vitalitas & Kesehatan',
            validate: {
                min: { args: [1], msg: 'Skor C4 minimal 1.' },
                max: { args: [8], msg: 'Skor C4 maksimal 8.' }
            }
        },
        c5_kaki: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Kekokohan Kaki',
            validate: {
                min: { args: [1], msg: 'Skor C5 minimal 1.' },
                max: { args: [8], msg: 'Skor C5 maksimal 8.' }
            }
        },
        c6_temperamen: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Temperamen',
            validate: {
                min: { args: [1], msg: 'Skor C6 minimal 1.' },
                max: { args: [8], msg: 'Skor C6 maksimal 8.' }
            }
        },
        // ==============================
        // CHECKLIST DATA (detail centangan)
        // ==============================
        c2_checklist: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: null,
            comment: 'Checklist BCS [bool×7]'
        },
        c3_checklist: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: null,
            comment: 'Checklist Postur [bool×7]'
        },
        c4_checklist: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: null,
            comment: 'Checklist Vitalitas [bool×7]'
        },
        c5_checklist: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: null,
            comment: 'Checklist Kaki [bool×7]'
        },
        c6_checklist: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: null,
            comment: 'Checklist Temperamen [bool×7]'
        },
        // ==============================
        // HASIL PERHITUNGAN SAW
        // ==============================
        skor_saw: {
            type: DataTypes.FLOAT,
            allowNull: true,
            defaultValue: null,
            comment: 'Skor SAW (0-100)'
        },
        grade: {
            type: DataTypes.STRING(10),
            allowNull: true,
            defaultValue: null,
            comment: 'Platinum (>90) / Gold (75-90) / Silver (60-74) / null (<60)'
        },
        // ==============================
        // STATUS & FOTO
        // ==============================
        status: {
            type: DataTypes.STRING(15),
            allowNull: false,
            defaultValue: 'Available',
            validate: {
                isIn: {
                    args: [['Available', 'Booked', 'Sold']],
                    msg: 'Status harus Available, Booked, atau Sold.'
                }
            }
        },
        foto_url: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        jenis_sapi_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
            references: {
                model: 'jenis_sapi',
                key: 'id'
            }
        }
    }, {
        tableName: 'sapi',
        timestamps: true
    });

    return Sapi;
};
