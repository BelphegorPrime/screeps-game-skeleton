//import * as _ from "lodash";
// notice to myself: "lodash version is 3.10.1 :O"
let roleHarvester = require('./role.harvester');
let roleUpgrader = require('./role.upgrader');
let roleBuilder = require('./role.builder');
let roleLoader = require('./role.loader');
let roleSourceProxy = require('./role.sourceproxy');
let room = require('./room');
let creepsHelper = require('./creeps');
let memoryHelper = require('./memory');
import output from "./output";
let settings = require('./settings').getSettingsForLevel();
module.exports.loop = () => {
    let subTimeStart = Game.cpu.getUsed();
    memoryHelper.init(Game.rooms);
    // Get Roominformations and extend the Room Object
    Game.rooms = room.init(Game.rooms);
    // Give every small and big Creep its role and source
    let creeps = [];
    if (_.size(Game.creeps) > 0) {
        creeps = creepsHelper.getCreeps(Game.creeps, Game.rooms, Game.constructionSites);
    }
    // Create small and big Creeps
    creepsHelper.spawnCreeps(Game.rooms, Game.spawns, creeps);
    // Execute Commands for Creeper Role
    let subTimeCreepsRun = Game.cpu.getUsed();
    _.map(creeps, (creep) => {
        if (Memory.enemys[creep.room.name] > 0) {
            roleLoader.run(creep);
        }
        else {
            let subTimeCreepRun = Game.cpu.getUsed();
            if (creep.memory.role === settings.generalSettings.roles.harvester ||
                creep.memory.role === "harvester") {
                roleHarvester.run(creep);
            }
            if (creep.memory.role === settings.generalSettings.roles.upgrader ||
                creep.memory.role === "upgrader") {
                roleUpgrader.run(creep);
            }
            if (creep.memory.role === settings.generalSettings.roles.builder ||
                creep.memory.role === "builder") {
                roleBuilder.run(creep);
            }
            if (creep.memory.role === settings.generalSettings.roles.loader ||
                creep.memory.role === "loader") {
                roleLoader.run(creep);
            }
            if (creep.memory.role === settings.generalSettings.roles.sourceproxy ||
                creep.memory.role === "sourceproxy") {
                roleSourceProxy.run(creep);
            }
            let durationCreepRun = (Game.cpu.getUsed() - subTimeCreepRun).toFixed(0);
            if (durationCreepRun > 1) {
                output.writeToDebug(creep.memory.role + " WORKTIME TOOK                 " + durationCreepRun);
            }
        }
    });
    let durationCreepsRun = (Game.cpu.getUsed() - subTimeCreepsRun).toFixed(0);
    output.workTimes("CREEPS WORKTIME TOOK                 " + durationCreepsRun);
    // WRITE ACTUAL TICK TO MEMORY
    let iteration = Memory.cpu.lengthLastTickTime;
    if (iteration >= settings.generalSettings.amountOfLastTimeTicksToSave) {
        Memory.cpu.lengthLastTickTime = 0;
        iteration = 0;
        Memory.cpu.lastTickTime[0] = [Memory.cpu.lastTickTime[0][_.size(Memory.cpu.lastTickTime[0]) - 1]];
    }
    Memory.cpu.lengthLastTickTime = iteration + 1;
    let duration = (Game.cpu.getUsed() - subTimeStart).toFixed(0);
    Memory.cpu.lastTickTime[0] = [].concat(Memory.cpu.lastTickTime[0], duration);
    // CONSOLE OUTPUT
    output.showCreepRoles(Game.rooms, creeps, settings.generalSettings.roles);
    output.writeCPU(Game.cpu);
    output.workTimes("All dt: " + duration);
    output.writeLog();
};
