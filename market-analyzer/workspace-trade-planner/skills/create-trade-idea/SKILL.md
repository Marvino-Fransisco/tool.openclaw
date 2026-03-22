---
name: create-trade-idea
description: Create new trade idea in JSON file.
---

## When to use this skill
Use this skill when the user wants to create a new trade idea based on technical analysis.

## What it does
This skill reads technical analysis data from `analysis/technical_analysis.json` and combines it with trade parameters to create a complete trade idea file at `idea/trade.json`.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--entry` | number | Yes | Entry price for the trade |
| `--sl` | number | Yes | Stop loss price |
| `--tp1` | number | Yes | Take profit 1 target price |
| `--tp2` | number | Yes | Take profit 2 target price |
| `--entryTrigger` | string | No | Reason/condition for entry trigger |
| `--slReason` | string | No | Reason for stop loss placement |
| `--tp1Reason` | string | No | Reason for TP1 target |
| `--tp2Reason` | string | No | Reason for TP2 target |

## Command Template

```bash
node skills/create-trade-idea/scripts/create-trade-idea.js \
  --entry <ENTRY_PRICE> \
  --sl <STOP_LOSS> \
  --tp1 <TP1_PRICE> \
  --tp2 <TP2_PRICE> \
  --entryTrigger "<ENTRY_TRIGGER_REASON>" \
  --slReason "<SL_REASON>" \
  --tp1Reason "<TP1_REASON>" \
  --tp2Reason "<TP2_REASON>"
```

## Full Parameter Example

```bash
node skills/create-trade-idea/scripts/create-trade-idea.js \
  --entry 1.0850 \
  --sl 1.0800 \
  --tp1 1.0920 \
  --tp2 1.0980 \
  --entryTrigger "Break above resistance at 1.0845 with volume confirmation" \
  --slReason "Below key support level and value area low" \
  --tp1Reason "Previous resistance level and 1:2 risk-reward ratio" \
  --tp2Reason "Major psychological level and extended target"
```

## Minimal Example (required params only)

```bash
node skills/create-trade-idea/scripts/create-trade-idea.js \
  --entry 1.0850 \
  --sl 1.0800 \
  --tp1 1.0920 \
  --tp2 1.0980
```

## Input Requirements
- `analysis/technical_analysis.json` must exist with the following fields:
  - `currentPrice`
  - `valueAreaPairs`
  - `bias`
  - `reason`
  - `confident`

## Output
Creates `idea/trade.json` containing the combined technical analysis and trade parameters.
