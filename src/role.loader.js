let output = require('./output')
let settings = require('./settings').getSettingsForLevel()
let roleLoader = {

    run: (creep) =>{
        if(creep.carry.energy === creep.carryCapacity) {
            if(creep.room.energyAvailable === creep.room.energyCapacityAvailable) {
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
            }

            let targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_TOWER) &&
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
    },
    getNumberOfLoader: (room)=>{
        let structures = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_TOWER || structure.structureType === STRUCTURE_CONTAINER
            }
        })
        output.writeToDebug(_.size(structures))
        if(_.size(structures) > 0){
            return settings.maxLoader
        }
        return 0
    }
}

module.exports = roleLoader