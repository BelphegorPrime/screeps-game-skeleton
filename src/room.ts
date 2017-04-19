import output from "./output"
import towers from "./tower"
import terrain from "./terrain"
import settingsHelp from "./settings"

let settings = settingsHelp.getSettingsForLevel()

let roomHelp = {
    init: (rooms:Room[]):Room[] => {
        let subTimeStart:number = Game.cpu.getUsed();
        output.energyInRooms(rooms)
        let returnvalue:Room[] =  _.map(rooms, (room:Room) =>{
            // Set amount of enemys in a room
            let closestHostiles = room.find(FIND_HOSTILE_CREEPS)
            Memory.enemys[room.name] = _.size(closestHostiles)

            // Run Tower for specific ID
            towers.getTower(room)
            room = terrain.read(room)

            room.canBuildMediumCreep = room.energyAvailable >= settings.generalSettings.costs.medium
            room.canBuildBigCreep = room.energyAvailable >= settings.generalSettings.costs.big

            let containers:Container[] = room.find<Container>(FIND_STRUCTURES, {
                filter: (structure:Container) => {
                    return structure.structureType === "container"
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
            containers.map((container:Container) =>{
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
        output.workTimes("ROOM INIT TOOK                       "+duration)
        return returnvalue
    }
}

export default roomHelp