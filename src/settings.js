let room = _.map(Game.rooms, room =>{return room})[0]
let settings = {
    level: room.controller.level,
    getSettingsForLevel: ()=>{
        if(settings.level <= 1 && !Number.isInteger(settings.level)){
            return {
                level: settings.level,
                numberLittleCreeps: 10,
                numberMediumCreeps: 0,
                numberBigCreeps: 0,
                maxBuilder: 2,
                maxLoader: 0,
                generalSettings: settings.getGeneralSettings(),
            }
        }else if(settings.level === 2){
            return {
                level: settings.level,
                numberLittleCreeps: 2,
                numberMediumCreeps: 10,
                numberBigCreeps: 0,
                maxBuilder: 2,
                maxLoader: 0,
                generalSettings: settings.getGeneralSettings(),
            }
        }else if(settings.level === 3){
            return {
                level: settings.level,
                numberLittleCreeps: 0,
                numberMediumCreeps: 10,
                numberBigCreeps: 4,
                maxBuilder: 4,
                maxLoader: 3,
                generalSettings: settings.getGeneralSettings(),
            }
        }else{
            return{
                level: settings.level,
                numberLittleCreeps: 10,
                numberMediumCreeps: 0,
                numberBigCreeps: 0,
                maxBuilder: 2,
                maxLoader: 1,
                generalSettings: settings.getGeneralSettings(),
            }
        }
    },
    getGeneralSettings: () =>{
        return {
            roles:{
                little_harvester: "little_harvester",
                little_upgrader: "little_upgrader",
                little_builder: "little_builder",
                medium_harvester: "medium_harvester",
                medium_upgrader: "medium_upgrader",
                medium_builder: "medium_builder",
                big_harvester: "big_harvester",
                big_upgrader: "big_upgrader",
                big_builder: "big_builder",
                little_loader: "little_loader",
                medium_loader: "medium_loader",
                big_loader: "big_loader",
            },
            costs:{
                little:300,
                medium: 550,
                big: 800,
            },
            roomLength: 50,
            bucketLimit: 5000,
        }
    }
}

module.exports = settings