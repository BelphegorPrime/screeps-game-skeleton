let output = require('./output');
let room = _.map(Game.rooms, room => { return room; })[0];
let settings = {
    level: room.controller.level,
    getSettingsForLevel: () => {
        if (settings.level <= 1 || !Number.isInteger(settings.level)) {
            return {
                level: settings.level,
                minHarvester: 5,
                numberLittleCreeps: 10,
                numberMediumCreeps: 0,
                numberBigCreeps: 0,
                maxBuilder: 1,
                maxLoader: 0,
                generalSettings: settings.getGeneralSettings(),
            };
        }
        else if (settings.level === 2) {
            return {
                level: settings.level,
                minHarvester: 5,
                numberLittleCreeps: 10,
                numberMediumCreeps: 5,
                numberBigCreeps: 0,
                maxBuilder: 2,
                maxLoader: 0,
                generalSettings: settings.getGeneralSettings(),
            };
        }
        else if (settings.level === 3) {
            return {
                level: settings.level,
                minHarvester: 5,
                numberLittleCreeps: 1,
                numberMediumCreeps: 10,
                numberBigCreeps: 4,
                maxBuilder: 2,
                maxLoader: 2,
                generalSettings: settings.getGeneralSettings(),
            };
        }
        else if (settings.level === 4) {
            return {
                level: settings.level,
                minHarvester: 5,
                numberLittleCreeps: 1,
                numberMediumCreeps: 7,
                numberBigCreeps: 7,
                maxBuilder: 2,
                maxLoader: 2,
                generalSettings: settings.getGeneralSettings(),
            };
        }
        else {
            return {
                level: settings.level,
                minHarvester: 5,
                numberLittleCreeps: 10,
                numberMediumCreeps: 7,
                numberBigCreeps: 7,
                maxBuilder: 2,
                maxLoader: 2,
                generalSettings: settings.getGeneralSettings(),
            };
        }
    },
    getGeneralSettings: () => {
        return {
            initDB: false,
            memoryClearCounter: 10,
            newRouteOutdateCounter: 5,
            roles: {
                harvester: "harvester",
                upgrader: "upgrader",
                builder: "builder",
                loader: "loader",
                sourceproxy: "sourceproxy",
            },
            costs: {
                little: 300,
                medium: 550,
                big: 800,
            },
            roomLength: 50,
            bucketLimit: 5000,
            amountOfLastTimeTicksToSave: 5,
        };
    }
};
module.exports = settings;
