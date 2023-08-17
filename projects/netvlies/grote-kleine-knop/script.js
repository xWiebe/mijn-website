const imgPlaceholder = document.querySelector(".img-placeholder");
const timer = document.querySelector(".timer");
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const pointsDisplay = document.querySelector("#point-counter");
const resultDisplay = document.querySelector("#result");
let points = 0;
let timerInterval;
let audio = new Audio();

// Set up the game
function setUpGame() {
  points = 0;
  pointsDisplay.textContent = points;
  resultDisplay.textContent = "";
  imgPlaceholder.style.backgroundImage = 'url("")';
  clearInterval(timerInterval);
  timerInterval = null;
  startGame();
}

// Start the game
function startGame() {
  let currentRound = 1;
  startRound(currentRound);
}

// Start a new round
function startRound(round) {
  if (round > 10) {
    // End of the game
    resultDisplay.textContent = `Afgelopen! Je hebt ${points} punten behaald.`;
    audio.src = "sounds/afgelopen.wav";
    audio.loop = false;
    audio.play();
    return;
  }

  // Set up the round
  let image;
  if (Math.random() < 0.5) {
    image = "img/pee.png";
  } else {
    image = "img/poo.png";
  }
  imgPlaceholder.style.backgroundImage = `url(${image})`;
  timer.textContent = "10";
  let timeLeft = 10;
  resultDisplay.textContent = "Nieuwe ronde!";

  audio.src = "sounds/nieuwe-ronde.wav";
  audio.loop = false;
  audio.play();

  button1.disabled = false;
  button2.disabled = false;
  let roundInterval = setInterval(() => {
    if (timeLeft <= 0) {
      // Tijd is om
      clearInterval(roundInterval);
      resultDisplay.textContent =
        "De tijd is om! Je was te laat met het drukken op een knop.";
      audio.src = "sounds/tijd-is-om.wav";
      audio.loop = false;
      audio.play();
      setTimeout(() => {
        startRound(round + 1);
      }, 2000);
    } else {
      timer.textContent = timeLeft;
      timeLeft--;
    }
  }, 1000);

  // Event listeners toeveogen aan knoppen
  button1.addEventListener("click", () => {
    if (imgPlaceholder.style.backgroundImage.includes("pee")) {
      points++;
      pointsDisplay.textContent = points;
      resultDisplay.textContent =
        "Wat goed! De juiste knop voor de juiste boodschap!";
      resultDisplay.classList.add("correct");
      audio.src = "sounds/wat-goed.wav";
      audio.loop = false;
      audio.play();
    } else {
      resultDisplay.textContent = "Helaas! Verkeerde knop.";
      resultDisplay.classList.add("incorrect");
      audio.src = "sounds/helaas.wav";
      audio.loop = false;
      audio.play();
    }
    button1.disabled = true;
    button2.disabled = true;
    clearInterval(roundInterval);
    setTimeout(() => {
      resultDisplay.classList.remove("correct");
      resultDisplay.classList.remove("incorrect");
      startRound(round + 1);
    }, 2000);
  });

  button2.addEventListener("click", () => {
    if (imgPlaceholder.style.backgroundImage.includes("poo")) {
      points++;
      pointsDisplay.textContent = points;
      resultDisplay.textContent =
        "Wat goed! De juiste knop voor de juiste boodschap!";
      resultDisplay.classList.add("correct");
      const audio = new Audio("sounds/wat-goed.wav");
      audio.loop = false;
      audio.play();
    } else {
      resultDisplay.textContent = "Helaas! Verkeerde knop.";
      resultDisplay.classList.add("incorrect");
      const audio = new Audio("sounds/helaas.wav");
      audio.loop = false;
      audio.play();
    }
    button1.disabled = true;
    button2.disabled = true;
    clearInterval(roundInterval);
    setTimeout(() => {
      resultDisplay.classList.remove("correct");
      resultDisplay.classList.remove("incorrect");
      startRound(round + 1);
    }, 2000);
  });
}

// Set up the game when the page loads
setUpGame();
