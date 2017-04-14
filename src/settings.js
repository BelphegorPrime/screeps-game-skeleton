let settings = {
    level: Game.rooms["E17N94"].controller.level,
    getSettingsForLevel: ()=>{
        if(settings.level <= 1 && !Number.isInteger(settings.level)){
            return {
                level: settings.level,
                numberCreeps: 10,
                numberMediumCreeps: 0,
                constructionplaceToBuild: 2,
                generalSettings: settings.getGeneralSettings(),
            }
        }else if(settings.level === 2){
            return {
                level: settings.level,
                numberCreeps: 10,
                numberMediumCreeps: 6,
                constructionplaceToBuild: 4,
                generalSettings: settings.getGeneralSettings(),
            }
        }else if(settings.level === 3){
            return {
                level: settings.level,
                numberCreeps: 0,
                numberMediumCreeps: 12,
                constructionplaceToBuild: 4,
                generalSettings: settings.getGeneralSettings(),
            }
        }else{
            return{
                level: settings.level,
                numberCreeps: 6,
                numberMediumCreeps: 0,
                constructionplaceToBuild: 2,
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
            }
        }
    }
};

module.exports = settings;