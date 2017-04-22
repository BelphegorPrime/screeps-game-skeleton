import output from "./output"
import routerHelper from "./router"

import settingsHelp from "./settings"
let settings = settingsHelp.getSettingsForLevel()

let roleLoader = {
    run: (creep:Creep) =>{
        if(creep.carry.energy === creep.carryCapacity || creep.carry.energy >= 50) {
            if(Memory.enemys[creep.room.name] <= 0 && creep.room.energyAvailable === creep.room.energyCapacityAvailable) {
                let container:Container = creep.pos.findClosestByRange<Container>(FIND_STRUCTURES, {
                    filter: (structure:Container) => {
                        return structure.structureType === "container" && structure.store[RESOURCE_ENERGY] < structure.storeCapacity
                    }
                })
                if(container !== null) {
                    if(creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        routerHelper.routeCreep(creep, container, {visualizePathStyle: {stroke: '#ffffff'}})
                    }
                }
            }
            let tower:Tower = creep.pos.findClosestByRange<Tower>(FIND_STRUCTURES, {
                filter: (structure:Tower) => {
                    return (structure.structureType === "tower") &&
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
                    let target:Extension|Spawn = creep.pos.findClosestByRange<Extension|Spawn>(FIND_STRUCTURES, {
                        filter: (structure:Extension|Spawn) => {
                            return (structure.structureType === STRUCTURE_EXTENSION ||
                                structure.structureType === STRUCTURE_SPAWN) &&
                                structure.energy < structure.energyCapacity
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
                let source:Source = creep.pos.findClosestByRange<Source>(FIND_SOURCES)
                if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    routerHelper.routeCreep(creep, source, {visualizePathStyle: {stroke: '#ffaa00'}})
                }
            }
        }
    },
    getNumberOfLoader: (room:Room):number =>{
        let structures = room.find(FIND_STRUCTURES, {
            filter: (structure:Tower|Container|Structure) => {
                return structure.structureType === "tower" || structure.structureType === "container"
            }
        })
        if(room.energyAvailable >= settings.generalSettings.costs.little*2 && _.size(structures) > 0){
            return settings.maxLoader
        }
        return 1
    }
}

export default roleLoader