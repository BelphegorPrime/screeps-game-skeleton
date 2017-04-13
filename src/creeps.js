let creeps = {

    getCreeps: (amountOfBuilder)=>{
        let littleCreeps = _.filter(Game.creeps, creep => creep.name.indexOf("big") === -1)
        _.map(Game.rooms, room =>{
            if(room.energyAvailable === room.energyCapacityAvailable){

                littleCreeps= littleCreeps.map((creep, index) =>{
                    let sources = creep.room.find(FIND_SOURCES);
                    if(index < amountOfBuilder ){
                        creep.memory.role = "builder"
                        creep.memory.source = sources[0]
                    }else{
                        creep.memory.role = "upgrader"
                        creep.memory.source = sources[1]
                    }
                    return creep
                })

                // creeps = Object.keys(Game.creeps).map((creepName, index) =>{
                //     let sources = Game.creeps[creepName].room.find(FIND_SOURCES);
                //     if(index < amountOfBuilder ){
                //         Game.creeps[creepName].memory.role = "builder"
                //         Game.creeps[creepName].memory.source = sources[0]
                //     }else{
                //         Game.creeps[creepName].memory.role = "upgrader"
                //         Game.creeps[creepName].memory.source = sources[1]
                //     }
                //     return Game.creeps[creepName]
                // })
            }else{
                littleCreeps= littleCreeps.map((creep, index) =>{
                    let sources = creep.room.find(FIND_SOURCES);
                    if(index < amountOfBuilder ){
                        creep.memory.role = "builder"
                        creep.memory.source = sources[0]
                    }else if(index < amountOfBuilder+2){
                        creep.memory.role = "upgrader"
                        creep.memory.source = sources[0]
                    }else{
                        creep.memory.role = "harvester"
                        creep.memory.source = sources[1]
                    }
                    return creep
                })
                
                // creeps = Object.keys(Game.creeps).map((creepName, index) =>{
                //     let sources = Game.creeps[creepName].room.find(FIND_SOURCES);
                //     if(index < amountOfBuilder ){
                //         Game.creeps[creepName].memory.role = "builder"
                //         Game.creeps[creepName].memory.source = sources[0]
                //     }else if(index < amountOfBuilder+2){
                //         Game.creeps[creepName].memory.role = "upgrader"
                //         Game.creeps[creepName].memory.source = sources[0]
                //     }else{
                //         Game.creeps[creepName].memory.role = "harvester"
                //         Game.creeps[creepName].memory.source = sources[1]
                //     }
                //     return Game.creeps[creepName]
                // })
            }
        })
        return littleCreeps
    }
};

module.exports = creeps;