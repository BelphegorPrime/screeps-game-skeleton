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
    showCreepRoles: (creeps)=>{
        let amountOfHarvester = 0
        let amountOfUpgrader = 0
        let amountOfBuilder = 0
        let amountOfBigHarvester = 0
        let amountOfBigUpgrader = 0
        let amountOfBigBuilder = 0

        _.map(creeps, creep =>{
            if(creep.memory.role === 'harvester') {
                amountOfHarvester += 1
            }
            if(creep.memory.role === 'big_harvester') {
                amountOfBigHarvester += 1
            }
            if(creep.memory.role === 'upgrader') {
                amountOfUpgrader += 1
            }
            if(creep.memory.role === 'big_upgrader') {
                amountOfBigUpgrader += 1
            }
            if(creep.memory.role === 'builder'){
                amountOfBuilder += 1
            }
            if(creep.memory.role === 'big_builder'){
                amountOfBigBuilder += 1
            }
        })

        console.log("======LITTLE CREEPS======")
        console.log("amountOfHarvester: "+amountOfHarvester)
        console.log("amountOfUpgrader: "+amountOfUpgrader)
        console.log("amountOfBuilder: "+amountOfBuilder)
        console.log("=======BIG CREEPS========")
        console.log("amountOfBigHarvester: "+amountOfBigHarvester)
        console.log("amountOfBigUpgrader: "+amountOfBigUpgrader)
        console.log("amountOfBigBuilder: "+amountOfBigBuilder)
        console.log("=========================")
    },
};

module.exports = general;