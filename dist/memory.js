'use strict';

var output = require('./output');
var settings = require('./settings').getSettingsForLevel();
var memoryHelper = {
    init: function init(rooms) {
        if (settings.generalSettings.initDB) {
            var subTimeStart = Game.cpu.getUsed();
            _.map(rooms, function (room) {
                // INIT CPU DATABASE
                if (Memory.cpu === undefined) {
                    Memory.cpu = {};
                }
                if (Memory.cpu.lastTickTime === undefined) {
                    Memory.cpu.lastTickTime = [];
                }
                if (Memory.cpu.lastTickTime[0] === undefined) {
                    Memory.cpu.lastTickTime[0] = [];
                }
                if (Memory.cpu.lengthLastTickTime === undefined) {
                    Memory.cpu.lengthLastTickTime = 0;
                }
                // INIT TERRAIN DATABASE
                if (Memory.areas === undefined) {
                    Memory.areas = {};
                }
                if (Memory.areas[room.name] === undefined) {
                    Memory.areas[room.name] = [];
                }
                if (Memory.terrain === undefined) {
                    Memory.terrain = {};
                }
                if (Memory.terrain[room.name] === undefined) {
                    Memory.terrain[room.name] = [];
                }
                if (Memory.terrain[room.name][0] === undefined) {
                    Memory.terrain[room.name][0] = [];
                }
                if (Memory.terrainX === undefined) {
                    Memory.terrainX = 0;
                }
                // INIT SOURCE DATABASE
                if (Memory.sources === undefined) {
                    Memory.sources = {};
                }
                if (Memory.sources[room.name] === undefined) {
                    Memory.sources[room.name] = {};
                }
                var sources = room.find(FIND_SOURCES);
                _.map(sources, function (source) {
                    if (Memory.sources[room.name][source.id] === undefined) {
                        Memory.sources[room.name][source.id] = {};
                    }
                });
                // INIT PROXYCONTAINER DATABASE
                if (Memory.proxyContainer === undefined) {
                    Memory.proxyContainer = {};
                }
                // INIT MEMORY CLEAR COUNTER DATABASE
                if (Memory.memoryClearCounter === undefined) {
                    Memory.memoryClearCounter = 0;
                }
                // INIT PATH DATABASE
                if (Memory.paths === undefined) {
                    Memory.paths = {};
                }
                if (Memory.paths[room.name] === undefined) {
                    Memory.paths[room.name] = {};
                }
                // INIT ENEMYS PRESENT
                if (Memory.enemys === undefined) {
                    Memory.enemys = {};
                }
                if (Memory.enemys[room.name] === undefined) {
                    Memory.enemys[room.name] = 0;
                }
            });
            var duration = (Game.cpu.getUsed() - subTimeStart).toFixed(0);
            output.workTimes("MEMORY INIT TOOK                     " + duration);
        }
        memoryHelper.clear();
    },
    clear: function clear() {
        if (Memory.memoryClearCounter === settings.generalSettings.memoryClearCounter) {
            Memory.memoryClearCounter = 0;
            // Cleanup Memory
            var subTimeStart = Game.cpu.getUsed();
            if (Object.keys(Game.creeps).length !== Object.keys(Memory.creeps).length) {
                _.map(Memory.creeps, function (creep, creepName) {
                    if (!Game.creeps[creepName]) {
                        delete Memory.creeps[creepName];
                        console.log('Clearing non-existing creep memory: ', creepName);
                    }
                });
            }
            var duration = (Game.cpu.getUsed() - subTimeStart).toFixed(0);
            output.workTimes("MEMORY CLEANUP TOOK                  " + duration);
        }
        Memory.memoryClearCounter = Memory.memoryClearCounter + 1;
    }
};
module.exports = memoryHelper;
//# sourceMappingURL=memory.js.map
