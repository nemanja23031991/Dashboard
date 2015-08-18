'use strict';

(function () {

    var random = require('./random');

    var cars = ['Toyota', 'General Motors', 'Volkswagen', 'Ford', 'BMW', 'Audi', 'Others'];
    var continents = ['Africa', 'South America', 'Australia', 'North America', 'Europe', 'Asia', ];

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
        return { data: normalized_rands, year: random.getRandomInt(1970, 2016) };
    }

    function getCarAvgSale() {
        var values = [];
        for (var i = 0; i < continents.length; i++) {
            var obj = {
                continentName: continents[i]
            };

            var data = [];
            for (var j = 0; j < 11; j++) {
                var newNumber = random.getRandomArbitrary(1 + i, 5 + random.getRandomInt(1, i * 2)).toFixed(2);
                data.push(parseFloat(newNumber));
            }
            obj.data = data;
            values.push(obj);
        }
        return { data: values, year: random.getRandomInt(1970, 2016) };
    }


    function getMonthTemperature() {
        return {
            month: random.getRandomIntInclusive(0, 11),
            value: random.getRandomInt(0, 36)
        };
    }


    //Make this methods public
    module.exports = {
        getCarShare: getCarShare,
        getCarAvgSale: getCarAvgSale,
        getMonthTemperature: getMonthTemperature
    };

}());