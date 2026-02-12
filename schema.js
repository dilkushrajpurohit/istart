
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
    college:{
        type:String,
        default:'Not specified'
    },
    mobile:{
        type:String,
        default:'Not provided'
    },
    city:{
        type:String,
        default:'Not specified'
    },
    bio:{
        type:String,
        default:'No bio added'
    },
    profilelink:{
        type:String
    },
    rating:{
        type:Number,
        default:0
    },
    bought:[{
        type:mongoose.Types.ObjectId,
        ref:'product'
    }],
    sold:[{
        type:mongoose.Types.ObjectId,
        ref:'product'
    }],
    createdAt:{
        type:Date,
        default:Date.now
    }

})
module.exports=mongoose.model('Schema',schema)