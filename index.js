const express=require('express')
const app=express()
const cookieParser=require('cookie-parser')
const nodemailer=require('nodemailer')
const mongoose=require('mongoose')
const schema=require("./schema.js")
const cschema=require('./cschema.js')
const products=require('./products.js')

mongoose.connect('mongodb+srv://divyanshuraj43435_db_user:9FvDgGOUROCOGdoh@smartindia.6uydl5q.mongodb.net/?retryWrites=true&w=majority&appName=smartindia').then(()=>{console.log('connected to db')})
app.use(cookieParser());// iski wajah se baut latka mai
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:false}))
var fileupload=require("express-fileupload");
var cloudinary=require("cloudinary").v2
app.use(fileupload({ useTempFiles: true })); 


cloudinary.config({ 
    cloud_name: 'dydtaoleb', 
    api_key: '353263951374847', 
    api_secret: 'kUttgOS99XKj2MDCevLVZm9kOrU' 
  });
  

app.use(express.static(__dirname+'/public'))
app.get('/',(req,res)=>{
    res.render(__dirname+'/public/index.ejs')
})
app.get('/home',async(req,res)=>{
    if(req.cookies.id==undefined){res.redirect('/')}
    else{
    let id=await schema.findById(req.params.id)
    let datasend= await cschema.find()
    res.render(__dirname+'/public/home.ejs',{items:datasend})}
    
})
app.get('/dashboard/:id',async(req,res)=>{
    if(req.cookies.id==undefined){
  res.redirect('/')}
    else{
        let i=req.params.id;
        let db=await cschema.findById(i)
        let array = db.product
        let disc=[]
        for (let index = 0; index < array.length; index++) {
            let cid=array[index]
            let pr=await products.findById(cid)
           if(pr){
            let final =disc.push(pr)}


            
        }
       res.render(__dirname+"/public/dash.ejs",{items:db,prod:disc})
     // res.send(disc)
    }
     
        
    }
)


app.post("/register",(req,res)=>{
let random =Math.floor(Math.random()*10000)
res.cookie('otpcookie',random)
res.cookie('name',req.body.name)
res.cookie('password',req.body.password)
res.cookie('email',req.body.email)
const mailoption =nodemailer.createTransport({
    host: "smtp.gmail.com",       // your SMTP server
    port: 587,                    // TLS port
    secure: false, 
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
        res.redirect(`/home`)
        }
    catch(e){
    console.log(e)
    }
        
        
    }

    else{
        res.send("otp is wrong")
    }
})

app.post('/login',async(req,res)=>{
let result=await schema.findOne({
    email:req.body.email,
    password:req.body.password
})

if(!result){
    res.send("sorry no information found with this credentials")
}
else{
    res.cookie('name',result.name)
    res.cookie('email',result.email)
    res.cookie('id',result._id)
    res.redirect(`/home`)
}


})


app.listen(process.env.PORT||3000,()=>{
    console.log("hey it is working new change")
})


///////////////////now saving college data

app.post("/create",(req,res)=>{
    if(req.cookies.id==undefined){res.redirect('/')}
    else{

    let file=req.files.collegephoto;
    cloudinary.uploader.upload(file.tempFilePath, function(err,result){
    if(err)
     {res.send(err)}
    else{


    let ns=new cschema({
        name:req.body.name,
        address:req.body.address,
        aictcid:req.body.Aictc,
        link:result.url,
        desc:req.body.about
    })
let sa= ns.save()
res.redirect(`/home`)

console.log(result.url)
}

    
})
    }
})
app.get("/additems/:id",(req,res)=>{
    if(req.cookies.id==undefined){res.redirect('/')}
    else{
    res.render(__dirname+"/public/additem.ejs")
    res.cookie('cid',req.params.id)}

})
app.post('/addit',async(req,res)=>{
    if(req.cookies.id==undefined){res.redirect('/')}
    else{
    let file=req.files.pfile;
    cloudinary.uploader.upload(file.tempFilePath, async function(err,result){
    if(err)
     {res.send(err)}
    else{

    let sc=new products({
        name:req.body.pname,
        Desc:req.body.desc,
        photo:result.url,
        email:req.cookies.email,
        nam:req.cookies.name,
        id:req.body.id,
        price:req.body.price,



    })
    let sv= await sc.save()
    await  cschema.findByIdAndUpdate(
        req.cookies.cid,
        { $push: { product:sv._id } },   // push productId to array
        { new: true }                         // return updated doc
      );
      res.redirect(`/dashboard/${req.cookies.cid}`)
    }
})
    }
})


app.get("/Aboutus",(req,res)=>{
    res.render(__dirname+"/public/contactus.ejs")
})
app.get("/contact/:id",async(req,res)=>{
    if(req.cookies.id==undefined){res.redirect('/')}
    else{
    let r =await products.findById(req.params.id)
    const mailoption =nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:"cartoonfans963@gmail.com",
            pass: "nbpgtweumfjgwijj"
        }
    })
    let maildata={
        from:"dilkushpurohit963@gmail.com",
        to:r.email,
        subject:"hey you got an order",
        html:`<h4> name of product :- ${r.name}<br>  
        name of person :- ${req.cookies.name}<br>
        email of person :- ${req.cookies.email}<br>
        price of product:- ${r.price} <br> contact the person through email and keep visiting </h4>
        
        `
    }
    mailoption.sendMail(maildata,function(error,info){
        if(error){
            console.log(error)
        }
        else{
            res.send('hey your request has been send to seller he will inform you through email so be alert and keep checking ')
        }
    })
}
})