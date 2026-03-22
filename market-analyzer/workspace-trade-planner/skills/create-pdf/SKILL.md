---
name: create-pdf
description: Generate a PDF report from a structured technical analysis JSON file.
---

## When to use this skill

Use this skill when you need to generate a PDF report from a trade analysis JSON file. Common scenarios:
- Documenting trade setups with entry, stop loss, and take profit levels
- Creating shareable trade analysis reports
- Archiving trade reasoning and bias information

## How to use this skill

1. Ensure the trade data exists at `./idea/trade.json`
2. Ensure that we are inside python virtual environment
3. Run the script:
   ```bash
   python skills/create-pdf/generate_trade_pdf.py
   ```
4. The PDF will be generated at `./idea/trade.pdf`

## Template

The input JSON file should follow this structure:

```json
{
  "currentPrice": 1.3432,
  "bias": "down",
  "reason": "Trade reasoning text...",
  "confident": "9",
  "entry": 1.3432,
  "sl": 1.3465,
  "tp1": 1.34,
  "tp2": 1.3375,
  "entryTrigger": "Entry trigger description...",
  "slReason": "Stop loss reasoning...",
  "tp1Reason": "TP1 reasoning...",
  "tp2Reason": "TP2 reasoning..."
}
```

## Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| currentPrice | float | Yes | Current market price |
| bias | string | Yes | Trade direction ("up" or "down") |
| reason | string | Yes | Main reasoning for the trade |
| confident | string | Yes | Confidence level (1-10) |
| entry | float | Yes | Entry price |
| sl | float | Yes | Stop loss price |
| tp1 | float | Yes | Take profit 1 price |
| tp2 | float | Yes | Take profit 2 price |
| entryTrigger | string | Yes | Entry trigger description |
| slReason | string | Yes | Stop loss reasoning |
| tp1Reason | string | Yes | TP1 reasoning |
| tp2Reason | string | Yes | TP2 reasoning |
| valueAreaPairs | array | No | Ignored in PDF output |

## Examples

Generate a PDF from existing trade data:
```bash
python generate_trade_pdf.py
```

Expected output:
```
PDF generated: ./idea/trade.pdf
```