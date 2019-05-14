function login(){
	$.post("/login",{username:$('#user').val(),password:$('#pwd').val()},function(response){
		window.loaction("/ds")
	})
}
