//global variables
var fps = 30;
var canvasDom = document.getElementById('game-battle');
var canvas = canvasDom.getContext('2d');
var canvasWidth = 0 , canvasHeight = 0;
var goLeft = false , goRight = false , goUp = false , goDown = false;
var bulletTimeout = 0;
var playerImg = new Image();
playerImg.src = 'img/player.png';
var enemyImg = new Image();
enemyImg.src = 'img/enemy.png';
var score = 0;
var level = 0;
var scoreBoard = document.getElementById('score-num');
var levelBoard = document.getElementById('score-level');
var touchable = 'createTouch' in document;

var player = {
	color : '#00f',
	x : 0,
	y : 0,
	width : 120,
	height : 120,
	speed : 20,
	draw : function(){
		canvas.drawImage(playerImg,this.x,this.y);
	},
	shoot: function(){
		var bulletPosX = this.x + this.width/2;
		var bulletPosY = this.y + this.height/2;
		bullets.push(Bullet({
			x : bulletPosX-3,
			y : bulletPosY
		}));
	},
	explode : function(){
		alert('GAME OVER\nYOU SHOT DOWN '+score+' ENEMIES');
		location.reload();
	}
}

var bullets = [];
function Bullet(I){
	I.active = true;
	I.speed = 25;
	I.width = 5;
	I.height = 30;
	I.color = '#f40';
	I.inBounds = function(){
		return I.x >= 0 &&
		I.x <= canvasWidth &&
		I.y >= 0 &&
		I.y <= canvasHeight;
	};
	I.draw = function(){
		canvas.fillStyle = this.color;
		canvas.fillRect( this.x, this.y, this.width, this.height);
	};
	I.update = function(){
		I.y -= I.speed;
		I.active = I.active && I.inBounds();
	};
	I.explode = function(){
		this.active = false;
	};
	return I;
}

var enemies = [];
function Enemy(I){
	I = I || {};
	I.active = true;
	I.color = '#f00';
	I.x = Math.random()*canvasWidth;
	I.y = 0;
	I.speed = Math.random()*6;
	I.width = 70;
	I.height = 120;
	I.inBounds = function(){
		return I.x >= 0 &&
		I.x <= canvasWidth &&
		I.y >= 0 &&
		I.y <= canvasHeight;
	};
	I.draw = function(){
		canvas.drawImage(enemyImg,this.x,this.y);
	};
	I.update = function(){
		I.y += I.speed;
		I.active = I.active && I.inBounds();
	};
	I.explode = function(){
		this.active = false;
	};
	return I;
}

window.onload = function(){
	//initialize
	control();
	init();
	window.addEventListener('resize',init,true);
	//core
	var core = setInterval(function(){
		draw();
		update();
	},1000/fps);
}

function update(){
	if(goLeft && player.x >= 0){
		player.x -= player.speed;
	}
	if(goRight && player.x <= canvasWidth-player.width){
		player.x += player.speed;
	}
	if(goUp && player.y >= 0){
		player.y -= player.speed;
	}
	if(goDown && player.y <= canvasHeight-player.height){
		player.y += player.speed;
	}
	
	bulletTimeout++;
	if(bulletTimeout>=10){
		player.shoot();
		bulletTimeout = 0;
	}
	bullets.forEach(function(bullet){
		bullet.update();
	});
	bullets = bullets.filter(function(bullet){
		return bullet.active;
	});

	if(Math.random()>0.99-0.01*level){
		enemies.push(Enemy());
	}
	enemies.forEach(function(enemy){
		enemy.update();
	});
	enemies = enemies.filter(function(enemy){
		return enemy.active;
	});

	collisionHandler();
}

function draw(){
	canvas.clearRect(0, 0, canvasWidth, canvasHeight);
	player.draw();
	bullets.forEach(function(bullet){
		bullet.draw();
	});
	enemies.forEach(function(enemy){
		enemy.draw();
	});
}

function collides(a,b){
	return a.x < b.x+b.width-20 &&
	b.x < a.x+a.width-20 &&
	a.y < b.y+b.height-20 &&
	b.y < a.y+a.height-20;
}
function collisionHandler(){
	bullets.forEach(function(bullet){
		enemies.forEach(function(enemy){
			if(collides(bullet,enemy)){
				enemy.explode();
				bullet.explode();
				score++;
				level = parseInt(score/10);
				scoreBoard.innerHTML = score;
				levelBoard.innerHTML = level;
			}
		});
	});
	enemies.forEach(function(enemy){
		if(collides(enemy,player)){
			enemy.explode();
			player.explode();
		}
	});
}

function control(){
	if(touchable){
		canvasDom.addEventListener('touchmove' , function(event){
			event.preventDefault();
			if(event.targetTouches.length == 1){
				player.x = event.targetTouches[0].pageX-player.width/2;
				player.y = event.targetTouches[0].pageY-player.height-80;
			}
		} , false);
	}
	else{
		document.onkeydown = function(e){
			var e = e || event;
			var curKey = e.keyCode || e.which || e.charCode;
			switch(curKey){
				case 37 : ;
				case 65 : goLeft=true;
				break;
				case 39 : ;
				case 68 : goRight=true;
				break;
				case 38 : ;
				case 87 : goUp=true;
				break;
				case 40 : ;
				case 83 : goDown=true;
				break;
				default: break;
			}
		}
		document.onkeyup = function(e){
			var e = e || event;
			var curKey = e.keyCode || e.which || e.charCode;
			switch(curKey){
				case 37 : ;
				case 65 : goLeft=false;
				break;
				case 39 : ;
				case 68 : goRight=false;
				break;
				case 38 : ;
				case 87 : goUp=false;
				break;
				case 40 : ;
				case 83 : goDown=false;
				break;
				default: break;
			}
		}
	}
}

function init(){
	canvasWidth = document.body.clientWidth;
	canvasHeight = document.body.clientHeight;
	canvasDom.width = canvasWidth;
	canvasDom.height = canvasHeight;
	player.x = (canvasWidth-player.width)/2;
	player.y = canvasHeight-player.height-20;
}