const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const multer = require('multer');
const upload = multer({
    dest: './uploads/'
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

/**
 * @apiDefine requireAuth
 * @apiHeader X-Auth-Token токен авторизации
 * @apiError 401 Токен не был передан
 * @apiError 403 Токен не найден в базе
 */
/**
 * @apiDefine returnToken
 * @apiSuccess {object} token
 * @apiSuccess {string} token.token Токен
 * @apiSuccess {number} token.userId Id пользователя
 */
/**
 * @apiDefine returnProduct
 * @apiSuccess {object} product
 * @apiSuccess {number} product.productId Id изделия
 * @apiSuccess {string} product.name Название изделия
 * @apiSuccess {number} product.materialId Id материала 
 * @apiSuccess {string} product.description Описание изделия
 */

/**
 * @api {POST} /api/getTemporaryToken get temporary token
 * @apiDescription Создает временного пользователя с ограниченными правами и возвращает токен авторизации
 * @apiGroup Auth
 * @apiUse returnToken
 */
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

/**
 * @api {POST} /api/register do register
 * @apiDescription Регистрирует нового пользователя с логином и паролем, переводит все изделия временного пользователя на нового, возвращает новый токен
 * @apiGroup Auth
 * @apiParam mail Почта
 * @apiParam password Пароль
 * @apiParam [address] Адрес
 * @apiUse returnToken
 * @apiUse requireAuth
 */
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

/**
 * @api {POST} /api/auth do auth
 * @apiDescription Авторизует пользователя с помощью логина и пароля, переводоит все изделия временного пользователя на него, возвращает новый токен
 * @apiGroup Auth
 * @apiParam mail Почта
 * @apiParam password Пароль
 * @apiUse returnToken
 * @apiUse requireAuth
 */
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

/**
 * @api {GET} /api/materials get materials
 * @apiDescription Отдает доступные для печати материалы
 * @apiGroup Product
 * @apiSuccess {object} material
 * @apiSuccess {number} material.materialId ID материала
 * @apiSuccess {string} material.type Тип материала
 * @apiSuccess {string} material.color Цвет материала
 * @apiSuccess {number} material.count Количество материала в граммах
 * @apiUse requireAuth
 */
router.get('/materials', authMiddleware, (req, res) => {
    Material.findAll().then(materials => {
        res.json(materials)
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    })
})

/**
 * @api {POST} /api/product create product
 * @apiDescription Загружает 3d модель, создает с ней новое изделие на сервере, возвращает изделие
 * @apiGroup Product
 * @apiParam {file} model Файл с моделью
 * @apiParam name Название изделия
 * @apiParam materialId Id материала
 * @apiParam [description] Описание изделия
 * @apiUse returnProduct
 * @apiUse requireAuth
 */
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
                materialId: Number(req.body.materialId)
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

router.post('/duplicateProduct/(:productId)', authMiddleware, (req, res) => {
    Product.findOne({ where: {productId: req.params.productId} })
    .then(product => {
        if (product){
            let {productId, ...newProduct} = product.get({plain: true})
            return Product.create(newProduct)
        } else {
            res.status(404).end();
            return
        }
    })
    .then(product => {
        if (product){
            res.json(product);
        }
    })
    .catch(err => {
        console.error('err',err);
        res.status(500).end();
    })
})

/**
 * @api {PUT} /api/product/(:productId) update product
 * @apiDescription Обновляет данные изделия, возвращает новые данные
 * @apiGroup Product
 * @apiParam [name] Название изделия
 * @apiParam [materialId] Id материала
 * @apiParam [description] Описание изделия
 * @apiParam [count] Количество изделий
 * @apiUse returnProduct
 * @apiUse requireAuth
 */
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