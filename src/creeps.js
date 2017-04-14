let generalFunctions = require('./general')
let settings = require('./settings').getSettingsForLevel()

let creepsHelp = {
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
    getCreeps: (allCreeps, rooms, numberOfBuilder, type)=>{
        allCreeps = _.map(allCreeps, creep =>{return creep})
        creeps = _.filter(allCreeps, creep => creep.memory.role.indexOf(type) !== -1)
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
            let notFullContainer = room.containerToTransfer.filter(container => container.isFull)
            if(room.energyAvailable === room.energyCapacityAvailable && _.size(notFullContainer) === 0){
                creeps= creeps.map((creep, index) =>{
                    let SourceToMoveTo = creepsHelp.getAvailableSource(creep, _.size(allCreeps))
                    if(index < numberOfBuilder ){
                        creep.memory.role = builder
                        creep.memory.type = type
                        creep.memory.source = SourceToMoveTo
                    }else{
                        creep.memory.role = upgrader
                        creep.memory.size = type
                        creep.memory.source = SourceToMoveTo
                    }
                    return creep
                })
            }else{
                if(_.size(creeps) <= 3){
                    creeps= creeps.map(creep =>{
                        let SourceToMoveTo = creepsHelp.getAvailableSource(creep, _.size(allCreeps))
                        creep.memory.role = harvester
                        creep.memory.type = type
                        creep.memory.source = SourceToMoveTo
                        return creep
                    })
                    return creeps
                }
                creeps= creeps.map((creep, index) =>{
                    let SourceToMoveTo = creepsHelp.getAvailableSource(creep, _.size(allCreeps))
                    if(index < numberOfBuilder ){
                        creep.memory.role = builder
                        creep.memory.type = type
                        creep.memory.source = SourceToMoveTo
                    }else if(index < numberOfBuilder+2){
                        creep.memory.role = upgrader
                        creep.memory.type = type
                        creep.memory.source = SourceToMoveTo
                    }else{
                        creep.memory.role = harvester
                        creep.memory.type = type
                        creep.memory.source = SourceToMoveTo
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
    },
    getAvailableSource: (creep, amountOfCreeps)=>{
        let sources = creep.room.find(FIND_SOURCES)
        let amountOfSources = _.size(sources)

        sources = sources.map((source, sourceIndex)=>{
            if(source.registeredCreeps === undefined){
                source.registeredCreeps=[]
            }
            source.maxCreeps = Math.round(amountOfCreeps/amountOfSources)

            if(sourceIndex > 0){
                if(sources[0].registeredCreeps.indexOf(creep.id)  > -1){

                }else{
                    if(_.size(source.registeredCreeps) < source.maxCreeps){
                        source.registeredCreeps = [].concat(source.registeredCreeps, creep.id)
                    }
                }
            }else{
                if(_.size(source.registeredCreeps) < source.maxCreeps){
                    source.registeredCreeps = [].concat(source.registeredCreeps, creep.id)
                }
            }

            return source
        })

        let sourceToReturn = sources.filter(source => {
            return source.registeredCreeps.indexOf(creep.id) > -1
        })[0]

        // when creep has no Source write informations to console.log
        if(sourceToReturn === undefined){
            console.log(amountOfCreeps)
            sources.map(source => {
                console.log(source.registeredCreeps)
            })
            console.log(creep.id)
            console.log(sourceToReturn)
        }

        return sourceToReturn
    },
}

module.exports = creepsHelp