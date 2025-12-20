# WorldEd Integration & Ploppable Buildings Guide

## Overview

This guide explains how to export your procedurally generated world to WorldEd format, use ploppable buildings, and draw paths/sidewalks in the editor.

## Features Implemented

### 1. WorldEd Export System
- Export procedurally generated worlds to WorldEd-compatible `.tmx` format
- Preserves all terrain, biomes, and decorations
- Creates editable layers for paths and buildings

### 2. Ploppable Buildings
- Pre-built structures with complete interiors
- Descriptive naming by building type
- Easy drag-and-drop placement in WorldEd
- Stored as reusable prefabs

### 3. Path Drawing Tools
- Dedicated "Paths" layer for gravel paths and sidewalks
- Compatible with WorldEd brush tools
- Separate from ground layer for easy editing

## Quick Start

### Export Your World

```bash
# Export current world to WorldEd format
python3 utils/export_world_to_worlded.py
```

This creates:
```
worlded_export/
├── world_map.tmx              # Main WorldEd map file
├── world_export.json          # JSON data export
└── ploppables/                # Building prefabs
    ├── store/
    │   ├── GroceryStore_Grocery.json
    │   ├── HardwareStore_Hardware.json
    │   └── ConvenienceStore_Convenience.json
    ├── house/
    │   ├── House_Suburban.json
    │   ├── House_Urban.json
    │   └── House_Rural.json
    └── warehouse/
        └── Warehouse_Storage.json
```

### Open in WorldEd

1. **Launch WorldEd:**
   ```bash
   ./launch-worlded.sh
   ```
   Or if you have WorldEd installed separately, open it directly.

2. **Load the exported map:**
   - File → Open
   - Navigate to `worlded_export/world_map.tmx`
   - Click Open

3. **Start editing!**

## Ploppable Buildings

### Naming Convention

Buildings are automatically named based on their type and purpose:

#### Stores
- `GroceryStore_Grocery` - Full grocery store with aisles
- `HardwareStore_Hardware` - Tools and supplies
- `ConvenienceStore_Convenience` - Small corner store
- `Pharmacy_Pharmacy` - Medical supplies
- `ElectronicsStore_Electronics` - Tech store
- `Bookstore_Bookstore` - Books and media
- `ClothingStore_Clothing` - Apparel shop

#### Restaurants & Food
- `Restaurant_FastFood` - Fast food restaurant
- `Restaurant_Diner` - Classic diner
- `Cafe_Coffee` - Coffee shop
- `Bar_Pub` - Bar or pub

#### Residential
- `House_Suburban` - Suburban family home
- `House_Urban` - Urban apartment/townhouse
- `House_Rural` - Rural farmhouse

#### Commercial
- `Office_Corporate` - Office building
- `Warehouse_Storage` - Storage warehouse
- `Factory_Manufacturing` - Industrial factory

### Building Structure

Each ploppable contains:

```json
{
  "name": "GroceryStore_Grocery",
  "type": "store",
  "subtype": "grocery",
  "x": 10,
  "y": 10,
  "width": 15,
  "height": 20,
  "has_interior": true,
  "rooms": [
    "sales_floor",
    "storage",
    "office",
    "employee_break_room"
  ],
  "doors": [
    {"x": 12, "y": 10, "type": "entrance"},
    {"x": 15, "y": 15, "type": "employee"}
  ],
  "windows": [
    {"x": 11, "y": 10},
    {"x": 13, "y": 10},
    {"x": 14, "y": 10}
  ],
  "metadata": {
    "description": "Main grocery store with full interior layout",
    "tags": ["commercial", "food", "essential"]
  }
}
```

### Using Ploppables in WorldEd

1. **Select the Ploppables Layer:**
   - In the Layers panel, click "Ploppables"
   - This is an Object Layer designed for buildings

2. **Place a Building:**
   - Tools → Place Object
   - Or drag from the Objects panel
   - Position where desired

3. **Configure Properties:**
   - Right-click the object
   - Properties → Set custom properties
   - Reference the prefab file path

4. **Load Prefab:**
   - The building data loads from `ploppables/[type]/[name].json`
   - Interior layout, doors, windows all included

## Drawing Paths & Sidewalks

### Path Layer

The exported map includes a dedicated "Paths" layer:

```xml
<layer id="4" name="Paths" width="100" height="100">
  <properties>
   <property name="editable" value="true"/>
   <property name="description" value="Use this layer to draw gravel paths and sidewalks"/>
  </properties>
  ...
</layer>
```

### Drawing Gravel Paths

1. **Select the Paths Layer:**
   - Click "Paths" in Layers panel

2. **Choose Path Tileset:**
   - In Tilesets panel, select gravel or path tiles
   - For gravel: Use stone/gravel textures
   - For sidewalk: Use concrete/pavement textures

3. **Use Brush Tool:**
   - Select the Stamp Brush (B key)
   - Or use Fill Tool for larger areas (F key)

4. **Draw Your Path:**
   - Click and drag to draw
   - Use different tiles for variety
   - Add corners and edges for realism

### Sidewalk Drawing

1. **Select Concrete/Pavement Tiles:**
   - From DailyGrind_Ground tileset
   - Look for sidewalk or pavement patterns

2. **Draw Along Roads:**
   - Use straight lines for consistency
   - Add curbs using transition tiles
   - Place at edges of roads

