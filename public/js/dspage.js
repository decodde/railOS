function show(x){
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
function getschedule(){
	
}
function updschedule(){
	
}
function delschedule(){
	
}
function getprice(){
	
}
function updprice(){
	
}
function delprice(){
	
}
