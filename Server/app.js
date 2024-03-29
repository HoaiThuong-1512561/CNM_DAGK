var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cors = require('cors');

// var productCtrl = require('./apiControllers/productControllers');
var userCtrl = require('./apiControllers/userControllers');
var requestCtrl = require('./apiControllers/requestController');
var app1Ctrl = require('./apiControllers/app1Controller');
var app2Ctrl = require('./apiControllers/app2Controller');
var app3Ctrl = require('./apiControllers/app3Controller');
var app4Ctrl = require('./apiControllers/app4Controller');
var events = require('./events');
var verifyAccessToken = require('./repos/authRepo').verifyAccessToken;

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json({
        msg: 'hello from nodejs express api'
    })
});

// app.use('/api/products/', productCtrl);
app.use('/api/users/', userCtrl);
app.use('/api/request', verifyAccessToken, requestCtrl);
app.use('/app1/', app1Ctrl);
app.use('/app2/', app2Ctrl);
app.use('/app3/', app3Ctrl);
app.use('/app4/',app4Ctrl);
app.get('/requestAddedEvent', events.subscribeRequestAdded);
app.get('/requestRemoveEvent', events.subscribeRequestRemove);
app.get('/driverReceive', events.subscribeDriverReceive);
app.get('/driverLocale', events.subscribeDriverLocale);
var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`QLBH API is running on port ${port}`);
})
