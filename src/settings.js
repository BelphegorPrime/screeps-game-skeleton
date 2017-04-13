let settings = {
    level: 1,
    getSettingsForLevel: ()=>{
        if(settings.level === 1){
            return {
                numberCreeps: 10,
                numberBigCreeps: 6,
                constructionplaceToBuild: 4,
            }
        }else{
            return{
                numberCreeps: 10,
                numberBigCreeps: 6,
                constructionplaceToBuild: 4,
            }
        }
    }
};

module.exports = settings;