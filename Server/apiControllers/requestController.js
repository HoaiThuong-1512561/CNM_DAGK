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
router.get('/getAllRequestApp1',(req,res)=>{
    requestRepo.loadAllRequestApp1()
        .then(rows => {
            res.json(rows);
        }).catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.end('View error log on console');
    })
});
router.post('/updateGeocoderRequest',(req,res)=>{

    requestRepo.updateGeocoder(req.body.id,req.body.lat,req.body.lng).then(rows=>{
        res.statusCode = 200;
        res.end('Done');
        events.publishRequestRemove("done");
    }).catch(err=>{
        console.log(err);
        res.statusCode = 500;
        res.end('View error log on console');
    })
});

module.exports = router;