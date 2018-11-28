var express = require('express');

var router = express.Router();
var requestRepo = require('../repos/requestRepo');
var userRepo = require('../repos/userRepo');
var moment = require('moment');
var events = require('../events');
//
// load orders by User
router.post('/addRequest', (req, res) => {
    entity ={
        name:req.body.name,
        phone:req.body.phone,
        address:req.body.address,
        note:req.body.note,
        time:moment().format("YYYY-MM-DD HH:mm:ss"),
        status:1 //Chưa được định vị
    };

    userRepo.addRequest(entity).then((value)=>{
        entity.id_request = value.insertId;
        events.publishRequestAdded(entity);
    }).catch((err)=>{
        console.log(err);
    });
    res.json(entity);
});


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

router.post('/getUserInfo', (req, res) => {
    requestRepo.loadUserInfo(req.body.userName)
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

router.post('/updateDriverLocationRequest', (req,res)=>{
    requestRepo.updateDriverLocation(req.body.ID, req.body.lat, req.body.lng).then(rows => {
        events.publishDriverLocale("Done");
        res.statusCode = 200;
        res.end('Done');

    }).catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.end('View error log on console');
    })
})
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
    requestRepo.updateRequestStatus(req.body.id, req.body.status,req.body.userName).then(row=>{
        if (row.affectedRows>0){
            events.publishRequestRemove("done");
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
