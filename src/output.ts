let tickMessage = "\n"
let debugText = "\n"
let workTimes = "\n"
let output = {

    energyInRooms: (rooms:[Room])=>{
        let rows = _.map(rooms, room => {
            let energyAmountInContainer = 0
            let energyMaxAmountInContainer = 0
            room.find(FIND_STRUCTURES, {
                filter: (structure:Container|Structure) => {return structure.structureType === "container"}
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
    showCreepRoles: (rooms:[Room], creeps:[Creep], settingsRoles: object)=>{
        let amountOfLittleHarvester = 0
        let amountOfLittleUpgrader = 0
        let amountOfLittleBuilder = 0
        let amountOfLittleLoader = 0
        let amountOfMediumHarvester = 0
        let amountOfMediumUpgrader = 0
        let amountOfMediumBuilder = 0
        let amountOfMediumLoader = 0
        let amountOfBigHarvester = 0
        let amountOfBigUpgrader = 0
        let amountOfBigBuilder = 0
        let amountOfBigLoader = 0
        let amountOfSourceproxy = 0

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
            }

            if(creep.memory.type === settingsRoles.sourceproxy){
                amountOfSourceproxy += 1
            }
        })

        let rows = _.map(rooms, room => {

            let harvesterSum = amountOfLittleHarvester+amountOfMediumHarvester+amountOfBigHarvester
            let upgraderSum = amountOfLittleUpgrader+amountOfMediumUpgrader+amountOfBigUpgrader
            let builderSum = amountOfLittleBuilder+amountOfMediumBuilder+amountOfBigBuilder
            let loaderSum = amountOfLittleLoader+amountOfMediumLoader+amountOfBigLoader
            let sourceproxySum = amountOfSourceproxy

            let littleSum = amountOfLittleHarvester+amountOfLittleUpgrader+amountOfLittleBuilder+amountOfLittleLoader
            let mediumSum = amountOfMediumHarvester+amountOfMediumUpgrader+amountOfMediumBuilder+amountOfMediumLoader
            let bigSum    = amountOfBigHarvester+amountOfBigUpgrader+amountOfBigBuilder+amountOfBigLoader

            let littleRow         = room.name+"   | LITTLE:     |         "+amountOfLittleHarvester+"         |        "+amountOfLittleUpgrader+"         |        "+amountOfLittleBuilder+"        |         "+amountOfLittleLoader+"        |         "+" "                +"        |         "+littleSum+"\n"
            let mediumRow         =     "         | MEDIUM:     |         "+amountOfMediumHarvester+"         |        "+amountOfMediumUpgrader+"         |        "+amountOfMediumBuilder+"        |         "+amountOfMediumLoader+"        |         "+" "                +"        |         "+mediumSum+"\n"
            let bigRow            =     "         | BIG:        |         "+amountOfBigHarvester   +"         |        "+amountOfBigUpgrader   +"         |        "+amountOfBigBuilder   +"        |         "+amountOfBigLoader   +"        |         "+" "                +"        |         "+bigSum+"\n"
            let sourceProxyRow    =     "         | PROXY:      |         "+" "                    +"         |        "+" "                   +"         |        "+" "                  +"        |         "+" "                 +"        |         "+amountOfSourceproxy+"        |         "+sourceproxySum+"\n"
            let summRow           =     "         |             |         "+harvesterSum           +"         |        "+upgraderSum           +"         |        "+builderSum           +"        |         "+loaderSum           +"        |         "+sourceproxySum     +"        |         "

            return littleRow + mediumRow + bigRow + sourceProxyRow + summRow
        })

        tickMessage += "         |     TYPE    |     HARVESTER     |     UPGRADER     |     BUILDER     |      LOADER      |    SOURCEPROXY   |\n"+rows +"\n"
    },
    writeCPU: (cpu: CPU) =>{
        tickMessage += "CPU-Limit: "+cpu.limit + " | Tick-Limit: "+ cpu.tickLimit+ " | Bucket: "+ cpu.bucket+"\n"
    },
    writeToDebug: (text: string)=>{
        debugText += JSON.stringify(text)+"\n"
    },
    workTimes: (text:string)=>{
        workTimes += text+"\n"
    },
    resetLog: ()=>{
        tickMessage = "\n"
        debugText = "\n"
        workTimes = "\n"
    },
    writeLog: ()=>{
        console.log(tickMessage+workTimes+debugText)
        output.resetLog()
    }
}

module.exports = output