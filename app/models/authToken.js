const Sequelize = require('sequelize');
const sequelize = require('../sequelize')

const AuthToken = sequelize.define('authToken', {
    token: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
});

module.exports = AuthToken;

const User = require('./user')
AuthToken.belongsTo(User, {
    foreignKey: 'userId'
})