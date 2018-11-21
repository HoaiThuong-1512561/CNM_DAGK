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
    let request=[];
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
                                        let temp=0;
                                        for (var j=0;j<request.length;j++){
                                            if (request[j].id_request===rows2[i].id_request){
                                                temp=temp+1;
                                            }
                                        }
                                        if (temp===0){
                                            min=haversine(start, end, {unit: 'meter'});
                                            index=i;
                                        }
                                    }
                            }
                        }
                        if (index!==-1){
                            request.push(rows2[index]);
                            var json = JSON.stringify(rows2[index]);
                            res.write(`retry: 500\n`);
                            res.write(`event: DRIVER_RECEIVE\n`);
                            res.write(`data: ${json}\n`);
                            res.write(`\n`);
                        }else {
                            request=[];
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
    }, 9000);

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

var DRIVER_LOCALE='DRIVER_LOCALE';

var subscribeRequestAdded = (req, res) => {
    subscribeEvent(req, res, REQUEST_ADDED);
};
var subscribeRequestRemove = (req, res) => {
    subscribeEvent(req, res, REQUEST_REMOVE);
};
var subscribeDriverReceive = (req, res) => {
    subscribeEventDriver(req, res, DRIVER_RECEIVE);
};
var subscribeDriverLocale = (req, res) => {
    subscribeEvent(req, res, DRIVER_LOCALE);
};


var publishRequestAdded = requestObj => {
    emitter.emit(REQUEST_ADDED, requestObj);
};
var publishRequestRemove = requestObj => {
    emitter.emit(REQUEST_REMOVE, requestObj);
};
var publishDriverLocale = requestObj => {
    emitter.emit(DRIVER_LOCALE, requestObj);
};

module.exports = {
    subscribeRequestAdded,
    publishRequestAdded,
    publishRequestRemove,
    subscribeRequestRemove,
    subscribeDriverReceive,
    publishDriverLocale,
    subscribeDriverLocale
}
