let general = {

    getUnitNumber: (creepArray)=>{
        let number = 0
        _.map(creepArray, (creep)=>{
            let creepNumber= parseInt(creep.name.split("-")[1])
            if(number < creepNumber){
                number = creepNumber
            }
        })
        return parseInt(number)+1
    },
    getRandomID: ()=>{
        return Math.floor(Math.random() * (Math.floor(10000))) + 1
    },

}

module.exports = general