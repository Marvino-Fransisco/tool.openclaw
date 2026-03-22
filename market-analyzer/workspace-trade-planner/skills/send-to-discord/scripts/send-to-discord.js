const fs = require('fs');
const path = require('path');

function parseArgs() {
  const args = process.argv.slice(2);
  let message = 'Trade Analysis';
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--message' && args[i + 1]) {
      message = args[i + 1];
      break;
    }
  }
  
  return { message };
}

function loadEnv(envPath) {
  if (!fs.existsSync(envPath)) {
    console.error(`Error: .env file not found at ${envPath}`);
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  return env;
}

async function main() {
  const workspaceRoot = path.resolve(__dirname, '..');
  const envPath = path.join(workspaceRoot, '.env');
  const ideaDir = "/home/node/.openclaw/workspace-trade-planner/idea"
  
  const { message } = parseArgs();
  const env = loadEnv(envPath);
  
  const webhookUrl = env.DISCORD_MARKET_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('Error: DISCORD_MARKET_WEBHOOK_URL not found in discord/.env');
    process.exit(1);
  }
  
  const files = [
    { name: 'trade.pdf', path: path.join(ideaDir, 'trade.pdf') },
    { name: 'XRPUSDT_1m.png', path: path.join(ideaDir, 'XRPUSDT_1m.png') },
    { name: 'XRPUSDT_5m.png', path: path.join(ideaDir, 'XRPUSDT_5m.png') }
  ];
  
  for (const file of files) {
    if (!fs.existsSync(file.path)) {
      console.error(`Error: File not found: ${file.path}`);
      process.exit(1);
    }
  }
  
  const formData = new FormData();
  
  files.forEach((file, index) => {
    const fileBuffer = fs.readFileSync(file.path);
    const blob = new Blob([fileBuffer]);
    formData.append(`files[${index}]`, blob, file.name);
  });
  
  formData.append('content', message);
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error: Failed to send to Discord: ${response.status} ${errorText}`);
      process.exit(1);
    }
    
    console.log('Files sent to Discord successfully!');
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
