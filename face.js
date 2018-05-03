var webcam = document.getElementById("_webcam"); // our webcam video
var imageData = document.getElementById("_imageData"); // image data for BRFv4
var brfManager = null;
var resolution = null;
var roi = null;
var resolutionAnalyze = null;
var brfv4 = null;
var sdkReady = false;


let deviceIndex = 1;

function setDevice(deviceInfos) {

  let videoSource;

  if (window.stream) {
    window.stream.getTracks().forEach(function(track) {
      track.stop();
    });
  }

  console.log(deviceInfos);

  let videoInputs = [];

  for (var i = 0; i !== deviceInfos.length; ++i) {
    var deviceInfo = deviceInfos[i];
    var option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'videoinput') {
      videoInputs.push(deviceInfo);
    } else {
      // console.log('Some other kind of source/device: ', deviceInfo);
    }
  }

  videoSource = videoInputs[deviceIndex].deviceId;
  console.log(videoInputs);
  console.log(videoInputs[deviceIndex]);

  constraints.video.deviceId = videoSource;
  constraintsFacetimeCam.video.deviceId = videoSource;
  constraints640.video.deviceId = videoSource;
}


var constraints = {
  video: {
deviceId: ''
  ? {
    exact: ''
  }
  : undefined,
    width: 960,
    height: 720,
    frameRate: 24
  }
};

console.log(constraints);

var constraintsFacetimeCam = {
  video: {
    width: 1280,
    height: 720,
    frameRate: 24
  }

};

var constraints640 = {
  video: {
    deviceId: ''
      ? {
        exact: ''
      }
      : undefined,
    width: 640,
    height: 480,
    frameRate: 24
  }

};

navigator.mediaDevices.enumerateDevices().then(setDevice);


  function startCamera() {
    // Start video playback once the camera was fetched.
    function onStreamFetched(mediaStream) {
      webcam.srcObject = mediaStream;
      // webcam.play();
      // Check whether we know the video dimensions yet, if so, start BRFv4.
      function onStreamDimensionsAvailable() {
        if (webcam.videoWidth === 0) {
          setTimeout(onStreamDimensionsAvailable, 100);
        } else {
          waitForSDK();
        }
      }
      onStreamDimensionsAvailable();
    }

    // {video: {deviceId: videoSource, width: 640, height: 480, frameRate: 30}}
    window.navigator.mediaDevices.getUserMedia(constraints).then(onStreamFetched).catch(function() {
      alert("No camera available.");
    });
  }

  function waitForSDK() {
    if (brfv4 === null) {
      brfv4 = {
        locateFile: function() {
          return "js/libs/brf_asmjs/BRFv4_JS_trial.js.mem";
        }
      };
      initializeBRF(brfv4);
    }
    if (brfv4.sdkReady) {
      initSDK();
    } else {
      setTimeout(waitForSDK, 100);
    }
  }
  function initSDK() {
    // Resize the canvas to match the webcam video size.
    imageData.width = webcam.videoWidth;
    imageData.height = webcam.videoHeight;
    console.log(webcam.videoWidth);
    resolution = new brfv4.Rectangle(0, 0, constraints640.video.width, constraints640.video.height);
    roiUsbCam = new brfv4.Rectangle(240, 160, 480, 480);
    roiFacetimeCam = new brfv4.Rectangle(0, 0, 960, 720);
    roi640 = new brfv4.Rectangle(0, 0, 640, 480);
    // resolutionAnalyze = new brfv4.Rectangle(0, 0, 640, 960)
    brfManager = new brfv4.BRFManager();
    brfManager.init(resolution, roi640, "com.tastenkunst.brfv4.js.examples.minimal.webcam");
    brfManager.setNumFacesToTrack(5);
    sdkReady = true;
  }
  function trackFaces() {
    if (!sdkReady) return [];
    var imageDataCtx = imageData.getContext("2d");
    imageDataCtx.setTransform(-1.0, 0, 0, 1, resolution.width, 0); // mirrored for draw of video
    imageDataCtx.drawImage(webcam, 0, 0, resolution.width, resolution.height);
    imageDataCtx.setTransform(1.0, 0, 0, 1, 0, 0); // unmirrored for draw of results
    brfManager.update(imageDataCtx.getImageData(0, 0, resolution.width, resolution.height).data);
    return brfManager.getFaces();
  }

  window.onload = startCamera;
