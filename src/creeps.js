let generalFunctions = require('./general')
let settings = require('./settings').getSettingsForLevel()

let creeps = {
    getCreeps: (creeps, rooms, amountOfBuilder)=>{
        let littleCreeps = _.filter(creeps, creep => creep.memory.role.indexOf("little") !== -1)
        _.map(rooms, room =>{
            if(room.energyAvailable === room.energyCapacityAvailable){
                littleCreeps= littleCreeps.map((creep, index) =>{
                    let sources = creep.room.find(FIND_SOURCES);
                    if(index < amountOfBuilder ){
                        creep.memory.role = settings.generalSettings.roles.little_builder
                        creep.memory.source = sources[0]
                    }else{
                        creep.memory.role = settings.generalSettings.roles.little_upgrader
                        creep.memory.source = sources[1]
                    }
                    return creep
                })
            }else{
                littleCreeps= littleCreeps.map((creep, index) =>{
                    let sources = creep.room.find(FIND_SOURCES);
                    if(index < amountOfBuilder ){
                        creep.memory.role = settings.generalSettings.roles.little_builder
                        creep.memory.source = sources[1]
                    }else if(index < amountOfBuilder+2){
                        creep.memory.role = settings.generalSettings.roles.little_upgrader
                        creep.memory.source = sources[0]
                    }else{
                        creep.memory.role = settings.generalSettings.roles.little_harvester
                        creep.memory.source = sources[1]
                    }
                    return creep
                })
            }
        })
        return littleCreeps
    },
    getOtherCreeps: (creeps, rooms, amountOfBuilder)=>{
        let otherCreeps = _.filter(Game.creeps, creep =>{
            if( creep.memory.role.indexOf("little") !== -1 ||
                creep.memory.role.indexOf("medium") !== -1 ||
                creep.memory.role.indexOf("big") !== -1){
                return false
            }
            return true
        })
        _.map(rooms, room =>{
            if(room.energyAvailable === room.energyCapacityAvailable){
                otherCreeps= otherCreeps.map((creep, index) =>{
                    let sources = creep.room.find(FIND_SOURCES);
                    if(index < amountOfBuilder ){
                        creep.memory.role = settings.generalSettings.roles.little_builder
                        creep.memory.source = sources[0]
                    }else{
                        creep.memory.role = settings.generalSettings.roles.little_upgrader
                        creep.memory.source = sources[1]
                    }
                    return creep
                })
            }else{
                otherCreeps= otherCreeps.map((creep, index) =>{
                    let sources = creep.room.find(FIND_SOURCES);
                    if(index < amountOfBuilder ){
                        creep.memory.role = settings.generalSettings.roles.little_builder
                        creep.memory.source = sources[1]
                    }else if(index < amountOfBuilder+2){
                        creep.memory.role = settings.generalSettings.roles.little_upgrader
                        creep.memory.source = sources[0]
                    }else{
                        creep.memory.role = settings.generalSettings.roles.little_harvester
                        creep.memory.source = sources[1]
                    }
                    return creep
                })
            }
        })
        return otherCreeps
    },
    getMediumCreeps: (creeps)=>{
        let mediumCreeps = _.filter(creeps, creep => creep.memory.role.indexOf("medium") !== -1)
        mediumCreeps= mediumCreeps.map((creep, index) =>{
            let sources = creep.room.find(FIND_SOURCES);
            if(index%3 === 0){
                creep.memory.role = settings.generalSettings.roles.medium_harvester
            }else if(index%3 === 1){
                creep.memory.role = settings.generalSettings.roles.medium_upgrader
            }else if(index%3 === 2){
                creep.memory.role = settings.generalSettings.roles.medium_builder
            }
            creep.memory.source = sources[0]
            return creep
        })
        return mediumCreeps
    },
    getBigCreeps: (creeps)=>{
        let bigCreeps = _.filter(creeps, creep => creep.memory.role.indexOf("big") !== -1)
        bigCreeps= bigCreeps.map((creep, index) =>{
            let sources = creep.room.find(FIND_SOURCES);
            if(index%3 === 0){
                creep.memory.role = settings.generalSettings.roles.big_harvester
            }else if(index%3 === 1){
                creep.memory.role = settings.generalSettings.roles.big_upgrader
            }else if(index%3 === 2){
                creep.memory.role = settings.generalSettings.roles.big_builder
            }
            creep.memory.source = sources[0]
            return creep
        })
        return bigCreeps
    },
    spawnCreeps: (rooms, spawns, littleCreeps, mediumCreeps)=>{
        _.map(rooms, room =>{
            _.map(spawns, spawn=>{
                if(room.name === spawn.room.name){
                    if(littleCreeps.length < settings.numberCreeps){
                        let creepNumber =generalFunctions.getUnitNumber(littleCreeps)
                        let newName = spawn.createCreep(
                            [WORK,CARRY,MOVE],
                            "Creep-"+creepNumber,
                            {role: settings.generalSettings.roles.little_harvester}
                        );
                        console.log('Spawning new creep ' + newName+" within the room "+room.name);
                    }

                    if(room.canBuildMediumCreep && mediumCreeps.length < settings.numberMediumCreeps){
                        let mediumCreepNumber =generalFunctions.getUnitNumber(mediumCreeps)
                        let newName = spawn.createCreep(
                            [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],
                            "MediumCreep-"+mediumCreepNumber,
                            {role: settings.generalSettings.roles.medium_harvester}
                        );
                        console.log('Spawning new mediumCreep ' + newName+" within the room "+room.name);
                    }
                }
            })
        })
    }
};

module.exports = creeps;