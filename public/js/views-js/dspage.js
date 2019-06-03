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