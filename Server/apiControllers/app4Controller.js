var express = require('express');

var router = express.Router();
var userRepo = require('../repos/userRepo'),
    moment = require('moment');
var authRepo = require('../repos/authRepo');


router.post('/registerapp4',(req,res)=>{
    var entity={
        username:req.body.userName,
        password:req.body.password,
        permission:4
    };

    

    userRepo.checkUserName(entity.username).then(rows=>{
        if (rows.length===0){
            userRepo.add(entity).then(rows=>{
                res.json({
                    note:"done"
                })
            }).catch(err=>{
                console.log(err)
            })
        }else {
            res.json({
                note:"da ton tai"
            })
        }
    })


});
router.post('/login', (req, res) => {
    var entity={
        userName:req.body.userName,
        password: req.body.password,
    }
    
    userRepo.login(entity)
        .then(rows => {
            
            if (rows.length > 0) {
                console.log(entity);
                var userEntity = rows[0];
                var acToken = authRepo.generateAccessToken(userEntity);
                var rfToken = authRepo.generateRefreshToken();
                console.log(rfToken);

                authRepo.updateRefreshToken(userEntity.ID, rfToken)
                    .then(value => {
                        res.json({
                            auth: true,
                            user: userEntity,
                            access_token: acToken,
                            refresh_token: rfToken
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        res.statusCode = 500;
                        res.end('View error log on console');
                    })
            } else {
                res.statusCode = 404;
                res.json({
                    
                    auth: false
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on console');
        })
})

module.exports = router;