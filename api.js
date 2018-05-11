const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const multer = require('multer');
const upload = multer({
    dest: 'uploads/'
});
const bodyParser = require('body-parser');

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const AuthToken = require('./models/authToken');
const User = require('./models/user');
const Material = require('./models/material');
const Product = require('./models/product');
const File = require('./models/file');

const authMiddleware = require('./authMiddleware');

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
        res.json(authToken);
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    })
});

router.post('/register', authMiddleware, upload.single(), (req, res) => {
    if (!req.user.isTemporary){
        res.status(403).end();
        return
    }
    if (req.body.mail && req.body.password && req.body.password.length>2) {
        bcrypt.hash(req.body.password, 10)
        .then(hashedPassword => 
            req.user.update({
                isTemporary: false,
                mail: req.body.mail,
                password: hashedPassword,
                address: req.body.address
            })
        )
        .then(updatedUser => 
            generateToken()
            .then( token => 
                AuthToken.create({
                    token: token,
                    userId: updatedUser.userId,
                })
            )
        )
        .then( generatedToken => res.json(generatedToken))
        .catch((err) => {
            console.error(err);
            res.status(500).json(err);
        });
    } else {
        res.status(422).end();
    }
})

router.post('/auth', authMiddleware, upload.single(), (req, res) => {
    if (!req.user.isTemporary){
        res.status(403).end();
        return
    }
    if (req.body.mail && req.body.password){
        User.findOne({
            where: { mail: req.body.mail }
        }).then( user => 
            bcrypt.compare(req.body.password, user.password).then(hashEquals => {
                if (hashEquals){
                    return user
                } else {
                    return null
                }
            })
        ).then( user => {
            if (user){
                return Product.update({//Переписывание всех изделий на нового пользователя
                    userId: user.userId
                }, {
                    where: {
                       userId:  req.user.userId
                    }
                })
                .then( () => req.user.destroy() )
                .then( generateToken )
                .then( token => AuthToken.create({
                    token: token,
                    userId: user.userId,
                }) )
                .then( authToken => {
                    res.json(authToken);
                })
            } else {
                res.status(401).end();
            }
        }).catch((err) => {
            console.error(err);
            res.status(500).json(err);
        });
    } else {
        res.status(422).end();
    }
})

router.get('/materials', authMiddleware, (req, res) => {
    Material.findAll().then(materials => {
        res.json(materials)
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    })
})

//TODO: ограничить размер файла
router.post('/product', authMiddleware, upload.single('model'), (req, res) => {
    if (req.file && req.body.name && req.body.materialId){
        File.create({
            mimetype: req.file.mimetype,
            originalName: req.file.originalName,
            size: req.file.size,
            destination: req.file.destination,
            filename: req.file.filename
        }).then(file => 
            Product.create({
                userId: req.user.userId,
                fileId: file.fileId,
                name: req.body.name,
                description: req.body.description,
                materialId: req.body.materialId
            })
        ).then(product => {
            res.json(product);
        }).catch(err => {
            console.error(err);
            res.status(500).end();
        })
    } else {
        res.status(422).end();
    }
})

router.put('/product/(:productId)', authMiddleware, upload.single(), (req, res) => {
    if (req.body && (req.body.name || req.body.materialId || req.body.description || req.body.count)){
        Product.findOne({ where: {productId: req.params.productId} })
        .then(product => {
            if (!product){
                res.status(404).end();
                return
            }
            if (product.userId !== req.user.userId){
                res.status(403).end();
                return
            }
            if (req.body.name){
                product.name = req.body.name
            }
            if (req.body.materialId){
                product.materialId = req.body.materialId
            }
            if (req.body.description){
                product.description = req.body.description
            }
            if (req.body.count){
                product.count = req.body.count
            }
            return product.save()
        })
        .then(product => {
            if (product){
                res.json(product);
            }
        }).catch(err => {
            console.error('err',err);
            res.status(500).end();
        })
    } else {
        res.status(422).end();
    }
})

module.exports = router;