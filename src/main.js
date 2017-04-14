// notice to myself: "lodash version is 3.10.1 :O"

let roleHarvester = require('./role.harvester')
let roleUpgrader = require('./role.upgrader')
let roleBuilder = require('./role.builder')
let roleLoader = require('./role.loader')
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

    // Output of Amount of Creeps with an specific Role
    output.showCreepRoles(Game.rooms, creeps, settings.generalSettings.roles)
    console.log("CPU-Limit: "+Game.cpu.limit + " | Tick-Limit: "+ Game.cpu.tickLimit+ " | Bucket: "+ Game.cpu.bucket)

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
    })
    let subTimeEnd=Game.cpu.getUsed();
    console.log('dt: '+(subTimeEnd-subTimeStart).toFixed(0));

    let iteration = Memory.cpu.lengthLastTickTime
    let arrayNumber = Memory.cpu.arrayNumberLastTickTime
    if(iteration === 255){
        Memory.cpu.lengthLastTickTime = 0
        iteration = 0
        Memory.cpu.arrayNumberLastTickTime = arrayNumber+1
    }

    if(arrayNumber === 5){
        Memory.cpu.arrayNumberLastTickTime = 0
    }

    Memory.cpu.lastTickTime[Memory.cpu.arrayNumberLastTickTime] = [].concat(
        Memory.cpu.lastTickTime[Memory.cpu.arrayNumberLastTickTime],
        (subTimeEnd-subTimeStart).toFixed(0)
    )
    Memory.cpu.lengthLastTickTime = iteration+1
}