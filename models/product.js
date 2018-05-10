const Sequelize = require('sequelize');
const sequelize = require('../sequelize')
const Product = sequelize.define('product', {
    productId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: Sequelize.STRING,
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    fileId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    materialId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
});

module.exports = Product;

const Material = require('./material');
Product.hasOne(Material, {
    foreignKey: 'materialId'
})
const File = require('./file');
Product.hasOne(File, {
    foreignKey: 'fileId'
})
const User = require('./user');
Product.belongsTo(User, {
    foreignKey: 'userId'
})
