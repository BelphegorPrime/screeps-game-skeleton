let creeps = {

    getCreeps: (amountOfBuilder)=>{
        let creeps = []
        _.map(Game.rooms, room =>{
            if(room.energyAvailable === room.energyCapacityAvailable){
                creeps = Object.keys(Game.creeps).map((creepName, index) =>{
                    let sources = Game.creeps[creepName].room.find(FIND_SOURCES);
                    if(index < amountOfBuilder ){
                        Game.creeps[creepName].memory.role = "builder"
                        Game.creeps[creepName].memory.source = sources[0]
                    }else{
                        Game.creeps[creepName].memory.role = "upgrader"
                        Game.creeps[creepName].memory.source = sources[1]
                    }
                    return Game.creeps[creepName]
                })
            }else{
                creeps = Object.keys(Game.creeps).map((creepName, index) =>{
                    let sources = Game.creeps[creepName].room.find(FIND_SOURCES);
                    if(index <= amountOfBuilder ){
                        Game.creeps[creepName].memory.role = "builder"
                        Game.creeps[creepName].memory.source = sources[0]
                    }else if(index <= amountOfBuilder+2){
                        Game.creeps[creepName].memory.role = "upgrader"
                        Game.creeps[creepName].memory.source = sources[0]
                    }else{
                        Game.creeps[creepName].memory.role = "harvester"
                        Game.creeps[creepName].memory.source = sources[1]
                    }
                    return Game.creeps[creepName]
                })
            }
        })
        return creeps
    }
};

module.exports = creeps;