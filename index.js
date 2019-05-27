var express=require("express")
var app=express()
const mongo=require('mongodb').MongoClient
const mongodbURL = 'mongodb+srv://railosapp:mongo@railos-vkklb.mongodb.net/test?retryWrites=true';
var session=require('express-session')
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
app.get("/dashboard",(req,res)=>{
    if(req.session&&req.session.userId){
        res.render("dashboard",{role:req.session.role,firstname:req.session.firstname,lastname:req.session.lastname})

    }
    else res.render("401")
})


/*###########################################################|
#############################################################|

                            DSPAGE

#############################################################|
############################################################*/
app.get("/ds",function(req,res){
    //console.log(req.session.role)
    if(req.session&&req.session.role=="ds"){
        res.render("dspage")
    }
    else res.render("401")

})

app.get("/trainschedule",function(req,res){

})
app.put("/trainschedule",function(req,res){

})
/////////////////////////////////////////////////////

/*###########################################################|
#############################################################|

                            ADMIN

#############################################################|
############################################################*/
app.get("/admin",function(req,res){
    if(req.session&&req.session.role=="ds"){
        res.render("admin")
    }
    else res.render("401")
})
//delete  account
app.delete("/deleteacct",function(res,req){
    if(req.session&&(req.session.role=="admin"||"ds")){
        dbusers.find({}).toArray((err,data)=>{

        })
    }
})
//register account
app.get("/register")
app.post("/register",function(req,res){
    if(req.session&&(req.session.role=="admin"||"ds")){
        dbusers.find({}).toArray((err,data)=>{

        })
    }
})



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

app.get("/getschedule",function(req,res){

})
app.post("/createtrainschedule",function(req,res){

})

app.post("/deltrainschedule",function(req,res){

})



app.listen(process.env.PORT||8090,function(){
          console.log("_._._._🚂-[¤ ¤]-[¤ ¤ ¤]-[¤ ¤ ¤]-[¤ ¤ ¤]_._ ______ railOS server running ")
}
)