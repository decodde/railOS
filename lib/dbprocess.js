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
const normalQuery=(vars,val,extra)=>{
    var a=readFromFile("mocktrip.json")
    a=JSON.parse(a)
    if (extra){

    }
    else {
        if(/(name)/.test(vars)){
            r=a.find(o=>o[`${vars}`]==val)
            r!=undefined?r:r="result not found"
            return r
        }
        else if(/(trip)/.test(vars)&&/(origin|tickettype|date|reason|destination)/i.test(vars)){
            var rtD=[]
            //#TODO optimize this code vv
            a.forEach(k=>{
                k.trips.find(t=>{
                    if(t[`${vars}`]==val){
                        const found=rtD.findIndex(o=>o.firstname==k.firstname)
                       /* for(var v=0;v<rtD.length;v++){
                            if(rtD[v].firstname==k.firstname) found=v;
                            else {found=null ;/*console.log("did not find oooo: ",rtD[v].firstname," | ",k.firstname);}*/
                        //}
                        //console.log(found)
                        if(found!=-1){
                             //console.log("found existing>>> ",rtD[found].firstname," | ",k.firstname)
                             rtD[found].trips.push(t)
                        }
                        else{
                            //console.log("did not find oooo: "," | ",k.firstname)
                            rtD.push({
                                firstname:k.firstname,
                                lastname:k.lastname,
                                trips:[t]
                            })
                        }
                    }
                    else ""
                } )
            })
            
           return rtD
        }
        else if(/(triptimes)/i.test(vars)){
            var rtD=[];
            a.forEach(o=>{
                if(/(<|lessthan)/i.test(val)){
                    o.trips.length<parseInt(val)?rtD.push(o): ""
                }
                else if(/(>|greaterthan)/i.test(val)){
                     o.trips.length>parseInt(val)?rtD.push(o): ""
                }
                else if(/(=|equalto)/i.test(val)){
                    o.trips.length==parseInt(val)?rtD.push(o):""
                }
            })
            return rtD;
        }
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