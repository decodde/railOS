$(".createuser").submit(function(event) {
    // Stop the browser from submitting the form.
    event.preventDefault();
    let pwd0=$('.createuser #pwd').val()
    if(pwd0==""){
        pwd0=$('.createuser #firstname').val()
    }
    $.post("/register",{username:$('.createuser #user').val(),
                        firstname:$('.createuser #firstname').val(),
                        lastname:$('.createuser #lastname').val(),
                        password:pwd0,role:$('.createuser #role').val(),
                        station:$('.createuser #station').val()},
                        function(response){
                            if(!response.value){

                                noty("top","right",response.string,"3000","fail")
                                console.log(response.string)
                                }
                            else if(response.value){
                                noty("top","right",response.string,"3000","success")
                                console.log(response.string)
                            }
                })

});

function noty(from, align,msg,time,type){

  $.notify({
      icon: "add_alert",
      message: msg

  },{
      type: type,
      timer: time,
      placement: {
          from: from,
          align: align
      }
  });
};
function getusers(){
    $.get("/getusers",{dta:"p"},(response)=>{
        console.log(response)
        if(response.value){
            if(response.data.length>0){
                $("#datazone").empty()
                for(let i=0;i<response.data.length;i++){
                    $("#datazone").append(`<div class="card ${response.data[i]._id}"
                     style="padding:10px"><span style="float:left"><span>Firstname : ${response.data[i].firstname}</span>  
                     &nbsp;&nbsp;&nbsp;<span>Lastname :  ${response.data[i].lastname}</span><br><span>Username : ${response.data[i].username}</span>&nbsp;&nbsp;&nbsp;<span>Role : ${response.data[i].role}</span></span><span style="float:right"><span id=${response.data[i]._id} class="btn btn-warning" onclick="del(this.id)">Delete User</span><span id=${response.data[i]._id}
                    class="btn btn-info" onclick="edit(this.id,'${response.data[i].username}','${response.data[i].firstname}','${response.data[i].lastname}','${response.data[i].role}','${response.data[i].station}')`+`">Edit User</span></span></div>`).children(':last').hide().fadeIn(1000)
                }
            }
            else if(response.data.length==0){

            }
        }
    })
}

function del(x){
    console.log("delete "+x)
    Swal.fire({
  title: 'Are you sure?',
  text: "You won't be able to revert this!",
  type: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete user'
}).then((result) => {
  if (result.value) {
      console.log("here")
      $.post("/deleteacct",{id:x},(response)=>{
        if(response.value){
            $("div ."+x).remove()
            noty("top","right",response.string,"3000","success")
        }
        else if(!response.value){
            noty("top","right",response.string,"3000","fail")
        }
    })
  }
})

}
function edit(x,uname,fname,lname,role,station){
    Swal.fire({
  title: `Edit User ${x}`,
  html:
    `<input class="swal2-input" value='${uname}'  placeholder="username" type="text" id="euname" required>`+
    `<input class="swal2-input" value='${fname}'  placeholder="firstname" type="text" id="efname" required>`+
    `<input class="swal2-input" value='${lname}'  placeholder="lastname" type="text" id="elname" required>`+
    `<input class="swal2-input" value='${role}'  placeholder="role" type="text" id="erole" required>`+
    `<input class="swal2-input" value='${station}'  placeholder="station" type="text" id="estation" required>`,
  focusConfirm: false,
  preConfirm: () => {
      let newusername=$("#euname").val()
      let newfirstname=$("#efname").val()
      let newlastname=$("#elname").val()
      let newrole=$("#erole").val()
      let newstation=$("#estation").val()
    $.post("/upduser",{user:x,newusername:newusername,newfirstname:newfirstname,newlastname:newlastname,newrole:newrole,newstation:newstation},(response)=>{
        if(response.value){
            noty("top","right",response.string,"3000","success")
            getusers()
        }
        else if(!response.value){
            noty("top","right",response.string,"3000","fail")
        }
    })
  }
})
}
logout=()=>{
    $.post("/logout",{},(r)=>{r.value?window.location="/":noty(top,right,r.string,1000,"fail")})
}
function noty(from, align,msg,time,type){

    $.notify({
        icon: "add_alert",
        message: msg

    },{
        type: type,
        timer: time,
        placement: {
            from: from,
            align: align
        }
    });
};