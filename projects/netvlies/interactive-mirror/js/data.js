let vidW = 1280;
let vidH = 720;
vidW /= 2;
vidH /= 2;

let captureConstraints = {
  video: {
    mandatory: {
      minWidth: vidW,
      minHeight: vidH,
      maxWidth: vidW,
      maxHeight: vidH,
    },
    optional: [{ maxFrameRate: 20 }],
  },
  audio: false,
};

class Data {
  constructor() {
    this.output = new Output();
    this.analysis = new Analysis();
    this.input = new Input();
  }
  update() {
    if (this.input.cam.loadedmetadata) {
      this.output.video.image(this.input.cam, 0, 0);
      let that = this;
      this.analysis.detector.detect(
        this.output.video,
        function (error, results) {
          handleDetections(error, results, that);
        }
      );
    }
  }
}

class Analysis {
  constructor() {
    this.detector = ml5.objectDetector("cocossd");
    this.detections = [];
    this.personRemoval = [];
    this.personAddition = [];
  }
}

class Input {
  constructor() {
    this.cam = createCapture(captureConstraints, VIDEO);
    this.cam.size(vidW, vidH);
    this.cam.hide();
  }
}

class Output {
  constructor() {
    this.persons = [];
    this.video = createGraphics(vidW, vidH);
    this.video.translate(vidW, 0);
    this.video.scale(-1, 1);
  }
}

class Person {
  constructor(detection) {
    this.confidence = detection.confidence;
    this.centerPoint = detection.centerPoint;
    this.width = detection.width;
    this.height = detection.height;
    this.size = this.width * this.height;
    this.x = detection.x;
    this.y = detection.y;
    this.deltaPos = 0;
    this.deltaSize = 0;
    this.deltaSizePercentage = 0;
    this.animationSpeed = 0.04;
    this.color = color(random(255), random(255), random(255));
  }
  adapt(detection) {
    //Movement
    let distance = getDistance(this.centerPoint, detection.centerPoint) * 20;
    this.deltaPos += this.animationSpeed * (distance - this.deltaPos);

    //Size
    let sizeDetection = detection.width * detection.height;
    let sizeDifference = sizeDetection - this.size;
    this.deltaSize += this.animationSpeed * (sizeDifference - this.deltaSize);
    this.deltaSizePercentage = Math.abs((this.deltaSize / this.size) * 50);
    // console.log(this.deltaSizePercentage);

    //Other values
    this.size = sizeDetection;
    this.confidence = detection.confidence;
    this.centerPoint = detection.centerPoint;
    this.width = detection.width;
    this.height = detection.height;
    this.x = detection.x;
    this.y = detection.y;
  }
  drawRect() {
    strokeWeight(8);
    noFill();
    fill(
      this.color.levels[0],
      this.color.levels[1],
      this.color.levels[2],
      255 * this.deltaSizePercentage
    );
    stroke(this.color);
    rect(this.x, this.y, this.width, this.height);
    fill(this.color);
    circle(this.centerPoint.x, this.centerPoint.y, this.deltaPos);

    // Add the following lines to display the x-axis value as text
    textSize(16);
    textAlign(CENTER, BOTTOM);
    fill(255); // Change the color of the text if needed
    text(Math.round(this.centerPoint.x), this.centerPoint.x, this.y);
  }
}

function handleDetections(error, results, parent) {
  if (error) {
    console.error("Video still loading");
  } else if (results) {
    parent.analysis.detections = [];
    for (let i = 0; i < results.length; i++) {
      if (results[i].label == "person") {
        results[i].centerPoint = {
          x: results[i].x + results[i].width * 0.5,
          y: results[i].y + results[i].height * 0.5,
        };
        parent.analysis.detections.push(results[i]);
      }
    }
    updatePersons(parent);
  }
}

