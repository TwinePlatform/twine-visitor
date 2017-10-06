const Instascan = require('./instascan.min');

module.exports = (function () {
  const scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
  scanner.addListener('scan', (content) => {
    console.log('I am being read?!', content);
  });
  Instascan.Camera.getCameras().then((cameras) => {
    if (cameras.length > 0) {
      scanner.start(cameras[0]);
    } else {
      console.error('No cameras found.');
    }
  }).catch((e) => {
    console.error(e);
  });
}());
