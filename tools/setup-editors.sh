#!/bin/bash

# Setup script for TileZed and WorldEd map editors
# This script extracts the editor tools from zip archives and configures them for use

set -e

TOOLS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$TOOLS_DIR")"
EDITORS_DIR="$TOOLS_DIR/zomboid_editors"
LOG_DIR="$ROOT_DIR/logs"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create logs directory if needed
mkdir -p "$LOG_DIR"

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
echo "  TileZed/WorldEd Setup Script"
echo "========================================"
echo ""

# Check for extraction tools
HAS_7Z=false
HAS_UNZIP=false

if command -v 7z &> /dev/null || command -v 7za &> /dev/null; then
    HAS_7Z=true
fi

if command -v unzip &> /dev/null; then
    HAS_UNZIP=true
fi

if [ "$HAS_7Z" = false ] && [ "$HAS_UNZIP" = false ]; then
    log_error "No extraction tool found!"
    log_info "Please install 7z or unzip:"
    log_info "  Ubuntu/Debian: sudo apt-get install p7zip-full"
    log_info "  Fedora/RHEL: sudo dnf install p7zip"
    log_info "  macOS: brew install p7zip"
    log_info "  Or for zip: sudo apt-get install unzip"
    exit 1
fi

# Look for archive files in the tools directory and root directory
log_info "Looking for editor archive files..."

# Check for individual files
TILEZED_FILES=(
    "$ROOT_DIR/tilezed.7z"
    "$ROOT_DIR/TileZed.7z"
    "$TOOLS_DIR/tilezed.7z"
    "$TOOLS_DIR/TileZed.7z"
    "$ROOT_DIR/TileZed.zip"
    "$TOOLS_DIR/TileZed.zip"
)

WORLDED_FILES=(
    "$ROOT_DIR/worlded.7z"
    "$ROOT_DIR/WorldEd.7z"
    "$TOOLS_DIR/worlded.7z"
    "$TOOLS_DIR/WorldEd.7z"
    "$ROOT_DIR/WorldEd.zip"
    "$TOOLS_DIR/WorldEd.zip"
)

COMBINED_FILES=(
    "$ROOT_DIR/zomboid_editors.7z"
    "$TOOLS_DIR/zomboid_editors.7z"
    "$ROOT_DIR/zomboid_editors.zip"
    "$TOOLS_DIR/zomboid_editors.zip"
)

FOUND_TILEZED=""
FOUND_WORLDED=""
FOUND_COMBINED=""

# Check for TileZed
for archive_file in "${TILEZED_FILES[@]}"; do
    if [ -f "$archive_file" ]; then
        FOUND_TILEZED="$archive_file"
        log_success "Found TileZed: $(basename "$FOUND_TILEZED")"
        break
    fi
done

# Check for WorldEd
for archive_file in "${WORLDED_FILES[@]}"; do
    if [ -f "$archive_file" ]; then
        FOUND_WORLDED="$archive_file"
        log_success "Found WorldEd: $(basename "$FOUND_WORLDED")"
        break
    fi
done

# Check for combined archive
for archive_file in "${COMBINED_FILES[@]}"; do
    if [ -f "$archive_file" ]; then
        FOUND_COMBINED="$archive_file"
        log_success "Found combined archive: $(basename "$FOUND_COMBINED")"
        break
    fi
done

# Validate we found at least something
if [ -z "$FOUND_TILEZED" ] && [ -z "$FOUND_WORLDED" ] && [ -z "$FOUND_COMBINED" ]; then
    log_warn "No editor archive files found!"
    echo ""
    log_info "Please download TileZed/WorldEd from:"
    log_info "  https://theindiestone.com/forums/index.php?/topic/59675-latest-tilezed-worlded-and-tilesets-september-8-2022/"
    echo ""
    log_info "Place the archive file(s) in the root directory with these names:"
    log_info "  - tilezed.7z (or TileZed.7z or TileZed.zip)"
    log_info "  - worlded.7z (or WorldEd.7z or WorldEd.zip)"
    log_info "  OR a combined zomboid_editors.7z (or .zip)"
    echo ""
    log_info "Then run this script again."
    exit 1
fi

# Create editors directory
log_info "Creating editors directory: $EDITORS_DIR"
mkdir -p "$EDITORS_DIR"

# Function to extract archive
extract_archive() {
    local archive_file="$1"
    local dest_dir="$2"
    local tool_name="$3"
    
    log_info "Extracting $tool_name: $(basename "$archive_file")..."
    
    # Determine file extension
    local ext="${archive_file##*.}"
    
    if [ "$ext" = "7z" ]; then
        # Use 7z for .7z files
        if command -v 7z &> /dev/null; then
            7Z_CMD="7z"
        elif command -v 7za &> /dev/null; then
            7Z_CMD="7za"
        else
            log_error "7z command not found for .7z extraction"
            return 1
        fi
        
        if $7Z_CMD x "$archive_file" -o"$dest_dir" -y > /dev/null; then
            log_success "$tool_name extraction complete!"
            return 0
        else
            log_error "Failed to extract $tool_name .7z file"
            return 1
        fi
    elif [ "$ext" = "zip" ]; then
        # Use unzip for .zip files
        if unzip -q -o "$archive_file" -d "$dest_dir"; then
            log_success "$tool_name extraction complete!"
            return 0
        else
            log_error "Failed to extract $tool_name .zip file"
            return 1
        fi
    fi
}

