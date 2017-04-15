let output = require('./output')
let roleHarvester = {

    run: (creep) =>{
        if(creep.carry.energy === creep.carryCapacity) {
            if(creep.room.energyAvailable === creep.room.energyCapacityAvailable){
                if(_.size(creep.room.containerToTransfer) > 0){
                        let containers = creep.room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return structure.structureType === STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity
                            }
                        })
                        if(containers.length > 0) {
                            if(creep.transfer(containers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                                creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffffff'}})
                            }
                        }
                }else {
                    let towers = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType === STRUCTURE_TOWER) &&
                                (structure.energy < structure.energyCapacity)
                        }
                    })
                    if(towers.length > 0) {
                        if(creep.transfer(towers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(towers[0], {visualizePathStyle: {stroke: '#ffffff'}})
                        }
                    }
                }
            }

            let targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_CONTAINER) &&
                        (structure.energy < structure.energyCapacity)
                }
            })
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {

                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}})
                }
            }
        } else {
            if(creep.harvest(creep.memory.source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.memory.source, {visualizePathStyle: {stroke: '#ffaa00'}})
            }
        }
    }
}

module.exports = roleHarvester