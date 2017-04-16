let output = require('./output')
let settings = require('./settings').getSettingsForLevel()
let roleLoader = {

    run: (creep) =>{
        if(creep.carry.energy === creep.carryCapacity) {
            if(creep.room.energyAvailable === creep.room.energyCapacityAvailable) {
                let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType === STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity
                    }
                })
                if(container !== null) {
                    if(creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}})
                    }
                }
            }

            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_TOWER) &&
                        (structure.energy < structure.energyCapacity)
                }
            })
            if(target!==null) {
                if(creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}})
                }
            }
        } else {
            if(creep.memory.source.structureType === "container"){
                if(creep.withdraw(creep.memory.source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.memory.source, {visualizePathStyle: {stroke: '#ffffff'}})
                }
            }else{
                if(creep.harvest(creep.memory.source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.memory.source, {visualizePathStyle: {stroke: '#ffaa00'}})
                }
            }
        }
    },
    getNumberOfLoader: (room)=>{
        let structures = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_TOWER || structure.structureType === STRUCTURE_CONTAINER
            }
        })
        if(_.size(structures) > 0){
            return settings.maxLoader
        }
        return 0
    }
}

module.exports = roleLoader