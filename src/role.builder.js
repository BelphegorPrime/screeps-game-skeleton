let output = require('./output')
let settings = require('./settings').getSettingsForLevel()
let roleBuilder = {

    run: (creep) =>{
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
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}})
                }
            }
        } else {
            if(_.size(creep.room.containerToGetFrom) > 0){
                creep.room.containerToGetFrom.map( container =>{
                    let realContainer = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.structureType === STRUCTURE_CONTAINER &&
                                structure.pos.x === container.pos.x &&
                                structure.pos.y === container.pos.y
                        }
                    })[0]

                    if(creep.withdraw(realContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(realContainer, {visualizePathStyle: {stroke: '#ffaa00'}})
                    }
                })
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
    },
    getNumberOfBuilder: (constructionSites)=>{
        // Set the Amount Of Creeps with the role Builder
        let amountOfSourceproxy = _.size(_.filter(Memory.creeps, creep => creep.role === "sourceproxy"))
        let numberOfBuilder = 1 + amountOfSourceproxy
        let amountOfConstructionSites = _.size(constructionSites)
        if(amountOfConstructionSites*2 > settings.maxBuilder){
            numberOfBuilder = settings.maxBuilder
        }else if(amountOfConstructionSites === 0){
            numberOfBuilder = 0
        }
        return numberOfBuilder
    },
}

module.exports = roleBuilder