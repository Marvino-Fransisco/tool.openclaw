#!/bin/bash

# Volume Profile Analyzer Runner - Concurrent Version
# Runs all analyses in parallel and waits for completion
# Usage: ./run-volume-profile.sh [pair]
# Example: ./run-volume-profile.sh XRPUSDT

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
OUTPUT_DIR="/home/node/.openclaw/workspace-volume-profile-analyzer/volume-profile-data"

# Get pair from argument or default to XRPUSDT
PAIR=${1:-XRPUSDT}

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Get current timestamps
NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
TODAY_START=$(date -u +"%Y-%m-%dT00:00:00Z")
YESTERDAY_START=$(date -u -d "yesterday" +"%Y-%m-%dT00:00:00Z")
YESTERDAY_END=$(date -u -d "yesterday" +"%Y-%m-%dT23:59:59Z")
ONE_WEEK_AGO=$(date -u -d "7 days ago" +"%Y-%m-%dT00:00:00Z")
TWO_MONTHS_AGO=$(date -u -d "2 months ago" +"%Y-%m-%dT00:00:00Z")
THREE_HOURS_AGO=$(date -u -d "3 hours ago" +"%Y-%m-%dT%H:%M:%SZ")

echo "=== Volume Profile Analyzer (Concurrent) ==="
echo "Pair: $PAIR"
echo "Current time (UTC): $NOW"
echo "Running 5 analyses in parallel..."
echo ""

run_analysis() {
    local label=$1
    local pair=$2
    local timeframe=$3
    local tick=$4
    local start=$5
    local end=$6
    local output=$7

    echo "[$label] Starting..."
    if node "$SCRIPT_DIR/market-profile.js" "$pair" "$timeframe" "$tick" "$start" "$end" "$output"; then
        echo "[$label] Done ✓"
    else
        echo "[$label] Failed ✗"
        return 1
    fi
}

# Run analyses in background
run_analysis "1/5" "$PAIR" 4h 0.001 "$TWO_MONTHS_AGO" "$NOW" "$OUTPUT_DIR/${PAIR}_4H_2Month.json" &
PID1=$!

run_analysis "2/5" "$PAIR" 4h 0.001 "$ONE_WEEK_AGO" "$NOW" "$OUTPUT_DIR/${PAIR}_4H_1Week.json" &
PID2=$!

run_analysis "3/5" "$PAIR" 5m 0.0005 "$YESTERDAY_START" "$YESTERDAY_END" "$OUTPUT_DIR/${PAIR}_5M_Yesterday.json" &
PID3=$!

run_analysis "4/5" "$PAIR" 5m 0.0005 "$TODAY_START" "$NOW" "$OUTPUT_DIR/${PAIR}_5M_Today.json" &
PID4=$!

run_analysis "5/5" "$PAIR" 1m 0.0005 "$THREE_HOURS_AGO" "$NOW" "$OUTPUT_DIR/${PAIR}_1M_3Hour.json" &
PID5=$!

echo "Waiting for all analyses to complete..."

FAIL=0

wait $PID1 || FAIL=1
wait $PID2 || FAIL=1
wait $PID3 || FAIL=1
wait $PID4 || FAIL=1
wait $PID5 || FAIL=1

if [ $FAIL -ne 0 ]; then
    echo ""
    echo "❌ One or more analyses failed."
    exit 1
fi

echo ""
echo "=== All analyses complete ==="
echo "Output files:"
ls -la "$OUTPUT_DIR"/${PAIR}_*.json 2>/dev/null || true

exit 0