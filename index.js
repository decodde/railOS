var express=require("express")
var app=express()
const mongo=require('mongodb').MongoClient
const mongodbURL = 'mongodb+srv://railosapp:mongo@railos-vkklb.mongodb.net/test?retryWrites=true';
var session=require('express-session')
let ObjectId=require("mongodb").ObjectId
var db;
var dbusers;

mongo.connect(mongodbURL,function(err,db0){
    db=db0.db("railos");
    dbusers=db.collection("users");
})
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

app.get("/",function(req,res){
		res.render("main")
})

//login
app.post("/login",function(req,res){
    //console.log("here")
    dbusers.find({username:req.body.username,password:req.body.password}).toArray(function(err,result){
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
    if(req.session&&req.session.userId){
        res.render("dashboard",{role:req.session.role,firstname:req.session.firstname,lastname:req.session.lastname})

    }
    else res.render("401")
})
/*##################################################################################|
####################################################################################|

                            CUSTOMER

####################################################################################|
###################################################################################*/
app.get("/customerdashboard",function(req,res){
    if(req.session&&/^(?:customer|ds|admin|editor|frontdesk)$/.test(req.session.role)){
        res.render("customer",{role:req.session.role,firstname:req.session.firstname,lastname:req.session.lastname})
    }
    else res.render("401")
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
    if(req.session&&/^(?:editor|ds|admin)$/.test(req.session.role)){
        res.render("editor",{role:req.session.role,firstname:req.session.firstname,lastname:req.session.lastname})
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
    if(req.session&&/^(?:admin|ds)$/.test(req.session.role)){
        res.render("dspage",{role:req.session.role,firstname:req.session.firstname,lastname:req.session.lastname})
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
    if(req.session&&req.session.role=="admin"){
        res.render("admin",{role:req.session.role,firstname:req.session.firstname,lastname:req.session.lastname})
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



app.post("/newtravel",function(req,res){

})

app.get("/travellistto",function(req,res){

})


app.post("/deleteacct",function(req,res){

})

app.post("/createacct",function(req,res){

})

app.post("/editacct",function(req,res){

})



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.listen(process.env.PORT||3000,function(){
          console.log("_._._._🚂-[¤ ¤]-[¤ ¤ ¤]-[¤ ¤ ¤]-[¤ ¤ ¤]_._ ______ railOS server running ")
}
)