let roleHarvester = require('./role.harvester');
let roleUpgrader = require('./role.upgrader');
let roleBuilder = require('./role.builder');
let towers = require('./tower')

let generalFunctions = require('./general')
let settings = require('./settings')

module.exports.loop = () =>{

    _.map(Memory.creeps, (creep, creepName) =>{
        if(!Game.creeps[creepName]) {
            delete Memory.creeps[creepName];
            console.log('Clearing non-existing creep memory: ', creepName);
        }
    })

    let creeps = []
    let amountOfBuilder = 1
    if(_.size(Game.constructionSites) > settings.constructionplaceToBuild){
        amountOfBuilder = settings.constructionplaceToBuild
    }

    _.map(Game.rooms, room =>{
        console.log('Room "'+room.name+'" has '+
            room.energyAvailable+'/'+
            room.energyCapacityAvailable+' energy'
        );

        if(room.energyAvailable === room.energyCapacityAvailable){
            creeps = Object.keys(Game.creeps).map((creepName, index) =>{
                let sources = Game.creeps[creepName].room.find(FIND_SOURCES);
                if(index <= amountOfBuilder ){
                    Game.creeps[creepName].memory.role = "builder"
                    Game.creeps[creepName].memory.source = sources[1]
                }else{
                    Game.creeps[creepName].memory.role = "upgrader"
                    Game.creeps[creepName].memory.source = sources[0]
                }
                return Game.creeps[creepName]
            })
        }else{
            creeps = Object.keys(Game.creeps).map((creepName, index) =>{
                let sources = Game.creeps[creepName].room.find(FIND_SOURCES);
                if(index <= 1){
                    Game.creeps[creepName].memory.role = "upgrader"
                    Game.creeps[creepName].memory.source = sources[0]
                } else if(index <= amountOfBuilder+2 ){
                    Game.creeps[creepName].memory.role = "builder"
                    Game.creeps[creepName].memory.source = sources[0]
                }else{
                    Game.creeps[creepName].memory.role = "harvester"
                    Game.creeps[creepName].memory.source = sources[1]
                }
                return Game.creeps[creepName]
            })
        }
    })

    if(creeps.length <= settings.numberCreeps){
        let creepNumber =generalFunctions.getUnitNumber(creeps)
        let newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], "Creep-"+creepNumber, {role: 'harvester'});
        console.log('Spawning new creep: ' + newName);
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

    towers.getTower('TOWER_ID')

    let amountOfHarvester = 0
    let amountOfUpgrader = 0

    _.map(creeps, creep =>{
        if(creep.memory.role === 'harvester') {
            amountOfHarvester += 1
        }
        if(creep.memory.role === 'upgrader') {
            amountOfUpgrader += 1
        }
    })

    console.log("amountOfHarvester: "+amountOfHarvester)
    console.log("amountOfBuilder: "+amountOfBuilder)
    console.log("amountOfUpgrader: "+amountOfUpgrader)


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