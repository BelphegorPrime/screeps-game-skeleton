import output from "./output"

let towerHelper = {
    run: (tower: Tower, room: Room)=>{
        let closestHostile = tower.pos.findClosestByRange<Creep>(FIND_HOSTILE_CREEPS)
        if(closestHostile) {
            tower.attack(closestHostile)
        }else{
            let damagedContainers:Container[] = room.find<Container>(FIND_STRUCTURES, {
                filter: (structure: Container) => structure.structureType === "container" && structure.hits < structure.hitsMax
            })

            if(_.size(damagedContainers) > 0){
                damagedContainers = _.sortByOrder(damagedContainers, ['hits', 'hitsMax'], ['asc', 'asc'])
                tower.repair(damagedContainers[0])
            }else{
                let damagedRamparts:Rampart[] = room.find<Rampart>(FIND_STRUCTURES, {
                    filter: (structure: Rampart) => structure.structureType === "rampart" && structure.hits < structure.hitsMax
                })
                if(_.size(damagedRamparts) > 0){
                    damagedRamparts = _.sortByOrder(damagedRamparts, ['hits', 'hitsMax'], ['asc', 'asc'])
                    tower.repair(damagedRamparts[0])
                }else{
                    let damagedStructures:Structure[] = room.find<Structure>(FIND_STRUCTURES, {
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
        let towers:Tower[] = room.find<Tower>(FIND_STRUCTURES, {filter: (structure: Tower) => {return structure.structureType === "tower"}})
        towers.map((tower:Tower) =>{towerHelper.run(tower, room)})
    },
}

export default towerHelper