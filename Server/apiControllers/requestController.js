var express = require('express');

var router = express.Router();
var requestRepo = require('../repos/requestRepo');
var events = require('../events');
//
// load orders by User

router.get('/getAll', (req, res) => {

    requestRepo.loadAll()
        .then(rows => {
            res.json(rows);
        }).catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on console');
        })


});
router.get('/getAllRequestApp1', (req, res) => {
    requestRepo.loadAllRequestApp1()
        .then(rows => {
            res.json(rows);
        }).catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on console');
        })
});

router.get('/getUserInfo', (req, res) => {
    requestRepo.loadUserInfo()
    .then(rows => {
        res.json(rows);
    }).catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.end('View error log on console');
    })
});

router.get('/getAllRequestApp2', (req, res) => {

    requestRepo.loadAllRequestApp2()
        .then(rows => {
            res.json(rows);
        }).catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on console');
        })
});
router.post('/updateGeocoderRequest', (req, res) => {

    console.log(req.body);
    requestRepo.updateGeocoder(req.body.id, req.body.lat, req.body.lng).then(rows => {
        res.statusCode = 200;
        res.end('Done');
        events.publishRequestRemove("done");

    }).catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.end('View error log on console');
    })
});

router.post('/updateUserStatus',(req,res)=>{

    requestRepo.updateUserStatus(req.body.ID,req.body.Status).then(row=>{
        res.statusCode=200;
        res.end('Done');
    }).catch(err=>{
        console.log(err);
        res.statusCode=500;
        res.end('View error log on console');
    })
});
router.post('/updateRequestStatus',(req,res)=>{
    console.log(req.body.id+req.body.status);
    requestRepo.updateRequestStatus(req.body.id, req.body.status).then(row=>{
        if (row.affectedRows>0){
            res.statusCode=200;
            res.end('Done');
        }else {
            res.statusCode=406;
            res.end('false');
        }

    }).catch(err=>{
        console.log(err);
        res.statusCode=500;
        res.end('View error log on console');
    })
});

module.exports = router;
