---
name: create-analysis-result
description: Create analysis result in json format.
---

## When to use this skill
Use this skill after you analyzed the volume profile

## Parameters

| Parameter | Short | Required | Description | Default |
|-----------|-------|----------|-------------|---------|
| `--price` | `-p` | Yes | Current price (number) | - |
| `--select` | `-s` | Yes | File selections (format: `"filename:[0,1],file2:[2]"`) | - |
| `--dir` | `-d` | No | Input directory containing JSON files | `./volume-profile-data` |
| `--list` | `-l` | No | List all available files with info | - |

## Output
- Always writes to: `./analysis-result/volume_profile_analysis.json`
- Directory is created automatically if it doesn't exist

## Selection Format
```
"filename1:[index1,index2],filename2:[index3]"
```

- Multiple files: separated by commas
- Indices: wrapped in brackets `[]`, separated by commas
- Example: `"XRPUSDT_4H_3Hour:[0],BTCUSDT_1H:[0,1,2]"`

## Examples

### List available files
```bash
node skills/create-analysis-result/scripts/generate-profile.js --list
```

### List files from custom directory
```bash
node skills/create-analysis-result/scripts/generate-profile.js --list --dir ./my-data
```

### Single file, single value area
```bash
node skills/create-analysis-result/scripts/generate-profile.js \
  --price 1.3971 \
  --select "XRPUSDT_4H_3Hour:[0]"
```

### Single file, multiple value areas
```bash
node skills/create-analysis-result/scripts/generate-profile.js \
  -p 2.45 \
  -s "XRPUSDT_4H_3Hour:[0,1,2]"
```

### Multiple files, multiple value areas
```bash
node skills/create-analysis-result/scripts/generate-profile.js \
  --price 1.3971 \
  --select "XRPUSDT_4H_3Hour:[0],BTCUSDT_1H:[0,1],ETHUSDT_15M:[2]"
```

### Custom input directory
```bash
node skills/create-analysis-result/scripts/generate-profile.js \
  -p 50000 \
  -s "BTCUSDT_1H:[0,1]" \
  -d ./custom-data
```

### Using all parameters (long form)
```bash
node skills/create-analysis-result/scripts/generate-profile.js \
  --price 0.5234 \
  --select "ADAUSDT_4H:[0],DOTUSDT_1H:[0,1]" \
  --dir ./volume-profile-data
```

## Output Format
The generated `volume_profile_analysis.json` contains:
```json
{
  "currentPrice": 1.3971,
  "valueAreaPairs": [
    {
      "vah": 1.4050,
      "val": 1.3900,
      "timeFrame": "4H"
    }
  ]
}
```