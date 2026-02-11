const mongoose=require('mongoose')
const schema=new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    mobile:{
        type:Number
    },
    desc:{
        type:String
    },
    link:{
        type:String
    },
    Price:{
        type:Number
    },
    Pages:{
        type:Number
    }
})
module.exports=mongoose.model('writter',schema)