const fs = require('fs');
const path = require('path');

function parseArgs() {
  const args = process.argv.slice(2);
  const params = {
    entry: null,
    sl: null,
    tp1: null,
    tp2: null,
    entryTrigger: '',
    slReason: '',
    tp1Reason: '',
    tp2Reason: ''
  };

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace(/^--/, '');
    const value = args[i + 1];
    if (key && params.hasOwnProperty(key)) {
      if (['entry', 'sl', 'tp1', 'tp2'].includes(key)) {
        params[key] = value !== undefined ? parseFloat(value) : null;
      } else {
        params[key] = value !== undefined ? value : '';
      }
    }
  }

  return params;
}

function main() {
  const workspaceRoot = path.resolve(__dirname, '..', '..', '..');
  const inputPath = path.join(workspaceRoot, 'analysis', 'technical_analysis.json');
  const outputDir = path.join(workspaceRoot, 'idea');
  const outputPath = path.join(outputDir, 'trade.json');

  const params = parseArgs();

  let inputData;
  try {
    const raw = fs.readFileSync(inputPath, 'utf8');
    inputData = JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading input file: ${err.message}`);
    process.exit(1);
  }

  const output = {
    currentPrice: inputData.currentPrice,
    valueAreaPairs: inputData.valueAreaPairs,
    bias: inputData.bias,
    reason: inputData.reason,
    confident: inputData.confident,
    entry: params.entry,
    sl: params.sl,
    tp1: params.tp1,
    tp2: params.tp2,
    entryTrigger: params.entryTrigger,
    slReason: params.slReason,
    tp1Reason: params.tp1Reason,
    tp2Reason: params.tp2Reason
  };

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`Trade idea saved to: ${outputPath}`);
}

main();
