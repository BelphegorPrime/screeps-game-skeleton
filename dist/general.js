"use strict";

var output = require('./output');
var general = {
    getUnitNumber: function getUnitNumber(creepArray) {
        var number = 0;
        _.map(creepArray, function (creep) {
            var creepNumber = parseInt(creep.name.split("-")[1]);
            if (number < creepNumber) {
                number = creepNumber;
            }
        });
        return parseInt(number) + 1;
    },
    getRandomID: function getRandomID() {
        return Math.floor(Math.random() * Math.floor(999)) + 1;
    }
};
module.exports = general;
//# sourceMappingURL=general.js.map
