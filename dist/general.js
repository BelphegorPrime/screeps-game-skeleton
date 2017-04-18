"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    getUnitNumber: function getUnitNumber(creepArray) {
        var intVal = 0;
        _.map(creepArray, function (creep) {
            var creepNumber = parseInt(creep.name.split("-")[1]);
            if (intVal < creepNumber) {
                intVal = creepNumber;
            }
        });
        return intVal + 1;
    },
    getRandomID: function getRandomID() {
        return Math.floor(Math.random() * Math.floor(999)) + 1;
    }
};
//# sourceMappingURL=general.js.map
