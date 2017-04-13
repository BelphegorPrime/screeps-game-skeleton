let roleHarvester = require('./role.harvester');
let roleUpgrader = require('./role.upgrader');
let roleBuilder = require('./role.builder');
let towers = require('./tower')

let creepsHelper = require('./creeps')

let generalFunctions = require('./general')
let settings = require('./settings')

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

    // Get Roominformations
    Game.rooms = _.map(Game.rooms, room =>{
        console.log('Room "'+room.name+'" has '+
            room.energyAvailable+'/'+
            room.energyCapacityAvailable+' energy'
        );
        room.canBuildBigCreep = false
        if(room.energyAvailable === 550){
            room.canBuildBigCreep = true
        }
        return room
    })

    // Set the Amount Of Creeps with the role Builder
    let amountOfBuilder = 1
    if(_.size(Game.constructionSites) > settings.constructionplaceToBuild){
        amountOfBuilder = settings.constructionplaceToBuild
    }

    // Give every small Creep its role and source
    let littleCreeps = creepsHelper.getCreeps(amountOfBuilder)
    let bigCreeps = creepsHelper.getBigCreeps()

    // Create small and big Creeps
    creepsHelper.spawnCreeps(Game.rooms, Game.spawns, littleCreeps, bigCreeps, settings, generalFunctions)

    // Execute Commands for Creeper Role
    let creeps = [].concat(littleCreeps, bigCreeps)

    // Output of Amount of Creeps with an specific Role
    generalFunctions.showCreepRoles(creeps)

    _.map(creeps, creep =>{
        if(creep.memory.role === 'harvester' || creep.memory.role === 'big_builder') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role === 'upgrader' || creep.memory.role === 'big_upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role === 'builder' || creep.memory.role === 'big_harvester') {
            roleBuilder.run(creep);
        }
    })
}