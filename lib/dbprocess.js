const fs=require("fs")
const path=require("path")

writeToFile=(filename,data)=>{
    fs.writeFileSync(path.join(__dirname,filename),data)
   // console.log(t)
    return true
}
readFromFile=(filename)=>{
    var a=fs.readFileSync(path.join(__dirname,filename),{encoding:"utf-8"})
    a=JSON.parse(a)
    return a
}


exports.getDash=(no)=>{
    var rd=readFromFile("dashboards.json")
    rd.panes[0].widgets[0].settings.value=no
    rd.datasources[0].settings.url=rd.datasources[0].settings.url+"/"+no
    //console.log(rd.panes[0].widgets[0].settings.value)
    //console.log("_______")
    //console.log("here>>>  ",rd.datasources[0].settings.url)
    //console.log(rd)
    return rd
}
exports.sndDash=()=>{
    var rd=readFromFile("dashboards.json")
    return rd
}

exports.saveDash=(data)=>{
    data=JSON.stringify(data)
    writeToFile("dashboards.json",data)
    return true
}

