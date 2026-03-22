const fs = require('fs');
const path = require('path');

function parseArgs() {
	const args = process.argv.slice(2);
	const params = {};
	
	args.forEach(arg => {
		const match = arg.match(/^--(.+?)=(.+)$/);
		if (match) {
			const [, key, value] = match;
			params[key] = value;
		}
	});
	
	return params;
}

function validateParams(params) {
	const required = ['bias', 'reason', 'confident', 'indices'];
	const missing = required.filter(key => !params[key]);
	
	if (missing.length > 0) {
		throw new Error(`Missing required parameters: ${missing.join(', ')}`);
	}
}

function validateIndices(indices, maxLength) {
	for (const idx of indices) {
		if (idx < 0 || idx >= maxLength) {
			throw new Error(`Invalid index ${idx}. Valid range: 0-${maxLength - 1}`);
		}
	}
}

function main() {
	const params = parseArgs();
	
	validateParams(params);
	
	const inputPath = params.input || path.join(__dirname, 'analysis-result', 'volume_profile_analysis.json');
	const outputPath = params.output || '/home/node/.openclaw/workspace-trade-planner/analysis/technical_analysis.json';
	
	let inputData;
	try {
		const fileContent = fs.readFileSync(inputPath, 'utf8');
		inputData = JSON.parse(fileContent);
	} catch (error) {
		throw new Error(`Failed to read input file: ${error.message}`);
	}
	
	const indices = params.indices.split(',').map(s => parseInt(s.trim(), 10));
	
	if (indices.some(isNaN)) {
		throw new Error('Invalid indices format. Use comma-separated numbers (e.g., "0,1,2")');
	}
	
	validateIndices(indices, inputData.valueAreaPairs.length);
	
	const selectedPairs = indices.map(idx => {
		const pair = inputData.valueAreaPairs[idx];
		return {
			vah: pair.vah,
			val: pair.val
		};
	});
	
	const output = {
		currentPrice: inputData.currentPrice,
		valueAreaPairs: selectedPairs,
		bias: params.bias,
		reason: params.reason,
		confident: params.confident
	};
	
	const outputDir = path.dirname(outputPath);
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}
	
	fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
	
	console.log(JSON.stringify({
		success: true,
		message: 'Analysis file created successfully',
		outputPath: outputPath
	}));
}

try {
	main();
} catch (error) {
	console.log(JSON.stringify({
		success: false,
		error: error.message
	}));
	process.exit(1);
}
