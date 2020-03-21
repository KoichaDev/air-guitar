const modelParams = {
  flipHorizontal: true, // flip e.g for video
  imageScaleFactor: 0.7, // reduce input image size for gains in speed.
  maxNumBoxes: 1, // maximum number of boxes to detect
  iouThreshold: 0.5, // ioU threshold for non-max suppression
  scoreThreshold: 0.79 // confidence threshold for predictions.
};

document.addEventListener('DOMContentLoaded', () => {
  // The ability to use the webcam
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  // Select everything from HTML

  const video = document.getElementById('video');
  const audio = document.getElementById('audio');

  // pre-made model for our hand tracking that knows how to detect your hands
  let model;

  handTrack.startVideo(video).then(status => {
    if (status) {
      // stream is the cb that's coming from the webcam
      navigator.getUserMedia(
        { video: {} },
        stream => {
          video.srcObject = stream;

          // Run our detection
          // alternative to run this, since you get 60 fps
          // requestAnimationFrame(runDetection);
          setInterval(runDetection, 300);
        },
        err => console.log(err)
      );
    }
  });

  function runDetection() {
    model.detect(video).then(predictions => {
      if (predictions.length !== 0) {
        let handOne = predictions[0].bbox;
        // Extracting the coodinates
        let x = handOne[0];
        let y = handOne[1];

        if (y > 300) {
          if (x < 200) {
            audio.src = './assets/mp3/guitar/a-chord.mp3';
          } else if (x > 400) {
            audio.src = './assets/mp3/guitar/e-chord.mp3';
          } else if (x > 300) {
            audio.src = './assets/mp3/guitar/c-chord.mp3';
          } else if (x > 200) {
            audio.src = './assets/mp3/guitar/b-chord.mp3';
          }
        }

        // Play the sound!
        audio.play();
      }
    });
  }

  handTrack.load(modelParams).then(loadModel => {
    model = loadModel;
  });
});
