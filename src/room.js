let output = require('./output')
let towers = require('./tower')
let terrain = require('./terrain')

let settings = require('./settings').getSettingsForLevel()

let room = {
    init: (rooms)=>{
        let subTimeStart=Game.cpu.getUsed();
        output.energyInRooms(rooms)
        let returnvalue =  _.map(rooms, room =>{
            // Run Tower for specific ID
            towers.getTower(room)
            room = terrain.read(room)

            room.canBuildMediumCreep = room.energyAvailable >= settings.generalSettings.costs.medium
            room.canBuildBigCreep = room.energyAvailable >= settings.generalSettings.costs.big

            let containers = room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType === STRUCTURE_CONTAINER
                }
            })

            if(room.containerToTransfer === undefined){
                room.containerToTransfer = []
            }
            if(room.containerToGetFrom === undefined){
                room.containerToGetFrom = []
            }

            let energyAmountInContainer = 0
            let energyMaxAmountInContainer = 0
            containers.map(container =>{
                let containerData = [{
                    "pos":container.pos,
                    "isFull": true
                }]
                if(container.id !== Memory.proxyContainer.id){
                    if(container.store[RESOURCE_ENERGY] < container.storeCapacity) {
                        containerData[0].isFull = false
                        room.containerToTransfer = [].concat(room.containerToTransfer, containerData)
                    }
                    if(container.store[RESOURCE_ENERGY] > 0){
                        room.containerToGetFrom = [].concat(room.containerToGetFrom, containerData)
                    }
                }

                energyAmountInContainer += container.store[RESOURCE_ENERGY]
                energyMaxAmountInContainer += container.storeCapacity
            })
            return room
        })
        let duration=(Game.cpu.getUsed()-subTimeStart).toFixed(0);
        output.writeToDebug("ROOM INIT TOOK                       "+duration)
        return returnvalue
    }
}

module.exports = room