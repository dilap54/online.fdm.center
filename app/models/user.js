const Sequelize = require('sequelize');
const sequelize = require('../sequelize')
const User = sequelize.define('user', {
    userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    mail: {
        type: Sequelize.STRING,
    },
    password: Sequelize.STRING,
    address: Sequelize.STRING,
    balance: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    isTemporary: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    }
});

module.exports = User;

const AuthToken = require('./authToken');
User.hasMany(AuthToken, {
    foreignKey: 'userId',
    onDelete: 'cascade'
});
const Product = require('./product');
User.hasMany(Product, {
    foreignKey: 'userId'
});