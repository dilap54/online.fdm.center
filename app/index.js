const express = require('express');
const app = express();

const sequelize = require('./sequelize');
const api = require('./api');

app.use('/apidoc', express.static('apidoc'));

app.use('/api', api);

/*
sequelize.sync({force: true})
    .then(() => {
        console.log('sequelize synced');
    })
    .catch((err) => {
        console.error('sequelize sync error', err);
    })
*/


app.listen(3000);
console.log('App started', 3000)

module.exports = app;