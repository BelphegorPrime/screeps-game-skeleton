import output from "./output"
import settingsHelp from './settings'
let settings = settingsHelp.getSettingsForLevel()
let routerHelper = require('./router')
let roleBuilder = {

    run: (creep:Creep) =>{
        if(creep.memory.building && creep.carry.energy === 0) {
            creep.memory.building = false
            creep.say('harvest')
        }
        if(!creep.memory.building && creep.carry.energy === creep.carryCapacity) {
            creep.memory.building = true
            creep.say('build')
        }

        if(creep.memory.building) {
            let target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)
            if(target !== null) {
                if(creep.build(target) === ERR_NOT_IN_RANGE) {
                    routerHelper.routeCreep(creep, target, {stroke: '#ffffff'})
                }
            }
        } else {
            if(_.size(creep.room.containerToGetFrom) > 0){
                creep.room.containerToGetFrom.map( (container:Container) =>{
                    let realContainer = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure:Container|Structure) => {
                            return structure.structureType === "container" &&
                                structure.pos.x === container.pos.x &&
                                structure.pos.y === container.pos.y
                        }
                    })[0]

                    if(creep.withdraw(realContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        routerHelper.routeCreep(creep, realContainer, {stroke: '#ffffff'})
                    }
                })
            }else {
                if(creep.memory.source.structureType === "container"){
                    if(creep.memory.source.store.energy > 0){
                        if(creep.withdraw(creep.memory.source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            routerHelper.routeCreep(creep, creep.memory.source, {stroke: '#ffaa00'})
                        }
                    }else{
                        if(creep.harvest(creep.memory.fallbackSource) === ERR_NOT_IN_RANGE) {
                            routerHelper.routeCreep(creep, creep.memory.fallbackSource, {stroke: '#ffaa00'})
                        }
                    }
                }else{
                    if(creep.harvest(creep.memory.source) === ERR_NOT_IN_RANGE) {
                        routerHelper.routeCreep(creep, creep.memory.source, {stroke: '#ffaa00'})
                    }
                }
            }

        }
    },
    getNumberOfBuilder: (constructionSites: [ConstructionSite])=>{
        // Set the Amount Of Creeps with the role Builder
        let numberOfBuilder = 1
        let amountOfConstructionSites = _.size(constructionSites)
        if(amountOfConstructionSites > settings.maxBuilder){
            numberOfBuilder = settings.maxBuilder
        }else if(amountOfConstructionSites === 0){
            numberOfBuilder = 0
        }
        return numberOfBuilder
    },
}

module.exports = roleBuilder