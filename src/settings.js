let settings = {
    level: 2,
    getSettingsForLevel: ()=>{
        if(settings.level <= 1 && !Number.isInteger(settings.level)){
            return {
                numberCreeps: 6,
                numberBigCreeps: 0,
                constructionplaceToBuild: 2,
            }
        }else if(settings.level === 2){
            return {
                numberCreeps: 10,
                numberBigCreeps: 6,
                constructionplaceToBuild: 4,
            }
        }else{
            return{
                numberCreeps: 6,
                numberBigCreeps: 0,
                constructionplaceToBuild: 2,
            }
        }
    }
};

module.exports = settings;