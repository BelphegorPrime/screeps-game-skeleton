let output = require('./output')
let routerHelper = require('./router')
let roleSourceProxy = {
    run: (creep:Creep) =>{
        if(creep.carry.energy === creep.carryCapacity && creep.carry.energy >= 50) {
            let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(structure:Container|Structure) {
                    return structure.structureType === "container" && structure.store[RESOURCE_ENERGY] < structure.storeCapacity
                }
            });
            if(container !== null){
                if(creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    routerHelper.routeCreep(creep, container, {visualizePathStyle: {stroke: '#ffffff'}})
                }
            }else{
                let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure:Extension|Spawn|Structure) => {
                        return (structure.structureType === STRUCTURE_EXTENSION ||
                            structure.structureType === STRUCTURE_SPAWN) &&
                            (structure.energy < structure.energyCapacity)
                    }
                })
                if(target!==null){
                    if(creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        routerHelper.routeCreep(creep, target, {visualizePathStyle: {stroke: '#ffffff'}})
                    }
                }
            }
        } else {
            if(creep.harvest(creep.memory.source) === ERR_NOT_IN_RANGE) {
                routerHelper.routeCreep(creep, creep.memory.source, {visualizePathStyle: {stroke: '#ffaa00'}})
            }
        }
    }
}

module.exports = roleSourceProxy