let output = require('./output')
let towerHelper = {
    run: (tower: Tower, room: Room)=>{
        let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
        if(closestHostile) {
            tower.attack(closestHostile)
        }else{
            let damagedContainers = room.find(FIND_STRUCTURES, {
                filter: (structure: Container | Structure) => structure.structureType === "container" && structure.hits < structure.hitsMax
            })

            if(_.size(damagedContainers) > 0){
                damagedContainers = _.sortByOrder(damagedContainers, ['hits', 'hitsMax'], ['asc', 'asc'])
                tower.repair(damagedContainers[0])
            }else{
                let damagedRamparts = room.find(FIND_STRUCTURES, {
                    filter: (structure: Rampart | Structure) => structure.structureType === "rampart" && structure.hits < structure.hitsMax
                })
                if(_.size(damagedRamparts) > 0){
                    damagedRamparts = _.sortByOrder(damagedRamparts, ['hits', 'hitsMax'], ['asc', 'asc'])
                    tower.repair(damagedRamparts[0])
                }else{
                    let damagedStructures = room.find(FIND_STRUCTURES, {
                        filter: (structure: Structure) => structure.hits < structure.hitsMax
                    })
                    if(_.size(damagedStructures) > 0){
                        damagedStructures = _.sortByOrder(damagedStructures, ['hits', 'hitsMax'], ['asc', 'asc'])
                        tower.repair(damagedStructures[0])
                    }
                }
            }
        }
    },
    getTower: (room: Room)=>{
        let towers = room.find(FIND_STRUCTURES, {filter: (structure: Tower) => {return structure.structureType === "tower"}})
        towers.map((tower:Tower|Structure) =>{towerHelper.run(tower, room)})
    },
}

module.exports = towerHelper