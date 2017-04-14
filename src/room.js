let towers = require('./tower')

let room = {
    init: (rooms)=>{
        return _.map(rooms, room =>{
            // Run Tower for specific ID
            towers.getTower(room)

            room.canBuildMediumCreep = room.energyAvailable >= 550

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

            console.log("Spawn     in Room "+room.name+" has "+room.energyAvailable+"/"+room.energyCapacityAvailable)
            console.log("Container in Room "+room.name+" has "+energyAmountInContainer+"/"+energyMaxAmountInContainer)
            return room
        })
    }
}

module.exports = room