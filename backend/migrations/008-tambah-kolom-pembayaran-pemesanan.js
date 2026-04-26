'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Tambah kolom metode_pembayaran
        await queryInterface.addColumn('pemesanan', 'metode_pembayaran', {
            type: Sequelize.STRING(20),
            allowNull: false,
            defaultValue: 'ditempat',
            comment: 'midtrans atau ditempat'
        });

        // Tambah kolom midtrans_order_id
        await queryInterface.addColumn('pemesanan', 'midtrans_order_id', {
            type: Sequelize.STRING(50),
            allowNull: true,
            defaultValue: null,
            comment: 'Order ID di Midtrans'
        });

        // Perlebar kolom status dari STRING(15) ke STRING(25)
        // untuk mendukung value 'Menunggu Pembayaran'
        await queryInterface.changeColumn('pemesanan', 'status', {
            type: Sequelize.STRING(25),
            allowNull: false,
            defaultValue: 'Pending'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('pemesanan', 'metode_pembayaran');
        await queryInterface.removeColumn('pemesanan', 'midtrans_order_id');
        await queryInterface.changeColumn('pemesanan', 'status', {
            type: Sequelize.STRING(15),
            allowNull: false,
            defaultValue: 'Pending'
        });
    }
};
