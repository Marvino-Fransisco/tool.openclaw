#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DEFAULT_INPUT_DIR = './volume-profile-data';

function parseArgs() {
  const args = process.argv.slice(2);
  const params = {
    price: null,
    select: null,
    dir: DEFAULT_INPUT_DIR,
    list: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--price' || arg === '-p') {
      params.price = parseFloat(args[++i]);
    } else if (arg === '--select' || arg === '-s') {
      params.select = args[++i];
    } else if (arg === '--dir' || arg === '-d') {
      params.dir = args[++i];
    } else if (arg === '--list' || arg === '-l') {
      params.list = true;
    }
  }

  return params;
}

function parseSelections(input) {
  const selections = [];
  // Use regex to match the pattern: filename:[indices]
  // This regex finds all occurrences of "filename:[...]" in the input
  const regex = /([^,]+?):\[([^\]]+)\]/g;
  let match;
  
  while ((match = regex.exec(input)) !== null) {
    const filename = match[1].trim();
    const indicesStr = match[2];
    const indices = indicesStr.split(',').map(n => parseInt(n.trim(), 10));
    selections.push({ filename, indices });
  }
  
  if (selections.length === 0) {
    throw new Error(`Invalid selection format: "${input}". Expected format: "filename:[0,1,2]"`);
  }
  
  return selections;
}

function readJsonFile(dir, filename) {
  const filepath = path.join(dir, filename);
  
  if (!fs.existsSync(filepath)) {
    throw new Error(`File not found: ${filepath}`);
  }
  
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    const data = JSON.parse(content);
    
    if (!data.success || !data.data || !data.data.value_areas) {
      throw new Error(`Invalid JSON structure in ${filename}`);
    }
    
    return data;
  } catch (err) {
    if (err.message.includes('File not found')) throw err;
    throw new Error(`Failed to parse JSON in ${filename}: ${err.message}`);
  }
}

function extractValueAreas(data, indices, filename) {
  const valueAreas = data.data.value_areas;
  const timeframe = data.data.timeframe;
  const extracted = [];
  
  for (const index of indices) {
    if (index < 0 || index >= valueAreas.length) {
      throw new Error(`Invalid index ${index} in ${filename}. File has ${valueAreas.length} value areas (indices 0-${valueAreas.length - 1})`);
    }
    
    const va = valueAreas[index];
    extracted.push({
      vah: va.vah,
      val: va.val,
      timeFrame: timeframe
    });
  }
  
  return extracted;
}

function generateOutput(price, selections, dir) {
  const valueAreaPairs = [];
  
  for (const selection of selections) {
    const data = readJsonFile(dir, selection.filename);
    const extracted = extractValueAreas(data, selection.indices, selection.filename);
    valueAreaPairs.push(...extracted);
  }
  
  return {
    currentPrice: price,
    valueAreaPairs
  };
}

function listAvailableFiles(dir) {
  const dirPath = path.resolve(dir);
  
  if (!fs.existsSync(dirPath)) {
    console.error(`Directory not found: ${dirPath}`);
    process.exit(1);
  }
  
  const files = fs.readdirSync(dirPath)
    .filter(f => f.endsWith('.json'))
    .sort();
  
  if (files.length === 0) {
    console.log(`No JSON files found in ${dirPath}`);
    return;
  }
  
  console.log(`\nAvailable files in ${dirPath}:\n`);
  
  files.forEach((filename, index) => {
    try {
      const data = readJsonFile(dirPath, filename);
      const timeframe = data.data.timeframe;
      const valueAreaCount = data.data.value_areas.length;
      
      console.log(`[${index}] ${filename}`);
      console.log(`    - Timeframe: ${timeframe}`);
      console.log(`    - Value areas: ${valueAreaCount}`);
      console.log();
    } catch (err) {
      console.log(`[${index}] ${filename}`);
      console.log(`    - Error: ${err.message}`);
      console.log();
    }
  });
}

function showUsage() {
  console.log(`
Usage: node generate-profile.js [options]

Required:
  --price, -p <number>      Current price (manual input)
  --select, -s <string>     File selections (format: "filename:[0,1],file2:[2]")

Optional:
  --dir, -d <path>          Input directory (default: ./volume-profile-data)
  --list, -l                List all available files with info

Output:
  ./analysis-result/volume_profile_analysis.json

Examples:
  node generate-profile.js --list
  
  node generate-profile.js --price 1.3971 --select "XRPUSDT_4H_3Hour:[0]"
  
  node generate-profile.js -p 2.45 -s "file1:[0,1],file2:[0]"
`);
}

function main() {
  const params = parseArgs();
  
  if (params.list) {
    listAvailableFiles(params.dir);
    return;
  }
  
  if (!params.price || !params.select) {
    showUsage();
    process.exit(1);
  }
  
  if (isNaN(params.price)) {
    console.error('Error: Invalid price value');
    process.exit(1);
  }
  
  try {
    const selections = parseSelections(params.select);
    const output = generateOutput(params.price, selections, params.dir);
    const json = JSON.stringify(output, null, 2);
    
    const outputPath = '/home/node/.openclaw/workspace-synthesizer/analysis-result/volume_profile_analysis.json';
    const outputDir = path.dirname(outputPath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, json);
    console.log(`Output written to ${outputPath}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
