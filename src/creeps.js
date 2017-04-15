let output = require('./output')
let generalFunctions = require('./general')
let roleBuilder = require('./role.builder')
let roleLoader = require('./role.loader')
let settings = require('./settings').getSettingsForLevel()

let creepsHelp = {
    getCreeps: (allCreeps, rooms, constructionSites)=>{
        creeps = _.map(allCreeps, creep =>{return creep})
        let harvester = settings.generalSettings.roles.harvester
        let upgrader = settings.generalSettings.roles.upgrader
        let builder = settings.generalSettings.roles.builder
        let loader = settings.generalSettings.roles.loader
        let sourceproxy = settings.generalSettings.roles.sourceproxy

        _.map(rooms, room =>{

            // TODO: Alot... if(source has one slot), an alltime proxy that fills a container, AAAAAND all other creeps get energie from that container
            let SourcesToMoveTo = _(creepsHelp.getAvailableSources(creeps, _.size(allCreeps))).reverse().value()
            let noProxySource = SourcesToMoveTo.filter(source => Memory.sources[room.name][source.id] !== undefined && Memory.sources[room.name][source.id]["availableSlots"] !== 1)[0]

            if(_.size(creeps) <= 3){
                creeps= creeps.map(creep =>{
                    creep.memory.source = SourcesToMoveTo.filter(source =>{
                        if(source.registeredCreeps !== undefined){
                            return source.registeredCreeps.indexOf(creep.id) > -1
                        }else {
                            return false
                        }
                    })[0]
                    if(source !== undefined){
                        if(Memory.sources[creep.room.name][source.id] !== undefined && Memory.sources[creep.room.name][source.id]["availableSlots"] === 1){
                            output.writeToDebug(creep.name)
                            output.writeToDebug(creep.pos)
                            creep.memory.role = sourceproxy
                            creep.memory.source = source
                        }else {
                            creep.memory.role = harvester
                        }
                    }else{
                        creep.memory.role = harvester
                        creep.memory.source = noProxySource
                    }
                    return creep
                })
                return creeps
            }

            let numberOfBuilder = roleBuilder.getNumberOfBuilder(constructionSites)
            let notFullContainer = room.containerToTransfer.filter(container => !container.isFull)
            if(room.energyAvailable >= settings.generalSettings.costs.little*2 && _.size(notFullContainer) > 0){
                let numberOfLoader = roleLoader.getNumberOfLoader(room)
                creeps= creeps.map((creep, index) =>{
                    let source = SourcesToMoveTo.filter(source =>{
                        if(source.registeredCreeps !== undefined){
                            return source.registeredCreeps.indexOf(creep.id) > -1
                        }else {
                            return false
                        }
                    })[0]
                    if(source !== undefined){
                        if(Memory.sources[creep.room.name][source.id] !== undefined && Memory.sources[creep.room.name][source.id]["availableSlots"] === 1){
                            output.writeToDebug(creep.name)
                            output.writeToDebug(creep.pos)
                            creep.memory.role = sourceproxy
                            creep.memory.source = source
                        }else{
                            if(index < numberOfBuilder ){
                                creep.memory.role = builder
                                creep.memory.source = source
                            }else if(index < numberOfBuilder+numberOfLoader){
                                creep.memory.role = loader
                                creep.memory.source = source
                            }else if(index < numberOfBuilder+numberOfLoader+2){
                                creep.memory.role = harvester
                                creep.memory.source = source
                            }else{
                                creep.memory.role = upgrader
                                creep.memory.source = source
                            }
                        }
                    }else{
                        creep.memory.role = harvester
                        creep.memory.source = noProxySource
                    }
                    return creep
                })
            }else{
                creeps= creeps.map((creep, index) =>{
                    let source = SourcesToMoveTo.filter(source =>{
                        if(source.registeredCreeps !== undefined){
                            return source.registeredCreeps.indexOf(creep.id) > -1
                        }else {
                            return false
                        }
                    })[0]
                    if(source !== undefined){
                        if(Memory.sources[creep.room.name][source.id] !== undefined && Memory.sources[creep.room.name][source.id]["availableSlots"] === 1){
                            output.writeToDebug(creep.name)
                            output.writeToDebug(creep.pos)
                            creep.memory.role = sourceproxy
                            creep.memory.source = source
                        }else{
                            if(index < numberOfBuilder ){
                                creep.memory.role = builder
                                creep.memory.source = source
                            }else if(index < numberOfBuilder+2){
                                creep.memory.role = upgrader
                                creep.memory.source = source
                            }else{
                                creep.memory.role = harvester
                                creep.memory.source = source
                            }
                        }
                    }else{
                        creep.memory.role = harvester
                        creep.memory.source = noProxySource
                    }
                    return creep
                })
            }
        })
        return creeps
    },
    spawnCreeps: (rooms, spawns, creeps)=>{
        _.map(rooms, room =>{
            _.map(spawns, spawn=>{
                if(room.name === spawn.room.name){
                    let littleCreeps = creeps.filter(creep => creep.memory.type === "little")
                    let mediumCreeps = creeps.filter(creep => creep.memory.type === "medium")
                    let bigCreeps = creeps.filter(creep => creep.memory.type === "big")
                    if(_.size(littleCreeps) < settings.numberLittleCreeps){
                        let creepNumber =generalFunctions.getUnitNumber(littleCreeps)
                        let newName = spawn.createCreep(
                            [WORK,CARRY,MOVE],
                            "LittleCreep-"+creepNumber+"|"+generalFunctions.getRandomID(),
                            {role: settings.generalSettings.roles.harvester, type: "little"}
                        )
                        console.log('Spawning new littleCreep ' + newName+" within the room "+room.name)
                    }

                    if(room.canBuildMediumCreep && _.size(mediumCreeps) < settings.numberMediumCreeps){
                        let mediumCreepNumber =generalFunctions.getUnitNumber(mediumCreeps)
                        let newName = spawn.createCreep(
                            [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],
                            "MediumCreep-"+mediumCreepNumber+"|"+generalFunctions.getRandomID(),
                            {role: settings.generalSettings.roles.harvester, type: "medium"}
                        )
                        console.log('Spawning new mediumCreep ' + newName+" within the room "+room.name)
                    }

                    if(room.canBuildBigCreep && _.size(bigCreeps) < settings.numberBigCreeps){
                        let bigCreepNumber =generalFunctions.getUnitNumber(bigCreeps)
                        let newName = spawn.createCreep(
                            [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
                            "BigCreep-"+bigCreepNumber+"|"+generalFunctions.getRandomID(),
                            {role: settings.generalSettings.roles.harvester, type: "big"}
                        )
                        console.log('Spawning new bigCreep ' + newName+" within the room "+room.name)
                    }
                }
            })
        })
    },
    getAvailableSource: (creep, amountOfCreeps)=>{

        // TODO: Look around the Source if there is a specific number of walls change the workerration
        let sources = creep.room.find(FIND_SOURCES)
        sources = sources.filter(source=> source.energy !== 0)
        let amountOfSources = _.size(sources)
        let maxCreeps = Math.round(amountOfCreeps/amountOfSources)
        sources = sources.map((source, sourceIndex)=>{
            if(source.registeredCreeps === undefined){
                source.registeredCreeps=[]
            }
            if(sourceIndex > 0){
                if(sources[0].registeredCreeps.indexOf(creep.id)  <= -1 && _.size(source.registeredCreeps) < maxCreeps){
                    source.registeredCreeps = [].concat(source.registeredCreeps, creep.id)
                }
            }else{
                if(_.size(source.registeredCreeps) < maxCreeps){
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
            output.writeToDebug(amountOfCreeps)
            sources.map(source => {
                output.writeToDebug(source.registeredCreeps)
            })
            output.writeToDebug(creep.id)
            output.writeToDebug(sourceToReturn)
        }

        return sourceToReturn
    },
    getAvailableSources: (creeps, amountOfCreeps)=>{
        // TODO: Look around the Source if there is a specific number of walls change the workerration

        return creeps.map(creep =>{
            let sources = creep.room.find(FIND_SOURCES)
            sources = sources.filter(source=> source.energy !== 0)
            let amountOfSources = _.size(sources)
            let maxCreeps = Math.round(amountOfCreeps/amountOfSources)

            sources = sources.map((source, sourceIndex)=>{
                if(Memory.sources[creep.room.name][source.id]["availableSlots"] === undefined){
                    output.writeToDebug("Memory.sources[creep.room.name][source.id]['availableSlots'] ist für "+source.id+" undefined")
                    let amountOfSurroundingWalls = 0
                    if (Memory.terrain[creep.room.name][source.pos.x - 1][source.pos.y - 1].terrain[0] === "wall") {
                        amountOfSurroundingWalls += 1
                    }
                    if (Memory.terrain[creep.room.name][source.pos.x][source.pos.y - 1].terrain[0] === "wall") {
                        amountOfSurroundingWalls += 1
                    }
                    if(Memory.terrain[creep.room.name][source.pos.x+1][source.pos.y-1].terrain[0] === "wall"){
                        amountOfSurroundingWalls += 1
                    }
                    if(Memory.terrain[creep.room.name][source.pos.x-1][source.pos.y].terrain[0] === "wall"){
                        amountOfSurroundingWalls += 1
                    }
                    if(Memory.terrain[creep.room.name][source.pos.x+1][source.pos.y].terrain[0] === "wall"){
                        amountOfSurroundingWalls += 1
                    }
                    if(Memory.terrain[creep.room.name][source.pos.x-1][source.pos.y+1].terrain[0] === "wall"){
                        amountOfSurroundingWalls += 1
                    }
                    if(Memory.terrain[creep.room.name][source.pos.x][source.pos.y+1].terrain[0] === "wall"){
                        amountOfSurroundingWalls += 1
                    }
                    if(Memory.terrain[creep.room.name][source.pos.x+1][source.pos.y+1].terrain[0] === "wall"){
                        amountOfSurroundingWalls += 1
                    }
                    // INIT SOURCE IN MEMORY
                    // Memory.sources = {}
                    if(Memory.sources[creep.room.name] === undefined){
                        Memory.sources[creep.room.name] = {}
                    }
                    if(Memory.sources[creep.room.name][source.id] === undefined){
                        Memory.sources[creep.room.name][source.id] = {}
                    }
                    Memory.sources[creep.room.name][source.id]["availableSlots"] = 8 - amountOfSurroundingWalls
                }

                let sourcesWithOneSlot = _.filter(Memory.sources[creep.room.name], source => source["availableSlots"] === 1)
                source.amountOfSupportCreeps = 0
                if(_.size(sourcesWithOneSlot) > 0){
                    if(Memory.sources[creep.room.name][source.id]["availableSlots"] === 1){
                        maxCreeps = 1
                        source.amountOfSupportCreeps = Math.round(amountOfCreeps/amountOfSources) - 1
                    }else {
                        maxCreeps = Math.round(amountOfCreeps/amountOfSources)
                        source.amountOfSupportCreeps = 0
                    }
                }

                if(source.registeredCreeps === undefined){
                    source.registeredCreeps=[]
                }
                if(sourceIndex > 0){
                    if(sources[0].registeredCreeps.indexOf(creep.id)  <= -1 && _.size(source.registeredCreeps) < maxCreeps){
                        source.registeredCreeps = [].concat(source.registeredCreeps, creep.id)
                    }
                }else{
                    if(_.size(source.registeredCreeps) < maxCreeps){
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
                sourceToReturn = sources.map(source => {
                    if(source.amountOfSupportCreeps > 0){
                        let container = source.pos.findClosestByRange(FIND_STRUCTURES,{
                            filter: (structure) => {
                                return structure.structureType === STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity
                            }
                        })
                        if(container.registeredCreeps === undefined){
                            container.registeredCreeps=[]
                        }
                        // if(_.size(container.registeredCreeps) < 3){
                            container.registeredCreeps = [].concat(container.registeredCreeps, creep.id)
                        // }
                        return container
                    }
                })[0]
            }
            return sourceToReturn
        })
    }
}

module.exports = creepsHelp