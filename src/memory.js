let output = require('./output')
let memoryHelper = {
    init: (rooms)=>{
        let subTimeStart=Game.cpu.getUsed();

        _.map(rooms, room =>{
            // INIT CPU DATABASE
            if(Memory.cpu === undefined){Memory.cpu = {}}
            if(Memory.cpu.lengthLastTickTime === undefined){Memory.cpu.lengthLastTickTime = 0}
            if(Memory.cpu.lastTickTime === undefined){Memory.cpu.lastTickTime = []}
            if(Memory.cpu.lastTickTime[0] === undefined){Memory.cpu.lastTickTime[0] = []}

            // INIT TERRAIN DATABASE
            if(Memory.terrain === undefined){Memory.terrain ={}}
            if(Memory.terrain[room.name] === undefined){Memory.terrain[room.name] =[]}
            if(Memory.terrain[room.name][0] === undefined){Memory.terrain[room.name][0] =[]}
            if(Memory.terrain === undefined){Memory.terrain ={}}
            if(Memory.areas === undefined){Memory.areas ={}}
            if(Memory.areas[room.name] === undefined){Memory.areas[room.name] = []}
            if(Memory.terrainX === undefined) {Memory.terrainX = 0}

            // INIT SOURCE DATABASE
            if(Memory.sources === undefined){Memory.sources = {}}
            if(Memory.sources[room.name] === undefined){Memory.sources[room.name] = {}}
            let sources = room.find(FIND_SOURCES)
            _.map(sources, source =>{
                if(Memory.sources[room.name][source.id] === undefined){Memory.sources[room.name][source.id] = {}}
            })

            // INIT PROXYCONTAINER DATABASE
            if(Memory.proxyContainer === undefined){Memory.proxyContainer = {}}
        })
        let duration=(Game.cpu.getUsed()-subTimeStart).toFixed(0);
        output.workTimes("MEMORY INIT TOOK                     "+duration)
        memoryHelper.clear()
    },
    clear:()=>{
        let subTimeStart=Game.cpu.getUsed();
        // Cleanup Memory
        if(_.size(Game.creeps) !== _.size(Memory.creeps)){
            _.map(Memory.creeps, (creep, creepName) =>{
                if(!Game.creeps[creepName]) {
                    delete Memory.creeps[creepName]
                    console.log('Clearing non-existing creep memory: ', creepName)
                }
            })
        }
        let duration=(Game.cpu.getUsed()-subTimeStart).toFixed(0);
        output.workTimes("MEMORY CLEANUP TOOK                  "+duration)
    },
}

module.exports = memoryHelper