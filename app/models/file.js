const Sequelize = require('sequelize');
const sequelize = require('../sequelize');
const File = sequelize.define('file', {
    fileId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    mimetype: Sequelize.STRING,
    originalName: Sequelize.STRING,
    size: Sequelize.STRING,
    destination: Sequelize.STRING,
    filename: Sequelize.STRING,
    status: Sequelize.STRING,
    amount: Sequelize.INTEGER
});

module.exports = File;

const Product = require('./product');
File.hasMany(Product, {
    foreignKey: 'fileId'
})
