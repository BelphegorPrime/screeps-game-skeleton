let roleHarvester = require('./role.harvester');
let roleUpgrader = require('./role.upgrader');
let roleBuilder = require('./role.builder');
let towers = require('./tower')

let creepsHelper = require('./creeps')

let generalFunctions = require('./general')
let settings = require('./settings')

module.exports.loop = () =>{

    // cleanup Memory
    _.map(Memory.creeps, (creep, creepName) =>{
        if(!Game.creeps[creepName]) {
            delete Memory.creeps[creepName];
            console.log('Clearing non-existing creep memory: ', creepName);
        }
    })

    // Get Roominformations
    _.map(Game.rooms, room =>{
        console.log('Room "'+room.name+'" has '+
            room.energyAvailable+'/'+
            room.energyCapacityAvailable+' energy'
        );
    })

    // set the Amount Of Creeps with the role Builder
    let amountOfBuilder = 1
    if(_.size(Game.constructionSites) > settings.constructionplaceToBuild){
        amountOfBuilder = settings.constructionplaceToBuild
    }

    // Give every Creep its role and source
    let creeps = creepsHelper.getCreeps(amountOfBuilder)

    // Spawning new Creeps
    if(creeps.length < settings.numberCreeps){
        let creepNumber =generalFunctions.getUnitNumber(creeps)
        let newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], "Creep-"+creepNumber, {role: 'harvester'});
        console.log('Spawning new creep: ' + newName);
    }


    // if(Game.spawns['Spawn1'].spawning) {
    //     let spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
    //     Game.spawns['Spawn1'].room.visual.text(
    //         '🛠️' + spawningCreep.memory.role,
    //         Game.spawns['Spawn1'].pos.x + 1,
    //         Game.spawns['Spawn1'].pos.y,
    //         {
    //             align: 'left',
    //             opacity: 0.8
    //         }
    //     );
    // }

    // Run Tower for specific ID
    towers.getTower('TOWER_ID')

    // Output of Amount of Creeps with an specific Role
    generalFunctions.showCreepRoles(creeps)

    // Execute Commands for Creeper Role
    _.map(creeps, creep =>{
        if(creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
    })
}