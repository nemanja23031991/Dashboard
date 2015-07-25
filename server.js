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

    //Send new data to all users
    function sendData() {
        io.emit('updateData', getRandomXY());
    }

    (function loop() {
        var rand = Math.round(Math.random() * (5000 - 2500)) + 500;
        setTimeout(function () {
            sendData();
            //Call again loop function that creates timer
            loop();
        }, rand);
    }());

});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


/**
 * Functions
 */
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