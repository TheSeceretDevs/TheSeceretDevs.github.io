/* Javascript */
var game = {
	gameMode : null,
	checkGameMode : function() {
		//for now I'm not going to do the html prompt, so I'll use the built in method prompt()
		var gameMode = prompt("Select your game mode please.\nType \"local\" to play offline.\n Type \"online\" for plaing online ");
		if(gameMode.toLowerCase() === "local"){
			game.initializeLocal();
		}
		if(gameMode.toLowerCase() === "online"){
			alert("Sorry, online play is not available right now.\nYou have been automatically switched to offline");
			game.initializeLocal();
		}
	},
	initializeLocal : function() {
		//this is also to be more orginized with O.O.P. instead of putting it in boot()
		//for those that don't know O.O.P. is Object Oriented Programming, and it's very useful (google it!)
		player.weapons.bulletPower = 1;
		player.weapons.bulletSpeed = 0.5;
		//200 for fun mode :D (1000 for boring realistic mode)
		player.weapons.reloadTime = 200;
		game.gameMode = "local";
	},
	reloadBar : {
		reloading : false,
		newWidth : null,
		tryReload : function() {
			if(game.reloadBar.reloading === true){

			}
			if(game.reloadBar.reloading === false){
				game.reloadBar.reloading = true;
				var x = document.getElementsByClassName("LLBar")[0];
				x.style.width = "0px";
				game.reloadBar.newWidth = 0;
				//dividing up the width of the reload bar and how long I want it to take.
				var updateInterval = 300 / player.weapons.reloadTime;
				//setting the interval, and yes the variables carry through, I tested.
				var d = new Date();
				var rn =  d.getTime(d.toDateString());
				var reload = window.setInterval(function(){
					if(game.reloadBar.newWidth >= 300){
						game.reloadBar.reloading = false;
						var nd = new Date();
						console.log(nd.getTime(nd.toDateString()) - rn)
						//fixing porblem where it doesn't catch the div in time
						x.style.width = "300px"
						window.clearInterval(reload)
					}
					else{
					var adder = (game.reloadBar.newWidth + updateInterval) * 1.0189;
					game.reloadBar.newWidth = adder;//* 1.009;
					x.style.width = game.reloadBar.newWidth.toString() + "px";						
					}

				},1)
			}
		}
	}
};
var player = {
	DOM : function(){
		//if the array is a property, you can't select a certain Node, so I returned it with a function
		var x = document.getElementsByClassName("box1")[0];
		return x;
	},
	x : function() {
		var a = player.DOM().style.transform;
		var p1 = a.search("e") + 2;
		var p2 = a.search("\,");
		var re = a.substring(p1,p2)
		return re;
	},
	y : function(options) {
		var a = player.DOM().style.transform;
		var p1 = a.search("\,") + 2;
		var p2 = a.length - 1;
		var re = a.substring(p1,p2)
		return re;
	},
	pause : true,
	togglePause : function() {
		//so the second toggle condition statement doesn't run.
		var dontrun = false
		if(player.pause === false){
			document.onmousemove = function(){return "PAUSED"};
			player.pause = true;
			dontrun = true
		}
		if(player.pause === true && dontrun === false){
			player.initialize();
			player.pause = false;
		}
	},
	initialize : function(){
			//This would normally be in boot(), However just to make everything more oragnized I put it in the object
			//Also I used this in the togglePause() property
			document.onmousemove = function(event){
				/*
				console.log("[" 
						+ event.clientX.toString() 
						+ "] ["
					    + event.clientY.toString() 
					    + "]");
				*/
				//follows your cursor by using the css transform proporty
				player.DOM().style.transform 
						= "translate(" 
						+ (event.clientX - 15)
						+ "px," 
						+ (event.clientY -13) 
						+ "px)";
				};
				document.onkeypress = function(event) {
				if(player.pause === false){
					//while in-game
					var key = event.which || event.keyCode;
					if(key == 32){
						player.shoot();
					}
				}
				if(player.pause === true){
					//so that when the game's paused and you <press a key> on something it doesn't just randomly do something in-game
					console.log("you are paused")
				}
			};
	},
	weapons : {
		//for damage
		bulletPower : null
		,
		//number 0.5 is pretty fast (goes into 0.5s in my fireBullet() function)
		bulletSpeed : null
		,
		//denominator for game.reloadBar.tryReload variable "updateInterval"
		reloadTime : null
	},
	shoot : function(){
		if(game.reloadBar.reloading === false){
			fireBullet(
 				player.weapons.bulletPower,
 				player.weapons.bulletSpeed,
 				(Number(player.x().substring(0,player.x().length - 2)) + 30).toString() + "px",
 				(Number(player.y().substring(0,player.y().length - 2)) - 7.5).toString() + "px"
 			)
		}
		game.reloadBar.tryReload();
	}
};
function fireBullet(power,velocity,startx,starty){
	/*The Power goes into a property called "damage" on the Node itself,
	 *Velocity is actually the transition time
	 *After all properties are set and the Node is appended to the body, A
	 *	setTimeout()
	 *Is initiated to fire 50 milliseconds later,
	 *What it does is set the transfrom property for the node to translate to the width of the screen (The very far right edge)
	 *The reason for this is a race condition. The computer is trying to do everything instantly, So technacally
	 *The translate would happen at the same time as the transition property is set. Therefore it would transition instantly, and the process
	 *The code that slows transitions.
	 *startingPos is just for the effect that the bullet is being "shot" from somewhere
	 *REMEMBER to add "px" to the end of start x and starty, the player module will do it for you in .x() and .y() but if you call the function
	 *on your own you need to add it.
	 */
	var x = document.createElement("DIV");
	x.className = "GameBullet";
	//putting in place to start
	x.style.transform = "translate(" + startx + "," + starty + ")";
	/*this is to make sure the velocity of the bullet is consistent no matter where the bullet is shot.
	 *If the bullet is shot right before the edge of the screen and the velocity is a direct input, it will travel at a muc hslower speed
	 *than if it is shot at the left edge of the screen.
	 *This is because the computer is trying to make the bullet traveling time last the same amout no matter where it is shot.
	*/
	x.style.transition = "all " + ((velocity/window.innerWidth) * (window.innerWidth - Number(player.x().substring(0,player.x().length - 2)))).toString() + "s";
	x.damage = power;
	document.body.appendChild(x);
	setTimeout(function(){
		x.style.transform = "translate(" + window.innerWidth + "px," + starty + ")";
		setTimeout(function(){
			document.body.removeChild(x);
		},velocity * 1000)
	},25);
};
function boot (num) {
	switch(num){
		case 0:
		//checks gamemode
		game.checkGameMode();
		document.getElementsByClassName("reloadBox")[0].style.top = (window.innerHeight - 65).toString() + "px";
		//starts player code
		player.initialize();
		//at the end so there's no confusion
		player.togglePause();
		break;
	}
};
/*
 *For safe keeping:
 *(Number(starty.substring(0,starty.length-2)) - height/2) <-- for middle of div
 *NEW for input ^^^:
 *(Number(player.y().substring(0,player.y().length - 2)) - 7.5)
 *FOR:
 *fireBullet(100,0.7,player.x(),(Number(player.y().substring(0,player.y().length - 2)) - 7.5).toString() + "px")
 *NEWERR VERSION:
 The 30 in the x represents the width and the 7.5 represents half the width (middle)
 *fireBullet(100,0.7,(Number(player.x().substring(0,player.x().length - 2)) + 30).toString() + "px",(Number(player.y().substring(0,player.y().length - 2)) - 7.5).toString() + "px")
 *OR:
 fireBullet(
 	100,
 	0.7,
 	(Number(player.x().substring(0,player.x().length - 2)) + 30).toString() + "px",
 	(Number(player.y().substring(0,player.y().length - 2)) - 7.5).toString() + "px"
 	)
*/