function login(){
	$.post({username:$('#user').val(),password:$('#pwd').val()},function(response){
		console.log(response)
	})
}
