let output = require('./output')
let roleSourceProxy = {
    run: (creep) =>{
        if(creep.carry.energy === creep.carryCapacity) {
            let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(structure) {
                    return structure.structureType === STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity
                }
            });
            if(container !== null){
                if(creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}})
                }
            }else{
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
            }
        } else {
            if(creep.harvest(creep.memory.source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.memory.source, {visualizePathStyle: {stroke: '#ffaa00'}})
            }
        }
    }
}

module.exports = roleSourceProxy