let output = require('./output')
let routerHelper = require('./router')
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
                routerHelper.routeCreep(creep, creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}})
            }
        }else {
            if(creep.memory.source !== undefined){
                if(creep.memory.source.structureType === "container"){
                    if(creep.memory.source.store.energy > 0){
                        if(creep.withdraw(creep.memory.source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            routerHelper.routeCreep(creep, creep.memory.source, {visualizePathStyle: {stroke: '#ffaa00'}})
                        }
                    }else{
                        if(creep.harvest(creep.memory.fallbackSource) === ERR_NOT_IN_RANGE) {
                            routerHelper.routeCreep(creep, creep.memory.fallbackSource, {visualizePathStyle: {stroke: '#ffaa00'}})
                        }
                    }
                }else{
                    if(creep.harvest(creep.memory.source) === ERR_NOT_IN_RANGE) {
                        routerHelper.routeCreep(creep, creep.memory.source, {visualizePathStyle: {stroke: '#ffaa00'}})
                    }
                }
            }
        }
    }
}

module.exports = roleUpgrader