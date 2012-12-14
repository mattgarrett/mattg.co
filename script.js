var BOARD_WIDTH = 120;
var BOARD_HEIGHT = 60;
var CELL_SIZE = 5;
var SCRAMBLE_WEIGHT = .5;
var REFRESH_RATE = 1000;

var context;
var canvas;
var intervalID;
var board;

$(document).ready(function () {
	init();
	runGame();
});

//initializes the state of the game
function init() {
	canvas = $('canvas')[0];
	canvas.width = BOARD_WIDTH * CELL_SIZE;
	canvas.height = BOARD_HEIGHT * CELL_SIZE;
	context = canvas.getContext('2d');
	board = [];
	for (var i = 0; i < BOARD_WIDTH; i++) {
		board[i] = [];
		for (var j = 0; j < BOARD_HEIGHT; j++) {
			board[i][j] = false;
		}
	}
	scramble(SCRAMBLE_WEIGHT);
	draw();
}

//starts the simulation
function runGame() {
	intervalID = window.setInterval(function() {
		update();
		draw();
	}, REFRESH_RATE);
}

//updates the game board for one turn
function update() {
	
}

//stops the simulation
function stopGame() {
	clearTimeout(intervalID);
}

//  draws the current state of the game board on screen
function draw() {
	canvas.width = canvas.width; //clears the canvas
	traverse(function (x, y) {
		if (board[x][y])
			context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
	});
}

//Accepts a weight as a parameter, 0 to 1
//  Randomizes each cell on the game board with the given
//  weight.  Each cell will have 'weight' chance to be
//  considered alive.
function scramble(weight) {
	traverse(function(x, y) {
		board[x][y] = Math.random() < weight;
	});
}

//Accepts a function, 'funct' as a parameter
//  'funct' must have an 'x' and a 'y' parameter
//  Applies 'funct' to every cell on the board
function traverse(funct) {
	for (var i = 0; i < BOARD_WIDTH; i++) {
		for (var j = 0; j < BOARD_HEIGHT; j++) {
			funct(i, j);
		}
	}
}
