// api key = 'AIzaSyBEXYUNUaFk36Ub6jw1tKK8CjpYagP34vA'

// Import google cloud client library
const vision = require('@google-cloud/vision');

// Create a client
const client = new vision.ImageAnnotatorClient();

// Perform a label detection on a image file
client.labelDetection('corgi.png').then(results => {
  const labels = results[0].labelAnnotations;

  console.log('Labels:');
  labels.forEach(label => console.log(label.description));

}).catch(err => {
  console.err('ERROR', err);
});

// Method
async function imageClassify(filename) {
  const vision = require('@google-cloud/vision');

  // Create a client
  const client = new vision.ImageAnnotatorClient();

  const [result] = await client.labelDetection(filename);
  const labels = result.labelAnnotations;
  console.log('Labels:');
  labels.forEach(label => console.log(label.description));
}

const f = 'corgi.png'
imageClassify(f);
