// notice to myself: "lodash version is 3.10.1 :O"

let roleHarvester = require('./role.harvester')
let roleUpgrader = require('./role.upgrader')
let roleBuilder = require('./role.builder')
let towers = require('./tower')

let creepsHelper = require('./creeps')

let generalFunctions = require('./general')
let settings = require('./settings').getSettingsForLevel()

module.exports.loop = () =>{

    // Cleanup Memory
    _.map(Memory.creeps, (creep, creepName) =>{
        if(!Game.creeps[creepName]) {
            delete Memory.creeps[creepName]
            console.log('Clearing non-existing creep memory: ', creepName)
        }
    })

    // Run Tower for specific ID
    towers.getTower('TOWER_ID')

    // Get Roominformations and extend the Room Object
    Game.rooms = _.map(Game.rooms, room =>{
        console.log('Room "'+room.name+'" has '+
            room.energyAvailable+'/'+
            room.energyCapacityAvailable+' energy'
        )
        room.canBuildMediumCreep = room.energyAvailable >= 550

        let containers = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_CONTAINER
            }
        })

        if(room.containerToTransfer === undefined){
            room.containerToTransfer = []
        }
        if(room.containerToGetFrom === undefined){
            room.containerToGetFrom = []
        }

        let energyAmount = 0
        containers.map(container =>{
            let containerData = [{
                "pos":container.pos
            }]
            if(container.store[RESOURCE_ENERGY] < container.storeCapacity) {
                room.containerToTransfer = [].concat(room.containerToTransfer, containerData)
            }
            if(container.store[RESOURCE_ENERGY] > 0){
                room.containerToGetFrom = [].concat(room.containerToGetFrom, containerData)
            }
            energyAmount += container.store[RESOURCE_ENERGY]
        })
        console.log("Container in Room "+room.name+" has "+energyAmount)
        return room
    })

    // Set the Amount Of Creeps with the role Builder
    let numberOfBuilder = 1
    let amountOfConstructionSites = _.size(Game.constructionSites)
    if(amountOfConstructionSites > settings.maxBuilder){
        numberOfBuilder = settings.maxBuilder
    }else if(amountOfConstructionSites === 0){
        numberOfBuilder = amountOfConstructionSites
    }

    // Give every small and big Creep its role and source
    let littleCreeps = creepsHelper.getCreeps(Game.creeps, Game.rooms, numberOfBuilder, "little")
    let mediumCreeps = creepsHelper.getCreeps(Game.creeps, Game.rooms, numberOfBuilder, "medium")
    let bigCreeps    = creepsHelper.getCreeps(Game.creeps, Game.rooms, numberOfBuilder, "big")

    // maybe later a function for all Creeps so that you don´t seperate through sizes
    // let AllCreeps    = creepsHelper.getAllCreeps(Game.creeps, Game.rooms, numberOfBuilder)
    // console.log(AllCreeps)

    // Create small and big Creeps
    creepsHelper.spawnCreeps(Game.rooms, Game.spawns, littleCreeps, mediumCreeps)

    // Execute Commands for Creeper Role
    let creeps = [].concat(littleCreeps, mediumCreeps, bigCreeps)

    // Output of Amount of Creeps with an specific Role
    generalFunctions.showCreepRoles(creeps, settings.generalSettings.roles)

    _.map(creeps, creep =>{
        if(creep.memory.role === settings.generalSettings.roles.little_harvester ||
            creep.memory.role === settings.generalSettings.roles.medium_harvester ||
            creep.memory.role === settings.generalSettings.roles.big_harvester ||
            creep.memory.role === "harvester") {
            roleHarvester.run(creep)
        }
        if(creep.memory.role === settings.generalSettings.roles.little_upgrader ||
            creep.memory.role === settings.generalSettings.roles.medium_upgrader ||
            creep.memory.role === settings.generalSettings.roles.big_upgrader ||
            creep.memory.role === "upgrader") {
            roleUpgrader.run(creep)
        }
        if(creep.memory.role === settings.generalSettings.roles.little_builder ||
            creep.memory.role === settings.generalSettings.roles.medium_builder ||
            creep.memory.role === settings.generalSettings.roles.big_builder ||
            creep.memory.role === "builder") {
            roleBuilder.run(creep)
        }
    })
}