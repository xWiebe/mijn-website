let data;
let windowW = window.innerWidth;
let windowH = window.innerHeight;
let playerSize = 200; // set the size of the player
let player1X = { x: windowW * 0.25 }; //initialize player1X
let player2X = { x: windowW * 0.75 }; //initialize player2X
let playerY = 540; //initialize playerY in the center of the screen
let gravitySpeed = 5; // set the speed of falling objects
let score1 = 0; // initialize score1
let score2 = 0; // initialize score2
let fallingObjectRate = 80; // set the rate of falling objects
let fallingObjectArea = 0.3; // set the area of falling objects
let fallingObjectSize = 60; // set the size of the falling objects
let timer = 60; // Added timer set to 60 seconds
let gameOver = false; // Added gameOver flag

let fallingObjects = []; // array to store falling objects

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
    ); // objects only fall between the specified area
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
      score1++;
      this.y = -this.size;
      this.x = random(
        windowW * (0.5 - fallingObjectArea),
        windowW * (0.5 + fallingObjectArea)
      ); // objects only fall between the specified area
    }

    // check collision with player 2
    if (
      this.y > playerY - this.size / 2 &&
      this.x > player2X.x - playerSize / 2 &&
      this.x < player2X.x + playerSize / 2
    ) {
      score2++;
      this.y = -this.size;
      this.x = random(
        windowW * (0.5 - fallingObjectArea),
        windowW * (0.5 + fallingObjectArea)
      ); // objects only fall between the specified area
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

  // Check for collisions and update scores
  for (let i = 0; i < fallingObjects.length; i++) {
    let obj = fallingObjects[i];

    // Check collision with player 1
    if (
      obj.y > playerY - obj.size / 2 &&
      obj.x > player1X.x - playerSize / 2 &&
      obj.x < player1X.x + playerSize / 2
    ) {
      score1++;
      obj.y = -obj.size;
      obj.x = random(
        windowW * (0.5 - fallingObjectArea),
        windowW * (0.5 + fallingObjectArea)
      ); // objects only fall between the specified area
    }

    // Check collision with player 2
    if (
      obj.y > playerY - obj.size / 2 &&
      obj.x > player2X.x - playerSize / 2 &&
      obj.x < player2X.x + playerSize / 2
    ) {
      score2++;
      obj.y = -obj.size;
      obj.x = random(
        windowW * (0.5 - fallingObjectArea),
        windowW * (0.5 + fallingObjectArea)
      ); // objects only fall between the specified area
    }

    if (gameOver) break; // Added check for game over state

    obj.update();
    obj.show();
  }

  // Display scores
  textSize(32);
  textAlign(CENTER);
  fill(255);
  text(`Player 1: ${score1}`, windowW * 0.25, 50);
  text(`Player 2: ${score2}`, windowW * 0.75, 50);

  // Draw timer
  textSize(32);
  fill(255);
  text(`Time: ${timer}`, windowW - 130, 50);

  // Add new falling objects
  if (frameCount % fallingObjectRate === 0) {
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
  window.location.href = "https://wiebeabdoel.com/projects/netvlies/";
}
