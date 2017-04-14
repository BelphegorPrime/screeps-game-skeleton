let roleHarvester = require('./role.harvester');
let roleUpgrader = require('./role.upgrader');
let roleBuilder = require('./role.builder');
let towers = require('./tower')

let creepsHelper = require('./creeps')

let generalFunctions = require('./general')
let settings = require('./settings').getSettingsForLevel()

module.exports.loop = () =>{

    // Cleanup Memory
    _.map(Memory.creeps, (creep, creepName) =>{
        if(!Game.creeps[creepName]) {
            delete Memory.creeps[creepName];
            console.log('Clearing non-existing creep memory: ', creepName);
        }
    })

    // Run Tower for specific ID
    towers.getTower('TOWER_ID')

    // Get Roominformations and extend the Room Object
    Game.rooms = _.map(Game.rooms, room =>{
        console.log('Room "'+room.name+'" has '+
            room.energyAvailable+'/'+
            room.energyCapacityAvailable+' energy'
        );
        room.canBuildMediumCreep = room.energyAvailable >= 550
        return room
    })

    // Set the Amount Of Creeps with the role Builder
    let amountOfBuilder = 1
    if(_.size(Game.constructionSites) > settings.constructionplaceToBuild){
        amountOfBuilder = settings.constructionplaceToBuild
    }

    // Give every small and big Creep its role and source
    let littleCreeps = creepsHelper.getCreeps(Game.creeps, Game.rooms, amountOfBuilder)
    let mediumCreeps = creepsHelper.getMediumCreeps(Game.creeps)
    let bigCreeps = creepsHelper.getBigCreeps(Game.creeps)


    let otherCreeps= creepsHelper.getOtherCreeps(Game.creeps, Game.rooms, amountOfBuilder)

    // Create small and big Creeps
    creepsHelper.spawnCreeps(Game.rooms, Game.spawns, littleCreeps, mediumCreeps)

    // Execute Commands for Creeper Role
    let creeps = [].concat(littleCreeps, mediumCreeps, bigCreeps, otherCreeps)

    // Output of Amount of Creeps with an specific Role
    generalFunctions.showCreepRoles(creeps, settings.generalSettings.roles)

    _.map(creeps, creep =>{
        if(creep.memory.role === settings.generalSettings.roles.little_harvester ||
            creep.memory.role === settings.generalSettings.roles.medium_harvester ||
            creep.memory.role === settings.generalSettings.roles.big_harvester ||
            creep.memory.role === "harvester") {
            roleHarvester.run(creep);
        }
        if(creep.memory.role === settings.generalSettings.roles.little_upgrader ||
            creep.memory.role === settings.generalSettings.roles.medium_upgrader ||
            creep.memory.role === settings.generalSettings.roles.big_upgrader ||
            creep.memory.role === "upgrader") {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role === settings.generalSettings.roles.little_builder ||
            creep.memory.role === settings.generalSettings.roles.medium_builder ||
            creep.memory.role === settings.generalSettings.roles.big_builder ||
            creep.memory.role === "builder") {
            roleBuilder.run(creep);
        }
    })
}