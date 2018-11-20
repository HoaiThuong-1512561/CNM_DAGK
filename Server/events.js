var eventEmitter = require('eventemitter3');
var emitter = new eventEmitter();
var userRepo=require('./repos/userRepo');
var requestRepo=require('./repos/requestRepo');
const haversine = require('haversine');
var subscribeEventDriver = (req, res, event) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    var heartBeat = setInterval(() => {
        userRepo.getUserStatus(req.query.userName).then(rows=>{
            if(rows.length>0 && rows[0].Status==='READY'){
                requestRepo.loadAllRequestApp2().then(rows2=>{
                    if (rows2.length>=0){
                        let min=0;
                        let index=-1;
                        for (var i=0;i<rows2.length;i++){
                            if (rows2[i].status===2){
                                let start = {
                                    latitude: rows[0].lat,
                                    longitude: rows[0].lng
                                };
                                let end = {
                                    latitude: rows2[i].lat,
                                    longitude: rows2[i].lng
                                };
                                    if (min===0 || min>haversine(start, end, {unit: 'meter'}))
                                    {
                                        min=haversine(start, end, {unit: 'meter'});
                                        index=i;
                                    }
                            }
                        }
                        if (index!==-1){
                            var json = JSON.stringify(rows2[index]);
                            res.write(`retry: 500\n`);
                            res.write(`event: DRIVER_RECEIVE\n`);
                            res.write(`data: ${json}\n`);
                            res.write(`\n`);
                        }else {
                            res.write('\n');
                        }


                    }else {
                        res.write('\n');
                    }
                })

            }else{
                res.write('\n');
            }
        })
    }, 5000);

    var handler = data => {
        var json = JSON.stringify(data);
        res.write(`retry: 500\n`);
        res.write(`event: ${event}\n`);
        res.write(`data: ${json}\n`);
        res.write(`\n`);
    };

    emitter.on(event, handler);

    req.on('close', () => {
        clearInterval(heartBeat);
        emitter.removeListener(event, handler);
    });
};

var subscribeEvent = (req, res, event) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    var heartBeat = setInterval(() => {
        userRepo.getUserStatus(req.body.userName).then(rows=>{
            res.write('\n');
        })
    }, 15000);

    var handler = data => {
        var json = JSON.stringify(data);
        res.write(`retry: 500\n`);
        res.write(`event: ${event}\n`);
        res.write(`data: ${json}\n`);
        res.write(`\n`);
    };

    emitter.on(event, handler);

    req.on('close', () => {
        clearInterval(heartBeat);
        emitter.removeListener(event, handler);
    });
};

//
// event pub-sub

var REQUEST_ADDED = 'REQUEST_ADDED';
var REQUEST_REMOVE = 'REQUEST_REMOVE';
var DRIVER_RECEIVE='DRIVER_RECEIVE';
var subscribeRequestAdded = (req, res) => {
    subscribeEvent(req, res, REQUEST_ADDED);
};
var subscribeRequestRemove = (req, res) => {
    subscribeEvent(req, res, REQUEST_REMOVE);
};
var subscribeDriverReceive = (req, res) => {
    subscribeEventDriver(req, res, DRIVER_RECEIVE);
};



var publishRequestAdded = requestObj => {
    emitter.emit(REQUEST_ADDED, requestObj);
};
var publishRequestRemove = requestObj => {
    emitter.emit(REQUEST_REMOVE, requestObj);
};

module.exports = {
    subscribeRequestAdded,
    publishRequestAdded,
    publishRequestRemove,
    subscribeRequestRemove,
    subscribeDriverReceive
}
