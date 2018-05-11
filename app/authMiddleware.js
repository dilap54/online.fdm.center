const AuthToken = require('./models/authToken');
const User = require('./models/user')

const authMiddleware = (req, res, next) => {
    if (req.header('x-auth-token')){
        AuthToken.findOne({
            where: {token: req.header('x-auth-token')}
        }).then(authToken => {
            if (authToken) {
                User.findOne({
                    where: { userId: authToken.userId }
                }).then(user => {
                    if (user){
                        req.user = user;
                        next()
                    } else {
                        res.status(500).end();
                        return Promise.reject('Токен есть, а пользователя нет')
                    }
                })
            } else {
                res.status(403).end()
            }
        })
    } else {
        res.status(401).end();
    }
}

module.exports = authMiddleware