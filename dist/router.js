'use strict';

var output = require('./output');
var settings = require('./settings').getSettingsForLevel();
//TODO Implement own cache for routes
var routerHelp = {
    routeCreep: function routeCreep(creep, target, visual) {
        var locStr = creep.pos.x + "," + creep.pos.y + "," + target.pos.x + "," + target.pos.y;
        routerHelp.createPath(creep, target, visual, locStr);
        var path = JSON.parse(Memory.paths[creep.room.name][locStr].path);
        if (path.length) {
            creep.moveByPath(path);
        }
    },
    createPath: function createPath(creep, target, visual, locStr) {
        if (Memory.paths[creep.room.name][locStr] === undefined) {
            var path = routerHelp.findPath(creep, target, visual);
            Memory.paths[creep.room.name][locStr] = {
                path: JSON.stringify(path),
                creattime: Game.time
            };
        } else if (Game.time - Memory.paths[creep.room.name][locStr].creattime > settings.generalSettings.newRouteOutdateCounter) {
            var _path = routerHelp.findPath(creep, target, visual);
            Memory.paths[creep.room.name][locStr] = {
                path: JSON.stringify(_path),
                creattime: Game.time
            };
        }
    },
    findPath: function findPath(creep, target, visual) {
        var path = creep.pos.findPathTo(target, _.merge(visual, { maxOps: 200 }));
        if (!path.length) {
            path = creep.pos.findPathTo(target, _.merge(visual, { maxOps: 1000, ignoreDestructibleStructures: true }));
        }
        return path;
    }
};
module.exports = routerHelp;
//# sourceMappingURL=router.js.map
