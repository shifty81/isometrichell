#!/bin/bash

# Launch script for Web-based Map Editor

echo "========================================"
echo "  Launching Map Editor (Web Version)"
echo "========================================"
echo ""

# Check if npm is available
if command -v npm &> /dev/null; then
    echo "Starting web server with npm..."
    npm start
elif command -v python3 &> /dev/null; then
    echo "Starting web server with Python..."
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "Starting web server with Python..."
    python -m http.server 8000
else
    echo "Error: No web server available!"
    echo "Please install Node.js or Python to run the web editor."
    exit 1
fi
