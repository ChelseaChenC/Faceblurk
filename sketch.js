let video;
var faces = [];
faces.used = false;
var faceArea = [];
var numberOfFaces = 0;
var area = {
  x: 240,
  y: 160,
  w: 480,
  h: 480,
  stroke: 0
};
const sawFaces = [false, false, false];

let rgbArray = [];

function setup() {
  createCanvas(640, 480);
  // canvas.parent('sketch-holder');
  ellipseMode(CENTER);
  angleMode(DEGREES);
  video = createCapture(VIDEO);
  video.size(width, height);

  video.hide();
  startCamera();
  // button = createButton('Start');
  // button.position(videoSelect.x + videoSelect.width, 65);
  // button.mousePressed(start);
  // button.mousePressed(initExample);
}

function draw() {
  numberOfFaces = 0;
  background(255);
  video.loadPixels();
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();
  faces = trackFaces();
  for (let i = 0; i < faces.length; i++) {
    // DrawMosaic(faces[i]);
    // findFacePositions(faces[i]);
    drawTest(faces[i]);

    // DrawCensorShades(faces[i]);
  }


  var newFace = faces.some(function(f) {return f.state === brfv4.BRFState.FACE_TRACKING_START;});
  if (newFace && !sawFaces.some(function(x) {return x;})) {
    screenShot();
  }
  sawFaces[frameCount % sawFaces.length] = newFace;
  



  // if (numberOfFaces != 0) {
  //   console.log(faces[1]);
  // }
  // else if (frameCount % 30 == 0) {
  //   console.log(numberOfFaces + "/" + faces.length);
  // }
}


var findFacePositions = (face) => {

  let r1 = {};
  r1.x = face.points[0].x;
  r1.y = face.points[18].y < face.points[25].y ?
    face.points[18].y :
    face.points[25].y;
  r1.w = face.points[15].x - face.points[0].x;
  r1.h = face.points[1].y > face.points[15].y ?
    face.points[1].y - r1.y :
    face.points[15].y - r1.y;
  faceArea.r1 = r1;

  let r2 = {};
  r2.x = face.points[1].x;
  r2.y = face.points[1].y < face.points[15].y ?
    face.points[1].y :
    face.points[15].y;
  r2.w = face.points[14].x - face.points[1].x;
  r2.h = face.points[2].y > face.points[14].y ?
    face.points[2].y - r2.y :
    face.points[14].y - r2.y;
  faceArea.r2 = r2;

  let r3 = {};
  r3.x = face.points[2].x;
  r3.y = face.points[2].y < face.points[14].y ?
    face.points[2].y :
    face.points[14].y;
  r3.w = face.points[14].x - face.points[2].x;
  r3.h = face.points[4].y > face.points[12].y ?
    face.points[4].y - r3.y :
    face.points[12].y - r3.y;
  faceArea.r3 = r3;

  let r4 = {};
  r4.x = face.points[4].x;
  r4.y = face.points[4].y < face.points[12].y ?
    face.points[4].y :
    face.points[12].y;
  r4.w = face.points[12].x - face.points[4].x;
  r4.h = face.points[6].y > face.points[10].y ?
    face.points[6].y - r4.y :
    face.points[10].y - r4.y;
  faceArea.r4 = r4;

  let r5 = {};
  r5.x = face.points[5].x;
  r5.y = face.points[5].y < face.points[11].y ?
    face.points[5].y :
    face.points[11].y;
  r5.w = face.points[11].x - face.points[5].x;
  r5.h = face.points[7].y > face.points[9].y ?
    face.points[7].y - r5.y :
    face.points[9].y - r5.y;
  faceArea.r5 = r5;

  let r6 = {};
  r6.x = face.points[7].x;
  r6.y = face.points[7].y < face.points[9].y ?
    face.points[7].y :
    face.points[9].y;
  r6.w = face.points[9].x - face.points[7].x;
  r6.h = face.points[8].y - r6.y;
  faceArea.r6 = r6;

  let r7 = {};
  r7.x = face.points[0].x;
  r7.y = face.points[18].y > face.points[25].y ?
    (face.points[18].y - 80) :
    (face.points[25].y - 80);
  r7.w = face.points[16].x - face.points[0].x;
  r7.h = face.points[18].y > face.points[25].y ?
    (face.points[18].y + 80) :
    (face.points[25].y + 80);
  faceArea.r7 = r7;
};



var DrawCensorShades = (face) => {
  if (face.state === brfv4.BRFState.FACE_TRACKING_START || face.state === brfv4.BRFState.FACE_TRACKING) {

    findFacePositions(face);
    // fill(0);
    // filter(BLUR, 10);
    rect(faceArea.r1.x, faceArea.r1.y, faceArea.r1.w, faceArea.r1.h);
  }
};


