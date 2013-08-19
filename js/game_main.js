//global variables
var fps = 30;
var canvasDom = document.getElementById('game-battle');
var canvas = canvasDom.getContext('2d');
var goLeft=false,goRight=false,goUp=false,goDown=false;

var player = {
	color : '#00f',
	x : 0,
	y : 0,
	width : 80,
	height : 80,
	draw : function(){
		canvas.fillStyle = this.color;
		canvas.fillRect(this.x, this.y, this.width, this.height);
	}
}

window.onload = function(){
	//initialize
	keys();
	init();
	window.addEventListener('resize',init,true);
	//core
	setInterval(function(){
		update();
		draw();
	},1000/fps);
}

function keys(){
	document.onkeydown = function(e){
		var e = e || event;
		var currKey = e.keyCode || e.which || e.charCode;
		switch
	}
	document.onkeyup = function(e){
		goLeft=false;
		goRight=false;
		goUp=false;
		goDown=false;
	}
}

function init(){
	canvasDom.width = document.body.clientWidth;
	canvasDom.height = document.body.clientHeight;
	player.x = (canvasDom.width-80)/2;
	player.y = canvasDom.height-100;
}

function update(){

}

function draw(){
	canvas.clearRect(0, 0, canvas.width, canvas.height);
	player.draw();
}