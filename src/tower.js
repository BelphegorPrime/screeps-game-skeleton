let tower = {
    getTower: (room)=>{

        let towers = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_TOWER
            }
        })

        towers.map(tower =>{
            let damagedStructures = room.find(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax
                }
            )

            damagedStructures = _.sortByOrder(damagedStructures, ['hits', 'hitsMax'], ['asc', 'asc']);
            if(_.size(damagedStructures) > 0){
                tower.repair(damagedStructures[0])
            }

            let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
            if(closestHostile) {
                tower.attack(closestHostile)
            }
        })
    }
}

module.exports = tower