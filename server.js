var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var port = process.env.PORT || 5000;
var io = require('socket.io')(http);

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
    var obj = getMonthTemperature();
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
        var obj = {};
        obj.data = getCarShare();
        obj.year = getRandomInt(1970, 2016);
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
        var obj = {};
        obj.data = getCarAvgSale();
        obj.year = getRandomInt(1970, 2016);
        io.emit('updateAvgSoldCars', obj);

        lastSentAvgSoldCarsByMonth = obj;
        //Call again loop function that creates timer
        loopNewAvgSoldCars();
    }, rand);
}());


/**
 * Functions
 */
var cars = ['Toyota', 'General Motors', 'Volkswagen', 'Ford', 'BMW', 'Audi', 'Others'];
function getCarShare() {
    var rands = [], rand, total = 0, normalized_rands = [];
    for (var i = 0; i < cars.length; i += 1) {
        rand = Math.random();
        rands.push(rand);
        total += rand;
    }
    for (var i = 0; i < cars.length; i += 1) {
        rand = rands[i] / total;
        normalized_rands.push([cars[i], rand * 100]);
    }
    return normalized_rands;
}

var continents = ['Africa', 'South America', 'Australia', 'North America', 'Europe', 'Asia', ];
function getCarAvgSale() {
    var values = [];
    for (var i = 0; i < continents.length; i++) {
        var obj = {
            continentName: continents[i]
        };

        var data = [];
        for (var j = 0; j < 11; j++) {
            var newNumber = getRandomArbitrary(1 + i, 5 + getRandomInt(1, i * 2)).toFixed(2);
            data.push(parseFloat(newNumber));
        }
        obj.data = data;
        values.push(obj);
    }
    return values;
}

function getMonthTemperature() {
    return {
        month: getRandomIntInclusive(0, 11),
        value: getRandomInt(0, 36)
    };
}

function getRandomXY() {
    return {
        x: getRandomInt(1, 5),
        y: getRandomInt(0, 3)
    }
}

function getRandomData() {
    return {
        bool: getRandomZeroOrOne(),
        num: getRandomIntInclusive(0, 5)
    };
}

// Returns a random number 0 or 1 
function getRandomZeroOrOne() {
    return Math.floor(Math.random() * 2);
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}