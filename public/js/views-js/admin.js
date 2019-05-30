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
function getuserrs(){
    $.post("/getusers",)
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
}
function show(x){
    $(".ctrl.nav-item.active").toggleClass("active")
    console.log(x)
    $("."+x).toggleClass("active")
	var p=document.getElementById("pricepane")
	var s=document.getElementById("schedulepane")
	if(x=="priceb"){
		s.style.display="none"
		s.style.visibility="hidden"
		s.style.zIndex="0"
		p.style.display="block"
		p.style.visibility="visible"
		p.style.zIndex="1"
	}
	else if(x=="scheduleb"){
		p.style.display="none"
		p.style.visibility="hidden"
		p.style.zIndex="0"
		s.style.display="block"
		s.style.visibility="visible"
		s.style.zIndex="1"
	}
}