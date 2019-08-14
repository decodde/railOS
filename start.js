var express=require("express")
var app=express()
const mongo=require('mongodb').MongoClient
const mongodbURL = 'mongodb+srv://railosapp:mongo@railos-vkklb.mongodb.net/test?retryWrites=true';
var session=require('express-session')
var fs=require("fs")
var path=require("path")
let ObjectId=require("mongodb").ObjectId
var db;
var dbusers;
var dbprocess=require("./lib/dbprocess")
/*
mongo.connect(mongodbURL,function(err,db0){
    db=db0.db("railos");

    dbusers=db.collection("users");
})
*/
app.use(require('body-parser')());
app.use(session({
  secret: 'railOS',
  resave: true,
  maxAge:600000,
  saveUninitialized: false
}));
app.use(express.static(__dirname+"/public"))
app.set('views',__dirname+"/views")
app.set('view engine',  'pug');
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "herokuapp.com"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  next();
});
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
    //console.log("here")
    /*dbusers.find({username:req.body.username,password:req.body.password}).toArray(function(err,result){
        //console.log(result)
        //console.log(result.length)
        if(err){
            console.log(err)
            res.send({value:false,string:"Connection Error"})
        }
        if(result&&result.length>0){
           // console.log("result: "+result.role)
            req.session.role=result[0].role
            req.session.userId=result[0].username
            req.session.firstname=result[0].firstname
            req.session.lastname=result[0].lastname
            //console.log("login ass: "+req.session.role)
            res.send({value:true,string:"Success"})
        }
        else {
            res.send({value:false,string:"Invalid Login details"})
        }
    })
    */
   fs.readFile(path.join(__dirname,"lib/users.json"),(err,data)=>{
    if(err) return console.error(err)
    data=JSON.parse(data)
    var ind=data.findIndex(o=>o.username==req.body.username)
    if(ind!=-1) {
        if(data[ind].password==req.body.password)
        {req.session.role=data[ind].role
            req.session.userId=data[ind].username
            req.session.firstname=data[ind].firstname
            req.session.lastname=data[ind].lastname
            //console.log("login ass: "+req.session.role)
            res.send({value:true,string:"Success"})
        }
        else res.send({string:"failed",value:false})
    }
    else res.send({string:"failed",value:false})
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


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
app.get("/getschedule",function(req,res){

})
app.post("/createtrainschedule",function(req,res){

})

app.post("/deltrainschedule",function(req,res){

})


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
app.get("/getschedule",function(req,res){

})
app.post("/createtrainschedule",function(req,res){

})

app.post("/deltrainschedule",function(req,res){

})


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

///////   customer query //////////////////////////
app.post("/customer-query",function(req,res){
    if(req.session&&/^(?:admin|ds)$/.test(req.session.role)){
        dbusers.find(req.body,{_id:0, password:0}).toArray((err,data)=>{
            console.log(data)
            if(err) console.log(err)
            if(data&&data.length>=0){
                 res.send(data)
            }
        })
    }
    else res.render("401")
})
app.get("/customer-query",(req,res)=>{
    if(req.session&&/^(?:admin|ds)$/.test(req.session.role)){
        res.render("customerquery",{role:req.session.role,firstname:req.session.firstname,lastname:req.session.lastname})
    }
    else res.render("401")
})
app.get("/trainschedule",function(req,res){

})
app.put("/trainschedule",function(req,res){

})
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
//////   getusers  ///////////////////////////////
app.get("/getusers",function(req,res){
    if(req.session&&(req.session.role=="admin"||"ds")){
        dbusers.find({},{_id:1,password:0}).toArray((err,data)=>{
            if(err){
                console.log(err)
                res.send({value:false,string:"Error retrieving data"})
            }
            if(data&&data.length>=0){
                res.send({value:true,data:data})
            }
        })
    }
    else res.render("401")
})
//////   register account //////////////////////
app.post("/register",function(req,res){
    if(req.session&&(req.session.role=="admin"||"ds")){
        dbusers.find({firstname:req.body.firstname,lastname:req.body.lastname}).toArray((err,data)=>{
            if(data&&data.length>0){
                //console.log("user exists")
                res.send({value:false,string:"User Exists"})
            }
            else if(data&&data.length==0){
                let pwd0=req.body.firstname[0].toLowerCase()+req.body.lastname.toLowerCase()
                let role=req.body.role.toLowerCase();
                let uname=req.body.username
                if(""==uname){
                    uname=req.body.firstname.toLowerCase()
                }
                dbusers.insertOne({username:req.body.firstname,password:pwd0,firstname:req.body.firstname,lastname:req.body.lastname,role:role,station:req.body.station})
                //console.log("success")
                res.send({value:true,string:"User Created Successfully"})
            }
            else res.send({value:false,string:"Error connecting to db"})
        })
    }
})
///////   delete account  //////////////////////
app.post("/deleteacct",function(req,res){
    //console.log(req.session)
    if(req.session&&/^(?:admin|ds)$/.test(req.session.role)){
        console.log("request for del")
        var o_id=new ObjectId(req.body.id)
        dbusers.find({_id:o_id}).toArray((err,data)=>{
            if(data&&data.length==0){
                res.send({value:false,string:"User does not exist"})
            }
            else if(data&&data.length>0){
                dbusers.remove({_id:o_id})
                res.send({value:true,string:"User deleted successfully"})
            }
        })

    }
    else res.render("401")
})
////// update user ////////////////////////////////
app.post("/upduser",(req,res)=>{
    if(req.session&&/^(?:admin|ds)$/.test(req.session.role)){
            dbusers.find({_id:ObjectId(req.body.user)}).toArray((err,data)=>{
                if(err){
                    console.log(err)
                }
                if(data&&data.length>0){
                    dbusers.updateOne({_id:ObjectId(req.body.user)},{$set:{username:req.body.newusername,firstname:req.body.newfirstname,lastname:req.body.newlastname,role:req.body.newrole,station:req.body.newstation}})
                    res.send({value:true,string:"User update Successful"})
                }
                else if(data&&data.length==0){
                    res.send({value:false,string:"User does not exist"})

                }
            })
    }
}
)



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
    var x=dbprocess.getDash(req.params.locono)
    res.json(x)

})
///#TODO: SAVE DASHBOARD
app.post("/train-track/save/dashboard",(req,res)=>{
    if(req.session.role=="admin"){
        var x=dbprocess.saveDash(req.body.db)
        x?res.send({string:"success",value:true}):x
    }
    else res.send("Not authorized")
})
app.get("/customerquery/:vars/:val",(req,res)=>{
    var a=dbprocess.processQuery(req.params)
    res.send(a)
})
app.get("/customerquery/:vars2/:val/:cmd(with|without)/:varso/:val2",(req,res)=>{
    var a=dbprocess.processQuery(req.params)
    res.send(a)
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/train-track/getdashboard/for/:locono",(req,res)=>{
    var x=dbprocess.getDash(req.params.locono)
    res.json(x)
})

app.get("/train-track/load/dashboard",(req,res)=>{
    if(req.session.role=="admin"){
        var x=dbprocess.sndDash()
        res.json(x)
    }
    else res.send("Not authorized")

})
/*dev*
app.listen(80,"127.168.10.11",function(){
          console.log("_._._._🚂-[¤ ¤]-[¤ ¤ ¤]-[¤ ¤ ¤]-[¤ ¤ ¤]_._ ______ railOS server running ")
}
)
/*/

/*prod*/
app.listen(process.env.PORT||3000,function(){
          console.log("_._._._🚂-[¤ ¤]-[¤ ¤ ¤]-[¤ ¤ ¤]-[¤ ¤ ¤]_._ ______ railOS server running ")
}
)
/**/
