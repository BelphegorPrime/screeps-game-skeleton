// notice to myself: "lodash version is 3.10.1 :O"

let roleHarvester = require('./role.harvester')
let roleUpgrader = require('./role.upgrader')
let roleBuilder = require('./role.builder')
let room = require('./room')
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