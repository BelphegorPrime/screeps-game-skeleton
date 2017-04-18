"use strict";

var tickMessage = "\n";
var debugText = "\n";
var _workTimes = "\n";
var output = {
    energyInRooms: function energyInRooms(rooms) {
        var rows = _.map(rooms, function (room) {
            var energyAmountInContainer = 0;
            var energyMaxAmountInContainer = 0;
            room.find(FIND_STRUCTURES, {
                filter: function filter(structure) {
                    return structure.structureType === STRUCTURE_CONTAINER;
                }
            }).map(function (container) {
                energyAmountInContainer += container.store[RESOURCE_ENERGY];
                energyMaxAmountInContainer += container.storeCapacity;
            });
            return room.name + "   | " + room.energyAvailable + "/" + room.energyCapacityAvailable + "     | " + energyAmountInContainer + "/" + energyMaxAmountInContainer + "            |                  |                 |";
        });
        tickMessage += "ROOMNAME | ROOM_ENERGY | CONTAINER_ENERGY  |                  |                 |\n" + rows + "\n";
    },
    showCreepRoles: function showCreepRoles(rooms, creeps, settingsRoles) {
        var amountOfLittleHarvester = 0;
        var amountOfLittleUpgrader = 0;
        var amountOfLittleBuilder = 0;
        var amountOfLittleLoader = 0;
        var amountOfMediumHarvester = 0;
        var amountOfMediumUpgrader = 0;
        var amountOfMediumBuilder = 0;
        var amountOfMediumLoader = 0;
        var amountOfBigHarvester = 0;
        var amountOfBigUpgrader = 0;
        var amountOfBigBuilder = 0;
        var amountOfBigLoader = 0;
        var amountOfSourceproxy = 0;
        _.map(creeps, function (creep) {
            if (creep.memory.type === "little") {
                if (creep.memory.role === settingsRoles.harvester) {
                    amountOfLittleHarvester += 1;
                }
                if (creep.memory.role === settingsRoles.upgrader) {
                    amountOfLittleUpgrader += 1;
                }
                if (creep.memory.role === settingsRoles.builder) {
                    amountOfLittleBuilder += 1;
                }
                if (creep.memory.role === settingsRoles.loader) {
                    amountOfLittleLoader += 1;
                }
            } else if (creep.memory.type === "medium") {
                if (creep.memory.role === settingsRoles.harvester) {
                    amountOfMediumHarvester += 1;
                }
                if (creep.memory.role === settingsRoles.upgrader) {
                    amountOfMediumUpgrader += 1;
                }
                if (creep.memory.role === settingsRoles.builder) {
                    amountOfMediumBuilder += 1;
                }
                if (creep.memory.role === settingsRoles.loader) {
                    amountOfMediumLoader += 1;
                }
            } else if (creep.memory.type === "big") {
                if (creep.memory.role === settingsRoles.harvester) {
                    amountOfBigHarvester += 1;
                }
                if (creep.memory.role === settingsRoles.upgrader) {
                    amountOfBigUpgrader += 1;
                }
                if (creep.memory.role === settingsRoles.builder) {
                    amountOfBigBuilder += 1;
                }
                if (creep.memory.role === settingsRoles.loader) {
                    amountOfBigLoader += 1;
                }
            }
            if (creep.memory.type === settingsRoles.sourceproxy) {
                amountOfSourceproxy += 1;
            }
        });
        var rows = _.map(rooms, function (room) {
            var harvesterSum = amountOfLittleHarvester + amountOfMediumHarvester + amountOfBigHarvester;
            var upgraderSum = amountOfLittleUpgrader + amountOfMediumUpgrader + amountOfBigUpgrader;
            var builderSum = amountOfLittleBuilder + amountOfMediumBuilder + amountOfBigBuilder;
            var loaderSum = amountOfLittleLoader + amountOfMediumLoader + amountOfBigLoader;
            var sourceproxySum = amountOfSourceproxy;
            var littleSum = amountOfLittleHarvester + amountOfLittleUpgrader + amountOfLittleBuilder + amountOfLittleLoader;
            var mediumSum = amountOfMediumHarvester + amountOfMediumUpgrader + amountOfMediumBuilder + amountOfMediumLoader;
            var bigSum = amountOfBigHarvester + amountOfBigUpgrader + amountOfBigBuilder + amountOfBigLoader;
            var littleRow = room.name + "   | LITTLE:     |         " + amountOfLittleHarvester + "         |        " + amountOfLittleUpgrader + "         |        " + amountOfLittleBuilder + "        |         " + amountOfLittleLoader + "        |         " + " " + "        |         " + littleSum + "\n";
            var mediumRow = "         | MEDIUM:     |         " + amountOfMediumHarvester + "         |        " + amountOfMediumUpgrader + "         |        " + amountOfMediumBuilder + "        |         " + amountOfMediumLoader + "        |         " + " " + "        |         " + mediumSum + "\n";
            var bigRow = "         | BIG:        |         " + amountOfBigHarvester + "         |        " + amountOfBigUpgrader + "         |        " + amountOfBigBuilder + "        |         " + amountOfBigLoader + "        |         " + " " + "        |         " + bigSum + "\n";
            var sourceProxyRow = "         | PROXY:      |         " + " " + "         |        " + " " + "         |        " + " " + "        |         " + " " + "        |         " + amountOfSourceproxy + "        |         " + sourceproxySum + "\n";
            var summRow = "         |             |         " + harvesterSum + "         |        " + upgraderSum + "         |        " + builderSum + "        |         " + loaderSum + "        |         " + sourceproxySum + "        |         ";
            return littleRow + mediumRow + bigRow + sourceProxyRow + summRow;
        });
        tickMessage += "         |     TYPE    |     HARVESTER     |     UPGRADER     |     BUILDER     |      LOADER      |    SOURCEPROXY   |\n" + rows + "\n";
    },
    writeCPU: function writeCPU(cpu) {
        tickMessage += "CPU-Limit: " + cpu.limit + " | Tick-Limit: " + cpu.tickLimit + " | Bucket: " + cpu.bucket + "\n";
    },
    writeToDebug: function writeToDebug(text) {
        debugText += JSON.stringify(text) + "\n";
    },
    workTimes: function workTimes(text) {
        _workTimes += text + "\n";
    },
    resetLog: function resetLog() {
        tickMessage = "\n";
        debugText = "\n";
        _workTimes = "\n";
    },
    writeLog: function writeLog() {
        console.log(tickMessage + _workTimes + debugText);
        output.resetLog();
    }
};
module.exports = output;
//# sourceMappingURL=output.js.map
