'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('sapi', 'c2_checklist', {
            type: Sequelize.JSON,
            allowNull: true,
            defaultValue: null,
            comment: 'Checklist BCS [bool,bool,bool,bool]'
        });
        await queryInterface.addColumn('sapi', 'c3_checklist', {
            type: Sequelize.JSON,
            allowNull: true,
            defaultValue: null,
            comment: 'Checklist Postur [bool,bool,bool,bool]'
        });
        await queryInterface.addColumn('sapi', 'c4_checklist', {
            type: Sequelize.JSON,
            allowNull: true,
            defaultValue: null,
            comment: 'Checklist Vitalitas [bool,bool,bool,bool]'
        });
        await queryInterface.addColumn('sapi', 'c5_checklist', {
            type: Sequelize.JSON,
            allowNull: true,
            defaultValue: null,
            comment: 'Checklist Kaki [bool,bool,bool,bool]'
        });
        await queryInterface.addColumn('sapi', 'c6_checklist', {
            type: Sequelize.JSON,
            allowNull: true,
            defaultValue: null,
            comment: 'Checklist Temperamen [bool,bool,bool,bool]'
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('sapi', 'c2_checklist');
        await queryInterface.removeColumn('sapi', 'c3_checklist');
        await queryInterface.removeColumn('sapi', 'c4_checklist');
        await queryInterface.removeColumn('sapi', 'c5_checklist');
        await queryInterface.removeColumn('sapi', 'c6_checklist');
    }
};