var DrawMosaic = (face) => {
  if (face.state === brfv4.BRFState.FACE_TRACKING_START || face.state === brfv4.BRFState.FACE_TRACKING) {
    numberOfFaces++;
    findFacePositions(face);
    // noFill();
    // noStroke();
    // filter(BLUR, 10);
    let areas = [6];
    areas[0] = video.get(faceArea.r1.x, faceArea.r1.y, faceArea.r1.w, faceArea.r1.h);
    areas[1] = video.get(faceArea.r2.x, faceArea.r2.y, faceArea.r2.w, faceArea.r2.h);
    areas[2] = video.get(faceArea.r3.x, faceArea.r3.y, faceArea.r3.w, faceArea.r3.h);
    areas[3] = video.get(faceArea.r4.x, faceArea.r4.y, faceArea.r4.w, faceArea.r4.h);
    areas[4] = video.get(faceArea.r5.x, faceArea.r5.y, faceArea.r5.w, faceArea.r5.h);
    areas[5] = video.get(faceArea.r6.x, faceArea.r6.y, faceArea.r6.w, faceArea.r6.h);
    areas[6] = video.get(faceArea.r7.x, faceArea.r7.y, faceArea.r7.w, faceArea.r7.h);


    // areas.forEach((area, i) => {
    //   push();
    //   image(area).filter(BLUR, 10);
    //   // filter(BLUR, 10);
    //   pop();
    // });

    drawArea(faceArea.r1.x, faceArea.r1.y, faceArea.r1.w, faceArea.r1.h);

    // rect(faceArea.r1.x, faceArea.r1.y, faceArea.r1.w, faceArea.r1.h);
    // rect(faceArea.r2.x, faceArea.r2.y, faceArea.r2.w, faceArea.r2.h);
    // rect(faceArea.r3.x, faceArea.r3.y, faceArea.r3.w, faceArea.r3.h);
    // rect(faceArea.r4.x, faceArea.r4.y, faceArea.r4.w, faceArea.r4.h);
    // rect(faceArea.r5.x, faceArea.r5.y, faceArea.r5.w, faceArea.r5.h);
    // rect(faceArea.r6.x, faceArea.r6.y, faceArea.r6.w, faceArea.r6.h);

  }

};

// function drawArea(_x, _y, _w, _h) {
//   console.log(_h, _w);
//   for (let y = _y; y < _y + floor(_h / 20); y++) {
//     for (let x = _x; x < _x + floor(_w / 20); x++) {
//       var index = (_w / 20 - (x + _x) + 1 + ((y + _y) * _w / 20)) * 4;
//       var r = rgbArray[index + 0];
//       console.log(r);
//       var g = rgbArray[index + 1];
//       var b = rgbArray[index + 2];
//       // var w = map(bright, 0, 255, 0, vScale);

//       noStroke();
//       fill(r, g, b);
//       rectMode(CENTER);
//       rect(_x + x * 20, _y + y * 20, 80, 80);

//       }
//     }
// };




var IsFace = (_x, _y) => {
  for (let prop in faceArea) {
    if (faceArea[prop].x < _x &&
      _x < (faceArea[prop].x + faceArea[prop].w) &&
      faceArea[prop].y < _y &&
      _y < (faceArea[prop].y + faceArea[prop].h)) {
      return true;
    }
  }
  return false;
}

function drawTest(face) {
  noStroke();
  if (face.state === brfv4.BRFState.FACE_TRACKING_START || face.state === brfv4.BRFState.FACE_TRACKING) {
    numberOfFaces++;
    findFacePositions(face);
    for (let y = 0; y < height; y += 20) {
      for (let x = 0; x < width; x += 20) {
        if (IsFace(x, y)) {
          let index = (width - x + 1 + (y * width)) * 4;
          let r = video.pixels[index];
          let g = video.pixels[index + 1];
          let b = video.pixels[index + 2];
          fill(r, g, b);
          rect(x, y, 20, 20);
        }
      }
    }
  }
}

var lastShotIndex = 0;

function screenShot() {
  saveFrames('out', 'png', 1, 1, function(data) {
    var imgs = document.getElementsByClassName('screenshot');
    lastShotIndex++;
    lastShotIndex %= imgs.length;
    imgs[lastShotIndex].src = data[0].imageData;
  });
}

var Monitor = (opacity) => {
  document.getElementById("_imageData").style.opacity = opacity;
  area.stroke = opacity * 200;
};
