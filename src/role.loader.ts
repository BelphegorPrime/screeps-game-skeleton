let output = require('./output')
let settings = require('./settings').getSettingsForLevel()
let routerHelper = require('./router')
let roleLoader = {

    run: (creep) =>{
        if(creep.carry.energy === creep.carryCapacity || creep.carry.energy >= 50) {
            if(Memory.enemys[creep.room.name] <= 0 && creep.room.energyAvailable === creep.room.energyCapacityAvailable) {
                let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType === STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity
                    }
                })
                if(container !== null) {
                    if(creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        routerHelper.routeCreep(creep, container, {visualizePathStyle: {stroke: '#ffffff'}})
                    }
                }
            }
            let tower = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_TOWER) &&
                        (structure.energy < structure.energyCapacity)
                }
            })
            if(tower!==null) {
                if(creep.transfer(tower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    routerHelper.routeCreep(creep, tower, {visualizePathStyle: {stroke: '#ffffff'}})
                }
            }else {
                if(creep.room.energyAvailable === creep.room.energyCapacityAvailable){
                    if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                        routerHelper.routeCreep(creep, creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}})
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
                            routerHelper.routeCreep(creep, target, {visualizePathStyle: {stroke: '#ffffff'}})
                        }
                    }
                }
            }
        } else {
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
            }else{
                let source = creep.pos.findClosestByRange(FIND_SOURCES)
                if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    routerHelper.routeCreep(creep, source, {visualizePathStyle: {stroke: '#ffaa00'}})
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
        if(room.energyAvailable >= settings.generalSettings.costs.little*2 && _.size(structures) > 0){
            return settings.maxLoader
        }
        return 1
    }
}

module.exports = roleLoader