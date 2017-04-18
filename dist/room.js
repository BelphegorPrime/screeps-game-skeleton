'use strict';

var output = require('./output');
var towers = require('./tower');
var terrain = require('./terrain');
var settings = require('./settings').getSettingsForLevel();
var room = {
    init: function init(rooms) {
        var subTimeStart = Game.cpu.getUsed();
        output.energyInRooms(rooms);
        var returnvalue = _.map(rooms, function (room) {
            // Set amount of enemys in a room
            var closestHostiles = room.find(FIND_HOSTILE_CREEPS);
            Memory.enemys[room.name] = _.size(closestHostiles);
            // Run Tower for specific ID
            towers.getTower(room);
            room = terrain.read(room);
            room.canBuildMediumCreep = room.energyAvailable >= settings.generalSettings.costs.medium;
            room.canBuildBigCreep = room.energyAvailable >= settings.generalSettings.costs.big;
            var containers = room.find(FIND_STRUCTURES, {
                filter: function filter(structure) {
                    return structure.structureType === "container";
                }
            });
            if (room.containerToTransfer === undefined) {
                room.containerToTransfer = [];
            }
            if (room.containerToGetFrom === undefined) {
                room.containerToGetFrom = [];
            }
            var energyAmountInContainer = 0;
            var energyMaxAmountInContainer = 0;
            containers.map(function (container) {
                var containerData = [{
                    "pos": container.pos,
                    "isFull": true
                }];
                if (container.id !== Memory.proxyContainer.id) {
                    if (container.store[RESOURCE_ENERGY] < container.storeCapacity) {
                        containerData[0].isFull = false;
                        room.containerToTransfer = [].concat(room.containerToTransfer, containerData);
                    }
                    if (container.store[RESOURCE_ENERGY] > 0) {
                        room.containerToGetFrom = [].concat(room.containerToGetFrom, containerData);
                    }
                }
                energyAmountInContainer += container.store[RESOURCE_ENERGY];
                energyMaxAmountInContainer += container.storeCapacity;
            });
            return room;
        });
        var duration = (Game.cpu.getUsed() - subTimeStart).toFixed(0);
        output.workTimes("ROOM INIT TOOK                       " + duration);
        return returnvalue;
    }
};
module.exports = room;
//# sourceMappingURL=room.js.map
