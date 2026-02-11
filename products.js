const mongoose=require('mongoose')
let products=new mongoose.Schema({
    name:{
        type:String
    },
    mobile:{
        type:Number
    },
    photo:{
        type:String
    },
    price:{
        type:String
    },
    Desc:{
        type:String
    },
    email:{
        type:String
    },
    nam:{
        type:String
    },
    id:{
        type:String
    },
    active:{
        type:Boolean
    }
    
    })

module.exports=mongoose.model('product',products)