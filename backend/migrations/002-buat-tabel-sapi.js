'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('sapi', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            kode_sapi: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true
            },
            berat_kg: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            harga: {
                type: Sequelize.DECIMAL(15, 2),
                allowNull: false
            },
            // Kriteria SAW (1-5)
            c1_bobot: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: 'Auto-calculated dari berat_kg'
            },
            c2_bcs: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: 'Body Condition Score'
            },
            c3_postur: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: 'Konformasi & Postur'
            },
            c4_vitalitas: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: 'Vitalitas & Kesehatan'
            },
            c5_kaki: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: 'Kekokohan Kaki'
            },
            c6_temperamen: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: 'Temperamen'
            },
            // Hasil SAW
            skor_saw: {
                type: Sequelize.FLOAT,
                allowNull: true,
                defaultValue: null,
                comment: 'Skor SAW (0-100)'
            },
            grade: {
                type: Sequelize.STRING(10),
                allowNull: true,
                defaultValue: null,
                comment: 'Platinum / Gold / Silver / null'
            },
            // Status & Foto
            status: {
                type: Sequelize.STRING(15),
                allowNull: false,
                defaultValue: 'Available'
            },
            foto_url: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: null
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
        await queryInterface.dropTable('sapi');
    }
};
