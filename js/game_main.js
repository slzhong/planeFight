//global variables
var fps = 30;
var canvasDom = document.getElementById('game-battle');
var canvas = canvasDom.getContext('2d');
var canvasWidth = 0, canvasHeight = 0;
var goLeft = false,goRight = false,goUp = false,goDown = false;
var bulletTimeout = 0,enemyTimeout = 0;

//three main characters
//player
var player = {
	color : '#00f',
	x : 0,
	y : 0,
	width : 80,
	height : 80,
	speed : 20,
	draw : function(){
		canvas.fillStyle = this.color;
		canvas.fillRect(this.x, this.y, this.width, this.height);
	},
	shoot: function(){
		var bulletPosX = this.x + this.width/2;
		var bulletPosY = this.y + this.height/2;
		bullets.push(Bullet({
			x : bulletPosX,
			y : bulletPosY
		}));
	},
	explode : function(){
		alert("GAME OVER");
		location.reload();
	}
}
//bullets
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
//enemies
var enemies = [];
function Enemy(I){
	I = I || {};
	I.active = true;
	I.color = '#f00';
	I.x = Math.random()*canvasWidth;
	I.y = 0;
	I.speed = 3;
	I.width = 50;
	I.height = 50;
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
	keys();
	init();
	window.addEventListener('resize',init,true);
	//core
	setInterval(function(){
		update();
		draw();
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

	enemyTimeout++;
	if(enemyTimeout>=80){
		enemies.push(Enemy());
		enemyTimeout=0;
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
	return a.x < b.x+b.width &&
	b.x < a.x+a.width &&
	a.y < b.y+b.height &&
	b.y < a.y+a.height;
}
function collisionHandler(){
	bullets.forEach(function(bullet){
		enemies.forEach(function(enemy){
			if(collides(bullet,enemy)){
				enemy.explode();
				bullet.explode();
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

function keys(){
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

function init(){
	canvasWidth = document.body.clientWidth;
	canvasHeight = document.body.clientHeight;
	canvasDom.width = canvasWidth;
	canvasDom.height = canvasHeight;
	player.x = (canvasWidth-player.width)/2;
	player.y = canvasHeight-player.height-20;
}