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
    showCreepRoles: (creeps, settingsRoles)=>{
        let amountOfLittleHarvester = 0
        let amountOfLittleUpgrader = 0
        let amountOfLittleBuilder = 0
        let amountOfMediumHarvester = 0
        let amountOfMediumUpgrader = 0
        let amountOfMediumBuilder = 0

        _.map(creeps, creep =>{
            if(creep.memory.role === settingsRoles.little_harvester) {
                amountOfLittleHarvester += 1
            }
            if(creep.memory.role === settingsRoles.little_upgrader) {
                amountOfLittleUpgrader += 1
            }
            if(creep.memory.role === settingsRoles.little_builder){
                amountOfLittleBuilder += 1
            }
            if(creep.memory.role === settingsRoles.medium_harvester) {
                amountOfMediumHarvester += 1
            }
            if(creep.memory.role === settingsRoles.medium_upgrader) {
                amountOfMediumUpgrader += 1
            }
            if(creep.memory.role === settingsRoles.medium_builder){
                amountOfMediumBuilder += 1
            }
        })

        console.log("======LITTLE CREEPS======")
        console.log("amountOfLittleHarvester: "+amountOfLittleHarvester)
        console.log("amountOfLittleUpgrader: "+amountOfLittleUpgrader)
        console.log("amountOfLittleBuilder: "+amountOfLittleBuilder)
        console.log("=======BIG CREEPS========")
        console.log("amountOfMediumHarvester: "+amountOfMediumHarvester)
        console.log("amountOfMediumUpgrader: "+amountOfMediumUpgrader)
        console.log("amountOfMediumBuilder: "+amountOfMediumBuilder)
        console.log("=========================")
    },
};

module.exports = general;