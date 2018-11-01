var express = require('express');

var router = express.Router();
var requestRepo = require('../repos/requestRepo');
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

module.exports = router;