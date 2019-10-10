var express=require("express")
var app=express()
const mongo=require('mongodb').MongoClient
//const mongodbURL = 'mongodb+srv://railosapp:mongo@railos-vkklb.mongodb.net/test?retryWrites=true';
const mongodbURL = 'mongodb://localhost:27017/railos';
var session=require('express-session')
var fs=require("fs")
var path=require("path")
let ObjectId=require("mongodb").ObjectId
var db;
var dbusers;
var dbdashboard;
var dblocomotives;
var dbprocess=require("./lib/dbprocess")

const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(mongodbURL, { useNewUrlParser: true });

client.connect(err => {
  dbusers = client.db("railOS").collection("users");
  dblocomotives=client.db("railOS").collection("locomotives")
  dbdashboard=client.db("railOS").collection("dashboards")
  console.log("connected")
});
  
app.use(require('body-parser')());
app.use(session({
  secret: 'railOS',
  resave: true,
  maxAge:600000,
  saveUninitialized: false
}));
app.use(express.static(__dirname+"/public"))
app.set('views',__dirname+"/views")
app.set('view engine', 'pug');

app.get("/",function(req,res){
    var dt={
        role:req.session.role,
        firstname:req.session.firstname,
        lastname:req.session.lastname
    }
		res.render("main",dt)
})

//login
app.post("/login",function(req,res){
   dbusers.findOne({username:req.body.username}).toArray((err,data)=>{
       if(data==null) res.send({string:"failed",value:false})
       else{
           if(data.password==req.body.password){
            req.session.role=data[ind].role
            req.session.userId=data[ind].username
            req.session.firstname=data[ind].firstname
            req.session.lastname=data[ind].lastname
            //console.log("login ass: "+req.session.role)
            res.send({value:true,string:"Success"})
           }
           else res.send({string:"failed",value:false})
       }
   })
})
//logout
app.post("/logout",function(req,res){
    if(req.session&&req.session.userId){
        req.session.destroy()
        res.send({value:true,string:"successful"})
    }
    else res.send({value:false,string:"not logged in"})
})
//dashboard
app.get("/dashboard",(req,res)=>{
    var dt={
        role:req.session.role,
        firstname:req.session.firstname,
        lastname:req.session.lastname
    }
    req.session&&req.session.userId?res.render("dashboard",dt):res.render("401")
})

/*##################################################################################|
####################################################################################|

                            CUSTOMER

####################################################################################|
###################################################################################*/
app.get("/customerdashboard",function(req,res){
    req.session&&/^(?:customer|ds|admin|editor|frontdesk)$/.test(req.session.role)? res.render("customer",{role:req.session.role,firstname:req.session.firstname,lastname:req.session.lastname}):res.render("401")
})


/*##################################################################################|
####################################################################################|

                            FRONT DESK

####################################################################################|
###################################################################################*/
app.get("/frontdesk",function(req,res){
    if(req.session&&/^(?:frontdesk|editor|admin|ds)$/.test(req.session.role)){
        res.render("frontdesk",{role:req.session.role,firstname:req.session.firstname,lastname:req.session.lastname})
    }
    else res.render("401")
})

/*##################################################################################|
####################################################################################|

                            EDITOR

####################################################################################|
###################################################################################*/
app.get("/editor",function(req,res){
    var dt={
        role:req.session.role,
        firstname:req.session.firstname,
        lastname:req.session.lastname
    }
    if(req.session&&/^(?:editor|ds|admin)$/.test(req.session.role)){
        res.render("editor",dt)
    }
    else res.render("401")
})


/*##################################################################################|
####################################################################################|

                            DSPAGE

####################################################################################|
###################################################################################*/
app.get("/ds",function(req,res){
    //console.log(req.session.role)
    var dt={
        role:req.session.role,
        firstname:req.session.firstname,
        lastname:req.session.lastname
    }
    if(req.session&&/^(?:admin|ds)$/.test(req.session.role)){
        res.render("dspage",dt)
    }
    else res.render("401")

})
/*##################################################################################|
####################################################################################|

                            ADMIN

####################################################################################|
###################################################################################*/
app.get("/admin",function(req,res){
    var dt={
        role:req.session.role,
        firstname:req.session.firstname,
        lastname:req.session.lastname
    }
    if(req.session&&req.session.role=="admin"){
        res.render("admin",dt)
    }
    else res.render("401")
})


//#TODO: ADD TRAINTRACK ENDPOINT
/*##################################################################################|
####################################################################################|

                            traintrack

####################################################################################|
###################################################################################*/

