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
//
//deletes an element from a datatype
const removeElem=(type,elemName,data)=>{
    let rtD=[]
    //an array
    if(type=="array"&&data[0]!=undefined){
        data.forEach(o=>o!==elemName?rtD.push(o):o)
        return rtD
    }
    //an array-object
    else if(type=="array-object"&&typeof data[0]=="object"){
        let key=Object.keys(elemName)
        data.forEach(o=>o[`${key}`]!==elemName[`${key[0]}`]?rtD.push(o):o)
        return rtD
    }
}
const normalQuery=(vars,val,extra)=>{
    var mockTrip=readFromFile("mocktrip.json")
    mockTrip=JSON.parse(mockTrip)
    
    if(/(name)/.test(vars)){
        r=mockTrip.find(o=>o[`${vars}`]==val)
        r!=undefined?r:r="result not found"
        return r
    }
    else if(/(trip)/.test(vars)&&/(origin|tickettype|date|reason|destination)/i.test(vars)){
        var rtD=[]
        //#TODO optimize this code vv --done
        mockTrip.forEach(k=>{
            k.trips.find(t=>{
                if(t[`${vars}`]==val){
                    const found=rtD.findIndex(o=>o.firstname==k.firstname) //check if it exists in returnData
                    found!=-1?rtD[found].trips.push(t):rtD.push({firstname:k.firstname,lastname:k.lastname,trips:[t] })
                }
                else ""
            })
        })
        return rtD
    }
    else if(/(triptimes)/i.test(vars)){
        var rtD=[];
        let vz=val;
        if(/(:)/i.test(vz)){
            val=val.split(":")
            val=val[1]
        } 
        mockTrip.forEach(o=>{
            if(/(<|lessthan)/i.test(vz)){
                o.trips.length<parseInt(val)?rtD.push(o): ""
            }
            else if(/(>|greaterthan)/i.test(vz)){
                    o.trips.length>parseInt(val)?rtD.push(o): ""
            }
            else if(/(=|equalto)/i.test(vz)){
                o.trips.length==parseInt(val)?rtD.push(o):""
            }
        })
        return rtD;
    }

    
}
const advQuery=(x,data)=>{
    console.log("here")
    return "advQuery"
}
exports.processQuery=(x)=>{
    let q
    const{vars,val,cmd}=x
    console.log(cmd)
    if (cmd==undefined){
        q=normalQuery(vars,val)
        return q
    }
    else if(cmd=="with"||"without"){
        q=advQuery(x,a)
        return q;   
    }
    return q
   
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