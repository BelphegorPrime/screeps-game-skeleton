import output from "./output"
import generalFunctions from "./general"
import roleBuilder from "./role.builder"
import roleLoader from "./role.loader"
import settingsHelp from "./settings"
let settings = settingsHelp.getSettingsForLevel()

let creepsHelp = {
    getCreeps: (allCreeps: [Creep], rooms:[Room], constructionSites: [ConstructionSite])=>{
        let subTimeStart:number=Game.cpu.getUsed()
        let creeps:any= _.values(allCreeps)
        let harvester:string = settings.generalSettings.roles.harvester
        let upgrader:string = settings.generalSettings.roles.upgrader
        let builder:string = settings.generalSettings.roles.builder
        let loader:string = settings.generalSettings.roles.loader

        _.map(rooms, (room:Room) =>{
            let SourcesToMoveTo = _(creepsHelp.getAvailableSources(creeps, _.size(allCreeps))).reverse().value()
            let noProxySource = SourcesToMoveTo.filter((source: Source) => source!== undefined && Memory.sources[room.name][source.id] !== undefined && Memory.sources[room.name][source.id]["availableSlots"] !== 1)[0]
            let proxySource = SourcesToMoveTo.filter((source: Source) => source!== undefined && Memory.sources[room.name][source.id] !== undefined && Memory.sources[room.name][source.id]["availableSlots"] === 1)[0]

            if(_.size(creeps) <= settings.minHarvester){
                creeps= creeps.map((creep:Creep) =>{
                    creep.memory.role = harvester
                    creep.memory.source = noProxySource
                    creep.memory.fallbackSource = noProxySource
                    creep.memory.proxysource = proxySource
                    return creep
                })
                return creeps
            }

            let numberOfBuilder = roleBuilder.getNumberOfBuilder(constructionSites)
            let numberOfLoader = roleLoader.getNumberOfLoader(room)
            let notFullContainer = room.containerToTransfer.filter((container:Container|Structure) => !container.isFull)
            let containers = room.find(FIND_STRUCTURES, {
                filter: (structure: Container|Structure) => {
                    return structure.structureType === "container" && structure.registeredCreeps === undefined
                }
            })

            if(room.energyAvailable >= settings.generalSettings.costs.little*2 && (_.size(notFullContainer) > 0 || _.size(containers) === 0)){
                creeps = creeps.map((creep:Creep, index:number) =>{
                    let source = SourcesToMoveTo.filter((source:Source|Structure) =>{
                        if(source.registeredCreeps !== undefined){
                            return source.registeredCreeps.indexOf(creep.id) > -1
                        }else {
                            return false
                        }
                    })[0]
                    if(source !== undefined){
                        if(creep.memory.type === settings.generalSettings.roles.sourceproxy && Memory.sources[creep.room.name][source.id] !== undefined && Memory.sources[creep.room.name][source.id]["availableSlots"] === 1){
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
                creeps= creeps.map((creep:Creep, index:number) =>{
                    let source:Source = SourcesToMoveTo.filter((source:Source):boolean =>{
                        if(source !== undefined && source.registeredCreeps !== undefined){
                            return source.registeredCreeps.indexOf(creep.id) > -1
                        }else {
                            return false
                        }
                    })[0]
                    if(source !== undefined){
                        if(creep.memory.type === settings.generalSettings.roles.sourceproxy &&  Memory.sources[creep.room.name][source.id] !== undefined && Memory.sources[creep.room.name][source.id]["availableSlots"] === 1){
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
        let duration=(Game.cpu.getUsed()-subTimeStart).toFixed(0);
        output.workTimes("CREEPS GET ROLE TOOK                 "+duration)
        return creeps
    },
    spawnCreeps: (rooms:Room[], spawns:Spawn[], creeps:Creep[]):void => {
        let subTimeStart:number = Game.cpu.getUsed();
        _.map(rooms, (room:Room) =>{
            _.map(spawns, (spawn:Spawn) =>{
                if(room.name === spawn.room.name){
                    let littleCreeps:Creep[] = creeps.filter(creep => creep.memory.type === "little")
                    let mediumCreeps:Creep[] = creeps.filter(creep => creep.memory.type === "medium")
                    let bigCreeps:Creep[] = creeps.filter(creep => creep.memory.type === "big")
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
                        let mediumCreepNumber:number = generalFunctions.getUnitNumber(mediumCreeps)
                        let newName:string|number = spawn.createCreep(
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
        let duration=(Game.cpu.getUsed()-subTimeStart).toFixed(0);
        output.workTimes("SPAWN CREEPS TOOK                    "+duration)
    },
    spawnSourceProxy: (rooms:Room[], spawns:Spawn[], creeps:Creep[])=>{
        _.map(rooms, (room:Room) =>{
            _.map(spawns, (spawn:Spawn)=>{
                let sourcesWithOneSlot:Source[] = _.filter(Memory.sources[room.name], (source:Source) => source["availableSlots"] === 1)
                if(_.size(sourcesWithOneSlot) > 0){
                    let amountOfSourceproxyCreeps:number = _.size(_.filter(creeps, (creep:Creep):boolean => creep.memory.type === "sourceproxy"))
                    output.writeToDebug(amountOfSourceproxyCreeps)
                    if(room.canBuildBigCreep && _.size(creeps)>3 && amountOfSourceproxyCreeps === 0){
                        spawn.createCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],"sourceproxy",{role: "sourceproxy", type: "sourceproxy"})
                        output.writeToDebug("Spawning new Big SOURCEPROXY within the room "+room.name)
                    }else{
                        if(room.canBuildMediumCreep && _.size(creeps)>3 && amountOfSourceproxyCreeps === 0){
                            spawn.createCreep([WORK,WORK,WORK,CARRY,MOVE],"sourceproxy",{role: "sourceproxy", type: "sourceproxy"})
                            output.writeToDebug("Spawning new Medium SOURCEPROXY within the room "+room.name)
                        }else {
                            if(_.size(creeps)>3 && amountOfSourceproxyCreeps === 0){
                                spawn.createCreep([WORK,WORK,CARRY,MOVE],"sourceproxy",{role: "sourceproxy", type: "sourceproxy"})
                                output.writeToDebug("Spawning new Little SOURCEPROXY within the room "+room.name)
                            }
                        }
                    }
                }
            })
        })
    },
    getAvailableSources: (creeps:Creep[], amountOfCreeps: number):(Source|Container)[] =>{
        let proxyCreeps:Creep[] = _.filter(creeps, (creep:Creep):boolean => creep.memory.type === settings.generalSettings.roles.sourceproxy)
        let proxyCreepPresent:boolean = !!_.size(proxyCreeps)
        let proxyCreep:any = {}
        if(!proxyCreepPresent){
            creepsHelp.spawnSourceProxy(Game.rooms , Game.spawns, creeps)
        }else{
            proxyCreep = proxyCreeps[0]
        }

        return creeps.map((creep:Creep) =>{
            let sources:Source[] = creep.room.find<Source>(FIND_SOURCES)
            sources = sources.filter((source:Source)=> source.energy !== 0)
            let amountOfSources = _.size(sources)
            let maxCreeps = Math.round(amountOfCreeps/amountOfSources)

            sources = sources.map((source: Source, sourceIndex)=>{
                if(Memory.sources[creep.room.name][source.id]["availableSlots"] === undefined){
                    output.writeToDebug("Memory.sources[creep.room.name][source.id]['availableSlots'] ist für "+source.id+" undefined")
                    let amountOfSurroundingWalls = 0
                    if(Memory.terrain[creep.room.name][source.pos.x - 1] !== undefined &&
                        Memory.terrain[creep.room.name][source.pos.x] !== undefined &&
                        Memory.terrain[creep.room.name][source.pos.x + 1] !== undefined){

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
                    }

                    Memory.sources[creep.room.name][source.id]["availableSlots"] = 8 - amountOfSurroundingWalls
                }

                let sourcesWithOneSlot = _.filter(Memory.sources[creep.room.name], (source:Source) => source["availableSlots"] === 1)
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

            let sourceToReturn:Source|Container = sources.filter((source:Source) => {
                return source.registeredCreeps.indexOf(creep.id) > -1
            })[0]

            // when creep has no Source write informations to console.log
            if(sourceToReturn === undefined){
                sourceToReturn = sources.map((source:Source) => {
                    if(source.amountOfSupportCreeps > 0){
                        let container:Container = source.pos.findClosestByRange<Container>(FIND_STRUCTURES,{
                            filter: (structure:Container) => {
                                return structure.structureType === "container"
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

export default creepsHelp