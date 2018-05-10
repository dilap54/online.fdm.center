process.env.NODE_ENV = 'test';

const fs = require('fs');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();

const sequelize = require('../sequelize');
const Material = require('../models/material')
const Product = require('../models/product')
const User = require('../models/user')

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

    describe('POST /api/product', () => {
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
                    done(err);
                })
        })
    })
    var product;
    describe('POST /api/register', () => {
        var tokenRegister;
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
    })
    
})