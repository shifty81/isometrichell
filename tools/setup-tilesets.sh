#!/bin/bash

# Script to configure tileset files for use with TileZed/WorldEd
# Creates tileset configuration files that point to our assets

set -e

TOOLS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$TOOLS_DIR")"
TILESETS_DIR="$TOOLS_DIR/tilesets"
ASSETS_DIR="$ROOT_DIR/assets"
EDITORS_DIR="$TOOLS_DIR/zomboid_editors"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

echo "========================================"
echo "  Tileset Configuration Setup"
echo "========================================"
echo ""

# Create tilesets directory
log_info "Creating tilesets directory..."
mkdir -p "$TILESETS_DIR"

# Also create in editors directory if it exists
if [ -d "$EDITORS_DIR" ]; then
    log_info "Creating Tilesets directory in editors..."
    mkdir -p "$EDITORS_DIR/Tilesets"
fi

# Ground Tiles Configuration
log_info "Creating ground tiles configuration..."
cat > "$TILESETS_DIR/DailyGrind_Ground.tiles" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<tilesets>
  <!-- High-resolution ground tiles (64x32) -->
  <tileset name="DailyGrind_Ground_64x32">
    <image source="../../assets/ground_tiles_sheets/grass_green_64x32.png"/>
    <properties>
      <property name="walkable" value="true"/>
      <property name="type" value="ground"/>
      <property name="terrain" value="grass"/>
    </properties>
  </tileset>
  
  <!-- Standard resolution ground tiles if available -->
  <tileset name="DailyGrind_Ground_32x16">
    <image source="../../assets/ground_tiles_sheets/grass_green_32x16.png"/>
    <properties>
      <property name="walkable" value="true"/>
      <property name="type" value="ground"/>
      <property name="terrain" value="grass"/>
    </properties>
  </tileset>
</tilesets>
EOF

log_success "Created DailyGrind_Ground.tiles"

# Trees and Vegetation Configuration  
log_info "Creating trees/vegetation configuration..."
cat > "$TILESETS_DIR/DailyGrind_Trees.tiles" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<tilesets>
  <!-- Trees - Note: sprites are 64x64 with 64x32 base -->
  <tileset name="DailyGrind_Trees">
    <image source="../../assets/isometric_trees_pack/sheets/trees_64x32_shaded.png"/>
    <properties>
      <property name="walkable" value="false"/>
      <property name="type" value="decoration"/>
      <property name="category" value="tree"/>
      <property name="blocks_vision" value="true"/>
    </properties>
  </tileset>
  
  <!-- Bushes if available -->
  <tileset name="DailyGrind_Bushes">
    <image source="../../assets/isometric_trees_pack/sheets/bushes_64x32_shaded.png"/>
    <properties>
      <property name="walkable" value="false"/>
      <property name="type" value="decoration"/>
      <property name="category" value="bush"/>
    </properties>
  </tileset>
</tilesets>
EOF

log_success "Created DailyGrind_Trees.tiles"

# Buildings Configuration
log_info "Creating buildings configuration..."
cat > "$TILESETS_DIR/DailyGrind_Buildings.tiles" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<tilesets>
  <!-- Building tiles and structures -->
  <tileset name="DailyGrind_Buildings">
    <properties>
      <property name="walkable" value="false"/>
      <property name="type" value="building"/>
      <property name="blocks_vision" value="true"/>
    </properties>
  </tileset>
  
  <!-- Walls -->
  <tileset name="DailyGrind_Walls">
    <properties>
      <property name="walkable" value="false"/>
      <property name="type" value="wall"/>
      <property name="blocks_vision" value="true"/>
    </properties>
  </tileset>
  
  <!-- Doors -->
  <tileset name="DailyGrind_Doors">
    <properties>
      <property name="walkable" value="true"/>
      <property name="type" value="door"/>
      <property name="interactable" value="true"/>
    </properties>
  </tileset>
</tilesets>
EOF

log_success "Created DailyGrind_Buildings.tiles"

# Characters Configuration
log_info "Creating characters configuration..."
cat > "$TILESETS_DIR/DailyGrind_Characters.tiles" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<tilesets>
  <!-- Character sprites -->
  <!-- Note: Directory is spelled "Charachters" in assets/ -->
  <tileset name="DailyGrind_Characters">
    <directory source="../../assets/Charachters/"/>
    <properties>
      <property name="walkable" value="true"/>
      <property name="type" value="character"/>
      <property name="entity" value="true"/>
    </properties>
  </tileset>
</tilesets>
EOF

log_success "Created DailyGrind_Characters.tiles"

# Vehicles Configuration
log_info "Creating vehicles configuration..."
cat > "$TILESETS_DIR/DailyGrind_Vehicles.tiles" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<tilesets>
  <!-- Vehicle sprites -->
  <tileset name="DailyGrind_Vehicles">
    <directory source="../../assets/Vehicles/"/>
    <properties>
      <property name="walkable" value="false"/>
      <property name="type" value="vehicle"/>
      <property name="entity" value="true"/>
    </properties>
  </tileset>
</tilesets>
EOF

log_success "Created DailyGrind_Vehicles.tiles"

# Copy to editors directory if it exists
if [ -d "$EDITORS_DIR/Tilesets" ]; then
    log_info "Copying tileset configs to editors directory..."
    cp "$TILESETS_DIR"/*.tiles "$EDITORS_DIR/Tilesets/" 2>/dev/null || true
    log_success "Copied tileset configurations"
fi

# Create a configuration readme
cat > "$TILESETS_DIR/README.md" << 'EOF'
# Tileset Configurations

This directory contains tileset configuration files for use with TileZed and WorldEd.

## Files

- `DailyGrind_Ground.tiles` - Ground terrain tiles
- `DailyGrind_Trees.tiles` - Trees and vegetation
- `DailyGrind_Buildings.tiles` - Building structures
- `DailyGrind_Characters.tiles` - Character sprites
- `DailyGrind_Vehicles.tiles` - Vehicle sprites

## Using with TileZed

1. Launch TileZed
2. Go to Tools → Tileset Manager
3. Click "Add Tileset"
4. Browse to this directory and select a .tiles file
5. The tileset will now be available for use in WorldEd and BuildingEd

## Format

These files use the Tiled Tileset XML format (.tsx), which is compatible with:
- TileZed
- WorldEd
- BuildingEd
- Tiled Map Editor
- Custom parsers

## Customization

You can edit these files to:
- Add more asset paths
- Change tile properties (walkable, type, etc.)
- Add custom metadata
- Organize tiles into categories

## Auto-Configuration

When you run `./tools/setup-editors.sh`, these files are automatically:
1. Created in this directory
2. Copied to `tools/zomboid_editors/Tilesets/` if editors are installed
3. Configured to point to our `assets/` directory

This ensures the editors can immediately access all our game assets.
EOF

log_success "Created tileset README"

echo ""
echo "========================================"
log_success "Tileset Configuration Complete!"
echo "========================================"
echo ""
log_info "Tileset files created in:"
log_info "  $TILESETS_DIR"
echo ""
log_info "When you launch TileZed, these tilesets will point to assets in:"
log_info "  $ASSETS_DIR"
echo ""
log_info "See $TILESETS_DIR/README.md for usage instructions"
echo ""
