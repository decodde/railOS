const express=require('express')
const app=express();
var bodyparser=require('body-parser')

app.use(express.static(__dirname+'/views'))

app.set('view engine','pug');

app.get('/',function(req,res){
    res.render('home')
})
app.post('/login',function(req,res){
    
})
app.listen(8090,function(){
    console.log('railOS server running')
})
