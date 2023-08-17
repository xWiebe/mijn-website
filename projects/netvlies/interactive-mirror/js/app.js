let data;
let windowW = window.innerWidth;
let windowH = window.innerHeight;
let personRecognized;
let timerStartTime = 0; // Track the start time of the current timer
let currentTime = 0; // Track the current time
let img;
let images = []; // Array to store the images

function preload() {
  img = loadImage("img/fles.png");
}

function setup() {
  pixelDensity(1);
  data = new Data();
  createCanvas(windowWidth, windowHeight);
  setInterval(addImage, 10000); // Call addImage function every 10 seconds
}

function draw() {
  data.update();

  // Calculate the position to center the video input
  const videoWidth = windowWidth;
  const videoHeight = windowHeight;

  image(data.output.video, 0, 0, videoWidth, videoHeight);

  // Display the images stacked next to each other on the same y value
  const yBottle = windowHeight - img.height;
  for (let i = 0; i < images.length; i++) {
    image(images[i], img.width * i, yBottle);
  }

  if (data.output.persons.length > 0) {
    // At least one person detected
    console.log("Person detected");
    if (timerStartTime === 0) {
      // Start a new timer
      timerStartTime = millis();
    }
  } else {
    // No person detected
    console.log("Person not detected");
    timerStartTime = 0; // Reset the timer start time
    currentTime = 0; // Reset the current time
    images = []; // Clear the images array
  }

  // Calculate the current time only if the timer is running
  if (timerStartTime > 0) {
    currentTime = int((millis() - timerStartTime) / 1000);
  }
}

function addImage() {
  // Add the loaded image to the images array
  images.push(img);
}
