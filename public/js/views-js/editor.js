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