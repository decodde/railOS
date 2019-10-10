const fs=require("fs")
const path=require("path")

writeToFile=(filename,data)=>{fs.writeFileSync(path.join(__dirname,filename),data);return true}
readFromFile=(filename)=>{var a=fs.readFileSync(path.join(__dirname,filename),{encoding:"utf-8"});return a}
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
    else if(cmd!==undefined){
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
exports.getLocomotives=()=>{
    var a=readFromFile("locomotives.json")
    a=JSON.parse(a)
    return a
}
exports.saveLocationData=(locomotiveNumber,locomotiveDetails)=>{
    var todaysDate=new Date()
    todaysDate=`${todaysDate.getDay()}-${todaysDate.getMonth()}-${todaysDate.getFullYear()}`
    var a=fs.existsSync(path.join(__dirname+`/locomotives/${locomotiveNumber}/${todaysDate}`))
    var b=fs.existsSync(path.join(__dirname+`/locomotives/${locomotiveNumber}/_tempData.json`))
    if(b){
        var tempData=readFromFile(`/locomotives/${locomotiveNumber}/_tempData.json`)
        tempData=JSON.parse(tempData)
        tempData.push(locomotiveDetails)
        tempData=JSON.stringify(tempData,null,"\t")
        writeToFile(`/locomotives/${locomotiveNumber}/_tempData.json`,tempData)
    }
    if(a){
        var todaysExistingTrip=readFromFile(`/locomotives/${locomotiveNumber}/${todaysDate}/trips.json`)
        todaysExistingTrip=JSON.parse(todaysExistingTrip)
        todaysExistingTrip.push(locomotiveDetails)
        todaysExistingTrip=JSON.stringify(todaysExistingTrip,null,"\t")
        writeToFile(`/locomotives/${locomotiveNumber}/${todaysDate}/trips.json`,todaysExistingTrip)
    }
    else{
        var _blankArr=[]
        _blankArr.push(locomotiveDetails)
        fs.mkdirSync(path.join(__dirname,`/locomotives/${locomotiveNumber}/${todaysDate}`))
        writeToFile(`/locomotives/${locomotiveNumber}/${todaysDate}/trips.json`,JSON.stringify(_blankArr,null,"\t"))
    }
}
exports.confirmLoco=(locoNo,locoCode)=>{
    var locos =readFromFile("locomotives.json")
    locos=JSON.parse(locos)
    var ind=locos.findIndex(o=>o.locomotiveNumber==locoNo&&locoCode==o.locomotiveCode)
    if(ind==-1) return false
    else return true
}
exports.createLocomotive=(locomotiveNumber,locomotiveDetails)=>{
    var locos =readFromFile("locomotives.json")
    locos=JSON.parse(locos)
    var ind=locos.findIndex(o=>o.locomotiveNumber==locomotiveNumber)
    if(ind!=-1) return {type:"error",message:"Locomotive Already Created",code:"RO_LOCO_CREATE_404"}
    else {
        locomotiveDetails.locomotiveCode="000000000"
        locos.push(locomotiveDetails)
        locos=JSON.stringify(locos,null,"\t")
        writeToFile("locomotives.json",locos)
        fs.mkdirSync(path.join(__dirname,`locomotives/${locomotiveNumber}`))
        var _blankArr=[]
        _blankArr=JSON.stringify(_blankArr,null,"\t")
        writeToFile(`/locomotives/${locomotiveNumber}/_tempData.json`,_blankArr)
        return {type:"success",message:`Created Locomotive ${locomotiveNumber} Successfully`,code:"RO_LOCO_CREATE_200"}
    }
}
exports.checkLocoExists=(lNumber)=>{
    var locos =readFromFile("locomotives.json")
    locos=JSON.parse(locos)
    //console.log(locos.findIndex(o=>o.locomotiveNumber==lNumber))
    var ind=locos.findIndex(o=>o.locomotiveNumber==lNumber)
    if(ind==-1) return false
    else return true
}
exports.deleteLocomotive=(locomotiveNumber)=>{
    var locos =readFromFile("locomotives.json")
    locos=JSON.parse(locos)
    //console.log(locos.findIndex(o=>o.locomotiveNumber==lNumber))
    var ind=locos.findIndex(o=>o.locomotiveNumber==locomotiveNumber)
    locos.splice(ind,1)
    locos=JSON.stringify(locos,null,"\t")
    fs.rmdirSync(path.join(__dirname,`locomotives/${locomotiveNumber}/`))
    writeToFile("locomotives.json",locos)
    return {type:"success",code:"RO_LOCO_DELETE_200",message:`Deleted Locomotive "${locomotiveNumber}" Successfully`}
}