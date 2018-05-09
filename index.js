const express = require('express');
const app = express();

const sequelize = require('./sequelize');
const api = require('./api');

sequelize.sync()
    .then(()=>{
        console.log('sequelize synced');
    })
    .catch((err)=>{
        console.error('sequelize sync error', err);
    })

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

app.use('/api', api);

app.listen(3000, ()=>{
    console.log('App started', 3000)
});