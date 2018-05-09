const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const AuthToken = require('./models/authToken');
const User = require('./models/user');

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
    }).catch((err)=>{
        console.error(err);
    })
});

module.exports = router;