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

        _.map(rooms, room =>{

            let SourcesToMoveTo = _(creepsHelp.getAvailableSources(creeps, _.size(allCreeps))).reverse().value()
            let noProxySource = SourcesToMoveTo.filter(source => source!== undefined && Memory.sources[room.name][source.id] !== undefined && Memory.sources[room.name][source.id]["availableSlots"] !== 1)[0]
            let proxySource = SourcesToMoveTo.filter(source => source!== undefined && Memory.sources[room.name][source.id] !== undefined && Memory.sources[room.name][source.id]["availableSlots"] === 1)[0]
            let sourceproxyCreeps = _.filter(creeps, creep => creep.memory.type === "sourceproxy")

            if(_.size(creeps) <= 3){
                creeps= creeps.map(creep =>{
                    creep.memory.role = harvester
                    creep.memory.source = noProxySource
                    creep.memory.fallbackSource = noProxySource
                    creep.memory.proxysource = proxySource
                    return creep
                })
                return creeps
            }

            let numberOfBuilder = roleBuilder.getNumberOfBuilder(constructionSites)
            let notFullContainer = room.containerToTransfer.filter(container => !container.isFull)
            let containers = room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType === STRUCTURE_CONTAINER && structure.registeredCreeps === undefined
                }
            })

            if(room.energyAvailable >= settings.generalSettings.costs.little*2 && (_.size(notFullContainer) > 0 || _.size(containers) === 0)){
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
                        if(creep.memory.type === settings.generalSettings.roles.sourceproxy && Memory.sources[creep.room.name][source.id] !== undefined && Memory.sources[creep.room.name][source.id]["availableSlots"] === 1){
                            output.writeToDebug(creep.name)
                            output.writeToDebug(creep.pos)
                            creep.memory.role = settings.generalSettings.roles.sourceproxy
                            creep.memory.source = source
                            creep.memory.fallbackSource = noProxySource
                            creep.memory.proxysource = proxySource
                        }else{
                            if(index < numberOfBuilder ){
                                creep.memory.role = builder
                                creep.memory.source = source
                                creep.memory.fallbackSource = noProxySource
                                creep.memory.proxysource = proxySource
                            }else if(index < numberOfBuilder+numberOfLoader){
                                creep.memory.role = loader
                                creep.memory.source = source
                                creep.memory.fallbackSource = noProxySource
                                creep.memory.proxysource = proxySource
                            }else if(index < numberOfBuilder+numberOfLoader+2){
                                creep.memory.role = harvester
                                creep.memory.source = source
                                creep.memory.fallbackSource = noProxySource
                                creep.memory.proxysource = proxySource
                            }else{
                                creep.memory.role = upgrader
                                creep.memory.source = source
                                creep.memory.fallbackSource = noProxySource
                                creep.memory.proxysource = proxySource
                            }
                        }
                    }else{
                        creep.memory.role = upgrader
                        creep.memory.source = noProxySource
                        creep.memory.fallbackSource = noProxySource
                        creep.memory.proxysource = proxySource
                    }
                    return creep
                })
            }else{
                creeps= creeps.map((creep, index) =>{
                    let source = SourcesToMoveTo.filter(source =>{
                        if(source !== undefined && source.registeredCreeps !== undefined){
                            return source.registeredCreeps.indexOf(creep.id) > -1
                        }else {
                            return false
                        }
                    })[0]
                    if(source !== undefined){
                        if(creep.memory.type === settings.generalSettings.roles.sourceproxy &&  Memory.sources[creep.room.name][source.id] !== undefined && Memory.sources[creep.room.name][source.id]["availableSlots"] === 1){
                            output.writeToDebug(creep.name)
                            output.writeToDebug(creep.pos)
                            creep.memory.role = settings.generalSettings.roles.sourceproxy
                            creep.memory.source = source
                            creep.memory.fallbackSource = noProxySource
                            creep.memory.proxysource = proxySource
                        }else{
                            if(index < numberOfBuilder ){
                                creep.memory.role = builder
                                creep.memory.source = source
                                creep.memory.fallbackSource = noProxySource
                                creep.memory.proxysource = proxySource
                            }else if(index < numberOfBuilder+2){
                                creep.memory.role = upgrader
                                creep.memory.source = source
                                creep.memory.fallbackSource = noProxySource
                                creep.memory.proxysource = proxySource
                            }else{
                                creep.memory.role = harvester
                                creep.memory.source = source
                                creep.memory.fallbackSource = noProxySource
                                creep.memory.proxysource = proxySource
                            }
                        }
                    }else{
                        creep.memory.role = harvester
                        creep.memory.source = noProxySource
                        creep.memory.fallbackSource = noProxySource
                        creep.memory.proxysource = proxySource
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
    spawnSourceProxy: (room, spawn, creeps)=>{
        let sourcesWithOneSlot = _.filter(Memory.sources[room.name], source => source["availableSlots"] === 1)
        if(_.size(sourcesWithOneSlot) > 0){
            let amountOfSourceproxyCreeps = _.size(_.filter(creeps, creep => creep.memory.type === "sourceproxy"))
            output.writeToDebug(amountOfSourceproxyCreeps)
            if(room.canBuildBigCreep && _.size(creeps)>3 && amountOfSourceproxyCreeps === 0){
                spawn.createCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],"sourceproxy",{role: "sourceproxy", type: "sourceproxy"})
                output.writeToDebug("Spawning new Big SOURCEPROXY within the room "+room.name)
            }else{
                if(room.canBuildMediumCreep && _.size(creeps)>3 && amountOfSourceproxyCreeps === 0){
                    spawn.createCreep([WORK,WORK,WORK,CARRY,MOVE],"sourceproxy",{role: "sourceproxy", type: "sourceproxy"})
                    output.writeToDebug("Spawning new Medium SOURCEPROXY within the room "+room.name)
                }
            }
        }
    },
    getAvailableSources: (creeps, amountOfCreeps)=>{
        let proxyCreeps= _.filter(creeps, creep => creep.memory.type === settings.generalSettings.roles.sourceproxy)
        let proxyCreepPresent = !!_.size(proxyCreeps)
        let proxyCreep = {}
        if(!proxyCreepPresent){
            creepsHelp.spawnSourceProxy(creeps[0].room, Game.spawns['Spawn1'], creeps)
        }else{
            proxyCreep = proxyCreeps[0]
        }

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
                    if(maxCreeps===1){
                        if(proxyCreepPresent && proxyCreep.id !== undefined && creep.memory.type === settings.generalSettings.roles.sourceproxy){
                            source.registeredCreeps = [].concat(source.registeredCreeps, creep.id)
                        }
                    }
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
                                return structure.structureType === STRUCTURE_CONTAINER
                            }
                        })
                        if(container !== null){
                            if(container.registeredCreeps === undefined){
                                container.registeredCreeps=[]
                            }
                            // if(_.size(container.registeredCreeps) < 3){
                                container.registeredCreeps = [].concat(container.registeredCreeps, creep.id)
                            // }

                            Memory.proxyContainer.id = container.id
                            return container
                        }
                    }
                })[0]
            }
            return sourceToReturn
        })
    }
}

module.exports = creepsHelp