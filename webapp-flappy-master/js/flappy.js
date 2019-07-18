// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

var width = 800;
var height = 400;
// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(width, height, Phaser.AUTO, 'game', stateActions);
var score=-2;
var labelScore;
var player;
var gameSpeed = 100;
var pipes = [];
var balloons = [];
var weight = [];
var y;
var gapStart = 50;
var gapMargin = 50;
var gapSize = 100;
var blockHeight = 50;
var pipeEndExtraWidth = 5;
var pipeEndHeight = 25;
var m = 350;

/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
  game.load.image("easy","../assets/emporio small.png");
  game.load.image("ea","../assets/flappy_superman.png");
  game.load.image("fifa","../assets/flappy_frog.png");
  game.load.image("ifa","../assets/easy.png");
  game.load.image("pipeBlock", "../assets/pipe2-body.png");
  game.load.audio("score", "../assets/jumpsnd1.mp3");
  game.load.image("gamebck","../assets/game background.jpg");
  game.load.image("pipeend","../assets/pipe2-end.png");
  game.load.image("balloons", "../assets/hitmesmall.jpg");
  game.load.image("weights","../assets/weight.png");
}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // set the background colour of the scene
    //game.stage.setBackgroundColor("gamebck");
    backgroundImage = game.add.sprite(0,0,"gamebck");
    backgroundImage.height = 400;
    backgroundImage.width = 810;

    game.add.text(20,20,"Easy");
    game.add.text(20,350,"Flaps!");

    var backgroundVelocity = gameSpeed / 1;
    var backgroundSprite = game.add.tileSprite(0,0, width, height, "gamebck");
    backgroundSprite.autoScroll(-backgroundVelocity, 0);

    game.input.onDown.add(clickHandler);



    game.input
    .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    .onDown.add(playerJump);
    var pipeInterval = 2 * Phaser.Timer.SECOND;
    game.time.events.loop(pipeInterval, generate);

    var pipeInterval2 = 1 * Phaser.Timer.SECOND;
    game.time.events.loop(pipeInterval2, moveRight);

    game.input
    .keyboard.addKey(Phaser.Keyboard.RIGHT)
    .onDown.add(moveRight);

    game.input
    .keyboard.addKey(Phaser.Keyboard.LEFT)
    .onDown.add(moveLeft);

    game.input
    .keyboard.addKey(Phaser.Keyboard.UP)
    .onDown.add(moveUp);

    game.input
    .keyboard.addKey(Phaser.Keyboard.DOWN)
    .onDown.add(moveDown);

    labelScore= game.add.text(0, 0, score.toString());
    player = game.add.sprite(50, 50, "easy");
    game.physics.arcade.enable(player);

    player.body.gravity.y = m;

    player.anchor.setTo(0.5, 0.5);
}

/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
  game.physics.arcade.overlap(player, pipes, gameOver);
  if(player.body.y<0) {
    gameOver();
  }

  game.physics.arcade.overlap(player, balloons, gameOver);
  if(player.body.y<0) {
    gameOver();
  }

  game.physics.arcade.overlap(player, weight, gameHarder);
  if(player.body.y<0) {
    gameHarder();
  }

  if(player.body.y>400) {
    gameOver();
  }
  player.rotation += 1;
  player.rotation = Math.atan(player.body.velocity.y / 200);
}

function gameOver(){
  registerScore(score);
  location.reload();
  game.state.restart();
}

function gameHarder() {
    m = player.body.gravity.y = 500;
}

function addPipeBlock(x,y) {
  var block = game.add.sprite(x, y, "pipeBlock");
  pipes.push(block);
  game.physics.arcade.enable(block);
  block.body.velocity.x = -250;
}

function addPipeEnd(x,y) {
  var block = game.add.sprite(x, y, "pipeend");
  pipes.push(block);
  game.physics.arcade.enable(block);
  block.body.velocity.x = -250;
}

function generatePipe() {
  var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);

  addPipeEnd(width - (pipeEndExtraWidth / 2), gapStart - 25);
  for(var y = gapStart - pipeEndHeight; y > 0; y -= blockHeight) {
    addPipeBlock(width, y - blockHeight);
  }
  for(var y = gapStart + gapSize + pipeEndHeight; y < height; y += blockHeight) {
    addPipeBlock(width, y);
  }
  addPipeEnd(width - (pipeEndExtraWidth / 2), gapStart + gapSize + 25);
  changeScore();
}

function generate() {
 var diceRoll = game.rnd.integerInRange(1, 10);
 if(diceRoll==1) {
   generateBalloons();
 } else if(diceRoll==2) {
   generateWeight();
 } else {
   generatePipe();
 }
}

function generateBalloons() {
  var bonus = game.add.sprite( width, height, "balloons");
  balloons.push(bonus);
  game.physics.arcade.enable(bonus);
  bonus.body.velocity.x = -200;
  bonus.body.velocity.y = - game.rnd.integerInRange(60,100);
}
function generateWeight() {
  var bonus = game.add.sprite( width, height, "weights");
  balloons.push(bonus);
  game.physics.arcade.enable(bonus);
  bonus.body.velocity.x = -200;
  bonus.body.velocity.y = - game.rnd.integerInRange(60,100);
}

function moveRight() {
  player.x = player.x + 10;
}

function moveLeft(){
  player.x = player.x - 10;
}

function moveUp() {
  player.y = player.y - 70;
}

function moveDown() {
  player.y = player.y + 10;
}

function playerJump() {
  player.body.velocity.y = -195;
  game.sound.play("score");
}

function clickHandler(event) {
  game.add.sprite(event.x, event.y, "ifa");
  game.sound.play("score");
}

function spaceHandler() {
  changeScore();
  game.sound.play("score");
}

function changeScore() {
  score = score + 1;
  labelScore.setText(score.toString());
}
