const express=require('express')
const app=express()
const cookieParser=require('cookie-parser')
const nodemailer=require('nodemailer')
const mongoose=require('mongoose')
const schema=require("./schema.js")
const cschema=require('./cschema.js')
const products=require('./products.js')

const otpStore = {}   // 
let {Resend}=require('resend')
const writter=require("./writter.js")
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
    res.render(__dirname+'/public/ho.ejs',{items:datasend,id:req.cookies.id})}
})
app.get('/dashboard/:id',async(req,res)=>{
    if(req.cookies.id==undefined){
  res.redirect('/')}
    else{
        let i=req.params.id;
        let db=await cschema.findById(i)
        let array = db.product
        let arr1=db.writter
     let disc = []
     let disc2 = []

// PRODUCTS
for (let cid of db.product) {
    let pr = await products.findById(cid)
    if (pr) disc.push(pr)
}

// WRITERS
for (let wid of db.writter) {
    let wr = await writter.findById(wid)
    if (wr) disc2.push(wr)
}

res.render(__dirname + "/public/dash.ejs", {
    items: db,
    prod: disc,
    wri: disc2
})

     // res.send(disc)
    }
     
        
    }
)


app.post("/register",(req,res)=>{
let random =Math.floor(Math.random()*10000)
 otpStore[req.body.email] = {
    random,
    expiresAt: Date.now() + 2 * 60 * 1000 // 2 minutes
  }



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

/*const resend = new Resend('re_MjXW1UZa_BiiBXYiWgGe6rGwgrDGtpDdA');

resend.emails.send({
  from: 'onboarding@resend.dev',
  to: req.body.email,
  subject: 'verify your identity',
  html: `<h1> hey your otp for vidya sahay</h1> <br> ${random} `
});
res.render(__dirname+"/public/otp.ejs")

*/

})
app.get("/pro",(req,res)=>{
    res.render(__dirname+"/public/pro.ejs")
})
app.post("/otpverify",async(req,res)=>{
    console.log(req.body.otp)
    console.log(req.cookies.otpcookie)
    const email=req.cookies.email
    const record = otpStore[email]

  if (!record) return res.send("OTP expired")

  if (Date.now() > record.expiresAt) {
    delete otpStore[email]
    return res.send("OTP expired")
  }

  if (record.random != req.body.otp) {
    return res.send("Wrong OTP")
  }

  delete otpStore[email]
    
    if(record.random==req.body.otp){

    let sc=new schema({
    name:req.cookies.name,
    email:req.cookies.email,
    password:req.cookies.password
           })
    try{let save =  await sc.save()
        res.cookie('id',save._id)
        res.redirect("/home")

        }
    catch(e){
    console.log(e)
    }
        
        
    }
else{
    res.send('something went wrong')
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


app.get('/profile',async(req,res)=>{
    if(req.cookies.id==undefined){res.redirect('/')}
    const id=req.cookies.id
    let data = await  schema.findById(id).populate('bought').populate('sold')
    res.render(__dirname +"/public/profile.ejs",{
        data:data     
    })
})


app.get("/landing",(req,res)=>{
    res.render(__dirname+"/public/landingpage.ejs")
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
        mobile:req.body.mobile,
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
        let user=await schema.find({email:req.cookies.email})
    let i=user[0]._id
    let up=await schema.findByIdAndUpdate(i,{
        $push:{sold:sv._id}
    })
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
    let data=await schema.find({email:req.cookies.email})
    let id=data[0]._id
    let up=await schema.findByIdAndUpdate(id,
        {
        $push:{bought:r._id}
        },
        {new:true}
        )
    /*const mailoption =nodemailer.createTransport({
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
    })*/


  let msg = `
Hello, I want to buy your product.
Product: ${r.name}
Price: ${r.price}
Buyer: ${req.cookies.name}
Email: ${req.cookies.email}
  `


let whatsappURL = `https://wa.me/91${r.mobile}?text=${encodeURIComponent(msg)}`

res.redirect(whatsappURL)
}
})

app.get("/writter/:id",async(req,res)=>{
    if(req.cookies.id==undefined){res.redirect('/')}
    else{
    let r =await writter.findById(req.params.id)
    /*const mailoption =nodemailer.createTransport({
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
    })*/


  let msg = `
Hello, I want to hire you to work for me.

Buyer: ${req.cookies.name}
Email: ${req.cookies.email}
  `


let whatsappURL = `https://wa.me/91${r.mobile}?text=${encodeURIComponent(msg)}`

res.redirect(whatsappURL)
}
})





app.get("/writter/:id",(req,res)=>{
    if(req.cookies.id==undefined){res.redirect('/')}   
    res.render(__dirname +"/public/writter.ejs")
    res.cookie('cid',req.params.id)
})
app.post("/saveinfo",(req,res)=>{
     if(req.cookies.id==undefined){res.redirect('/')}
    else{
    let file=req.files.pfile;
    cloudinary.uploader.upload(file.tempFilePath, async function(err,result){
    if(err)
     {res.send(err)}
    else{

    let sc=new writter({
        name:req.body.name,
        Price:req.body.Price,
        Pages:req.body.Page,
        email:req.body.email,
        desc:req.body.textarea,
        link:result.url,
        mobile:req.body.mobile



    })
   
    let sv= await sc.save()
    await  cschema.findByIdAndUpdate(
        req.cookies.cid,
        { $push: { writter:sv._id } },   // push productId to array
        { new: true }                         // return updated doc
      );
      res.redirect(`/dashboard/${req.cookies.cid}`)
    }
})
    }
})