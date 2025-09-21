
const mongoose =require('mongoose')
const schema= new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    profilelink:{
        type:String
    },
    rating:{
        type:Number
    }

})
module.exports=mongoose.model('Schema',schema)