const mongoose=require('mongoose')
const { type } = require('os')
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
    },
    desc:{
        type:String
    },
    product:[{
        type:mongoose.Types.ObjectId,
        ref:'product'
    }],
       writter:[{
        type:mongoose.Types.ObjectId,
        ref:'writter'
    }]
})



module.exports=mongoose.model('college',newschema)
