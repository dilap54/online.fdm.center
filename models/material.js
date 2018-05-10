const Sequelize = require('sequelize');
const sequelize = require('../sequelize');
const Material = sequelize.define('material', {
    materialId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: Sequelize.STRING,
    color: Sequelize.STRING,
    count: Sequelize.INTEGER
});

module.exports = Material;

const Product = require('./product');
Material.hasMany(Product, {
    foreignKey: 'materialId'
})
