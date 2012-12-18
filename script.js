var BOARD_WIDTH     = 60;
var BOARD_HEIGHT    = 30;
var CELL_SIZE       = 7;
var SCRAMBLE_WEIGHT = .3;
var REFRESH_RATE    = 100;

var context;
var canvas;
var intervalID;
var board;
var tempBoard;

//main
$(document).ready(function () {
   buildInterface();
   initializeGame();
   play();
});

//attaches event handlers, sets up interface
function buildInterface() {
   $('#play').button();
   $('#pause').button();
   $('#play').click(play);
   $('#pause').click(pause);
}

//starts the simulation
function play() {
   $('#play').button('disable');
   $('#pause').button('enable');
   intervalID = window.setInterval(function() {
      update();
      draw();
   }, REFRESH_RATE);
}

//pauses the simulation
function pause() {
   $('#pause').button('disable');
   $('#play').button('enable');
   clearInterval(intervalID);
}

//initializes the state of the game
function initializeGame() {
   canvas = $('#canvas')[0];
   canvas.width = BOARD_WIDTH * CELL_SIZE;
   canvas.height = BOARD_HEIGHT * CELL_SIZE;
   context = canvas.getContext('2d');
   board = [];
   tempBoard = [];
   for (var i = 0; i < BOARD_WIDTH + 2; i++) {
      board[i] = [];
      tempBoard[i] = [];
      for (var j = 0; j < BOARD_HEIGHT + 2; j++) {
         board[i][j] = false;
         tempBoard[i][j] = false;
      }
   }
   scramble(SCRAMBLE_WEIGHT);
   draw();
}

//updates the game board for one turn
function update() {
   boardBoarders();
   tempBoard = [];
   for (var i = 0; i < BOARD_WIDTH + 2; i++)
      tempBoard[i] = [];
   traverse(function (x, y) {
   var aliveCount = 0;
   if (board[x - 1][y - 1]) aliveCount++;
   if (board[x    ][y - 1]) aliveCount++;
   if (board[x + 1][y - 1]) aliveCount++;
   if (board[x + 1][y    ]) aliveCount++;
   if (board[x + 1][y + 1]) aliveCount++;
   if (board[x    ][y + 1]) aliveCount++;
   if (board[x - 1][y + 1]) aliveCount++;
   if (board[x - 1][y    ]) aliveCount++;
   if (board[x][y])
      if (aliveCount == 2 || aliveCount == 3)
         tempBoard[x][y] = true;
      else
         tempBoard[x][y] = false;
   else
      if (aliveCount == 3)
         tempBoard[x][y] = true;
      else
         tempBoard[x][y] = false;
   });
   board = tempBoard;
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
         context.fillRect((x - 1) * CELL_SIZE,
                          (y - 1) * CELL_SIZE,
                          CELL_SIZE,
                          CELL_SIZE);
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
   for (var i = 1; i < BOARD_WIDTH + 1; i++)
      for (var j = 1; j < BOARD_HEIGHT + 1; j++)
         funct(i, j);
}

//Fixes the boarder of the board so that the cells that are
//  outside the boarders are the same as the cells they pair with
function boardBoarders() {
   for (var i = 1; i < BOARD_WIDTH + 1; i++) {
      board[i][0] = board[i][BOARD_HEIGHT];
      board[i][BOARD_HEIGHT + 1] = board[i][1];
   }
   for (var j = 1; j < BOARD_HEIGHT + 1; j++) {
      board[0][j] = board[BOARD_WIDTH][j];
      board[BOARD_WIDTH + 1][j] = board[1][j];
   }
   board[0][0] = board[BOARD_WIDTH][BOARD_HEIGHT];
   board[BOARD_WIDTH + 1][0] = board[1][BOARD_HEIGHT];
   board[BOARD_WIDTH + 1][BOARD_HEIGHT + 1] = board[1][1];
   board[0][BOARD_HEIGHT + 1] = board[BOARD_WIDTH][1];
}