const fs=require("fs")
const path=require("path")

writeToFile=(filename,data)=>{fs.writeFileSync(path.join(__dirname,filename),data);return true}

readFromFile=(filename)=>{var a=fs.readFileSync(path.join(__dirname,filename),{encoding:"utf-8"});return a}

fp=(x,y,z)=>{
    console.log("here")
     if(extra=""||null||undefined){
       
    }
    else{

    }
}
exports.processQuery=(vars,val,extra)=>{
    var a=readFromFile("mocktrip.json")
    a=JSON.parse(a)
    if(/(name)/.test(vars)){
        r=a.find(o=>o[`${vars}`]==val)
        console.log(r)
        r!=undefined?r:r="result not found"
        return r
    }
    else{
        var d=[]
        var k=[]
        a.forEach(o=>{
            o.trips.find(x=>{
                x[`${vars}`]==val?k.push(x):k
            
            })
            
        })
        d.push(k)
        d.length>1?d:d="result not found"
        
        return d
    } 
   
   
}

exports.getDash=(no)=>{
    var rd=readFromFile("dashboards.json")
    rd=JSON.parse(rd)
    rd.panes[0].widgets[0].settings.value=no
    rd.datasources[0].settings.url=rd.datasources[0].settings.url+"/"+no
    /*onsole.log(rd.panes[0].widgets[0].settings.value)
    console.log("_______")
    console.log("here>>>  ",rd.datasources[0].settings.url)
    console.log(rd)*/
    rd=JSON.stringify(rd)
    return rd
}
exports.sndDash=()=>{ var rd=readFromFile("dashboards.json"); return rd}

exports.saveDash=(data)=>{writeToFile("dashboards.json",data);return true}

exports.getSess=(x)=>{
    var dt={
        role:x.session.role,
        firstname:x.session.firstname,
        lastname:x.session.lastname,
    }
    return dt
}