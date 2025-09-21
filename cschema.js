const mongoose=require('mongoose')
let newschema= new mongoose.Schema({
    name:{
        type:String
    },
    address:{
        type:String
    },
    aictcid:{
        type:Number
    },
    link:{
        type:String
    }
})
module.exports=mongoose.model('college',newschema)