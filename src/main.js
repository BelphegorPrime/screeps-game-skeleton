// notice to myself: "lodash version is 3.10.1 :O"

let roleHarvester = require('./role.harvester')
let roleUpgrader = require('./role.upgrader')
let roleBuilder = require('./role.builder')
let roleLoader = require('./role.loader')
let roleSourceProxy = require('./role.sourceproxy')

let room = require('./room')
let creepsHelper = require('./creeps')

let output = require('./output')
let settings = require('./settings').getSettingsForLevel()

module.exports.loop = () =>{

    let subTimeStart=Game.cpu.getUsed();

    // Cleanup Memory
    _.map(Memory.creeps, (creep, creepName) =>{
        if(!Game.creeps[creepName]) {
            delete Memory.creeps[creepName]
            console.log('Clearing non-existing creep memory: ', creepName)
        }
    })


    // Get Roominformations and extend the Room Object
    Game.rooms = room.init(Game.rooms)

    // Set the Amount Of Creeps with the role Builder
    let numberOfBuilder = 1
    let amountOfConstructionSites = _.size(Game.constructionSites)
    if(amountOfConstructionSites > settings.maxBuilder){
        numberOfBuilder = settings.maxBuilder
    }else if(amountOfConstructionSites === 0){
        numberOfBuilder = amountOfConstructionSites
    }

    let numberOfLoader = 0
    _.map(Game.rooms, room =>{
        let structures = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_TOWER || structure.structureType === STRUCTURE_CONTAINER
            }
        })
        if(_.size(structures) > 0){
            numberOfLoader = settings.maxLoader
        }
    })

    // Give every small and big Creep its role and source
    let littleCreeps = creepsHelper.getCreeps(Game.creeps, Game.rooms, numberOfBuilder, numberOfLoader, "little")
    let mediumCreeps = creepsHelper.getCreeps(Game.creeps, Game.rooms, numberOfBuilder, numberOfLoader, "medium")
    let bigCreeps    = creepsHelper.getCreeps(Game.creeps, Game.rooms, numberOfBuilder, numberOfLoader, "big")

    // Create small and big Creeps
    creepsHelper.spawnCreeps(Game.rooms, Game.spawns, littleCreeps, mediumCreeps, bigCreeps)

    // Execute Commands for Creeper Role
    let creeps = [].concat(littleCreeps, mediumCreeps, bigCreeps)

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
        if(creep.memory.role === settings.generalSettings.roles.little_loader ||
            creep.memory.role === settings.generalSettings.roles.medium_loader ||
            creep.memory.role === settings.generalSettings.roles.big_loader ||
            creep.memory.role === "loader"){
            roleLoader.run(creep)
        }
        if(creep.memory.role === settings.generalSettings.roles.sourceproxy){
            roleSourceProxy.run(creep)
        }
    })




    // WRITE ACTUAL TICK TO MEMORY

    // INIT CPU DATABASE
    // Memory.cpu = {}
    // Memory.cpu.lengthLastTickTime = 0
    // Memory.cpu.lastTickTime = []
    // Memory.cpu.lastTickTime[0] = []

    let iteration = Memory.cpu.lengthLastTickTime
    if(iteration === 5){
        Memory.cpu.lengthLastTickTime = 0
        iteration = 0
        Memory.cpu.lastTickTime[0]=[Memory.cpu.lastTickTime[0][_.size(Memory.cpu.lastTickTime[0])-1]]
    }
    Memory.cpu.lengthLastTickTime = iteration+1

    let duration=(Game.cpu.getUsed()-subTimeStart).toFixed(0);
    Memory.cpu.lastTickTime[0] = [].concat(Memory.cpu.lastTickTime[0],duration)

    // CONSOLE OUTPUT
    output.showCreepRoles(Game.rooms, creeps, settings.generalSettings.roles)
    output.writeCPU(Game.cpu)
    output.allDuration(duration)
    output.writeLog()
}