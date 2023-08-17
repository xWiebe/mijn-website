let data;
let windowW = window.innerWidth;
let windowH = window.innerHeight;
let playerSize = 200; // set the size of the player
let playerX = { x: windowW / 2 }; //initialize playerX in the center of the screen
let playerY = 550; //initialize playerY in the center of the screen
let gravitySpeed = 5; // set the speed of falling objects
let score = 0; // initialize score
let fallingObjectRate = 80; // set the rate of falling objects
let fallingObjectArea = 0.30; // set the area of falling objects
let fallingObjectSize = 60; // set the size of the falling objects

let fallingObjects = []; // array to store falling objects

let playerImg;
let fallingObjectImg;
let bgImg;

let timer = 60; // set timer to 30 seconds
let timerInterval; // variable to hold the timer interval

class FallingObject {
  constructor() {
    this.y = 0;
    this.size = fallingObjectSize;
    this.img = fallingObjectImg;
    this.x = random(windowW * (0.5 - fallingObjectArea), windowW * (0.5 + fallingObjectArea)); // objects only fall between the specified area
  }

  show() {
    image(this.img, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
  }

  update() {
    this.y += gravitySpeed;
    if (this.y > playerY - this.size / 2 && this.x > playerX.x - playerSize / 2 && this.x < playerX.x + playerSize / 2) {
      score++;
      this.y = -this.size;
      this.x = random(windowW * (0.5 - fallingObjectArea), windowW * (0.5 + fallingObjectArea)); // objects only fall between the specified area
    }
    if (this.y > windowH) {
      let index = fallingObjects.indexOf(this);
      fallingObjects.splice(index, 1);
    }
  }
}

function preload() {
  playerImg = loadImage('img/Character.png');
  fallingObjectImg = loadImage('img/Waterdruppel.png');
  bgImg = loadImage('img/BG.jpg');
}

function setup() {
  pixelDensity(1);
  data = new Data();
  createCanvas(windowW, windowH, P2D);

  // start timer interval
  timerInterval = setInterval(() => {
    timer--;
    if (timer === 0) {
      endGame();
    }
  }, 1000);
}

function draw() {
  data.update();

  playerX.x = map(playerX.x, 0, data.input.cam.width, 0, windowW);

  if (data.output.persons.length > 0) {
    playerX.x = map(
      data.output.persons[0].centerPoint.x,
      0,
      data.input.cam.width,
      0,
      windowW
    );
  }

  image(bgImg, 0, 0, windowW, windowH);

  image(playerImg, playerX.x - playerSize / 2, playerY - playerSize / 2, playerSize, playerSize);

  for (let i = 0; i < fallingObjects.length; i++) {
    fallingObjects[i].show();
    fallingObjects[i].update();
  }

  if (frameCount % fallingObjectRate === 0) {
    fallingObjects.push(new FallingObject());
  }

  textSize(32);
  textAlign(LEFT, TOP);
  text(score, 10, 10);
  
  // Timer
  textSize(32);
  textAlign(RIGHT, TOP);
  text(timer, windowW - 10, 10);
  if (frameCount % 60 === 0) {
    timer--;
  }
  if (timer <= 0) {
    noLoop();
    textSize(64);
    textAlign(CENTER, CENTER);
    fill(255);
    text("Het spel is afgelopen", windowW / 2, windowH / 2);
    // Opnieuw spelen button
    restartButton = createButton("Opnieuw spelen");
    restartButton.position(windowW / 2 - 150, windowH / 2 + 100);
    restartButton.mousePressed(restartGame);
    // Afsluiten button
    exitButton = createButton("Afsluiten");
    exitButton.position(windowW / 2 + 50, windowH / 2 + 100);
    exitButton.mousePressed(() => {
      window.location.href = "https://wiebeabdoel.com/projects/netvlies/index.html";
    });
  }
}

function restartGame() {
  fallingObjects = [];
  score = 0;
  timer = 60;
  loop();
  restartButton.remove();
  exitButton.remove();
}