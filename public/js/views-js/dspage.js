$(".search").submit(function(event) {
    // Stop the browser from submitting the form.
    event.preventDefault();
    $.post("/customer-query",{query:"d",filter},function(response){
		if(!response.value){
            $('#details').text(response.string)
            console.log(response)
            }
        else if(response.value){
            window.location="/dashboard"
        }

	})
    // TODO
});
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