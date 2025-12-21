#!/bin/bash

# PZ Map Extraction Helper Script
# Helps extract and convert Project Zomboid vanilla maps for use in The Daily Grind

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
EXTRACT_DIR="$ROOT_DIR/tiled_maps/extracted"
TEMPLATES_DIR="$ROOT_DIR/tiled_maps/templates"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "========================================"
echo "  PZ Map Extraction Helper"
echo "========================================"
echo ""

# Create directories
mkdir -p "$EXTRACT_DIR"
mkdir -p "$TEMPLATES_DIR"

# Detect Project Zomboid installation
log_info "Looking for Project Zomboid installation..."

PZ_PATHS=(
    "$HOME/.steam/steam/steamapps/common/ProjectZomboid"
    "$HOME/.local/share/Steam/steamapps/common/ProjectZomboid"
    "/c/Program Files (x86)/Steam/steamapps/common/ProjectZomboid"
    "/mnt/c/Program Files (x86)/Steam/steamapps/common/ProjectZomboid"
)

PZ_INSTALL=""
for path in "${PZ_PATHS[@]}"; do
    if [ -d "$path/media/maps" ]; then
        PZ_INSTALL="$path"
        log_success "Found PZ installation: $PZ_INSTALL"
        break
    fi
done

if [ -z "$PZ_INSTALL" ]; then
    log_warn "Could not auto-detect Project Zomboid installation"
    echo ""
    echo "Please enter the path to your Project Zomboid installation:"
    echo "(e.g., C:/Program Files (x86)/Steam/steamapps/common/ProjectZomboid)"
    read -p "Path: " PZ_INSTALL
    
    if [ ! -d "$PZ_INSTALL/media/maps" ]; then
        log_error "Invalid path - media/maps not found"
        exit 1
    fi
fi

MAPS_DIR="$PZ_INSTALL/media/maps"

# List available maps
log_info "Available maps in Project Zomboid:"
echo ""

MAPS=()
INDEX=1
while IFS= read -r -d '' map; do
    map_name=$(basename "$map")
    MAPS+=("$map_name")
    echo "  [$INDEX] $map_name"
    INDEX=$((INDEX + 1))
done < <(find "$MAPS_DIR" -mindepth 1 -maxdepth 1 -type d -print0 | sort -z)

