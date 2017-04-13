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

        _.map(creeps, creep =>{
            if(creep.memory.role === 'harvester') {
                amountOfHarvester += 1
            }
            if(creep.memory.role === 'upgrader') {
                amountOfUpgrader += 1
            }
            if(creep.memory.role === 'builder'){
                amountOfBuilder += 1
            }
        })

        console.log("amountOfHarvester: "+amountOfHarvester)
        console.log("amountOfBuilder: "+amountOfBuilder)
        console.log("amountOfUpgrader: "+amountOfUpgrader)
    },
    showBigCreepRoles: (creeps)=>{
        let amountOfHarvester = 0
        let amountOfUpgrader = 0
        let amountOfBuilder = 0

        _.map(creeps, creep =>{
            console.log(creep.memory.role)
            if(creep.memory.role === 'big_harvester') {
                amountOfHarvester += 1
            }
            if(creep.memory.role === 'big_upgrader') {
                amountOfUpgrader += 1
            }
            if(creep.memory.role === 'big_builder'){
                amountOfBuilder += 1
            }
        })

        console.log("amountOfBigHarvester: "+amountOfHarvester)
        console.log("amountOfBigBuilder: "+amountOfBuilder)
        console.log("amountOfBigUpgrader: "+amountOfUpgrader)
    }
};

module.exports = general;