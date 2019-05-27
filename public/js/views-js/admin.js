$(".createuser").submit(function(event) {
    // Stop the browser from submitting the form.
    event.preventDefault();
    $.post("/createuser",{username:$('.createuser#user').val(),firstname:$('.createuser#firstname').val(),lastname:$('.createuser#lastname').val(),password:$('.createuser#pwd').val(),role:$('.createuser#role'),station:$('createuser#station')},function(response){
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