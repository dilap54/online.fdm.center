const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const multer = require('multer')
const upload = multer({
    dest: 'uploads/'
})

const AuthToken = require('./models/authToken');
const User = require('./models/user');
const Material = require('./models/material')
const File = require('./models/file')

const authMiddleware = require('./authMiddleware')

function generateToken(){
    return new Promise((resolve, reject)=>{
        crypto.randomBytes(48, (err, buffer) => {
            if (err){
                reject(err);
            } else {
                resolve(buffer.toString('hex'));
            }
        });
    })
}

router.post('/getTemporaryToken', (req, res)=>{
    generateToken().then((token)=>
        User.create({
            isTemporary: true
         }).then(user=>
             AuthToken.create({
                 token: token,
                 userId: user.userId,
             })
         )
    )
    .then((authToken)=>{
        console.log(authToken.token);
        res.json(authToken);
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    })
});

router.get('/materials', authMiddleware, (req, res)=>{
    Material.findAll().then(materials => {
        res.json(materials)
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    })
})

//TODO: ограничить размер файла
router.post('/product', authMiddleware, upload.single('model'), (req, res) => {
    if (req.file){
        File.create({
            mimetype: req.file.mimetype,
            originalName: req.file.originalName,
            size: req.file.size,
            destination: req.file.destination,
            filename: req.file.filename
        }).then(file => {
            res.json(file);
        }).catch(err => {
            console.error(err);
            res.status(500).end();
        })
    } else {
        res.status(422).end();
    }
})

module.exports = router;