3. **Use Terrain Brush (Optional):**
   - Tools → Terrain Brush
   - Automatically places corner pieces
   - Speeds up sidewalk creation

## Advanced Techniques

### Custom Ploppables

Create your own ploppable buildings:

```python
# Add to your world data before export
custom_building = {
    'type': 'store',
    'subtype': 'bakery',
    'x': 25,
    'y': 30,
    'width': 10,
    'height': 12,
    'has_interior': True,
    'is_ploppable': True,
    'rooms': ['shop', 'kitchen', 'storage'],
    'doors': [{'x': 27, 'y': 30}],
    'windows': [{'x': 26, 'y': 30}, {'x': 28, 'y': 30}],
    'description': 'Local bakery with kitchen'
}

world_data['buildings'].append(custom_building)
```

This will export as: `ploppables/store/Bakery_Bakery.json`

### Path Patterns

Create reusable path patterns:

1. **Straight Path:**
   ```
   ████████████
   ░░░░░░░░░░░░  (gravel tiles)
   ████████████
   ```

2. **Sidewalk with Curb:**
   ```
   ▓▓▓▓▓▓▓▓▓▓▓▓  (curb)
   ░░░░░░░░░░░░  (concrete)
   ░░░░░░░░░░░░  (concrete)
   ```

3. **Intersection:**
   ```
      ░░░
      ░░░
   ░░░░░░░░░░
   ░░░░░░░░░░
   ░░░░░░░░░░
      ░░░
      ░░░
   ```

### Batch Export

Export multiple worlds:

```bash
# Export with custom name
python3 utils/export_world_to_worlded.py --name "downtown"
python3 utils/export_world_to_worlded.py --name "suburbs"
python3 utils/export_world_to_worlded.py --name "industrial"
```

## Map Layers

The exported map has these layers (top to bottom):

1. **Ploppables** (Object Layer)
   - Pre-built buildings
   - Drag & drop placement
   - Stored as prefabs

2. **Paths** (Tile Layer)
   - Gravel paths
   - Sidewalks
   - Roads (optional)

3. **Buildings** (Tile Layer)
   - Individual building tiles
   - Walls, doors, windows
   - From ISO-64x64 tileset

4. **Vegetation** (Tile Layer)
   - Trees
   - Bushes
   - Decorations

5. **Ground** (Tile Layer)
   - Base terrain
   - Grass, dirt, sand, etc.
   - Biome textures

## Integration with Game

### Loading Back Into Game

After editing in WorldEd:

1. **Save your map** in WorldEd (File → Save)

2. **Import to game:**
   ```javascript
   // In your game code
   const mapLoader = new TMXMapLoader();
   const worldData = await mapLoader.load('worlded_export/world_map.tmx');
   
   // Create world from loaded data
   const world = World.fromTMXData(worldData);
   ```

3. **Ploppables load automatically:**
   - Game reads prefab JSON files
   - Interiors spawn correctly
   - Doors and windows placed

### Collision & Vision

Ploppables include collision data:

```json
{
  "doors": [
    {
      "x": 12,
      "y": 10,
      "type": "entrance",
      "collision": {
        "walkable": true,
        "blocks_vision": false,
        "interactable": true
      }
    }
  ],
  "windows": [
    {
      "x": 11,
      "y": 10,
      "collision": {
        "walkable": false,
        "blocks_vision": false,
        "transparent": true
      }
    }
  ]
}
```

This integrates with the `CollisionSystem` and `LineOfSight` systems.

## WorldEd Tips

### Performance
- Keep maps under 200x200 tiles for best performance
- Use ploppables instead of placing individual tiles for large buildings
- Group similar layers

### Organization
- Name layers descriptively
- Use different layers for different features
- Keep ploppables on separate layer

### Testing
- Test in-game frequently
- Check collision boundaries
- Verify door interactions

## Troubleshooting

### Map Won't Load in WorldEd
- Check TMX file syntax
- Verify tileset paths are correct
- Ensure WorldEd can find referenced tilesets

### Ploppables Not Appearing
- Check Object Layer is visible
- Verify prefab JSON files exist
- Confirm file paths in object properties

### Paths Look Wrong
- Ensure using correct layer
- Check tile IDs match tileset
- Verify transparency settings

## Example Workflow

1. **Generate world** in game:
   ```bash
   npm start
   # Let world generate
   ```

2. **Export to WorldEd:**
   ```bash
   python3 utils/export_world_to_worlded.py
   ```

3. **Edit in WorldEd:**
   ```bash
   ./launch-worlded.sh
   # Open worlded_export/world_map.tmx
   # Add buildings, paths, details
   # Save
   ```

4. **Test in game:**
   ```bash
   npm start
   # Load edited map
   # Test gameplay
   ```

5. **Iterate:**
   - Repeat steps 3-4 until satisfied

## Additional Resources

- [WorldEd Documentation](docs/WORLDEDIT_INTEGRATION_COMPLETE.md)
- [Tileset Guide](docs/TILED_GUIDE.md)
- [Collision System](docs/LINE_OF_SIGHT_SYSTEM.md)
- [Asset Catalog](docs/ASSET_CATALOG.md)

---

**Status:** ✅ Fully Implemented  
**Last Updated:** 2025-12-20  
**Version:** 1.0
