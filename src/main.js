let roleHarvester = require('./role.harvester');
let roleUpgrader = require('./role.upgrader');
let roleBuilder = require('./role.builder');

let generalFunctions = require('./general')

module.exports.loop = function() {

    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    for(let roomName in Game.rooms) {
        console.log('Room "'+roomName+'" has '+
            Game.rooms[roomName].energyAvailable+'/'+
            Game.rooms[roomName].energyCapacityAvailable+' energy');
    }

    let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    let upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    let builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');

    let newName = ""
    if(builder.length < 6) {
        let builderNr=generalFunctions.getUnitNumber(builder)
        newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], "Builder-"+builderNr, {role: 'builder'});
        //console.log('Spawning new builder: ' + newName);
    }

    if(upgrader.length < 3) {
        let upgraderNr=generalFunctions.getUnitNumber(upgrader)
        newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], "Upgrader-"+upgraderNr, {role: 'upgrader'});
        //console.log('Spawning new upgrader: ' + newName);
    }

    if(harvesters.length < 3) {
        let harvesterNr=generalFunctions.getUnitNumber(harvesters)
        newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], "Harvester-"+harvesterNr , {role: 'harvester'});
        //console.log('Spawning new harvester: ' + newName);
    }

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

    let tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        let closestDamagedStructure = tower.pos.findClosestByRange(
            FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax
            }
        )
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(let creepName in Game.creeps) {
        let creep = Game.creeps[creepName];
        if(creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
    }
}