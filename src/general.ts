import output from "./output"
export default {
    getUnitNumber: (creepArray:Creep[]):number => {
        let intVal = 0
        _.map(creepArray, (creep)=>{
            let creepNumber= parseInt(creep.name.split("-")[1])
            if(intVal < creepNumber){
                intVal = creepNumber
            }
        })
        return intVal+1
    },
    getRandomID: ()=>{
        return Math.floor(Math.random() * (Math.floor(999))) + 1
    },
}