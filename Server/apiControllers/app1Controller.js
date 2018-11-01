var express = require('express');

var router = express.Router();
var userRepo = require('../repos/userRepo'),
    moment = require('moment');
var events = require('../events');
//
// load orders by User

router.post('/request', (req, res) => {
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

module.exports = router;