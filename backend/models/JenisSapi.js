'use strict';

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const JenisSapi = sequelize.define('JenisSapi', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nama: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: { msg: 'Nama jenis sapi tidak boleh kosong.' }
            }
        },
        deskripsi: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null
        }
    }, {
        tableName: 'jenis_sapi',
        timestamps: true
    });

    return JenisSapi;
};
