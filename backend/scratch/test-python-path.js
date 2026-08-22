const { execFile } = require('child_process');
const path = require('path');

const scriptPath = path.join(__dirname, '../ml_service/predict.py');
const testImgPath = path.join(__dirname, '../ml_service/datasets/other/Foliar_Spot/other_foliar_spot_001.jpg');

console.log('Testing python command execution...');

execFile('python', [scriptPath, '--image', testImgPath, '--crop', 'rice'], { timeout: 30000 }, (err, stdout, stderr) => {
  if (err) {
    console.error('python exec error:', err.message);
    console.error('stderr:', stderr);
  } else {
    console.log('python exec success! Output:');
    console.log(stdout);
  }
});
