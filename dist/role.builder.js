'use strict';

var output = require('./output');
var settings = require('./settings').getSettingsForLevel();
var routerHelper = require('./router');
var roleBuilder = {
    run: function run(creep) {
        if (creep.memory.building && creep.carry.energy === 0) {
            creep.memory.building = false;
            creep.say('harvest');
        }
        if (!creep.memory.building && creep.carry.energy === creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('build');
        }
        if (creep.memory.building) {
            var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if (target !== null) {
                if (creep.build(target) === ERR_NOT_IN_RANGE) {
                    routerHelper.routeCreep(creep, target, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        } else {
            if (_.size(creep.room.containerToGetFrom) > 0) {
                creep.room.containerToGetFrom.map(function (container) {
                    var realContainer = creep.room.find(FIND_STRUCTURES, {
                        filter: function filter(structure) {
                            return structure.structureType === STRUCTURE_CONTAINER && structure.pos.x === container.pos.x && structure.pos.y === container.pos.y;
                        }
                    })[0];
                    if (creep.withdraw(realContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        routerHelper.routeCreep(creep, realContainer, { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                });
            } else {
                if (creep.memory.source.structureType === "container") {
                    if (creep.memory.source.store.energy > 0) {
                        if (creep.withdraw(creep.memory.source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            routerHelper.routeCreep(creep, creep.memory.source, { visualizePathStyle: { stroke: '#ffaa00' } });
                        }
                    } else {
                        if (creep.harvest(creep.memory.fallbackSource) === ERR_NOT_IN_RANGE) {
                            routerHelper.routeCreep(creep, creep.memory.fallbackSource, { visualizePathStyle: { stroke: '#ffaa00' } });
                        }
                    }
                } else {
                    if (creep.harvest(creep.memory.source) === ERR_NOT_IN_RANGE) {
                        routerHelper.routeCreep(creep, creep.memory.source, { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                }
            }
        }
    },
    getNumberOfBuilder: function getNumberOfBuilder(constructionSites) {
        // Set the Amount Of Creeps with the role Builder
        var numberOfBuilder = 1;
        var amountOfConstructionSites = _.size(constructionSites);
        if (amountOfConstructionSites > settings.maxBuilder) {
            numberOfBuilder = settings.maxBuilder;
        } else if (amountOfConstructionSites === 0) {
            numberOfBuilder = 0;
        }
        return numberOfBuilder;
    }
};
module.exports = roleBuilder;
//# sourceMappingURL=role.builder.js.map
