let towers = require('./tower')
let settings = require('./settings').getSettingsForLevel()
let output = require('./output')

let room = {
    init: (rooms)=>{
        output.energyInRooms(rooms)
        return _.map(rooms, room =>{
            // Run Tower for specific ID
            towers.getTower(room)

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
                    "pos":container.pos
                }]
                if(container.store[RESOURCE_ENERGY] < container.storeCapacity) {
                    room.containerToTransfer = [].concat(room.containerToTransfer, containerData)
                }
                if(container.store[RESOURCE_ENERGY] > 0){
                    room.containerToGetFrom = [].concat(room.containerToGetFrom, containerData)
                }
                energyAmountInContainer += container.store[RESOURCE_ENERGY]
                energyMaxAmountInContainer += container.storeCapacity
            })

            return room
        })
    }
}

module.exports = room