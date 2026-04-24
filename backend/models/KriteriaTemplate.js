'use strict';

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const KriteriaTemplate = sequelize.define('KriteriaTemplate', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        jenis_sapi_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: { msg: 'Jenis sapi wajib diisi.' }
            }
        },
        kode_kriteria: {
            type: DataTypes.STRING(5),
            allowNull: false,
            validate: {
                isIn: {
                    args: [['c2', 'c3', 'c4', 'c5', 'c6']],
                    msg: 'Kode kriteria harus salah satu dari: c2, c3, c4, c5, c6'
                }
            }
        },
        label: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Label kriteria tidak boleh kosong.' }
            }
        },
        items: {
            type: DataTypes.JSON,
            allowNull: false,
            validate: {
                isArrayWithMinItems(value) {
                    if (!Array.isArray(value)) {
                        throw new Error('Items harus berupa array.');
                    }
                    if (value.length < 5) {
                        throw new Error('Minimal 5 item checklist per kriteria.');
                    }
                    if (!value.every(item => typeof item === 'string' && item.trim().length > 0)) {
                        throw new Error('Setiap item harus berupa string yang tidak kosong.');
                    }
                }
            }
        }
    }, {
        tableName: 'kriteria_template',
        timestamps: true
    });

    return KriteriaTemplate;
};
