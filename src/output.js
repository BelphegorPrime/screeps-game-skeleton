let tickMessage = "\n"
let debugText = "\n"
let output = {

    energyInRooms: (rooms)=>{
        let rows = _.map(rooms, room => {
            let energyAmountInContainer = 0
            let energyMaxAmountInContainer = 0
            room.find(FIND_STRUCTURES, {
                filter: (structure) => {return structure.structureType === STRUCTURE_CONTAINER}
            }).map(container =>{
                energyAmountInContainer += container.store[RESOURCE_ENERGY]
                energyMaxAmountInContainer += container.storeCapacity
            })
            return room.name+"   | "+room.energyAvailable + "/" + room.energyCapacityAvailable+"     | "
                    +energyAmountInContainer + "/" + energyMaxAmountInContainer+
                    "            |                  |                 |"
        })
        tickMessage += "ROOMNAME | ROOM_ENERGY | CONTAINER_ENERGY  |                  |                 |\n"+rows+"\n"
    },
    showCreepRoles: (rooms, creeps, settingsRoles)=>{
        let amountOfLittleHarvester = 0
        let amountOfLittleUpgrader = 0
        let amountOfLittleBuilder = 0
        let amountOfLittleLoader = 0
        let amountOfLittleSourceproxy = 0
        let amountOfMediumHarvester = 0
        let amountOfMediumUpgrader = 0
        let amountOfMediumBuilder = 0
        let amountOfMediumLoader = 0
        let amountOfMediumSourceproxy = 0
        let amountOfBigHarvester = 0
        let amountOfBigUpgrader = 0
        let amountOfBigBuilder = 0
        let amountOfBigLoader = 0
        let amountOfBigSourceproxy = 0

        _.map(creeps, creep =>{
            if(creep.memory.type === "little"){
                if(creep.memory.role === settingsRoles.harvester){
                    amountOfLittleHarvester += 1
                }
                if(creep.memory.role === settingsRoles.upgrader){
                    amountOfLittleUpgrader += 1
                }
                if(creep.memory.role === settingsRoles.builder){
                    amountOfLittleBuilder += 1
                }
                if(creep.memory.role === settingsRoles.loader){
                    amountOfLittleLoader += 1
                }
                if(creep.memory.role === settingsRoles.sourceproxy){
                    amountOfLittleSourceproxy += 1
                }
            }else if(creep.memory.type === "medium"){
                if(creep.memory.role === settingsRoles.harvester){
                    amountOfMediumHarvester += 1
                }
                if(creep.memory.role === settingsRoles.upgrader){
                    amountOfMediumUpgrader += 1
                }
                if(creep.memory.role === settingsRoles.builder){
                    amountOfMediumBuilder += 1
                }
                if(creep.memory.role === settingsRoles.loader){
                    amountOfMediumLoader += 1
                }
                if(creep.memory.role === settingsRoles.sourceproxy){
                    amountOfMediumSourceproxy += 1
                }
            }else if(creep.memory.type === "big"){
                if(creep.memory.role === settingsRoles.harvester){
                    amountOfBigHarvester += 1
                }
                if(creep.memory.role === settingsRoles.upgrader){
                    amountOfBigUpgrader += 1
                }
                if(creep.memory.role === settingsRoles.builder){
                    amountOfBigBuilder += 1
                }
                if(creep.memory.role === settingsRoles.loader){
                    amountOfBigLoader += 1
                }
                if(creep.memory.role === settingsRoles.sourceproxy){
                    amountOfBigSourceproxy += 1
                }
            }
        })

        let rows = _.map(rooms, room => {

            let harvesterSum = amountOfLittleHarvester+amountOfMediumHarvester+amountOfBigHarvester
            let upgraderSum = amountOfLittleUpgrader+amountOfMediumUpgrader+amountOfBigUpgrader
            let builderSum = amountOfLittleBuilder+amountOfMediumBuilder+amountOfBigBuilder
            let loaderSum = amountOfLittleLoader+amountOfMediumLoader+amountOfBigLoader
            let sourceproxySum = amountOfLittleSourceproxy+amountOfMediumSourceproxy+amountOfBigSourceproxy

            let littleSum = amountOfLittleHarvester+amountOfLittleUpgrader+amountOfLittleBuilder+amountOfLittleLoader+amountOfLittleSourceproxy
            let mediumSum = amountOfMediumHarvester+amountOfMediumUpgrader+amountOfMediumBuilder+amountOfMediumLoader+amountOfMediumSourceproxy
            let bigSum    = amountOfBigHarvester+amountOfBigUpgrader+amountOfBigBuilder+amountOfBigLoader+amountOfBigSourceproxy

            let littleRow = room.name+"   | LITTLE:     |         "+amountOfLittleHarvester+"         |        "+amountOfLittleUpgrader+"         |        "+amountOfLittleBuilder+"        |         "+amountOfLittleLoader+"        |         "+amountOfLittleSourceproxy+"        |         "+littleSum+"\n"
            let mediumRow =     "         | MEDIUM:     |         "+amountOfMediumHarvester+"         |        "+amountOfMediumUpgrader+"         |        "+amountOfMediumBuilder+"        |         "+amountOfMediumLoader+"        |         "+amountOfMediumSourceproxy+"        |         "+mediumSum+"\n"
            let bigRow    =     "         | BIG:        |         "+amountOfBigHarvester   +"         |        "+amountOfBigUpgrader   +"         |        "+amountOfBigBuilder   +"        |         "+amountOfBigLoader   +"        |         "+amountOfBigSourceproxy   +"        |         "+bigSum+"\n"
            let summRow   =     "         |             |         "+harvesterSum           +"         |        "+upgraderSum           +"         |        "+builderSum           +"        |         "+loaderSum           +"        |         "+sourceproxySum           +"        |         "

            return littleRow + mediumRow + bigRow + summRow
        })

        tickMessage += "         |     TYPE    |     HARVESTER     |     UPGRADER     |     BUILDER     |      LOADER      |    SOURCEPROXY   |\n"+rows +"\n"
    },
    writeCPU: (cpu) =>{
        tickMessage += "CPU-Limit: "+cpu.limit + " | Tick-Limit: "+ cpu.tickLimit+ " | Bucket: "+ cpu.bucket+"\n"
    },
    allDuration: (duration)=>{
        tickMessage += "All dt: "+duration+"\n"
    },
    writeToDebug: (text)=>{
        debugText += JSON.stringify(text)+"\n"
    },
    resetLog: ()=>{
        tickMessage = "\n"
        debugText = "\n"
    },
    writeLog: ()=>{
        console.log(tickMessage+debugText)
        output.resetLog()
    }
}

module.exports = output