/*	TODO	
 *
 *
 *
 */

//Canvas
var canvas = document.getElementById("gc");
var ctx = canvas.getContext("2d");
var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;
document.body.appendChild(canvas);

//Background
var background = function () {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
};

//Paddles
var pl_Paddle = {
	width: 15,
	height: (canvas.height / 8),
	speed: 300,
	x: (canvas.width / 20),
	y: (canvas.height / 2) - ((canvas.height / 8) / 2),
};

var pl_Draw = function () {
	ctx.fillStyle = "white";
	ctx.fillRect(pl_Paddle.x, pl_Paddle.y, pl_Paddle.width, pl_Paddle.height);
};

var comp_Paddle = {
	width: 15,
	height: (canvas.height / 8),
	speed: 300,
	x: (canvas.width - (canvas.width / 20)),
	y: (canvas.height / 2) - ((canvas.height / 8) / 2),
};

var comp_Draw = function () {
	ctx.fillStyle = "white";
	ctx.fillRect(comp_Paddle.x, comp_Paddle.y, comp_Paddle.width, comp_Paddle.height);
};

//Ball
var ball = {
	width: 8,
	height: 8,
	speed: 300,
	x: (canvas.width / 2) - 4,
	y: (canvas.height / 2) - 4,
	//dx: 0,
	//dy: 0,
};

var ball_Draw = function () {
	ctx.fillStyle = "white";
	ctx.fillRect(ball.x, ball.y, ball.width, ball.height);
};

//Divider
if (!ctx.setLineDash) {
	ctx.setLineDash = function () {}
};

var divider_Draw = function () {
	ctx.beginPath();
	ctx.lineWidth = 4;
	ctx.strokeStyle = "#8c8c8c";
	ctx.setLineDash([30]);
	ctx.moveTo((canvas.width / 2 ), 0);
	ctx.lineTo((canvas.width / 2 ), canvas.height);
	ctx.stroke();
};

//Collision
var collision = function (modifier) {
	//Ball collisions
	if (ball.x <= 0) { //Hits left wall
		comp_Score += 1;
		comp_Last_Score = 1;
		reset();
	}
	if (ball.x >= canvas.width - 8) {	//Hits right wall
		pl_Score += 1;
		pl_Last_Score = 1;
		reset();
	}
	if (ball.y <= 0) {	//Hits top
		ball.dy = Math.abs(ball.dy);
	}
	if (ball.y >= canvas.height - 8) {	//Hits bottom
		ball.dy = ball.dy * -1;
	}

	//Player paddle collision
	if (pl_Paddle.y <= 0) {	//Paddle hits top
		pl_Paddle.y += pl_Paddle.speed * modifier;
	}
	if (pl_Paddle.y >= canvas.height - pl_Paddle.height) {	//Paddle hits bottom
		pl_Paddle.y -= pl_Paddle.speed * modifier;
	}
	if (ball.x <= pl_Paddle.x + pl_Paddle.width && ball.y >= pl_Paddle.y && ball.y <= pl_Paddle.y + pl_Paddle.height) {
		ball.dx = Math.abs(ball.dx);
	}

	//Comp paddle collision
	if (comp_Paddle.y <= 0) {	//Paddle hits top
		comp_Paddle.y += comp_Paddle.speed * modifier;
	}
	if (comp_Paddle.y >= canvas.height - comp_Paddle.height) {	//Paddle hits bottom
		comp_Paddle.y -= comp_Paddle.speed * modifier;
	}
	if (ball.x + ball.width >= comp_Paddle.x && ball.y >= comp_Paddle.y && ball.y <= comp_Paddle.y + comp_Paddle.height) {	//Paddle hits ball
		ball.dx = ball.dx * -1;
	}
};

//AI
var comp_AI = function (modifier) {
	if (ball.dx == 1) {	//Heading towards comp
		//console.log("Y: " + y_Check);
		if (comp_Paddle.y + (comp_Paddle.height / 2) >= ball.y) {
			comp_Paddle.y -= comp_Paddle.speed * modifier;
		}
		if (comp_Paddle.y + (comp_Paddle.height / 2) <= ball.y) {
			comp_Paddle.y += comp_Paddle.speed * modifier;
		}
		if (comp_Paddle.y - comp_Paddle.height <= ball.y) {
			comp_Paddle.y = comp_Paddle.y;
		}
		if (comp_Paddle.y - comp_Paddle.height >= ball.y) {
			comp_Paddle.y = comp_Paddle.y;
		}
	}
};

//Score
var pl_Score = 0;
var pl_Win = false;
var pl_Wins = 0;
var pl_Last_Score = 0
var comp_Score = 0;
var comp_Win = false;
var comp_Wins = 0;
var comp_Last_Score = 0
var win = 10; //Max score

var score_Draw = function () {
	ctx.fillStyle = "#8c8c8c";
	ctx.font ="30px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseLine = "top";
	ctx.fillText("Wins: " + pl_Wins + " Score : " + pl_Score, 50, 50);
	ctx.textAlign = "right";
	ctx.fillText("Wins: " + comp_Wins + " Score : " + comp_Score, canvas.width - 50 , 50);
};

//Game States
var game_Start = true;
var game_State = false;
var pause_State = false;
var game_Over = function () {
	if (pl_Score == win) {
		pl_Win = true;
		pl_Wins += 1;
		game_Reset();
	}
	if (comp_Score == win) {
		comp_Win = true;
		comp_Wins += 1;
		game_Reset();
	}
};

