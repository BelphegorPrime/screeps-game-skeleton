let tower = {
    getTower: (room)=>{

        let towers = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_TOWER)
            }
        })

        towers.map(tower =>{
            let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax
                }
            )
            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure)
            }

            let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
            if(closestHostile) {
                tower.attack(closestHostile)
            }
        })
    }
}

module.exports = tower