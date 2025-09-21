const express=require('express')
const app=express()
const cookieParser=require('cookie-parser')
const nodemailer=require('nodemailer')
const mongoose=require('mongoose')
const schema=require("./schema.js")
const cschema=require('./cschema.js')
mongoose.connect('mongodb+srv://divyanshuraj43435_db_user:9FvDgGOUROCOGdoh@smartindia.6uydl5q.mongodb.net/?retryWrites=true&w=majority&appName=smartindia').then(()=>{console.log('connected to db')})
app.use(cookieParser());// iski wajah se baut latka mai
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:false}))

app.use(express.static(__dirname+'/public'))
app.get('/',(req,res)=>{
    res.render(__dirname+'/public/index.ejs')
})
app.get('/home/:id',async(req,res)=>{
    let id=await schema.findById(req.params.id)
    res.render(__dirname+'/public/home.ejs')
})
app.get('/dashboard',(req,res)=>{
    res.render(__dirname+"/public/dash.ejs")
})


app.post("/login",(req,res)=>{
let random =Math.floor(Math.random()*10000)
res.cookie('otpcookie',random)
res.cookie('name',req.body.name)
res.cookie('password',req.body.password)
res.cookie('email',req.body.email)
const mailoption =nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:"cartoonfans963@gmail.com",
        pass: "nbpgtweumfjgwijj"
    }
})
let maildata={
    from:"dilkushpurohit963@gmail.com",
    to:req.body.email,
    subject:"verify your identity",
    text:`hey your otp is ${random}`
}
mailoption.sendMail(maildata,function(error,info){
    if(error){
        console.log(error)
    }
    else{
        res.render(__dirname+"/public/otp.ejs")
    }
})


})

app.post("/otpverify",async(req,res)=>{
    console.log(req.body.otp)
    console.log(req.cookies.otpcookie)
    
    if(req.cookies.otpcookie==req.body.otp){

    let sc=new schema({
    name:req.cookies.name,
    email:req.cookies.email,
    password:req.cookies.password
           })
    try{let save =  await sc.save()
        res.cookie('id',save._id)
        res.redirect(`/home/${save._id}`)
        }
    catch(e){
    console.log(e)
    }
        
        
    }

    else{
        res.send("otp is wrong")
    }
})
app.listen(3000,()=>{
    console.log("hey it is working")
})


///////////////////now saving college data