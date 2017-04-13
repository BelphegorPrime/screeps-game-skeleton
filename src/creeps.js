let creeps = {

    getCreeps: (amountOfBuilder)=>{
        let littleCreeps = _.filter(Game.creeps, creep => creep.memory.role.indexOf("big") === -1)
        _.map(Game.rooms, room =>{
            if(room.energyAvailable === room.energyCapacityAvailable){
                littleCreeps= littleCreeps.map((creep, index) =>{
                    let sources = creep.room.find(FIND_SOURCES);
                    if(index < amountOfBuilder ){
                        creep.memory.role = "builder"
                        creep.memory.source = sources[0]
                    }else{
                        creep.memory.role = "upgrader"
                        creep.memory.source = sources[1]
                    }
                    return creep
                })
            }else{
                littleCreeps= littleCreeps.map((creep, index) =>{
                    let sources = creep.room.find(FIND_SOURCES);
                    if(index < amountOfBuilder ){
                        creep.memory.role = "builder"
                        creep.memory.source = sources[0]
                    }else if(index < amountOfBuilder+2){
                        creep.memory.role = "upgrader"
                        creep.memory.source = sources[0]
                    }else{
                        creep.memory.role = "harvester"
                        creep.memory.source = sources[1]
                    }
                    return creep
                })
            }
        })
        return littleCreeps
    },
    getBigCreeps: ()=>{
        let bigCreeps = _.filter(Game.creeps, creep => creep.memory.role.indexOf("big") !== -1)
        bigCreeps= bigCreeps.map((creep, index) =>{
            let sources = creep.room.find(FIND_SOURCES);
            if(index%3 === 0){
                creep.memory.role = "big_harvester"
                creep.memory.source = sources[1]
            }else if(index%3 === 1){
                creep.memory.role = "big_upgrader"
                creep.memory.source = sources[0]
            }else if(index%3 === 2){
                creep.memory.role = "big_builder"
                creep.memory.source = sources[0]
            }
            return creep
        })
        return bigCreeps
    },
    spawnCreeps: (rooms, spawns, littleCreeps, bigCreeps, settings, generalFunctions)=>{
        _.map(rooms, room =>{
            _.map(spawns, spawn=>{
                if(room.name === spawn.room.name){
                    if(littleCreeps.length < settings.numberCreeps){
                        let creepNumber =generalFunctions.getUnitNumber(littleCreeps)
                        let newName = spawn.createCreep([WORK,CARRY,MOVE], "Creep-"+creepNumber, {role: 'harvester'});
                        console.log('Spawning new creep ' + newName+" within the room "+room.name);
                    }

                    if(room.canBuildBigCreep && bigCreeps.length < settings.numberBigCreeps){
                        let bigCreepNumber =generalFunctions.getUnitNumber(bigCreeps)
                        let newName = spawn.createCreep([WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], "BigCreep-"+bigCreepNumber, {role: 'big_harvester'});
                        console.log('Spawning new bigCreep ' + newName+" within the room "+room.name);
                    }
                }
            })
        })
    }
};

module.exports = creeps;