---
name: synthesize
description: Synthesize volume profile analysis data into a structured technical analysis JSON file with agent-provided metadata.
---

## When to use this skill

Use this skill when you need to:
- Process volume profile analysis data from multiple timeframes
- Select specific value area pairs based on relevance
- Add trading bias, reasoning, and confidence to technical analysis
- Create a standardized technical analysis output file for downstream systems

## Prerequisites

- Input file must exist at: `./analysis-result/volume_profile_analysis.json`
- Input file must contain `currentPrice` and `valueAreaPairs` array
- Each value area pair must have `vah`, `val`, and `timeFrame` fields

## How to use this skill

### Template

```bash
node volume-profile-processor.js \
  --bias="<BIAS>" \
  --reason="<REASON>" \
  --confident="<CONFIDENCE>" \
  --indices="<INDICES>"
```

### Parameters

| Parameter | Required | Type | Description | Example |
|-----------|----------|------|-------------|---------|
| `--bias` | Yes | String | Trading bias direction | `"up"` or `"down"` |
| `--reason` | Yes | String | Reasoning for the analysis | `"Price is on 4H and 5M VAL"` |
| `--confident` | Yes | String | Confidence level (1-10) | `"8"` |
| `--indices` | Yes | String | Comma-separated indices of value area pairs to include | `"0,1"` or `"0,1,2"` |

### Input File Structure

**Path:** `./analysis-result/volume_profile_analysis.json`

```json
{
  "currentPrice": 1.11,
  "valueAreaPairs": [
    {
      "vah": 1.23,
      "val": 1.21,
      "timeFrame": "4H"
    },
    {
      "vah": 1.31,
      "val": 1.29,
      "timeFrame": "5M"
    },
    {
      "vah": 1.41,
      "val": 1.39,
      "timeFrame": "1H"
    }
  ]
}
```

### Output File Structure

**Path:** `/home/node/.openclaw/tehcnical-analysis-reviewer/analysis-result/technical_analysis.json`

```json
{
  "currentPrice": 1.11,
  "valueAreaPairs": [
    {
      "vah": 1.23,
      "val": 1.21
    },
    {
      "vah": 1.31,
      "val": 1.29
    }
  ],
  "bias": "up",
  "reason": "Price is on 4H and 5M VAL",
  "confident": "8"
}
```

**Note:** The `timeFrame` field is stripped from the output for a cleaner structure.

## Examples

### Example 1: Basic Usage (Select First Two Pairs)

```bash
node volume-profile-processor.js \
  --bias="up" \
  --reason="Price is on 4H and 5M VAL" \
  --confident="8" \
  --indices="0,1"
```

**Output Response (Success):**
```json
{
  "success": true,
  "message": "Analysis file created successfully",
  "outputPath": "/home/node/.openclaw/tehcnical-analysis-reviewer/analysis-result/technical_analysis.json"
}
```

### Example 2: Select All Three Pairs

```bash
node volume-profile-processor.js \
  --bias="down" \
  --reason="Price rejected from 4H VAH, bearish divergence on 5M" \
  --confident="7" \
  --indices="0,1,2"
```

### Example 3: Select Single Pair

```bash
node volume-profile-processor.js \
  --bias="up" \
  --reason="Price bouncing off 1H VAL with volume" \
  --confident="9" \
  --indices="2"
```

### Example 4: Missing Required Parameter (Error)

```bash
node volume-profile-processor.js \
  --bias="up" \
  --reason="Price on support"
```

**Output Response (Error):**
```json
{
  "success": false,
  "error": "Missing required parameters: confident, indices"
}
```

### Example 5: Invalid Index (Error)

```bash
node volume-profile-processor.js \
  --bias="up" \
  --reason="Test" \
  --confident="5" \
  --indices="0,5"
```

**Output Response (Error):**
```json
{
  "success": false,
  "error": "Invalid index 5. Valid range: 0-2"
}
```

## Error Handling

The script will fail with an error response if:
- Any required parameter is missing
- Input file doesn't exist or is malformed JSON
- Indices contain non-numeric values
- Indices are out of bounds (negative or >= array length)
- Output directory cannot be created

## Success Criteria

✅ All required parameters provided
✅ Input file exists and is valid JSON
✅ Indices are valid (within bounds)
✅ Output file successfully written

## Exit Codes

- `0`: Success
- `1`: Failure (check error message in response)