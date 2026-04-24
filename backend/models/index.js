'use strict';

const { Sequelize } = require('sequelize');
const config = require('../config/database.js');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging
  }
);

const db = {};

// ========================
// IMPORT MODELS
// ========================
db.Admin = require('./Admin')(sequelize);
db.Sapi = require('./Sapi')(sequelize);
db.Pemesanan = require('./Pemesanan')(sequelize);
db.JenisSapi = require('./JenisSapi')(sequelize);
db.KriteriaTemplate = require('./KriteriaTemplate')(sequelize);

// ========================
// RELASI ANTAR MODEL
// ========================

// Sapi memiliki banyak Pemesanan
db.Sapi.hasMany(db.Pemesanan, {
  foreignKey: 'sapi_id',
  as: 'pemesanan'
});

// Pemesanan milik satu Sapi
db.Pemesanan.belongsTo(db.Sapi, {
  foreignKey: 'sapi_id',
  as: 'sapi'
});

// JenisSapi memiliki banyak Sapi
db.JenisSapi.hasMany(db.Sapi, {
  foreignKey: 'jenis_sapi_id',
  as: 'daftarSapi'
});

// Sapi milik satu JenisSapi
db.Sapi.belongsTo(db.JenisSapi, {
  foreignKey: 'jenis_sapi_id',
  as: 'jenisSapi'
});

// JenisSapi memiliki banyak KriteriaTemplate
db.JenisSapi.hasMany(db.KriteriaTemplate, {
  foreignKey: 'jenis_sapi_id',
  as: 'kriteriaTemplates'
});

// KriteriaTemplate milik satu JenisSapi
db.KriteriaTemplate.belongsTo(db.JenisSapi, {
  foreignKey: 'jenis_sapi_id',
  as: 'jenisSapi'
});

// ========================
// EXPORT
// ========================
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