app.get("/train-track",(req,res)=>{
    var dt=dbprocess.getSess(req)
    res.render("traintrack",dt)
})
///////////////////////////////////////////////////////////////////////////////////////////
app.get("/train-track/edit",(req,res)=>{
    
    var dt={
        role:req.session.role,
        firstname:req.session.firstname,
        lastname:req.session.lastname,
    }
    req.session.role=="admin"?res.render("traintrackedit",dt):res.render("401")
    
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post("/train-track/:locono",(req,res)=>{
    
    var dt={
        role:req.session.role,
        firstname:req.session.firstname,
        lastname:req.session.lastname,
        locono:req.params.locono
    }
    dbdashboard.findOne({}).toArray((err,data)=>{
        if(data==null){
            console.log("No dashboard Found")
            res.json()
        }
        else{
            data.panes[0].widgets[0].settings.value=no
            data.datasources[0].settings.url=rd.datasources[0].settings.url+"/"+req.params.no
            res.json(data)
        }
        
    })

})
///#TODO: SAVE DASHBOARD
app.post("/train-track/save/dashboard",(req,res)=>{
    if(req.session.role=="admin"){
        dbdashboard.update({version:1},req.body.db)
        res.send({string:"success",value:true})
    }
    else res.send("Not authorized")
})
app.get("/customerquery/:vars/:val",(req,res)=>{
    var a=dbprocess.processQuery(req.params)
    res.send(a)
})
app.get("/customerquery/:vars/:val/:cmd(and|without)/:vars2/:val2",(req,res)=>{
    var a=dbprocess.processQuery(req.params)
    res.send(a)
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/train-track/getdashboard/for/:locono",(req,res)=>{
    dbdashboard.findOne({}).toArray((err,data)=>{
        if(data==null){
            console.log("No dashboard Found")
            res.json()
        }
        else{
            data.panes[0].widgets[0].settings.value=no
            data.datasources[0].settings.url=rd.datasources[0].settings.url+"/"+req.params.no
            res.json(data)
        }
    })
})

app.get("/train-track/load/dashboard",(req,res)=>{
    if(req.session.role=="admin"){
        dbdashboard.findOne({version:1}).toArray((err,data)=>{
            res.json(data)
        })
    }
    else res.send("Not authorized")
    
})
app.get("/saveLocationData/:locoNo/:locoCode",(req,res)=>{
    var {locoNo,locoCode}=req.params
    var locationData=req.body
    dblocomotives.findOne({locomotiveNumber:locoNo,locomotiveCode:locoCode}).toArray((err,daa)=>{
        if (daa==null)res.json({type:"error",code:"RO_LOCO_EXIST_404",message:"Locomotive does not exist"})
        else{
            dblocomotives.update({locomotiveNumber:locoNo},locationData)
            res.json({type:"success",message:`Created Locomotive ${locoNo} Successfully`,code:"RO_LOCO_CREATE_200"})
        }
    })
})
app.post("/createLocomotive/:locoNo",(req,res)=>{
    var locoNo=req.params.locoNo
    var locationData=req.body
    dblocomotives.findOne({locomotiveNumber:locoNo}).toArray((err,daa)=>{
        if (daa==null){
            dblocomotives.insert(locationData)
            res.json({type:"success",message:`Created Locomotive ${locoNo} Successfully`,code:"RO_LOCO_CREATE_200"})
        }
        else res.json({type:"error",message:"Locomotive Already Created",code:"RO_LOCO_CREATE_404"})
    })
})
app.post("/deleteLocomotive/:locomotiveNumber",(req,res)=>{
    var locomotiveNumber=req.params.locomotiveNumber
    dblocomotives.findOne({locomotiveNumber:locomotiveNumber}).toArray((err,daa)=>{
        if (data==null)res.json({type:"error",code:"RO_LOCO_EXIST_404",message:"Locomotive does not exist"})
        else{
            dblocomotives.remove({locomotiveNumber:locoNo})
            res.json({type:"success",message:`Created Locomotive ${locoNo} Successfully`,code:"RO_LOCO_CREATE_200"})
        }
    })
})
app.get("/getLocomotives",(req,res)=>{
    if(req.session.role=="admin"){
        dblocomotives.find({}).toArray((err,data)=>{
            res.json(data)
        })
    }
    else res.json({type:"error",message:"What the f* bro"})
})
/*dev*/
app.listen(80,"127.168.10.11",function(){
          console.log("_._._._🚂-[¤ ¤]-[¤ ¤ ¤]-[¤ ¤ ¤]-[¤ ¤ ¤]_._ ______ railOS server running ")
}
)
/*/

/*prod*
app.listen(process.env.PORT||3000,function(){
          console.log("_._._._🚂-[¤ ¤]-[¤ ¤ ¤]-[¤ ¤ ¤]-[¤ ¤ ¤]_._ ______ railOS server running ")
}
)
/**/
