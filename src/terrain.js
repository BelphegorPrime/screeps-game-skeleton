let output = require('./output')
let settings = require('./settings')

let terrain = {
    read: (room)=>{
        let lastTick = Memory.cpu.lastTickTime[0][_.size(Memory.cpu.lastTickTime[0])-1]
        let tickBefireLastTick = Memory.cpu.lastTickTime[0][_.size(Memory.cpu.lastTickTime[0])-2]
        if(lastTick >= Game.cpu.limit || tickBefireLastTick >= Game.cpu.limit){
            output.writeToDebug("LastTick with value "+lastTick+" or value "+tickBefireLastTick+" are greater or equal to "+Game.cpu.limit)
            if(Game.cpu.bucket > settings.getGeneralSettings().bucketLimit && lastTick < Game.cpu.limit){
                let iteration = Memory.terrainX
                if(iteration === settings.getGeneralSettings().roomLength){
                    Memory.terrainX = 0
                    iteration = 0
                }

                let data = []
                for (let i = 0; i < settings.getGeneralSettings().roomLength; i++) {
                    data = [].concat(data, {
                        x: iteration,
                        y: i,
                        terrain: room.lookForAt('terrain', iteration, i),
                    })
                }

                Memory.terrain[room.name][iteration] = data
                Memory.areas[room.name] = room.lookAtArea(0, 0, 49, 49, true)
                Memory.terrainX = iteration+1
            }
        }

        return room
    }
}

module.exports = terrain