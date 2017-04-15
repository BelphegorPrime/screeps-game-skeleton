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
            let targets = creep.room.find(FIND_CONSTRUCTION_SITES)
            if(targets.length) {
                if(creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}})
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
                    }else {
                        creep.withdraw(realContainer, RESOURCE_ENERGY)
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
        let numberOfBuilder = 1
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