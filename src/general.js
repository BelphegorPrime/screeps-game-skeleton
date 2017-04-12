var general = {

    /** @param {Array} unitArray **/
    getUnitNumber: function(unitArray) {

        let number = 0
        _.map(unitArray, (unit)=>{
            if(number < unit.name.split("-")[1]){
                number = unit.name.split("-")[1]
            }
        })
        return number
    }
};

module.exports = general;