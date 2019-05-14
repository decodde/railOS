var express=require("express")
var app=express()

app.use(require('body-parser')());

app.set('views',__dirname+"/views")
app.use(express.static(__dirname+"/public"))

app.set('view engine',  'pug');

app.get("/",function(req,res){
		res.render("dspage")
})

app.post("/login",function(req,res){
		console.log(req.body.username+"  "+req.body.password)
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



app.listen(process.env.port||8090,function(){
          console.log("_._._._🚂-[¤ ¤]-[¤ ¤ ¤]-[¤ ¤ ¤]-[¤ ¤ ¤]_._ ______ railOS server running ")
}
)