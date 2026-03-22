name: market-profile-analyzer

args:
  pair:
    default: "XRPUSDT"

steps:
  - id: fetch-volume-profile-batch
    command: bybit/run-volume-profile.sh ${pair}
  
  - id: analyze-volume-profile
    command: openclaw agent --agent volume-profile-analyzer -m "Analyze the volume profile"

  - id: synthesize-all-analysis
    command: openclaw agent --agent synthesizer -m "Analyze all the analysis result and synthesize them"

  - id: create-chart-data
    command: node bybit/fetch-candle.js ${pair}

  - id: create-trade-idea
    command: openclaw agent --agent trade-planner -m "Run your to do list"

  - id: move-trade-idea
    command: mv /home/node/.openclaw/workspace-trade-planner/idea/* ./idea || true
 
  - id: clean-up
    command: ./scripts/clear.sh