---
name: send-to-discord
description: Send trade files (PDF + charts) to Discord channel via webhook
---

## What it does
Sends trade analysis files from `idea/` folder to Discord:
- trade.pdf
- XRPUSDT_1m.png
- XRPUSDT_5m.png

## Command

```bash
node skills/send-to-discord/scripts/send-to-discord.js [--message "Your message"]
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--message` | string | No | Custom message to include (default: "Trade Analysis") |

## Requirements
- `discord/.env` with `DISCORD_MARKET_WEBHOOK_URL`
- Files must exist in `idea/` folder:
  - trade.pdf
  - XRPUSDT_1m.png
  - XRPUSDT_5m.png

## Example

```bash
node skills/send-to-discord/scripts/send-to-discord.js --message "XRP Short Setup"
```
