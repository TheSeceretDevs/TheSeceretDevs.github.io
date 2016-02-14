/* Javascript */
function MoveBar(){
	var x = document.getElementsByClassName("sideBar")[0];
	if(x.style.transform === "translate(-180px, 0px)"){
		x.style.transform = "translate(" + 0 + "px," + 0 + "px)";
	}
	else{
		x.style.transform = "translate(-180px," + 0 + "px)";
	}


	
	return "done";
};
function boot (num) {
	switch(num){
		case 0:
		document.getElementsByClassName("sideBar")[0].style.transform = "translate(-180px,0px)";
		console.log("finished boot: " + num )
		break;
	}
}