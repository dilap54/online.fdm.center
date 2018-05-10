const Sequelize = require('sequelize');
const sequelize = new Sequelize('online.fdm.center', 'root', '123321Aa', {
  host: '192.168.1.111',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
});

module.exports = sequelize;