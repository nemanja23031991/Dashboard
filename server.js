var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var port = process.env.PORT || 5000;
var io = require('socket.io')(http);

//Require data layer
var data = require('./server/data');

app.use(express.static(__dirname + '/'));

http.listen(port, function () {
    console.log('listening on *:' + port);
});

io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/api/carshare', function (req, res) {
    res.json(lastSentCarShareData);
});
app.get('/api/avg-sold-cars', function (req, res) {
    res.json(lastSentAvgSoldCarsByMonth);
});

//Send new temperature to all users
function sendNewTemparature(city) {
    var obj = data.getMonthTemperature();
    obj.cityName = city;
    io.emit('updateTemparatureForMonth', obj);
}

(function loopNewTemperatureTokyo() {
    var rand = Math.round(Math.random() * 15000) + 500;
    setTimeout(function () {
        sendNewTemparature('Tokyo');
        //Call again loop function that creates timer
        loopNewTemperatureTokyo();
    }, rand);
}());
(function loopNewTemperatureNewYork() {
    var rand = Math.round(Math.random() * 15000) + 500;
    setTimeout(function () {
        sendNewTemparature('New York');
        //Call again loop function that creates timer
        loopNewTemperatureNewYork();
    }, rand);
}());
(function loopNewTemperatureBerlin() {
    var rand = Math.round(Math.random() * 15000) + 500;
    setTimeout(function () {
        sendNewTemparature('Berlin');
        //Call again loop function that creates timer
        loopNewTemperatureBerlin();
    }, rand);
}());
(function loopNewTemperatureLondon() {
    var rand = Math.round(Math.random() * 15000) + 500;
    setTimeout(function () {
        sendNewTemparature('London');
        //Call again loop function that creates timer
        loopNewTemperatureLondon();
    }, rand);
}());



var lastSentCarShareData = {};
//Send new browser shares
(function loopNewCarShare() {
    var rand = Math.round(Math.random() * 15000) + 500;
    setTimeout(function () {
        var obj = data.getCarShare();
        io.emit('updateCarMarketShares', obj);

        lastSentCarShareData = obj;
        //Call again loop function that creates timer
        loopNewCarShare();
    }, rand);
}());


var lastSentAvgSoldCarsByMonth = {};
//Send new browser shares
(function loopNewAvgSoldCars() {
    var rand = Math.round(Math.random() * 15000) + 500;
    setTimeout(function () {
        var obj =  data.getCarAvgSale();
        io.emit('updateAvgSoldCars', obj);

        lastSentAvgSoldCarsByMonth = obj;
        //Call again loop function that creates timer
        loopNewAvgSoldCars();
    }, rand);
}());
