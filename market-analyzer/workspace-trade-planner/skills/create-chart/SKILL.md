---
name: create-chart
description: Generate candlestick charts with trade overlays from JSON data.
---

## When to Use This Skill

**Use when you need:**
- Static candlestick charts for analysis/reports
- Trade visualization with entry, SL, TP zones
- Value area pair overlays
- TradingView-style charts without TradingView subscription

**Don't use when you need:**
- Interactive charts (zoom, hover, crosshairs)
- Real-time streaming charts
- Web dashboard integration (use JavaScript with lightweight-charts instead)

## Input Format Requirements

### 1. Candle Data JSON (required)
Path: Pass as command-line argument
```json
{
  "symbol": "XRPUSDT",
  "timeframe": "1m",
  "start_date": "2026-03-07T02:10:00.000Z",
  "end_date": "2026-03-09T02:09:00.000Z",
  "candles_count": 2880,
  "exported_at": "2026-03-09T02:09:28.846Z",
  "candles": [
    {
      "timestamp": 1772849400000,
      "open": 1.3665,
      "high": 1.3667,
      "low": 1.3663,
      "close": 1.3663,
      "volume": 4040.7
    }
  ]
}
```

### 2. Trade Data JSON (optional)
Path: `./idea/trade.json`
```json
{
  "currentPrice": 1.11,
  "valueAreaPairs": [
    { "vah": 1.23, "val": 1.21 },
    { "vah": 1.31, "val": 1.29 }
  ],
  "bias": "up",
  "reason": "Price is on 4H and 5M VAL",
  "confident": "8",
  "entry": 1.13,
  "sl": 1.08,
  "tp1": 1.20,
  "tp2": 1.25
}
```

## How to Use

**Basic Usage:**
```bash
. venv/bin/activate
python skills/create-chart/scripts/candlestick_chart.py path/to/candles.json
```
