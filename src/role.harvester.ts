let output = require('./output')
let routerHelper = require('./router')
let roleHarvester = {

    // TODO OPTIMISE RUN FUNCTION
    run: (creep:Creep) =>{
        if(creep.carry.energy === creep.carryCapacity || creep.carry.energy >= 50) {
            let subTimeHarvesterDelivery=Game.cpu.getUsed();
            roleHarvester.deliver(creep)
            let durationHarvesterRunDelivery=(Game.cpu.getUsed()-subTimeHarvesterDelivery).toFixed(0);
            if(durationHarvesterRunDelivery > 1){
                output.writeToDebug("HARVESTER---DELIVERY-------->"+durationHarvesterRunDelivery)
            }
        } else {
            let subTimeHarvesterGetEnergy=Game.cpu.getUsed();
            roleHarvester.getEnergy(creep)
            let durationHarvesterRunGetEnergy=(Game.cpu.getUsed()-subTimeHarvesterGetEnergy).toFixed(0);
            if(durationHarvesterRunGetEnergy > 1){
                output.writeToDebug("HARVESTER---GETENERGY------->"+durationHarvesterRunGetEnergy)
            }
        }

    },
    deliver: (creep:Creep) =>{
        if(creep.room.energyAvailable === creep.room.energyCapacityAvailable){
            if(_.size(creep.room.containerToTransfer) <= 0){
                let towers = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure:Tower|Structure) => {
                        return (structure.structureType === "tower") &&
                            (structure.energy < structure.energyCapacity)
                    }
                })
                if(towers.length > 0) {
                    if(creep.transfer(towers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        routerHelper.routeCreep(creep, towers[0], {visualizePathStyle: {stroke: '#ffffff'}})
                    }
                }else {
                    if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                        routerHelper.routeCreep(creep, creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}})
                    }
                }
            }else {
                let containers = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure:Container|Structure) => {
                        return structure.structureType === "container" && structure.store[RESOURCE_ENERGY] < structure.storeCapacity
                    }
                })
                if(containers.length > 0) {
                    if(creep.transfer(containers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        routerHelper.routeCreep(creep, containers[0], {visualizePathStyle: {stroke: '#ffffff'}})
                    }
                }else{
                    if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                        routerHelper.routeCreep(creep, creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}})
                    }
                }
            }
        }

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
    },
    getEnergy: (creep:Creep)=>{
        let target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
        if(target) {
            if(creep.pickup(target) === ERR_NOT_IN_RANGE) {
                routerHelper.routeCreep(creep, target, {visualizePathStyle: {stroke: '#ffaa00'}})
            }
        }else{
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
                    if(creep.memory.source.ticksToRegeneration > 75 && creep.memory.source.energy === 0){
                        if(creep.harvest(creep.memory.proxysource) === ERR_NOT_IN_RANGE) {
                            routerHelper.routeCreep(creep, creep.memory.proxysource, {visualizePathStyle: {stroke: '#ffaa00'}})
                        }
                    }else {
                        if(creep.harvest(creep.memory.source) === ERR_NOT_IN_RANGE) {
                            routerHelper.routeCreep(creep, creep.memory.source, {visualizePathStyle: {stroke: '#ffaa00'}})
                        }
                    }
                }
            }else{
                let source = creep.pos.findClosestByRange(FIND_SOURCES)
                if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    routerHelper.routeCreep(creep, source, {visualizePathStyle: {stroke: '#ffaa00'}})
                }
            }
        }
    }
}

module.exports = roleHarvester