'use strict';

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _output = require('./output');

var _output2 = _interopRequireDefault(_output);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// notice to myself: "lodash version is 3.10.1 :O"
var roleHarvester = require('./role.harvester');
var roleUpgrader = require('./role.upgrader');
var roleBuilder = require('./role.builder');
var roleLoader = require('./role.loader');
var roleSourceProxy = require('./role.sourceproxy');
var room = require('./room');
var creepsHelper = require('./creeps');
var memoryHelper = require('./memory');

var settings = require('./settings').getSettingsForLevel();
module.exports.loop = function () {
    var subTimeStart = Game.cpu.getUsed();
    memoryHelper.init(Game.rooms);
    // Get Roominformations and extend the Room Object
    Game.rooms = room.init(Game.rooms);
    // Give every small and big Creep its role and source
    var creeps = [];
    if (_.size(Game.creeps) > 0) {
        creeps = creepsHelper.getCreeps(Game.creeps, Game.rooms, Game.constructionSites);
    }
    // Create small and big Creeps
    creepsHelper.spawnCreeps(Game.rooms, Game.spawns, creeps);
    // Execute Commands for Creeper Role
    var subTimeCreepsRun = Game.cpu.getUsed();
    _.map(creeps, function (creep) {
        if (Memory.enemys[creep.room.name] > 0) {
            roleLoader.run(creep);
        } else {
            var subTimeCreepRun = Game.cpu.getUsed();
            if (creep.memory.role === settings.generalSettings.roles.harvester || creep.memory.role === "harvester") {
                roleHarvester.run(creep);
            }
            if (creep.memory.role === settings.generalSettings.roles.upgrader || creep.memory.role === "upgrader") {
                roleUpgrader.run(creep);
            }
            if (creep.memory.role === settings.generalSettings.roles.builder || creep.memory.role === "builder") {
                roleBuilder.run(creep);
            }
            if (creep.memory.role === settings.generalSettings.roles.loader || creep.memory.role === "loader") {
                roleLoader.run(creep);
            }
            if (creep.memory.role === settings.generalSettings.roles.sourceproxy || creep.memory.role === "sourceproxy") {
                roleSourceProxy.run(creep);
            }
            var durationCreepRun = (Game.cpu.getUsed() - subTimeCreepRun).toFixed(0);
            if (durationCreepRun > 1) {
                _output2.default.writeToDebug(creep.memory.role + " WORKTIME TOOK                 " + durationCreepRun);
            }
        }
    });
    var durationCreepsRun = (Game.cpu.getUsed() - subTimeCreepsRun).toFixed(0);
    _output2.default.workTimes("CREEPS WORKTIME TOOK                 " + durationCreepsRun);
    // WRITE ACTUAL TICK TO MEMORY
    var iteration = Memory.cpu.lengthLastTickTime;
    if (iteration >= settings.generalSettings.amountOfLastTimeTicksToSave) {
        Memory.cpu.lengthLastTickTime = 0;
        iteration = 0;
        Memory.cpu.lastTickTime[0] = [Memory.cpu.lastTickTime[0][_.size(Memory.cpu.lastTickTime[0]) - 1]];
    }
    Memory.cpu.lengthLastTickTime = iteration + 1;
    var duration = (Game.cpu.getUsed() - subTimeStart).toFixed(0);
    Memory.cpu.lastTickTime[0] = [].concat(Memory.cpu.lastTickTime[0], duration);
    // CONSOLE OUTPUT
    _output2.default.showCreepRoles(Game.rooms, creeps, settings.generalSettings.roles);
    _output2.default.writeCPU(Game.cpu);
    _output2.default.workTimes("All dt: " + duration);
    _output2.default.writeLog();
};
//# sourceMappingURL=main.js.map
