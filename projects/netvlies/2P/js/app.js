let data;
let windowW = window.innerWidth;
let windowH = window.innerHeight;
let playerSize = 200;
let player1X = { x: windowW * 0.25 };
let player2X = { x: windowW * 0.75 };
let playerY = 540;
let gravitySpeed = 5;
let score = 0;
let fallingObjectRate = 80;
let fallingObjectArea = 0.3;
let fallingObjectSize = 60;
let timer = 60; // Added timer set to 60 seconds
let gameOver = false; // Added gameOver flag

let fallingObjects = [];

let player1Img;
let player2Img;
let fallingObjectImg;
let bgImg;

// Added button elements
let restartButton;
let closeButton;

class FallingObject {
  constructor() {
    this.y = 0;
    this.size = fallingObjectSize;
    this.img = fallingObjectImg;
    this.x = random(
      windowW * (0.5 - fallingObjectArea),
      windowW * (0.5 + fallingObjectArea)
    );
  }

  show() {
    image(
      this.img,
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
  }

  update() {
    this.y += gravitySpeed;

    if (gameOver) return; // Added check for game over state

    // check collision with player 1
    if (
      this.y > playerY - this.size / 2 &&
      this.x > player1X.x - playerSize / 2 &&
      this.x < player1X.x + playerSize / 2
    ) {
      score++;
      this.y = -this.size;
      this.x = random(
        windowW * (0.5 - fallingObjectArea),
        windowW * (0.5 + fallingObjectArea)
      );
    }

    // check collision with player 2
    if (
      this.y > playerY - this.size / 2 &&
      this.x > player2X.x - playerSize / 2 &&
      this.x < player2X.x + playerSize / 2
    ) {
      score++;
      this.y = -this.size;
      this.x = random(
        windowW * (0.5 - fallingObjectArea),
        windowW * (0.5 + fallingObjectArea)
      );
    }

    if (this.y > windowH) {
      let index = fallingObjects.indexOf(this);
      fallingObjects.splice(index, 1);
    }
  }
}

function preload() {
  player1Img = loadImage("img/Character1.png");
  player2Img = loadImage("img/Character2.png");
  fallingObjectImg = loadImage("img/Waterdruppel.png");
  bgImg = loadImage("img/BG.jpg");
}

function setup() {
  pixelDensity(1);
  data = new Data();
  createCanvas(windowW, windowH, P2D);

  // Added setup for buttons
  restartButton = createButton("Opnieuw spelen");
  closeButton = createButton("Afsluiten");
  restartButton.position(windowW / 2 - 100, windowH / 2 - 20);
  closeButton.position(windowW / 2 + 100, windowH / 2 - 20);
  restartButton.mousePressed(restartGame);
  closeButton.mousePressed(closeGame);
  restartButton.hide();
  closeButton.hide();
}

function draw() {
  if (!gameOver) {
    data.update();
  }

  // Update player 1 position based on input
  player1X.x = map(player1X.x, 0, data.input.cam.width, 0, windowW);
  if (data.output.persons.length > 0) {
    player1X.x = map(
      data.output.persons[0].centerPoint.x,
      0,
      data.input.cam.width,
      0,
      windowW
    );
  }

  // Update player 2 position based on input
  player2X.x = map(player2X.x, 0, data.input.cam.width, 0, windowW);
  if (data.output.persons.length > 1) {
    player2X.x = map(
      data.output.persons[1].centerPoint.x,
      0,
      data.input.cam.width,
      0,
      windowW
    );
  }

  image(bgImg, 0, 0, windowW, windowH);

  // Draw player 1
  image(
    player1Img,
    player1X.x - playerSize / 2,
    playerY - playerSize / 2,
    playerSize,
    playerSize
  );

  // Draw player 2
  image(
    player2Img,
    player2X.x - playerSize / 2,
    playerY - playerSize / 2,
    playerSize,
    playerSize
  );

  // Check for collisions and update score
  for (let i = 0; i < fallingObjects.length; i++) {
    let obj = fallingObjects[i];

    if (gameOver) break; // Added check for game over state

    obj.update();
    obj.show();
  }

  // Draw score
  textSize(32);
  fill(255);
  text(`Score: ${score}`, 10, 50);

  // Draw timer
  textSize(32);
  fill(255);
  text(`Time: ${timer}`, windowW - 130, 50);

  // Add new falling objects
  if (frameCount % fallingObjectRate == 0 && !gameOver) {
    fallingObjects.push(new FallingObject());
  }

  // Update timer
  if (frameCount % 60 == 0 && timer > 0 && !gameOver) {
    timer--;
  }

  // Check for game over
  if (timer <= 0 && !gameOver) {
    gameOver = true;
    restartButton.show();
    closeButton.show();
  }
}

// Added function to restart the game
function restartGame() {
  timer = 60;
  score = 0;
  gameOver = false;
  fallingObjects = [];
  restartButton.hide();
  closeButton.hide();
}

// Added function to close the game and redirect to www.google.com
function closeGame() {
  window.location.href = "https://www.google.com";
}
