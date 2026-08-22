const { spawn } = require('child_process');
const path = require('path');

const scriptPath = path.join(__dirname, '../ml_service/predict.py');
const testImgPath = path.join(__dirname, '../ml_service/datasets/other/Foliar_Spot/other_foliar_spot_001.jpg');

console.log('Testing python spawn execution with PYTHONUNBUFFERED=1...');

const py = spawn('python', [scriptPath, '--image', testImgPath, '--crop', 'rice'], {
  env: { ...process.env, PYTHONUNBUFFERED: '1', TF_CPP_MIN_LOG_LEVEL: '3', TF_ENABLE_ONEDNN_OPTS: '0' },
  windowsHide: true
});

let stdout = '';
let stderr = '';

py.stdout.on('data', (d) => { stdout += d.toString(); });
py.stderr.on('data', (d) => { stderr += d.toString(); });

py.on('close', (code) => {
  console.log(`Python process exited with code ${code}`);
  console.log('STDOUT:', stdout);
  if (stderr) console.error('STDERR:', stderr);
});
