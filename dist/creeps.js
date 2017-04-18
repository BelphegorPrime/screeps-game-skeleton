"use strict";

var _output = require("./output");

var _output2 = _interopRequireDefault(_output);

var _general = require("./general");

var _general2 = _interopRequireDefault(_general);

var _role = require("./role.builder");

var _role2 = _interopRequireDefault(_role);

var _role3 = require("./role.loader");

var _role4 = _interopRequireDefault(_role3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var settings = require('./settings').getSettingsForLevel();
var creepsHelp = {
    getCreeps: function getCreeps(allCreeps, rooms, constructionSites) {
        var subTimeStart = Game.cpu.getUsed();
        var creeps = _.values(allCreeps);
        var harvester = settings.generalSettings.roles.harvester;
        var upgrader = settings.generalSettings.roles.upgrader;
        var builder = settings.generalSettings.roles.builder;
        var loader = settings.generalSettings.roles.loader;
        _.map(rooms, function (room) {
            var SourcesToMoveTo = _(creepsHelp.getAvailableSources(creeps, _.size(allCreeps))).reverse().value();
            var noProxySource = SourcesToMoveTo.filter(function (source) {
                return source !== undefined && Memory.sources[room.name][source.id] !== undefined && Memory.sources[room.name][source.id]["availableSlots"] !== 1;
            })[0];
            var proxySource = SourcesToMoveTo.filter(function (source) {
                return source !== undefined && Memory.sources[room.name][source.id] !== undefined && Memory.sources[room.name][source.id]["availableSlots"] === 1;
            })[0];
            if (_.size(creeps) <= settings.minHarvester) {
                creeps = creeps.map(function (creep) {
                    creep.memory.role = harvester;
                    creep.memory.source = noProxySource;
                    creep.memory.fallbackSource = noProxySource;
                    creep.memory.proxysource = proxySource;
                    return creep;
                });
                return creeps;
            }
            var numberOfBuilder = _role2.default.getNumberOfBuilder(constructionSites);
            var numberOfLoader = _role4.default.getNumberOfLoader(room);
            var notFullContainer = room.containerToTransfer.filter(function (container) {
                return !container.isFull;
            });
            var containers = room.find(FIND_STRUCTURES, {
                filter: function filter(structure) {
                    return structure.structureType === "container" && structure.registeredCreeps === undefined;
                }
            });
            if (room.energyAvailable >= settings.generalSettings.costs.little * 2 && (_.size(notFullContainer) > 0 || _.size(containers) === 0)) {
                creeps = creeps.map(function (creep, index) {
                    var source = SourcesToMoveTo.filter(function (source) {
                        if (source.registeredCreeps !== undefined) {
                            return source.registeredCreeps.indexOf(creep.id) > -1;
                        } else {
                            return false;
                        }
                    })[0];
                    if (source !== undefined) {
                        if (creep.memory.type === settings.generalSettings.roles.sourceproxy && Memory.sources[creep.room.name][source.id] !== undefined && Memory.sources[creep.room.name][source.id]["availableSlots"] === 1) {
                            creep.memory.role = settings.generalSettings.roles.sourceproxy;
                            creep.memory.source = source;
                            creep.memory.fallbackSource = noProxySource;
                            creep.memory.proxysource = proxySource;
                        } else {
                            if (index < numberOfBuilder) {
                                creep.memory.role = builder;
                                creep.memory.source = source;
                                creep.memory.fallbackSource = noProxySource;
                                creep.memory.proxysource = proxySource;
                            } else if (index < numberOfBuilder + numberOfLoader) {
                                creep.memory.role = loader;
                                creep.memory.source = source;
                                creep.memory.fallbackSource = noProxySource;
                                creep.memory.proxysource = proxySource;
                            } else if (index < numberOfBuilder + numberOfLoader + 2) {
                                creep.memory.role = harvester;
                                creep.memory.source = source;
                                creep.memory.fallbackSource = noProxySource;
                                creep.memory.proxysource = proxySource;
                            } else {
                                creep.memory.role = upgrader;
                                creep.memory.source = source;
                                creep.memory.fallbackSource = noProxySource;
                                creep.memory.proxysource = proxySource;
                            }
                        }
                    } else {
                        creep.memory.role = upgrader;
                        creep.memory.source = noProxySource;
                        creep.memory.fallbackSource = noProxySource;
                        creep.memory.proxysource = proxySource;
                    }
                    return creep;
                });
            } else {
                creeps = creeps.map(function (creep, index) {
                    var source = SourcesToMoveTo.filter(function (source) {
                        if (source !== undefined && source.registeredCreeps !== undefined) {
                            return source.registeredCreeps.indexOf(creep.id) > -1;
                        } else {
                            return false;
                        }
                    })[0];
                    if (source !== undefined) {
                        if (creep.memory.type === settings.generalSettings.roles.sourceproxy && Memory.sources[creep.room.name][source.id] !== undefined && Memory.sources[creep.room.name][source.id]["availableSlots"] === 1) {
                            creep.memory.role = settings.generalSettings.roles.sourceproxy;
                            creep.memory.source = source;
                            creep.memory.fallbackSource = noProxySource;
                            creep.memory.proxysource = proxySource;
                        } else {
                            if (index < numberOfBuilder) {
                                creep.memory.role = builder;
                                creep.memory.source = source;
                                creep.memory.fallbackSource = noProxySource;
                                creep.memory.proxysource = proxySource;
                            } else if (index < numberOfBuilder + numberOfLoader) {
                                creep.memory.role = loader;
                                creep.memory.source = source;
                                creep.memory.fallbackSource = noProxySource;
                                creep.memory.proxysource = proxySource;
                            } else if (index < numberOfBuilder + numberOfLoader + 2) {
                                creep.memory.role = upgrader;
                                creep.memory.source = source;
                                creep.memory.fallbackSource = noProxySource;
                                creep.memory.proxysource = proxySource;
                            } else {
                                creep.memory.role = harvester;
                                creep.memory.source = source;
                                creep.memory.fallbackSource = noProxySource;
                                creep.memory.proxysource = proxySource;
                            }
                        }
                    } else {
                        creep.memory.role = harvester;
                        creep.memory.source = noProxySource;
                        creep.memory.fallbackSource = noProxySource;
                        creep.memory.proxysource = proxySource;
                    }
                    return creep;
                });
            }
        });
        var duration = (Game.cpu.getUsed() - subTimeStart).toFixed(0);
        _output2.default.workTimes("CREEPS GET ROLE TOOK                 " + duration);
        return creeps;
    },
    spawnCreeps: function spawnCreeps(rooms, spawns, creeps) {
        var subTimeStart = Game.cpu.getUsed();
        _.map(rooms, function (room) {
            _.map(spawns, function (spawn) {
                if (room.name === spawn.room.name) {
                    var littleCreeps = creeps.filter(function (creep) {
                        return creep.memory.type === "little";
                    });
                    var mediumCreeps = creeps.filter(function (creep) {
                        return creep.memory.type === "medium";
                    });
                    var bigCreeps = creeps.filter(function (creep) {
                        return creep.memory.type === "big";
                    });
                    if (_.size(littleCreeps) < settings.numberLittleCreeps) {
                        var creepNumber = _general2.default.getUnitNumber(littleCreeps);
                        var newName = spawn.createCreep([WORK, CARRY, MOVE], "LittleCreep-" + creepNumber + "|" + _general2.default.getRandomID(), { role: settings.generalSettings.roles.harvester, type: "little" });
                        console.log('Spawning new littleCreep ' + newName + " within the room " + room.name);
                    }
                    if (room.canBuildMediumCreep && _.size(mediumCreeps) < settings.numberMediumCreeps) {
                        var mediumCreepNumber = _general2.default.getUnitNumber(mediumCreeps);
                        var _newName = spawn.createCreep([WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE], "MediumCreep-" + mediumCreepNumber + "|" + _general2.default.getRandomID(), { role: settings.generalSettings.roles.harvester, type: "medium" });
                        console.log('Spawning new mediumCreep ' + _newName + " within the room " + room.name);
                    }
                    if (room.canBuildBigCreep && _.size(bigCreeps) < settings.numberBigCreeps) {
                        var bigCreepNumber = _general2.default.getUnitNumber(bigCreeps);
                        var _newName2 = spawn.createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], "BigCreep-" + bigCreepNumber + "|" + _general2.default.getRandomID(), { role: settings.generalSettings.roles.harvester, type: "big" });
                        console.log('Spawning new bigCreep ' + _newName2 + " within the room " + room.name);
                    }
                }
            });
        });
        var duration = (Game.cpu.getUsed() - subTimeStart).toFixed(0);
        _output2.default.workTimes("SPAWN CREEPS TOOK                    " + duration);
    },
    spawnSourceProxy: function spawnSourceProxy(rooms, spawns, creeps) {
        _.map(rooms, function (room) {
            _.map(spawns, function (spawn) {
                var sourcesWithOneSlot = _.filter(Memory.sources[room.name], function (source) {
                    return source["availableSlots"] === 1;
                });
                if (_.size(sourcesWithOneSlot) > 0) {
                    var amountOfSourceproxyCreeps = _.size(_.filter(creeps, function (creep) {
                        return creep.memory.type === "sourceproxy";
                    }));
                    _output2.default.writeToDebug(amountOfSourceproxyCreeps);
                    if (room.canBuildBigCreep && _.size(creeps) > 3 && amountOfSourceproxyCreeps === 0) {
                        spawn.createCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE], "sourceproxy", { role: "sourceproxy", type: "sourceproxy" });
                        _output2.default.writeToDebug("Spawning new Big SOURCEPROXY within the room " + room.name);
                    } else {
                        if (room.canBuildMediumCreep && _.size(creeps) > 3 && amountOfSourceproxyCreeps === 0) {
                            spawn.createCreep([WORK, WORK, WORK, CARRY, MOVE], "sourceproxy", { role: "sourceproxy", type: "sourceproxy" });
                            _output2.default.writeToDebug("Spawning new Medium SOURCEPROXY within the room " + room.name);
                        } else {
                            if (_.size(creeps) > 3 && amountOfSourceproxyCreeps === 0) {
                                spawn.createCreep([WORK, WORK, CARRY, MOVE], "sourceproxy", { role: "sourceproxy", type: "sourceproxy" });
                                _output2.default.writeToDebug("Spawning new Little SOURCEPROXY within the room " + room.name);
                            }
                        }
                    }
                }
            });
        });
    },
    getAvailableSources: function getAvailableSources(creeps, amountOfCreeps) {
        var proxyCreeps = _.filter(creeps, function (creep) {
            return creep.memory.type === settings.generalSettings.roles.sourceproxy;
        });
        var proxyCreepPresent = !!_.size(proxyCreeps);
        var proxyCreep = {};
        if (!proxyCreepPresent) {
            creepsHelp.spawnSourceProxy(Game.rooms, Game.spawns, creeps);
        } else {
            proxyCreep = proxyCreeps[0];
        }
        return creeps.map(function (creep) {
            var sources = creep.room.find(FIND_SOURCES);
            sources = sources.filter(function (source) {
                return source.energy !== 0;
            });
            var amountOfSources = _.size(sources);
            var maxCreeps = Math.round(amountOfCreeps / amountOfSources);
            sources = sources.map(function (source, sourceIndex) {
                if (Memory.sources[creep.room.name][source.id]["availableSlots"] === undefined) {
                    _output2.default.writeToDebug("Memory.sources[creep.room.name][source.id]['availableSlots'] ist für " + source.id + " undefined");
                    var amountOfSurroundingWalls = 0;
                    if (Memory.terrain[creep.room.name][source.pos.x - 1] !== undefined && Memory.terrain[creep.room.name][source.pos.x] !== undefined && Memory.terrain[creep.room.name][source.pos.x + 1] !== undefined) {
                        if (Memory.terrain[creep.room.name][source.pos.x - 1][source.pos.y - 1].terrain[0] === "wall") {
                            amountOfSurroundingWalls += 1;
                        }
                        if (Memory.terrain[creep.room.name][source.pos.x][source.pos.y - 1].terrain[0] === "wall") {
                            amountOfSurroundingWalls += 1;
                        }
                        if (Memory.terrain[creep.room.name][source.pos.x + 1][source.pos.y - 1].terrain[0] === "wall") {
                            amountOfSurroundingWalls += 1;
                        }
                        if (Memory.terrain[creep.room.name][source.pos.x - 1][source.pos.y].terrain[0] === "wall") {
                            amountOfSurroundingWalls += 1;
                        }
                        if (Memory.terrain[creep.room.name][source.pos.x + 1][source.pos.y].terrain[0] === "wall") {
                            amountOfSurroundingWalls += 1;
                        }
                        if (Memory.terrain[creep.room.name][source.pos.x - 1][source.pos.y + 1].terrain[0] === "wall") {
                            amountOfSurroundingWalls += 1;
                        }
                        if (Memory.terrain[creep.room.name][source.pos.x][source.pos.y + 1].terrain[0] === "wall") {
                            amountOfSurroundingWalls += 1;
                        }
                        if (Memory.terrain[creep.room.name][source.pos.x + 1][source.pos.y + 1].terrain[0] === "wall") {
                            amountOfSurroundingWalls += 1;
                        }
                    }
                    Memory.sources[creep.room.name][source.id]["availableSlots"] = 8 - amountOfSurroundingWalls;
                }
                var sourcesWithOneSlot = _.filter(Memory.sources[creep.room.name], function (source) {
                    return source["availableSlots"] === 1;
                });
                source.amountOfSupportCreeps = 0;
                if (_.size(sourcesWithOneSlot) > 0) {
                    if (Memory.sources[creep.room.name][source.id]["availableSlots"] === 1) {
                        maxCreeps = 1;
                        source.amountOfSupportCreeps = Math.round(amountOfCreeps / amountOfSources) - 1;
                    } else {
                        maxCreeps = Math.round(amountOfCreeps / amountOfSources);
                        source.amountOfSupportCreeps = 0;
                    }
                }
                if (source.registeredCreeps === undefined) {
                    source.registeredCreeps = [];
                }
                if (sourceIndex > 0) {
                    if (sources[0].registeredCreeps.indexOf(creep.id) <= -1 && _.size(source.registeredCreeps) < maxCreeps) {
                        source.registeredCreeps = [].concat(source.registeredCreeps, creep.id);
                    }
                } else {
                    if (maxCreeps === 1) {
                        if (proxyCreepPresent && proxyCreep.id !== undefined && creep.memory.type === settings.generalSettings.roles.sourceproxy) {
                            source.registeredCreeps = [].concat(source.registeredCreeps, creep.id);
                        }
                    }
                    if (_.size(source.registeredCreeps) < maxCreeps) {
                        source.registeredCreeps = [].concat(source.registeredCreeps, creep.id);
                    }
                }
                return source;
            });
            var sourceToReturn = sources.filter(function (source) {
                return source.registeredCreeps.indexOf(creep.id) > -1;
            })[0];
            // when creep has no Source write informations to console.log
            if (sourceToReturn === undefined) {
                sourceToReturn = sources.map(function (source) {
                    if (source.amountOfSupportCreeps > 0) {
                        var container = source.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: function filter(structure) {
                                return structure.structureType === "container";
                            }
                        });
                        if (container !== null) {
                            if (container.registeredCreeps === undefined) {
                                container.registeredCreeps = [];
                            }
                            // if(_.size(container.registeredCreeps) < 3){
                            container.registeredCreeps = [].concat(container.registeredCreeps, creep.id);
                            // }
                            Memory.proxyContainer.id = container.id;
                            return container;
                        }
                    }
                })[0];
            }
            return sourceToReturn;
        });
    }
};
module.exports = creepsHelp;
//# sourceMappingURL=creeps.js.map
