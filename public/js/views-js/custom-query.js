$(".search").submit(function(event){
    event.preventDefault()
    submitquery()

})
let querysample={username:"French",station:"GB"}
function submitquery(){
    $.post("/customer-query",querysample,(response)=>{
        console.log(response)
    })
}