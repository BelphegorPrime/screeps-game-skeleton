'use strict';

var output = require('./output');
var towerHelper = {
    run: function run(tower, room) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        } else {
            var damagedContainers = room.find(FIND_STRUCTURES, {
                filter: function filter(structure) {
                    return structure.structureType === "container" && structure.hits < structure.hitsMax;
                }
            });
            if (_.size(damagedContainers) > 0) {
                damagedContainers = _.sortByOrder(damagedContainers, ['hits', 'hitsMax'], ['asc', 'asc']);
                tower.repair(damagedContainers[0]);
            } else {
                var damagedRamparts = room.find(FIND_STRUCTURES, {
                    filter: function filter(structure) {
                        return structure.structureType === "rampart" && structure.hits < structure.hitsMax;
                    }
                });
                if (_.size(damagedRamparts) > 0) {
                    damagedRamparts = _.sortByOrder(damagedRamparts, ['hits', 'hitsMax'], ['asc', 'asc']);
                    tower.repair(damagedRamparts[0]);
                } else {
                    var damagedStructures = room.find(FIND_STRUCTURES, {
                        filter: function filter(structure) {
                            return structure.hits < structure.hitsMax;
                        }
                    });
                    if (_.size(damagedStructures) > 0) {
                        damagedStructures = _.sortByOrder(damagedStructures, ['hits', 'hitsMax'], ['asc', 'asc']);
                        tower.repair(damagedStructures[0]);
                    }
                }
            }
        }
    },
    getTower: function getTower(room) {
        var towers = room.find(FIND_STRUCTURES, { filter: function filter(structure) {
                return structure.structureType === "tower";
            } });
        towers.map(function (tower) {
            towerHelper.run(tower, room);
        });
    }
};
module.exports = towerHelper;
//# sourceMappingURL=tower.js.map
