#!/bin/bash

ROOT_PATH="/home/node/.openclaw"

# Clear workspace-synthesizer generated files
echo "Clearing workspace-synthesizer generated files..."
rm -rf "$ROOT_PATH/workspace-synthesizer/analysis-result/*"
echo "Done\n"

# Clear workspace-trade-planner generated files
echo "Clearing workspace-trade-planner generated files..."
rm -rf "$ROOT_PATH/workspace-trade-planner/idea/*"
rm -rf "$ROOT_PATH/workspace-trade-planner/analysis/*"
rm -rf "$ROOT_PATH/workspace-trade-planner/data/*"
echo "Done\n"

# Clear workspace-volume-profile-analyzer generated files
echo "Clearing workspace-volume-profile-analyzer generated files..."
rm -rf "$ROOT_PATH/workspace-volume-profile-analyzer/volume-profile-data/*"
echo "Done\n"

echo "All generated files have been cleared."