if [ ${#MAPS[@]} -eq 0 ]; then
    log_error "No maps found in $MAPS_DIR"
    exit 1
fi

echo ""
echo "Recommended for extraction:"
echo "  • Muldraugh, KY (medium, good variety)"
echo "  • Rosewood, KY (small, simple)"
echo "  • West Point, KY (large, complex)"
echo ""

# Selection menu
echo "What would you like to do?"
echo "  [1] Copy raw map files (map.info, spawnpoints.lua, etc.)"
echo "  [2] List map contents (see what's in each map)"
echo "  [3] Launch WorldEd to export maps manually"
echo "  [4] Launch TileZed to extract buildings"
echo "  [5] Generate extraction instructions"
echo "  [6] Exit"
echo ""
read -p "Choice [1-6]: " choice

case $choice in
    1)
        echo ""
        read -p "Enter map number to copy [1-${#MAPS[@]}]: " map_num
        if [ "$map_num" -lt 1 ] || [ "$map_num" -gt ${#MAPS[@]} ]; then
            log_error "Invalid map number"
            exit 1
        fi
        
        MAP_NAME="${MAPS[$((map_num - 1))]}"
        SOURCE_MAP="$MAPS_DIR/$MAP_NAME"
        DEST_MAP="$EXTRACT_DIR/$(echo "$MAP_NAME" | tr ' ' '_' | tr ',' '')"
        
        log_info "Copying $MAP_NAME..."
        mkdir -p "$DEST_MAP"
        
        # Copy readable files
        if [ -f "$SOURCE_MAP/map.info" ]; then
            cp "$SOURCE_MAP/map.info" "$DEST_MAP/"
            log_success "Copied map.info"
        fi
        
        if [ -f "$SOURCE_MAP/spawnpoints.lua" ]; then
            cp "$SOURCE_MAP/spawnpoints.lua" "$DEST_MAP/"
            log_success "Copied spawnpoints.lua"
        fi
        
        if [ -f "$SOURCE_MAP/objects.lua" ]; then
            cp "$SOURCE_MAP/objects.lua" "$DEST_MAP/"
            log_success "Copied objects.lua"
        fi
        
        # Copy cell data directory
        if [ -d "$SOURCE_MAP/celldata" ]; then
            cp -r "$SOURCE_MAP/celldata" "$DEST_MAP/"
            CELL_COUNT=$(find "$DEST_MAP/celldata" -name "*.lotheader" | wc -l)
            log_success "Copied celldata directory ($CELL_COUNT cells)"
        fi
        
        echo ""
        log_success "Map files copied to: $DEST_MAP"
        echo ""
        log_info "Next steps:"
        echo "  1. View map.info: cat $DEST_MAP/map.info"
        echo "  2. View spawns: cat $DEST_MAP/spawnpoints.lua"
        echo "  3. Use WorldEd to view/export the map visually"
        echo "  4. Parse with our tools: node tools/parse-pz-map.js"
        ;;
        
    2)
        echo ""
        read -p "Enter map number to analyze [1-${#MAPS[@]}]: " map_num
        if [ "$map_num" -lt 1 ] || [ "$map_num" -gt ${#MAPS[@]} ]; then
            log_error "Invalid map number"
            exit 1
        fi
        
        MAP_NAME="${MAPS[$((map_num - 1))]}"
        SOURCE_MAP="$MAPS_DIR/$MAP_NAME"
        
        echo ""
        log_info "Analyzing: $MAP_NAME"
        echo "----------------------------------------"
        
        if [ -f "$SOURCE_MAP/map.info" ]; then
            echo ""
            echo "=== map.info ==="
            cat "$SOURCE_MAP/map.info"
        fi
        
        if [ -f "$SOURCE_MAP/spawnpoints.lua" ]; then
            echo ""
            echo "=== spawnpoints.lua (first 20 lines) ==="
            head -n 20 "$SOURCE_MAP/spawnpoints.lua"
        fi
        
        if [ -d "$SOURCE_MAP/celldata" ]; then
            echo ""
            echo "=== Cell Data ==="
            CELL_COUNT=$(find "$SOURCE_MAP/celldata" -name "*.lotheader" | wc -l)
            echo "Total cells: $CELL_COUNT"
            echo "Sample cell files:"
            find "$SOURCE_MAP/celldata" -name "*.lotheader" | head -n 5
        fi
        ;;
        
    3)
        log_info "Launching WorldEd..."
        if [ ! -f "$ROOT_DIR/launch-worlded.sh" ]; then
            log_error "WorldEd not installed. Run: ./tools/setup-editors.sh"
            exit 1
        fi
        
        echo ""
        log_info "Instructions for WorldEd:"
        echo "  1. File → Open World"
        echo "  2. Navigate to: $MAPS_DIR"
        echo "  3. Select a map folder (e.g., Muldraugh, KY)"
        echo "  4. Wait for map to load"
        echo "  5. File → Export → TMX format"
        echo "  6. Save to: $EXTRACT_DIR"
        echo ""
        read -p "Press Enter to launch WorldEd..."
        
        cd "$ROOT_DIR"
        ./launch-worlded.sh
        ;;
        
    4)
        log_info "Launching TileZed..."
        if [ ! -f "$ROOT_DIR/launch-tilezed.sh" ]; then
            log_error "TileZed not installed. Run: ./tools/setup-editors.sh"
            exit 1
        fi
        
        echo ""
        log_info "Instructions for TileZed/BuildingEd:"
        echo "  1. In TileZed: Tools → BuildingEd"
        echo "  2. File → Open from World"
        echo "  3. Navigate to: $MAPS_DIR"
        echo "  4. Click on buildings to extract"
        echo "  5. File → Export → TMX or TBX format"
        echo "  6. Save to: $EXTRACT_DIR/buildings/"
        echo ""
        read -p "Press Enter to launch TileZed..."
        
        cd "$ROOT_DIR"
        ./launch-tilezed.sh
        ;;
        
    5)
        log_info "Generating extraction guide..."
        
        GUIDE_FILE="$ROOT_DIR/EXTRACTION_INSTRUCTIONS.txt"
        
        cat > "$GUIDE_FILE" << EOF
========================================
Project Zomboid Map Extraction Guide
Generated: $(date)
========================================

PROJECT ZOMBOID INSTALLATION
Location: $PZ_INSTALL
Maps Directory: $MAPS_DIR

AVAILABLE MAPS
$(printf "  • %s\n" "${MAPS[@]}")

EXTRACTION METHODS

Method 1: Copy Raw Files
-------------------------
This script can copy the readable files (map.info, spawnpoints.lua) to:
  $EXTRACT_DIR

Run this script and choose option [1]

Method 2: Use WorldEd (Visual Export)
--------------------------------------
1. Launch: ./launch-worlded.sh
2. File → Open World
3. Navigate to: $MAPS_DIR
4. Select map (e.g., Muldraugh, KY)
5. File → Export → TMX
6. Save to: $EXTRACT_DIR

Method 3: Use TileZed (Buildings)
----------------------------------
1. Launch: ./launch-tilezed.sh
2. Tools → BuildingEd
3. File → Open from World
4. Click buildings to extract
5. File → Export → TMX/TBX
6. Save to: $EXTRACT_DIR/buildings/

WHAT YOU'LL GET

From raw copy:
  • map.info (map metadata)
  • spawnpoints.lua (spawn locations)
  • objects.lua (object placements)
  • celldata/ (binary cell data)

From WorldEd export:
  • .tmx files (Tiled Map XML)
  • .pzw files (WorldEd project)
  • tileset references

From TileZed export:
  • .tbx files (building definitions)
  • .tmx files (building layouts)

USING EXTRACTED DATA

1. Parse with our tools:
   node tools/parse-pz-map.js $EXTRACT_DIR/[map_name]

2. Convert to our format:
   See: engine/world/PZMapDataParser.js

3. Use as template:
   Load in game using World.fromTemplate()

DOCUMENTATION

See full guide: docs/PZ_MAP_EXTRACTION_GUIDE.md

For help: Check README.md or docs/WORLDEDIT_TILEZED_SETUP.md
EOF
        
        log_success "Guide saved to: $GUIDE_FILE"
        echo ""
        cat "$GUIDE_FILE"
        ;;
        
    6)
        log_info "Exiting..."
        exit 0
        ;;
        
    *)
        log_error "Invalid choice"
        exit 1
        ;;
esac

echo ""
log_success "Done!"
echo ""
