let output = require('./output');
let towerHelper = {
    run: (tower, room) => {
        let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
        else {
            let damagedContainers = room.find(FIND_STRUCTURES, {
                filter: (structure) => structure.structureType === "container" && structure.hits < structure.hitsMax
            });
            if (_.size(damagedContainers) > 0) {
                damagedContainers = _.sortByOrder(damagedContainers, ['hits', 'hitsMax'], ['asc', 'asc']);
                tower.repair(damagedContainers[0]);
            }
            else {
                let damagedRamparts = room.find(FIND_STRUCTURES, {
                    filter: (structure) => structure.structureType === "rampart" && structure.hits < structure.hitsMax
                });
                if (_.size(damagedRamparts) > 0) {
                    damagedRamparts = _.sortByOrder(damagedRamparts, ['hits', 'hitsMax'], ['asc', 'asc']);
                    tower.repair(damagedRamparts[0]);
                }
                else {
                    let damagedStructures = room.find(FIND_STRUCTURES, {
                        filter: (structure) => structure.hits < structure.hitsMax
                    });
                    if (_.size(damagedStructures) > 0) {
                        damagedStructures = _.sortByOrder(damagedStructures, ['hits', 'hitsMax'], ['asc', 'asc']);
                        tower.repair(damagedStructures[0]);
                    }
                }
            }
        }
    },
    getTower: (room) => {
        let towers = room.find(FIND_STRUCTURES, { filter: (structure) => { return structure.structureType === "tower"; } });
        towers.map((tower) => { towerHelper.run(tower, room); });
    },
};
module.exports = towerHelper;
