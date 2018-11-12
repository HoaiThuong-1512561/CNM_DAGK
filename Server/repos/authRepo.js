var jwt = require('jsonwebtoken');
var rndToken = require('rand-token');
var moment = require('moment');
var userRepo=require('./userRepo');
var db = require('../fn/mysql-db');

const SECRET = 'HUUTHAN';
const AC_LIFETIME = 5; // seconds

exports.generateAccessToken = userEntity => {
    var payload = {
        user: userEntity,
        info: 'more info'
    }

    var token = jwt.sign(payload, SECRET, {
        expiresIn: AC_LIFETIME
    });

    return token;
}

exports.verifyAccessToken = (req, res, next) => {
    var token = req.headers['token'];
    if (token) {
        jwt.verify(token, SECRET, (err, payload) => {
            if (err) {
                res.statusCode = 401;
                res.json({
                    msg: 'INVALID TOKEN',
                    error: err
                })
            } else {
                req.token_payload = payload;
                next();
            }
        });
    } else {
        res.statusCode = 403;
        res.json({
            msg: 'NO_TOKEN'
        })
    }
}

exports.generateRefreshToken = () => {
    const SIZE = 80;
    return rndToken.generate(SIZE);
}

exports.refreshAccessToken = (refToken) => {
    return new Promise((resolve, reject) => {
        var sql = `select* from userRefreshTokenExt where token = '${refToken}'`;
        db.load(sql) // delete
            .then(rows => {
                if (rows.length>0){
                    userRepo.getUserInfo(rows[0].ID).then(info=>{
                        var payload = {
                            user: info,
                            info: 'more info'
                        }

                        var token = jwt.sign(payload, SECRET, {
                            expiresIn: AC_LIFETIME
                        });

                        resolve(token);
                    })
                }else {
                    reject();
                }
            })
    });
};

exports.updateRefreshToken = (userId, rfToken) => {
    return new Promise((resolve, reject) => {

        var sql = `delete from userRefreshTokenExt where ID = ${userId}`;
        db.insert(sql) // delete
            .then(value => {
                var rdt = moment().format('YYYY-MM-DD HH:mm:ss');
                sql = `insert into userRefreshTokenExt values(${userId}, '${rfToken}', '${rdt}')`;
                return db.insert(sql);
            })
            .then(value => resolve(value))
            .catch(err => reject(err));
    });
}