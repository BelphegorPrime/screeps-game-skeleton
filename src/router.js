let output = require('./output')
//TODO Implement own cache for routes
let router = {
    routeCreepOld: (creep, dest)=>{
        if(creep.fatigue>0){
            return -1;
        }
        if(typeof dest === "undefined"){
            return -1;
        }
        let locStr = creep.room.name+"."+creep.pos.x+"."+creep.pos.y
        let path = false;

        if(typeof Memory.routeCache !== "object"){
            Memory.routeCache = {};
        }

        if(typeof Memory.routeCache[locStr] === "undefined"){
            Memory.routeCache[locStr] = {
                'dests':{},
                'established':Game.time
            }
        }
        if(typeof Memory.routeCache[locStr]['dests'][''+dest.id] === "undefined"){
            Memory.routeCache[locStr]['dests'][dest.id] = {
                1:0,2:0,3:0,4:0,
                5:0,6:0,7:0,8:0
            };
            path = creep.room.findPath(creep.pos,dest.pos,{maxOps:500,heuristicWeight:2})
            if(typeof path[0] !== "undefined"){
                Memory.routeCache[locStr]['dests'][''+dest.id][path[0].direction]+=1;
                for(let i =0;i<path.length-1;i++){
                    let step = path[i];
                    let stepStr = creep.room.name+"."+step.x+"."+step.y//creep.room.name+"."+step.x+"."+step.y
                    if(typeof Memory.routeCache[stepStr] === "undefined"){
                        Memory.routeCache[stepStr] = {'dests':{},'established':Game.time,'usefreq':0.0};
                    }
                    if(typeof Memory.routeCache[stepStr]['dests'][''+dest.id] === "undefined"){
                        Memory.routeCache[stepStr]['dests'][''+dest.id] = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0};
                    }
                    output.writeToDebug(path[i+1].direction);
                    Memory.routeCache[stepStr]['dests'][''+dest.id][path[i+1].direction]+=1;
                }
            }else{
                dir = Math.floor(Math.random()*8);
                return creep.move(dir);
            }
        }

        _.map(Memory.routeCache[locStr]['dests'], k=>{
            if(Game.getObjectById(k)=== null){//clean out invalid routes
                delete  Memory.routeCache[locStr]['dests'][k];
                output.writeToDebug(k)
            }
        })

        let total = 0.0//pick from the weighted list of steps
        for(let d in Memory.routeCache[locStr]['dests'][''+dest.id]){
            total+=Memory.routeCache[locStr]['dests'][''+dest.id][d];
        }
        total=total*Math.random();

        let dir = 0;
        _.map(Memory.routeCache[locStr]['dests'][''+dest.id], d=>{
            total-=Memory.routeCache[locStr]['dests'][''+dest.id][d];
            if(total<0){
                dir = d;
            }
        })
        // if(creep.pos.getRangeTo(dest)>1 && pathisBlocked(creep.pos,dir)){ //you will need your own "pathisBlocked" function!
        if(creep.pos.getRangeTo(dest)>1){ //you will need your own "pathisBlocked" function!
            dir = Math.floor(Math.random()*8);
        }
        return creep.move(dir);
    },
    routeCreep: (creep, target, visual)=>{
        // output.writeToDebug(visual)
        // if(!creep.memory.path) {
            let path = creep.pos.findPathTo(target, _.merge(visual, {maxOps: 200}));
            if( !path.length) {
                path = creep.pos.findPathTo(target, _.merge(visual, {maxOps: 1000, ignoreDestructibleStructures: true}));
            }
            creep.memory.path = JSON.stringify(path);
        // }
        // let path = JSON.parse(creep.memory.path)
        path = JSON.parse(creep.memory.path)
        if( path.length ) {
            // output.writeToDebug(path)
            creep.moveByPath(path);
        }

    }
}

module.exports = router
