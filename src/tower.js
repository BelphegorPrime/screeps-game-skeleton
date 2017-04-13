let tower = {
    getTower: (towerID)=>{
        let tower = Game.getObjectById(towerID);
        if(tower) {
            let closestDamagedStructure = tower.pos.findClosestByRange(
                FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax
                }
            )
            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }

            let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }
        }
    }
};

module.exports = tower;