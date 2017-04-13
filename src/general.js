let general = {

    getUnitNumber: (unitArray)=>{
        let number = 0
        _.map(unitArray, (unit)=>{
            if(number < unit.name.split("-")[1]){
                number = unit.name.split("-")[1]
            }
        })
        return parseInt(number)+1
    },
    showCreepRoles: (creeps, amountOfBuilder)=>{
        let amountOfHarvester = 0
        let amountOfUpgrader = 0

        _.map(creeps, creep =>{
            if(creep.memory.role === 'harvester') {
                amountOfHarvester += 1
            }
            if(creep.memory.role === 'upgrader') {
                amountOfUpgrader += 1
            }
        })

        console.log("amountOfHarvester: "+amountOfHarvester)
        console.log("amountOfBuilder: "+amountOfBuilder)
        console.log("amountOfUpgrader: "+amountOfUpgrader)
    }
};

module.exports = general;