

// Function to classify
async function imageClassify(filename) {
  // Import google cloud client library
  const vision = require('@google-cloud/vision');

  // Create a client
  const client = new vision.ImageAnnotatorClient();

  const [result] = await client.labelDetection(filename);
  const labels = result.labelAnnotations;
  console.log('Labels:');
  labels.forEach(label => console.log(label.description));
}

// Test
const f = 'corgi.png'
imageClassify(f);


// Create directory
function createDir(folderName) {
  const fs = require('fs');

  try {
    if (!fs.existsSync(folderName)){
      fs.mkdirSync(folderName)
    }
  } catch (err) {
    console.error(err)
  }
}

// Test
const f2 = 'test2'
createDir(f2);
