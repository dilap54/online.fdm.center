process.env.NODE_ENV = 'test';

const fs = require('fs');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app/index');
const should = chai.should();
const expect = chai.expect;

const config = require('../app/config.json');

const sequelize = require('../app/sequelize');
const Material = require('../app/models/material');
const Product = require('../app/models/product');
const User = require('../app/models/user');
const File = require('../app/models/file');
const AuthToken = require('../app/models/authToken');


chai.use(chaiHttp);

describe('API', () => {

    before((done) => {
        sequelize.sync({force: true})
        .then(()=>
            Material.bulkCreate([
                {
                    type: 'ABS',
                    color: 'red',
                    count: 750
                },
                {
                    type: 'PLA',
                    color: 'red',
                    count: 1000
                },
                {
                    type: 'PLA',
                    color: 'black',
                    count: 1250
                }
            ])
            
        )
        .then(()=>{
            done();
        }, done)
    });

    var token;

    describe('POST /api/getTemporaryToken', () => {
        it('should get temporary token', (done) => {
            chai.request(server)
                .post('/api/getTemporaryToken')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.token.should.be.a('string');
                    res.body.token.length.should.be.above(48);
                    token = res.body;
                    done();
                })
        })
        it('temporary user isTemporary should be true', (done) => {
            User.findOne({ where: { userId: token.userId}})
            .then(user => {
                user.isTemporary.should.be.true
                done()
            }, done)
        })
    })

    describe('GET /api/materials', () => {
        it('should get materials list', (done) => {
            chai.request(server)
                .get('/api/materials')
                .set('X-Auth-Token', token.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.equal(3);
                    done(err);
                })
        })
        it('should get error without x-auth-token', (done) => {
            chai.request(server)
                .get('/api/materials')
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                })
        })
        it('should get error with wrong x-auth-token', (done) => {
            chai.request(server)
                .get('/api/materials')
                .set('X-Auth-Token', 'false token')
                .end((err, res) => {
                    res.should.have.status(403);
                    done();
                })
        })
    })
    var product;
    describe('POST /api/product', () => {
        var countFilesInUploadDir = fs.readdirSync('./uploads').length
        it('should get error without file', (done) => {
            chai.request(server)
                .post('/api/product')
                .set('X-Auth-Token', token.token)
                .end((err, res) => {
                    res.should.have.status(422);
                    done(err);
                })
        })
        it('should get product', (done) => {
            chai.request(server)
                .post('/api/product')
                .set('X-Auth-Token', token.token)
                .attach('model', fs.readFileSync('./test/laser.stl'), 'laser.stl')
                .field('name','randomName')
                .field('materialId',1)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.any.keys('productId', 'name', 'materialId', 'count');
                    product = res.body;
                    done(err);
                })
        })
        it('should increase files count in uploads dir', (done) => {
            fs.readdirSync('./uploads').length.should.above(countFilesInUploadDir);
            done();
        })
    })

    describe('POST /api/duplicateProduct/(:productId)', () => {
        it('should get 404 if productId not exists', (done) => {
            chai.request(server)
                .post('/api/duplicateProduct/1234')
                .set('X-Auth-Token', token.token)
                .end((err, res) => {
                    res.should.have.status(404);
                    done(err);
                })
        })
        it('should get product', (done) => {
            chai.request(server)
                .post('/api/duplicateProduct/'+product.productId)
                .set('X-Auth-Token', token.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.any.keys('productId', 'name', 'materialId', 'count');
                    res.body.productId.should.not.equal(product.productId);
                    res.body.materialId.should.equal(product.materialId);
                    res.body.name.should.equal(product.name);
                    done(err);
                })
        })
            
    })

    describe('PUT /api/product/(:productId)', () => {
        var token1;
        var token2;
        var product;
        it('creating new token1', (done) => {
            chai.request(server)
            .post('/api/getTemporaryToken')
            .end((err, res) => {
                token1 = res.body;
                done(err);
            })
        })
        it('creating new token2', (done) => {
            chai.request(server)
            .post('/api/getTemporaryToken')
            .end((err, res) => {
                token2 = res.body;
                done(err);
            })
        })
        it('creating new product for token1', (done) => {
            chai.request(server)
            .post('/api/product')
            .set('X-Auth-Token', token1.token)
            .attach('model', fs.readFileSync('./test/laser.stl'), 'laser.stl')
            .field('name','randomName')
            .field('materialId',1)
            .end((err, res) => {
                product = res.body;
                done(err);
            })
        })
        
        it('update product without token should return 401', (done) => {
            chai.request(server)
            .put('/api/product/'+product.productId)
            .end((err, res) => {
                res.should.have.status(401);
                done(err);
            })
        })
        it('update product without id should return 404', (done) => {
            chai.request(server)
            .put('/api/product/222')
            .set('X-Auth-Token', token1.token)
            .field('description', 'description')
            .end((err, res) => {
                res.should.have.status(404);
                done(err);
            })
        })
        it('should return 403 with wrong token', (done) => {
            chai.request(server)
            .put('/api/product/'+product.productId)
            .set('X-Auth-Token', token2.token)
            .field('description', 'testDescription')
            .end((err, res) => {
                res.should.have.status(403);
                done(err);
            })
        })
        it('should return product', (done) => {
            chai.request(server)
            .put('/api/product/'+product.productId)
            .set('X-Auth-Token', token1.token)
            .field('description', 'testDescription')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.description.should.be.a('string');
                res.body.description.should.equal('testDescription')
                done(err);
            })
        })
    })

    
    describe('POST /api/register', () => {
        var tokenRegister;
        var product;
        it('creating new tokenRegister', (done) => {
            chai.request(server)
            .post('/api/getTemporaryToken')
            .end((err, res) => {
                tokenRegister = res.body;
                done(err);
            })
        })
        it('creating new product', (done) => {
            chai.request(server)
            .post('/api/product')
            .set('X-Auth-Token', tokenRegister.token)
            .attach('model', fs.readFileSync('./test/laser.stl'), 'laser.stl')
            .field('name','randomName')
            .field('materialId',1)
            .end((err, res) => {
                product = res.body;
                done(err);
            })
        })
        it('should return 401 without token', (done) => {
            chai.request(server)
            .post('/api/register')
            .field('mail', '123@123.ru')
            .field('password', 'password')
            .end((err, res) => {
                res.should.have.status(401);
                done(err);
            })
        })
        it('should return new token', (done) => {
            chai.request(server)
            .post('/api/register')
            .set('X-Auth-Token', tokenRegister.token)
            .field('mail', '123@123.ru')
            .field('password', 'password')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.token.should.be.a('string');
                res.body.token.length.should.be.above(48);
                done(err);
            })
        })
        it('should set user.isTemporary to false', (done) => {
            User.findOne({ where: { userId: tokenRegister.userId}})
            .then(user => {
                user.isTemporary.should.be.false
                done()
            }, done)
        })
    })

    describe('POST /api/auth', () => {
        var product;
        var tokenBeforeAuth;
        var tokenAfterAuth;
        it('creating new tokenAuth', (done) => {
            chai.request(server)
            .post('/api/getTemporaryToken')
            .end((err, res) => {
                tokenBeforeAuth = res.body;
                done(err);
            })
        })
        it('creating new product', (done) => {
            chai.request(server)
            .post('/api/product')
            .set('X-Auth-Token', tokenBeforeAuth.token)
            .attach('model', fs.readFileSync('./test/laser.stl'), 'laser.stl')
            .field('name','randomName')
            .field('materialId',1)
            .end((err, res) => {
                product = res.body;
                done(err);
            })
        })
        it('should return 401 without token', (done) => {
            chai.request(server)
            .post('/api/auth')
            .end((err, res) => {
                res.should.have.status(401);
                done(err);
            })
        })
        it('should return 401 with wrong creditinals', (done) => {
            chai.request(server)
            .post('/api/auth')
            .set('X-Auth-Token', tokenBeforeAuth.token)
            .field('mail', '123@123.ru')
            .field('password', 'wrongPassword')
            .end((err, res) => {
                res.should.have.status(401);
                done(err);
            })
        })
        it('should return new token', (done) => {
            chai.request(server)
            .post('/api/auth')
            .set('X-Auth-Token', tokenBeforeAuth.token)
            .field('mail', '123@123.ru')
            .field('password', 'password')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.token.should.be.a('string');
                res.body.token.length.should.be.above(48);
                tokenAfterAuth = res.body;
                done(err);
            })
        })
        it('shouldn`t userId before auth equal userId after auth', (done) => {
            tokenBeforeAuth.userId.should.not.equal(tokenAfterAuth.userId);
            done();
        })
        it('product should change id to new', (done) => {
            Product.findOne({ where: {productId: product.productId} })
            .then( dbProduct => {
                dbProduct.userId.should.equal(tokenAfterAuth.userId);
                done()
            }, done);
        })
        it('old user should be deleted', (done) => {
            User.findOne({ where: {userId: tokenBeforeAuth.userId} })
            .then( user => {
                expect(user).to.be.null;
                done()
            }, done)
        })
        it('old authToken should be deleted', (done) => {
            AuthToken.findOne({ where: {userId: tokenBeforeAuth.userId} })
            .then( authToken => {
                expect(authToken).to.be.null;
                done()
            }, done)
        })
    })

    describe('PUT /api/file/(:fileId)', () => {
        it('should return 401 without x-auth-token', (done) => {
            chai.request(server)
            .put('/api/file/'+product.fileId)
            .field('status', 'new status')
            .end((err, res) => {
                res.should.have.status(401);
                done(err);
            })
        })
        it('should return 403 with wrong x-auth-token', (done) => {
            chai.request(server)
            .put('/api/file/'+product.fileId)
            .set('X-Auth-Token', token.token)
            .field('status', 'new status')
            .end((err, res) => {
                res.should.have.status(403);
                done(err);
            })
        })
        it('should return new file', (done) => {
            chai.request(server)
            .put('/api/file/'+product.fileId)
            .set('X-Auth-Token', config.serverAuthToken)
            .field('status', 'new status')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.status.should.equal('new status');
                done(err);
            })
        })
        it('should save new file status in database', (done) => {
            File.findOne({ where: {fileId: product.fileId}})
            .then(file => {
                file.status.should.equal('new status')
                done()
            }, done)
        })
    })
    
})