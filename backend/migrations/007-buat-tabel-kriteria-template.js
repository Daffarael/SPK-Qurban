'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('kriteria_template', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            jenis_sapi_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'jenis_sapi',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            kode_kriteria: {
                type: Sequelize.STRING(5),
                allowNull: false,
                comment: 'Kode kriteria: c2, c3, c4, c5, c6'
            },
            label: {
                type: Sequelize.STRING(100),
                allowNull: false,
                comment: 'Label tampilan, misal: Body Condition Score'
            },
            items: {
                type: Sequelize.JSON,
                allowNull: false,
                comment: 'Array of checklist strings, min 5 items'
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

        // Unique constraint: 1 jenis sapi hanya punya 1 row per kode_kriteria
        await queryInterface.addConstraint('kriteria_template', {
            fields: ['jenis_sapi_id', 'kode_kriteria'],
            type: 'unique',
            name: 'uq_jenis_kode_kriteria'
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('kriteria_template');
    }
};
