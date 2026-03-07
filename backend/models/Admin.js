'use strict';

const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
    const Admin = sequelize.define('Admin', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: { msg: 'Username tidak boleh kosong.' },
                len: { args: [3, 50], msg: 'Username harus 3-50 karakter.' }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Password tidak boleh kosong.' },
                len: { args: [6, 255], msg: 'Password minimal 6 karakter.' }
            }
        }
    }, {
        tableName: 'admin',
        timestamps: true,
        hooks: {
            beforeCreate: async (admin) => {
                const salt = await bcrypt.genSalt(10);
                admin.password = await bcrypt.hash(admin.password, salt);
            },
            beforeUpdate: async (admin) => {
                if (admin.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    admin.password = await bcrypt.hash(admin.password, salt);
                }
            }
        }
    });

    // Method untuk verifikasi password saat login
    Admin.prototype.verifikasiPassword = async function (password) {
        return bcrypt.compare(password, this.password);
    };

    return Admin;
};
