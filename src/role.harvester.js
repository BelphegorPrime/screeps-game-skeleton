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

            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_SPAWN) &&
                        (structure.energy < structure.energyCapacity)
                }
            })
            if(target!==null){
                if(creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}})
                }
            }
        } else {
            let target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
            if(target) {
                if(creep.pickup(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }else{
                if(creep.memory.source !== undefined){
                    if(creep.memory.source.structureType === "container"){
                        if(creep.memory.source.store.energy > 0){
                            if(creep.withdraw(creep.memory.source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                                creep.moveTo(creep.memory.source, {visualizePathStyle: {stroke: '#ffaa00'}})
                            }
                        }else{
                            if(creep.harvest(creep.memory.fallbackSource) === ERR_NOT_IN_RANGE) {
                                creep.moveTo(creep.memory.fallbackSource, {visualizePathStyle: {stroke: '#ffaa00'}})
                            }
                        }
                    }else{
                        if(creep.harvest(creep.memory.source) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.memory.source, {visualizePathStyle: {stroke: '#ffaa00'}})
                        }
                    }
                }
            }
        }
    }
}

module.exports = roleHarvester