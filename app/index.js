const express = require('express');
const app = express();

const sequelize = require('./sequelize');
const api = require('./api');

app.options("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, X-Auth-Token');
    res.sendStatus(200);
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, DELETE, OPTIONS');
    next();
})

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