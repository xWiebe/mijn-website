let mask = [];
let loopCount = 0;
let myFont;

let titlePosX = 20;
let titlePosY = 20;

let fr = 120;

let title_blue;
let title_darkblue;
let title_darkgrey;
let title_green;
let title_lightgrey;
let title_middleblue;
let title_red;

let data;

let transparancyVar = 255;

var colour;

var rectSizeMultiplier = 0.5;
var minRectSize = 20;
var maxRectSize = 60;
var opacity = 255;

let windowW = window.innerWidth;
let windowH = window.innerHeight;

var size;

//img
let imgCross;
let imgSquare;
let img;

function preload() {

  document.body.style.overflow = 'hidden';

  img = loadImage('assets/Mask_003_0.png');

  title_darkblue = loadImage('titles/title_darkblue.png');
  title_blue = loadImage('titles/title_blue.png');
  title_darkgrey = loadImage('titles/title_darkgrey.png');
  title_green = loadImage('titles/title_green.png');
  title_lightgrey = loadImage('titles/title_lightgrey.png');
  title_middleblue = loadImage('titles/title_middleblue.png');
  title_red = loadImage('titles/title_red.png');
  
}

function setup(){
  
  frameRate(10);
  pixelDensity(1);
  canvas = createCanvas(windowW, windowH, P2D);
canvas.id('mycanvas');
blobcol =  color(195,237,45);
    data = new Data();
    //neutral
    colour1 = color(224,227,226, transparancyVar);
    //happy
    colour2 = color(0, 127, 201, transparancyVar);
    //angry
    colour3 = color(253,98,70, transparancyVar);
    //suprised
    colour4 = color(70, 68, 158, transparancyVar);
    //sad
    colour5 = color(85,85,85, transparancyVar);
    //disgusted
    colour6 = color(195,237,45, transparancyVar);

    background(180, 178, 176);  
    //canvas.parent('canvasContainer'); 
}

function draw() {
  
    data.update();
    //image(data.output.video, 0, 0); //shows camera in view

    if(data.output.expressions){
        let count = 0;
        fill(255);
        textSize(32);
        for(let expression in data.output.expressions){ //loop through the data object
            count++;
          }
    }

    if(data.output.faceDimensions){
        noFill();
        stroke(255,0,0);
      }

    readEmotions();
      
    //image(img, 0, 0, windowW, windowH);

 }

  
  function readEmotions() {
    let count = 0;
  
    for(let expression in data.output.expressions){
      let key = Object.keys(data.output.expressions)[count];
      let value  = data.output.expressions[expression];
      if(key == "neutral"){
        fill(colour1);
        createSquare();
        console.log(data.output.expressions);
      }
      if(key == "happy"){
        fill(colour2);
        createSquare();
        console.log(data.output.expressions);
      }
      if(key == "angry"){
        fill(colour3);
        createSquare();
        console.log(data.output.expressions);
      }
      if(key == "suprised"){
        fill(colour4);
        createSquare();
        console.log(data.output.expressions);
      }
      if(key == "sad"){
        fill(colour5);
        createSquare();
        console.log(data.output.expressions);
      }
      if(key == "disgusted"){
        fill(colour6);
        createSquare();
        console.log(data.output.expressions);
      }
       count++;
    }
  }

  function createSquare(){
    let startingpointX = random(0,screen.width);
    let startingpointY = random(0,screen.height);

    let rectHeight = random(minRectSize * rectSizeMultiplier, maxRectSize * rectSizeMultiplier);
    let rectWidth = random(minRectSize * rectSizeMultiplier, maxRectSize * rectSizeMultiplier);

    stroke(0, 0, 0, 255);
    strokeWeight(0);
    
    rect(startingpointX, startingpointY, rectHeight, rectWidth);
}