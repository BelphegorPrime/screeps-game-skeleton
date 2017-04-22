import output from "./output"
import settingsHelp from './settings'
let settings = settingsHelp.getSettingsForLevel()

//TODO RE-Implement own cache for routes
let routerHelp = {
    routeCreep: (creep:Creep, target:Structure, visual:Object)=>{
        let locStr = creep.pos.x+","+creep.pos.y+","+target.pos.x+","+target.pos.y
        //routerHelp.createPath(creep, target, visual, locStr)
        //let path = JSON.parse(Memory.paths[creep.room.name][locStr].path)
        let path = creep.pos.findPathTo(target, _.merge(visual, {maxOps: 1000, ignoreDestructibleStructures: true}));

        if( path.length ) {
            creep.moveByPath(path);
        }
    },
    createPath: (creep:Creep, target:Structure, visual:Object, locStr:string)=>{
        if(Memory.paths[creep.room.name][locStr] === undefined){
            let path = routerHelp.findPath(creep, target, visual)
            Memory.paths[creep.room.name][locStr] = {
                path: JSON.stringify(path),
                creattime:Game.time
            }
        }else if(Game.time - Memory.paths[creep.room.name][locStr].creattime > settings.generalSettings.newRouteOutdateCounter){
            let path = routerHelp.findPath(creep, target, visual)
            Memory.paths[creep.room.name][locStr] = {
                path: JSON.stringify(path),
                creattime:Game.time
            }
        }
    },
    findPath: (creep:Creep, target:Structure, visual:Object)=>{
        let path = creep.pos.findPathTo(target, _.merge(visual, {maxOps: 200}));
        if( !path.length) {
            path = creep.pos.findPathTo(target, _.merge(visual, {maxOps: 1000, ignoreDestructibleStructures: true}));
        }
        return path
    }
}

module.exports = routerHelp
