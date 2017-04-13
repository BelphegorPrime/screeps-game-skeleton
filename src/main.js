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

    let canBuildBigCreep = false

    // Get Roominformations
    _.map(Game.rooms, room =>{
        console.log('Room "'+room.name+'" has '+
            room.energyAvailable+'/'+
            room.energyCapacityAvailable+' energy'
        );
        if(room.energyAvailable === 550){
            canBuildBigCreep = true
        }
    })

    // set the Amount Of Creeps with the role Builder
    let amountOfBuilder = 1
    if(_.size(Game.constructionSites) > settings.constructionplaceToBuild){
        amountOfBuilder = settings.constructionplaceToBuild
    }

    // Give every small Creep its role and source
    let littleCreeps = creepsHelper.getCreeps(amountOfBuilder)
    let bigCreeps = creepsHelper.getBigCreeps()

    if(littleCreeps.length < settings.numberCreeps){
        let creepNumber =generalFunctions.getUnitNumber(littleCreeps)
        let newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], "Creep-"+creepNumber, {role: 'harvester'});
        console.log('Spawning new creep: ' + newName);
    }

    console.log(canBuildBigCreep)
    if(canBuildBigCreep && bigCreeps.length < settings.numberBigCreeps){
        let bigCreepNumber =generalFunctions.getUnitNumber(bigCreeps)
        let littleCreepNumber =generalFunctions.getUnitNumber(littleCreeps)
        let newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], "BigCreep"+littleCreepNumber+"-"+bigCreepNumber, {role: 'big_harvester'});
        console.log('Spawning new bigCreep: ' + newName);
    }

    // bigCreep
    // Game.spawns['Spawn1'].createCreep( [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],'HarvesterBig',{ role: 'big_harvester' } );
    // Game.spawns['Spawn1'].createCreep( [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],'HarvesterBig',{ role: 'big_upgrader' } );
    // Game.spawns['Spawn1'].createCreep( [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],'HarvesterBig',{ role: 'big_builder' } );


    if(Game.spawns['Spawn1'].spawning) {
        let spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {
                align: 'left',
                opacity: 0.8
            }
        );
    }

    // Run Tower for specific ID
    towers.getTower('TOWER_ID')

    // Output of Amount of Creeps with an specific Role
    generalFunctions.showCreepRoles(littleCreeps)
    generalFunctions.showBigCreepRoles(bigCreeps)

    // Execute Commands for Creeper Role
    let creeps = [].concat(littleCreeps, bigCreeps)
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