# Extract archives
if [ -n "$FOUND_COMBINED" ]; then
    log_info "Extracting combined archive..."
    extract_archive "$FOUND_COMBINED" "$EDITORS_DIR" "Combined editors" || exit 1
else
    # Extract TileZed if found
    if [ -n "$FOUND_TILEZED" ]; then
        extract_archive "$FOUND_TILEZED" "$EDITORS_DIR" "TileZed" || exit 1
    fi
    
    # Extract WorldEd if found
    if [ -n "$FOUND_WORLDED" ]; then
        extract_archive "$FOUND_WORLDED" "$EDITORS_DIR" "WorldEd" || exit 1
    fi
fi

# Check what was extracted
log_info "Checking extracted contents..."
EXTRACTED_ITEMS=$(ls -1 "$EDITORS_DIR" | head -5)
echo "$EXTRACTED_ITEMS"

# Make executables (for Linux/Mac)
if [ "$(uname)" != "Windows" ]; then
    log_info "Setting executable permissions..."
    
    # Find and make TileZed executable
    find "$EDITORS_DIR" -name "TileZed" -type f -exec chmod +x {} \;
    find "$EDITORS_DIR" -name "tilezed" -type f -exec chmod +x {} \;
    find "$EDITORS_DIR" -name "WorldEd" -type f -exec chmod +x {} \;
    find "$EDITORS_DIR" -name "worlded" -type f -exec chmod +x {} \;
    
    # Make any .sh files executable
    find "$EDITORS_DIR" -name "*.sh" -type f -exec chmod +x {} \;
    
    log_success "Executable permissions set"
fi

# Set up tilesets
log_info "Setting up tileset configurations..."
if [ -f "$TOOLS_DIR/setup-tilesets.sh" ]; then
    bash "$TOOLS_DIR/setup-tilesets.sh"
else
    log_warn "setup-tilesets.sh not found, skipping tileset configuration"
fi

# Create launch scripts in root directory
log_info "Creating launch scripts..."

# TileZed launch script
cat > "$ROOT_DIR/launch-tilezed.sh" << 'EOF'
#!/bin/bash
# Launch TileZed map editor

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EDITORS_DIR="$SCRIPT_DIR/tools/zomboid_editors"

if [ ! -d "$EDITORS_DIR" ]; then
    echo "ERROR: TileZed not installed!"
    echo "Run: ./tools/setup-editors.sh"
    exit 1
fi

# Find TileZed executable
TILEZED_BIN=$(find "$EDITORS_DIR" -name "TileZed" -o -name "tilezed" -o -name "TileZed.exe" | head -1)

if [ -z "$TILEZED_BIN" ]; then
    echo "ERROR: Could not find TileZed executable"
    exit 1
fi

echo "Launching TileZed..."
cd "$(dirname "$TILEZED_BIN")"
"$TILEZED_BIN"
EOF

chmod +x "$ROOT_DIR/launch-tilezed.sh"
log_success "Created launch-tilezed.sh"

# WorldEd launch script
cat > "$ROOT_DIR/launch-worlded.sh" << 'EOF'
#!/bin/bash
# Launch WorldEd map editor

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EDITORS_DIR="$SCRIPT_DIR/tools/zomboid_editors"

if [ ! -d "$EDITORS_DIR" ]; then
    echo "ERROR: WorldEd not installed!"
    echo "Run: ./tools/setup-editors.sh"
    exit 1
fi

# Find WorldEd executable
WORLDED_BIN=$(find "$EDITORS_DIR" -name "WorldEd" -o -name "worlded" -o -name "WorldEd.exe" | head -1)

if [ -z "$WORLDED_BIN" ]; then
    echo "ERROR: Could not find WorldEd executable"
    exit 1
fi

echo "Launching WorldEd..."
cd "$(dirname "$WORLDED_BIN")"
"$WORLDED_BIN"
EOF

chmod +x "$ROOT_DIR/launch-worlded.sh"
log_success "Created launch-worlded.sh"

echo ""
echo "========================================"
log_success "Setup Complete!"
echo "========================================"
echo ""
log_info "The editors have been installed to:"
log_info "  $EDITORS_DIR"
echo ""
log_info "To launch the editors, use:"
log_info "  ./launch-tilezed.sh  - Main tool with BuildingEd access"
log_info "  ./launch-worlded.sh  - World map editor"
echo ""
log_info "See tools/README.md for usage instructions"
echo ""
