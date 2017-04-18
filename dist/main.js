'use strict';

// notice to myself: "lodash version is 3.10.1 :O"
var roleHarvester = require('./role.harvester');
var roleUpgrader = require('./role.upgrader');
var roleBuilder = require('./role.builder');
var roleLoader = require('./role.loader');
var roleSourceProxy = require('./role.sourceproxy');
var room = require('./room');
var creepsHelper = require('./creeps');
var memoryHelper = require('./memory');
var output = require('./output');
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
                output.writeToDebug(creep.memory.role + " WORKTIME TOOK                 " + durationCreepRun);
            }
        }
    });
    var durationCreepsRun = (Game.cpu.getUsed() - subTimeCreepsRun).toFixed(0);
    output.workTimes("CREEPS WORKTIME TOOK                 " + durationCreepsRun);
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
    output.showCreepRoles(Game.rooms, creeps, settings.generalSettings.roles);
    output.writeCPU(Game.cpu);
    output.workTimes("All dt: " + duration);
    output.writeLog();
};
//# sourceMappingURL=main.js.map
