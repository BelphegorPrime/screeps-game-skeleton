let output = require('./output')
let roleUpgrader = {
    run: (creep) =>{
        if(creep.memory.upgrading && creep.carry.energy === 0) {
            creep.memory.upgrading = false
            creep.say('harvest')
        }
        if(!creep.memory.upgrading && creep.carry.energy === creep.carryCapacity) {
            creep.memory.upgrading = true
            creep.say('upgrade')
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}})
            }
        }else {
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
    }
}

module.exports = roleUpgrader