function updatePersons(parent) {
  let comb = createCombinations(
    parent.output.persons.length,
    parent.analysis.detections.length
  );
  let combinations = comb.combinations;
  let smallestTotalDistance;
  let bestFit;

  for (let i = 0; i < combinations.length; i++) {
    let totalDistance = 0;
    for (let j = 0; j < combinations[i].length; j++) {
      let a = combinations[i][j][0];
      let b = combinations[i][j][1];
      if (typeof a !== "undefined" && typeof b !== "undefined") {
        totalDistance += getDistance(
          parent.output.persons[a].centerPoint,
          parent.analysis.detections[b].centerPoint
        );
      }
    }
    if (typeof smallestTotalDistance === "undefined") {
      smallestTotalDistance = totalDistance;
      bestFit = i;
    } else if (totalDistance < smallestTotalDistance) {
      smallestTotalDistance = totalDistance;
      bestFit = i;
    }
  }
  for (let i = 0; i < combinations[bestFit].length; i++) {
    updatePerson(combinations[bestFit][i], parent.output.persons, parent);
  }
  if (parent.analysis.personRemoval.length > 0) {
    parent.analysis.personRemoval.sort(function (a, b) {
      return b - a;
    });
    for (let i = parent.analysis.personRemoval.length - 1; i >= 0; i--) {
      parent.output.persons.splice(parent.analysis.personRemoval[i]);
    }
  } else if (parent.analysis.personAddition.length > 0) {
    for (let i = 0; i < parent.analysis.personAddition.length; i++) {
      let p = new Person(
        parent.analysis.detections[parent.analysis.personAddition[i]]
      );
      parent.output.persons.push(p);
    }
  }
  parent.analysis.personRemoval = [];
  parent.analysis.personAddition = [];
}

function updatePerson(combination, persons, parent) {
  if (typeof combination[0] === "undefined") {
    //person not existing add detection to list
    parent.analysis.personAddition.push(combination[1]);
  } else if (typeof combination[1] === "undefined") {
    //person not existing add detection to list
    parent.analysis.personRemoval.push(combination[0]);
  } else {
    //update person with closest match
    parent.output.persons[combination[0]].adapt(
      parent.analysis.detections[combination[1]]
    );
  }
}

function createCombinations(sizeA, sizeB) {
  let a;
  let b;
  let swapped = false;
  if (sizeA >= sizeB) {
    a = Array.from(Array(sizeA).keys());
    b = Array.from(Array(sizeB).keys());
  } else {
    a = Array.from(Array(sizeB).keys());
    b = Array.from(Array(sizeA).keys());
    swapped = true;
  }

  const zip = (a, b) => a.map((k, i) => [k, b[i]]);
  let uniqueCombinations = [];
  let permut = permutations(a, a.length);
  for (let comb of permut) {
    let zipped = zip(comb, b);
    if (swapped) {
      for (let i = 0; i < zipped.length; i++) {
        let swap = zipped[i][0];
        zipped[i][0] = zipped[i][1];
        zipped[i][1] = swap;
      }
    }
    uniqueCombinations.push(zipped);
  }
  return { combinations: uniqueCombinations };
}

function getDistance(p1, p2) {
  let y = p2.x - p1.x;
  let x = p2.y - p1.y;

  return Math.sqrt(x * x + y * y);
}

function permutations(array, r) {
  // Algorythm copied from Python `itertools.permutations`.
  var n = array.length;
  if (r === undefined) {
    r = n;
  }
  if (r > n) {
    return;
  }
  var indices = [];
  for (var i = 0; i < n; i++) {
    indices.push(i);
  }
  var cycles = [];
  for (var i = n; i > n - r; i--) {
    cycles.push(i);
  }
  var results = [];
  var res = [];
  for (var k = 0; k < r; k++) {
    res.push(array[indices[k]]);
  }
  results.push(res);

  var broken = false;
  while (n > 0) {
    for (var i = r - 1; i >= 0; i--) {
      cycles[i]--;
      if (cycles[i] === 0) {
        indices = indices
          .slice(0, i)
          .concat(indices.slice(i + 1).concat(indices.slice(i, i + 1)));
        cycles[i] = n - i;
        broken = false;
      } else {
        var j = cycles[i];
        var x = indices[i];
        indices[i] = indices[n - j];
        indices[n - j] = x;
        var res = [];
        for (var k = 0; k < r; k++) {
          res.push(array[indices[k]]);
        }
        results.push(res);
        broken = true;
        break;
      }
    }
    if (broken === false) {
      break;
    }
  }
  return results;
}
