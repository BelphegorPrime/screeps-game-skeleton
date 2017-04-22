import output from "./output"
import routerHelper from "./router"

let roleSourceProxy = {
    run: (creep:Creep) =>{
        if(creep.carry.energy === creep.carryCapacity && creep.carry.energy >= 50) {
            let container:Container = creep.pos.findClosestByRange<Container>(FIND_STRUCTURES, {
                filter: function(structure:Container) {
                    return structure.structureType === "container" && structure.store[RESOURCE_ENERGY] < structure.storeCapacity
                }
            });
            if(container !== null){
                if(creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    routerHelper.routeCreep(creep, container, {stroke: '#ffffff'})
                }
            }else{
                let target:Extension|Spawn = creep.pos.findClosestByRange<Extension|Spawn>(FIND_STRUCTURES, {
                    filter: (structure:Extension|Spawn) => {
                        return (structure.structureType === STRUCTURE_EXTENSION ||
                            structure.structureType === STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity
                    }
                })
                if(target!==null){
                    if(creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        routerHelper.routeCreep(creep, target, {stroke: '#ffffff'})
                    }
                }
            }
        } else {
            if(creep.harvest(creep.memory.source) === ERR_NOT_IN_RANGE) {
                routerHelper.routeCreep(creep, creep.memory.source, {stroke: '#ffaa00'})
            }
        }
    }
}

export default roleSourceProxy