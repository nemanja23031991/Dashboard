'use strict';
/**
 * Functions for generating random stuff
 */

(function () {

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

    //Make this methods public
    module.exports = {
        getRandomZeroOrOne: getRandomZeroOrOne,
        getRandomArbitrary: getRandomArbitrary,
        getRandomInt: getRandomInt,
        getRandomIntInclusive: getRandomIntInclusive
    };

}());