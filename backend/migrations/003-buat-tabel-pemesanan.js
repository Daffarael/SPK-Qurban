'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('pemesanan', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            kode_pemesanan: {
                type: Sequelize.STRING(30),
                allowNull: false,
                unique: true
            },
            sapi_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'sapi',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            nama_pelanggan: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            no_wa: {
                type: Sequelize.STRING(20),
                allowNull: false
            },
            tanggal_pemesanan: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            kadaluarsa_pada: {
                type: Sequelize.DATE,
                allowNull: false,
                comment: 'tanggal_pemesanan + 48 jam'
            },
            status: {
                type: Sequelize.STRING(15),
                allowNull: false,
                defaultValue: 'Pending'
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('pemesanan');
    }
};