var start_Draw = function () {
	ctx.fillStyle = "white";
	ctx.font = "70px Arial";
	ctx.textAlign = "center";
	ctx.textBaseLine = "middle";
	ctx.fillText("Press SPACE to start", canvas.width / 2, canvas.height / 2);
}

//Reset
var reset = function () {
	//Player paddle
	pl_Paddle.x = (canvas.width / 20);
	pl_Paddle.y = (canvas.height / 2) - ((canvas.width / 8) / 2);

	//Computer paddle
	comp_Paddle.x = (canvas.width - (canvas.width / 20));
	comp_Paddle.y = (canvas.height / 2) - ((canvas.width / 8) / 2);

	//Ball
	ball.x = (canvas.width / 2) - 4;
	ball.y = (canvas.height / 2) - 4;

	if (pl_Last_Score == 1) {
		ball.dx = 1;
		pl_Last_Score = 0;
	}
	if (comp_Last_Score == 1) {
		ball.dx = -1;
		comp_Last_Score = 0;
	}

	var yd_Check = Math.random();
	if (yd_Check <= 0.5) {	//Goes Up
		ball.dy = -1;
	}
	if (yd_Check >= 0.5) {	//Goes Down
		ball.dy = 1;
	}

	var max = 0.75;
	var min = 0.25;

	var range = Math.floor(Math.random() * (max - min + 1)) + min;
	ball.dy = ball.dy * range;

};

var game_Reset = function () {
	reset();
	pl_Score = 0;
	pl_Win = false;
	comp_Score = 0;
	comp_Win = false;

	//Ball direction
	var xd = Math.random();
	if (xd <= 0.5) {	//Goes Left
		ball.dx = -1;
	}
	if (xd >= 0.5) {	//Goes Right
		ball.dx = 1;
	}
	//console.log(xd);

	var yd_Check = Math.random();
	if (yd_Check <= 0.5) {	//Goes Up
		ball.dy = -1;
	}
	if (yd_Check >= 0.5) {	//Goes Down
		ball.dy = 1;
	}

	var max = 0.75;
	var min = 0.25;

	var range = Math.floor(Math.random() * (max - min + 1)) + min;
	ball.dy = ball.dy * range;
};

//Pause
var pause = function () {
	game_State = false;
	pause_State = true;
	//console.log("Hey, Listen");
};

var unpause = function () {
	pause_State = false;
	game_State = true;
};

var pause_Draw = function () {
	ctx.fillStyle = "white";
	ctx.font = "40px Helvetica";
	ctx.textAlign = "center";
	ctx.textBaseLine = "bottom";
	ctx.fillText("Paused", (canvas.width / 2), (canvas.height / 2));
};

var pause_Info = function () {
	ctx.fillStyle = "#8c8c8c";
	ctx.font = "15px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseLine = "bottom";
	ctx.fillText("Press Esc to pause", 20, canvas.height - 20);
}

//Render
var render = function () {
	background();
	divider_Draw();
	pl_Draw();
	comp_Draw();
	ball_Draw();
	score_Draw();
	if (game_State == true) {
		pause_Info();
		hide_Cursor();
	}
	if (pause_State == true) {
		pause_Draw();
		show_Cursor();
	}
	if (game_Start == true) {
		start_Draw();
	}
	//console.log("Render");
};

var hide_Cursor = function () {
	canvas.style.cursor = "none";

};

var show_Cursor = function () {
	canvas.style.cursor = "default";
}

//Keyboard
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

//Update is physics is paused no paddle control
var update = function (modifier) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	//console.log("Update");
	game_Over();
};

var input = function (modifier) {
	if (38 in keysDown) {	//Up
		pl_Paddle.y -= pl_Paddle.speed * modifier;
	}
	if (40 in keysDown) {	//Down
		pl_Paddle.y += pl_Paddle.speed * modifier;
	}
};

var pause_Input = function () {
	if (27 in keysDown && pause_State == false && count == 0) {
		pause();
		//console.log("Pause");
		count = 0;
		window.setTimeout(count_Up, 100);
		}
	if (27 in keysDown && pause_State == true && count >= 1) {
		unpause();
		//console.log("Unpause");
		window.setTimeout(count_Reset, 100);
	}
};

var count = 0;

var count_Up = function () {
	++count;
};

var count_Reset = function () {
	count = 0;
};

//Physics ie. ball, paddle motion
var physics = function (modifier) {
	//Ball motion
	ball.x += ball.dx * ball.speed * modifier;
	ball.y += ball.dy * ball.speed * modifier;
	comp_AI(modifier);
};

//Game Loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
	var tick = delta / 1000;

	update(tick);
	collision(tick);
	render(tick);
	pause_Input();
	if (game_State == true) {
		input(tick);
		physics(tick);
	};
	//console.log("main");
	then = now;

	requestAnimationFrame(main);
};

var w = window;
var requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
var cancelAnimationFrame = w.cancelAnimationFrame || w.mozCancelAnimationFrame;
var then = Date.now();
render();
document.addEventListener('keydown', function (event) {
	if (event.keyCode == 32) {
		game_Start = false;
		game_State = true;
		main();
		game_Reset();
		console.log("Check Start is running");
	}
});
