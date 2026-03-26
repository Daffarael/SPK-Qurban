'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('jenis_sapi', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            nama: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true
            },
            deskripsi: {
                type: Sequelize.TEXT,
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
        await queryInterface.dropTable('jenis_sapi');
    }
};
