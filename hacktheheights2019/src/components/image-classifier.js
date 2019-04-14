// Function to classify
async function imageClassify(filename) {
  var fs = require('fs');

  // Import google cloud client library
  const vision = require('@google-cloud/vision');

  // Create a client
  const client = new vision.ImageAnnotatorClient();

  const [result] = await client.labelDetection(filename, timeout=5000);
  const labels = result.labelAnnotations;
  //console.log('Labels:');
  //labels.forEach(label => console.log(label.description));
  // Get the tag with the largest probability in classification
  const tag = labels[0].description

  return tag;

}
