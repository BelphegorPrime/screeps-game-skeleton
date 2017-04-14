let generalFunctions = require('./general')
let settings = require('./settings').getSettingsForLevel()

let creeps = {
    getOtherCreeps: (creeps, rooms, numberOfBuilder)=>{
        let otherCreeps = _.filter(creeps, creep => creep.memory.role.indexOf("little") === -1 ||
                creep.memory.role.indexOf("medium") === -1 ||
                creep.memory.role.indexOf("big") === -1
        )
        // console.log(otherCreeps)
        _.map(rooms, room =>{
            if(room.energyAvailable === room.energyCapacityAvailable){
                otherCreeps= otherCreeps.map((creep, index) =>{
                    let sources = creep.room.find(FIND_SOURCES)
                    if(index < numberOfBuilder ){
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
                    let sources = creep.room.find(FIND_SOURCES)
                    if(index < numberOfBuilder ){
                        creep.memory.role = settings.generalSettings.roles.little_builder
                        creep.memory.source = sources[1]
                    }else if(index < numberOfBuilder+2){
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
    getCreeps: (creeps, rooms, numberOfBuilder, type)=>{
        creeps = _.filter(creeps, creep => creep.memory.role.indexOf(type) !== -1)
        let harvester = ""
        let upgrader = ""
        let builder = ""
        if(type === "little"){
            harvester = settings.generalSettings.roles.little_harvester
            upgrader = settings.generalSettings.roles.little_upgrader
            builder = settings.generalSettings.roles.little_builder
        }else if(type === "medium"){
            harvester = settings.generalSettings.roles.medium_harvester
            upgrader = settings.generalSettings.roles.medium_upgrader
            builder = settings.generalSettings.roles.medium_builder
        }else if(type === "big"){
            harvester = settings.generalSettings.roles.big_harvester
            upgrader = settings.generalSettings.roles.big_upgrader
            builder = settings.generalSettings.roles.big_builder
        }else{
            harvester = "harvester"
            upgrader = "upgrader"
            builder = "builder"
        }

        _.map(rooms, room =>{
            if(room.energyAvailable === room.energyCapacityAvailable){
                creeps= creeps.map((creep, index) =>{
                    let sources = creep.room.find(FIND_SOURCES)
                    if(index < numberOfBuilder ){
                        creep.memory.role = builder
                        creep.memory.type = type
                        creep.memory.source = sources[0]
                    }else{
                        creep.memory.role = upgrader
                        creep.memory.size = type
                        creep.memory.source = sources[1]
                    }
                    return creep
                })
            }else{
                if(_.size(creeps) <= 3){
                    creeps= creeps.map(creep =>{
                        creep.memory.role = harvester
                        creep.memory.type = type
                        creep.memory.source = creep.room.find(FIND_SOURCES)[1]
                        return creep
                    })
                    return creeps
                }
                creeps= creeps.map((creep, index) =>{
                    let sources = creep.room.find(FIND_SOURCES)
                    if(index < numberOfBuilder ){
                        creep.memory.role = builder
                        creep.memory.type = type
                        creep.memory.source = sources[1]
                    }else if(index < numberOfBuilder+2){
                        creep.memory.role = upgrader
                        creep.memory.type = type
                        creep.memory.source = sources[0]
                    }else{
                        creep.memory.role = harvester
                        creep.memory.type = type
                        creep.memory.source = sources[1]
                    }
                    return creep
                })
            }
        })
        return creeps
    },
    getAllCreeps: (creeps, rooms, numberOfBuilder)=>{
        creeps = _.map(creeps, creep => {return creep})
        let harvester = "harvester"
        let upgrader = "upgrader"
        let builder = "builder"
        _.map(rooms, room =>{
            if(room.energyAvailable === room.energyCapacityAvailable){
                creeps= creeps.map((creep, index) =>{
                    let sources = creep.room.find(FIND_SOURCES)
                    if(index < numberOfBuilder ){
                        creep.memory.role = builder
                        creep.memory.source = sources[0]
                    }else{
                        creep.memory.role = upgrader
                        creep.memory.source = sources[1]
                    }
                    return creep
                })
            }else{
                if(_.size(creeps) <= 3){
                    creeps= creeps.map(creep =>{
                        creep.memory.role = harvester
                        creep.memory.source = creep.room.find(FIND_SOURCES)[1]
                        return creep
                    })
                    return creeps
                }
                creeps= creeps.map((creep, index) =>{
                    let sources = creep.room.find(FIND_SOURCES)
                    if(index < numberOfBuilder ){
                        creep.memory.role = builder
                        creep.memory.source = sources[1]
                    }else if(index < numberOfBuilder+2){
                        creep.memory.role = upgrader
                        creep.memory.source = sources[0]
                    }else{
                        creep.memory.role = harvester
                        creep.memory.source = sources[1]
                    }
                    return creep
                })
            }
        })
        return creeps
    },
    spawnCreeps: (rooms, spawns, littleCreeps, mediumCreeps)=>{
        _.map(rooms, room =>{
            _.map(spawns, spawn=>{
                if(room.name === spawn.room.name){
                    if(littleCreeps.length < settings.numberCreeps){
                        let creepNumber =generalFunctions.getUnitNumber(littleCreeps)
                        let newName = spawn.createCreep(
                            [WORK,CARRY,MOVE],
                            "LittleCreep-"+creepNumber+"|"+generalFunctions.getRandomID(),
                            {role: settings.generalSettings.roles.little_harvester, type: "little"}
                        )
                        console.log('Spawning new creep ' + newName+" within the room "+room.name)
                    }

                    if(room.canBuildMediumCreep && mediumCreeps.length < settings.numberMediumCreeps){
                        let mediumCreepNumber =generalFunctions.getUnitNumber(mediumCreeps)
                        let newName = spawn.createCreep(
                            [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],
                            "MediumCreep-"+mediumCreepNumber+"|"+generalFunctions.getRandomID(),
                            {role: settings.generalSettings.roles.medium_harvester, type: "medium"}
                        )
                        console.log('Spawning new mediumCreep ' + newName+" within the room "+room.name)
                    }
                }
            })
        })
    }
}

module.exports = creeps