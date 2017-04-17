let output = require('./output')
let settings = require('./settings').getSettingsForLevel()

//TODO Implement own cache for routes
let routerHelp = {
    routeCreep: (creep, target, visual)=>{
        let locStr = creep.pos.x+","+creep.pos.y+","+target.pos.x+","+target.pos.y
        routerHelp.createPath(creep, target, visual, locStr)
        let path = JSON.parse(Memory.paths[creep.room.name][locStr].path)
        if( path.length ) {
            creep.moveByPath(path);
        }
    },
    createPath: (creep, target, visual, locStr)=>{
        if(Memory.paths[creep.room.name][locStr] === undefined){
            let path = routerHelp.findPath(creep, target, visual)
            Memory.paths[creep.room.name][locStr] = {
                path: JSON.stringify(path),
                start: creep.pos,
                end: target.pos,
                length: path.length,
                creattime:Game.time
            }
        }else if(Game.time - Memory.paths[creep.room.name][locStr].creattime > settings.generalSettings.newRouteOutdateCounter){
            let path = routerHelp.findPath(creep, target, visual)
            // if(Memory.paths[creep.room.name][locStr].length > path.length){
                Memory.paths[creep.room.name][locStr] = {
                    path: JSON.stringify(path),
                    start: creep.pos,
                    end: target.pos,
                    length: path.length,
                    creattime:Game.time
                }
            // }else{
            //     Memory.paths[creep.room.name][locStr].creattime = Game.time
            // }
        }
    },
    findPath: (creep, target, visual)=>{
        let path = creep.pos.findPathTo(target, _.merge(visual, {maxOps: 200}));
        if( !path.length) {
            path = creep.pos.findPathTo(target, _.merge(visual, {maxOps: 1000, ignoreDestructibleStructures: true}));
        }
        return path
    }
}

module.exports = routerHelp
