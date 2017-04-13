let general = {

    /** @param {Array} unitArray **/
    getUnitNumber: (unitArray)=>{
        let number = 0
        _.map(unitArray, (unit)=>{
            if(number < unit.name.split("-")[1]){
                number = unit.name.split("-")[1]
            }
        })
        return parseInt(number)+1
    }
};

module.exports = general;