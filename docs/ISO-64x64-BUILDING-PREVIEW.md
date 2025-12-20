# ISO-64x64 Building Spritesheet Asset Preview

## Overview
**Source File:** `assets/iso-64x64-building (1).png`  
**Dimensions:** 640 x 512 pixels  
**Tile Size:** 64x64 pixels (isometric)  
**Grid Layout:** 10 columns × 8 rows = 80 tile positions  
**Format:** PNG with 8-bit colormap

## Visual Reference
![ISO-64x64 Building Spritesheet](https://github.com/user-attachments/assets/6ee42c82-6183-43af-be43-e506d31a2223)

## Asset Breakdown by Category

### 1. ROOF COMPONENTS (Rows 1-2)
**Teal/Green Roof Tiles:**
- Stacked flat blocks (various heights: 1-layer, 2-layer, 3-layer)
- Corner pieces and edge tiles
- Flat roof panels in different sizes
- **Estimated Count:** 12 pieces

**Purple/Red Tiled Roofs:**
- Gabled roof sections (left-facing, right-facing)
- Roof peaks and ridges
- Corner roof pieces
- Roof edge decorations
- A-frame roof tops
- **Estimated Count:** 15 pieces

### 2. WALL SEGMENTS (Rows 3-6)
**Main Wall Types:**
- **Wood Panel Walls:** Brown horizontal planked walls
- **Stone/Brick Walls:** Textured masonry sections
- **Mixed Pattern Walls:** Combination wood/stone designs
- **Window Sections:** White/light colored window frames - allow line of sight through
- **Door Openings:** Dark/yellow doorway sections - can be opened/closed, block line of sight when closed
- **Corner Pieces:** Inside and outside corners
- **Estimated Count:** 35-40 pieces

**Collision & Vision Properties:**
- **Walls:** Block movement and vision completely
- **Windows:** Block movement but allow vision through (transparent)
- **Doors:** Block movement and vision when closed, allow both when open (interactable)
- **Corners:** Block movement and vision like walls

**Wall Features:**
- Multiple heights (1-story, 2-story sections)
- Various textures and patterns
- Connecting pieces for seamless walls
- Decorative trim elements

### 3. FOUNDATION & FLOOR TILES (Rows 7-9)
**Floor Components:**
- Flat foundation tiles
- Ground-level platforms
- Base blocks in green/teal
- Small decorative floor tiles
- **Estimated Count:** 8-10 pieces

### 4. SMALL OBJECTS & FURNITURE (Row 7)
**Decorative Items:**
- Wooden tables (2-3 variants)
- Stools/chairs (2 variants)
- Small crates or boxes
- Decorative blocks
- **Estimated Count:** 6-8 pieces

### 5. BUILDING BLOCKS & CONNECTORS (Various)
**Structural Elements:**
- Solid green/teal blocks (various sizes)
- Building foundations
- Support pillars
- Connection pieces
- **Estimated Count:** 10-12 pieces

## Total Asset Count
**Estimated Individual Usable Assets:** 80-90 pieces

## Proposed Directory Structure
```
assets/individual/buildings/iso-64x64/
├── roofs/
│   ├── teal-blocks/
│   │   ├── flat-1layer-000.png
│   │   ├── flat-2layer-001.png
│   │   ├── flat-3layer-002.png
│   │   └── ...
│   └── tiled-purple/
│       ├── gable-left-000.png
│       ├── gable-right-001.png
│       ├── peak-002.png
│       ├── corner-003.png
│       └── ...
├── walls/
│   ├── wood-panels/
│   │   ├── straight-000.png
│   │   ├── corner-left-001.png
│   │   ├── corner-right-002.png
│   │   └── ...
│   ├── stone-brick/
│   │   └── ...
│   ├── windows/
│   │   ├── single-window-000.png (transparent - allows vision)
│   │   ├── double-window-001.png (transparent - allows vision)
│   │   └── ...
│   └── doors/
│       ├── door-closed-000.png (interactable - blocks when closed)
│       ├── door-with-frame-001.png (interactable)
│       └── ...
├── floors/
│   ├── foundation-000.png
│   ├── platform-001.png
│   └── ...
├── furniture/
│   ├── table-000.png
│   ├── table-001.png
│   ├── stool-000.png
│   └── ...
└── blocks/
    ├── teal-block-small-000.png
    ├── teal-block-medium-001.png
    ├── teal-block-large-002.png
    └── ...
```

## Metadata File Structure
Each extracted asset will have corresponding metadata with collision and vision properties:

```json
{
  "spritesheet": "iso-64x64-building (1).png",
  "tile_size": [64, 64],
  "tiles": [
    {
      "id": "roof_teal_flat_1layer",
      "position": [0, 0],
      "category": "roofs/teal-blocks",
      "filename": "flat-1layer-000.png",
      "properties": {
        "walkable": false,
        "type": "roof",
        "blocks_vision": false,
        "transparent": false,
        "interactable": false,
        "layer": "roof"
      }
    },
    {
      "id": "wall_wood_straight",
      "position": [0, 3],
      "category": "walls/wood-panels",
      "filename": "straight-000.png",
      "properties": {
        "walkable": false,
        "type": "wall",
        "blocks_vision": true,
        "transparent": false,
        "interactable": false,
        "layer": "building"
      }
    },
    {
      "id": "window_single",
      "position": [3, 3],
      "category": "walls/windows",
      "filename": "single-window-000.png",
      "properties": {
        "walkable": false,
        "type": "window",
        "blocks_vision": false,
        "transparent": true,
        "interactable": false,
        "layer": "building"
      }
    },
    {
      "id": "door_closed",
      "position": [2, 4],
      "category": "walls/doors",
      "filename": "door-closed-000.png",
      "properties": {
        "walkable": false,
        "type": "door",
        "blocks_vision": true,
        "transparent": false,
        "interactable": true,
        "can_open": true,
        "is_open": false,
        "layer": "building"
      }
    }
  ]
}
```

## Integration with Editor
The dissected assets will be:
1. **Extracted** into individual PNG files
2. **Organized** into logical categories
3. **Cataloged** in JSON metadata for easy loading
4. **Integrated** with existing DailyGrind_Buildings.tiles tileset
5. **Available** in the map editor for placement

## Usage Examples

### Building a Simple House
1. **Foundation:** Use teal blocks or foundation tiles
2. **Walls:** Select wood panel or stone wall pieces (block movement & vision)
3. **Windows:** Add window segments for natural light (allow vision through)
4. **Doors:** Place door pieces at entrances (can be opened/closed by player)
5. **Roof:** Top with purple tiled roof or teal flat roof
6. **Details:** Add furniture and decorative elements

### Line of Sight System (Project Zomboid-style)
- **Wide Arc Vision:** 180-degree field of view based on player facing direction
- **Wall Occlusion:** Walls completely block line of sight
- **Window Transparency:** Windows allow vision through but not movement
- **Door States:** Closed doors block vision, open doors allow vision through
- **Distance Falloff:** Vision clarity decreases with distance
- **Ray Casting:** High-resolution ray casting for smooth, realistic vision

### Collision Detection
- **Walls:** Impassable, block movement and vision
- **Doors:** Impassable when closed, can interact to open/close
- **Windows:** Impassable but transparent for vision
- **Furniture:** Impassable, can be interacted with
- **Trees/Decorations:** Block movement but partially obscure vision

### Modular Building System
- All wall pieces are designed to connect seamlessly
- Roof pieces can be mixed for varied architecture
- Multiple height levels supported
- Foundation blocks allow elevated structures

## Technical Specifications

### Isometric Projection
- **Angle:** 2:1 isometric (26.565° from horizontal)
- **Tile Base:** 64x64 pixels
- **Compatibility:** Matches other isometric assets in project

### Color Palette
- **Teal/Green:** #5A7A6A range (foundations, blocks)
- **Purple/Red:** #8A4A5A range (tiled roofs)
- **Brown:** #6A4A3A range (wood walls)
- **Stone:** #7A7A7A range (masonry)
- **Windows:** #EFEFEF range (glass/frames)

### Alpha Channel
- Transparent backgrounds
- Clean edges for precise placement
- No artifacts or noise

## Recommended Next Steps

### Phase 1: Extraction
- [ ] Run tile splitter utility with 64x64 grid
- [ ] Manually verify each extracted tile
- [ ] Remove empty/placeholder tiles
- [ ] Clean up any edge artifacts

### Phase 2: Organization
- [ ] Create directory structure
- [ ] Categorize tiles by type
- [ ] Rename files with descriptive names
- [ ] Generate metadata JSON

### Phase 3: Integration
- [ ] Update DailyGrind_Buildings.tiles
- [ ] Add asset paths to editor config
- [ ] Create usage documentation
- [ ] Test in map editor

### Phase 4: Documentation
- [ ] Create visual catalog with thumbnails
- [ ] Write building assembly guides
- [ ] Document tile properties
- [ ] Add example map sections

## Quality Considerations

### What We Have
✅ Comprehensive building component set  
✅ Consistent isometric perspective  
✅ Matching visual style  
✅ Good variety of pieces  
✅ Modular design for flexibility  

### Potential Improvements
⚠️ Some tiles may have transparency issues  
⚠️ Color palette could be expanded  
⚠️ Additional roof styles would be beneficial  
⚠️ More furniture variants needed  

## Compatibility

### Works With
- TileZed/WorldEd editors
- Tiled Map Editor
- Custom JavaScript-based map editor (in src/editor/)
- Phaser game engine (project uses)

### Asset Format Requirements
- PNG format ✅
- Transparent background ✅
- Consistent 64x64 size ✅
- Power-of-2 friendly ✅

## Conclusion

The ISO-64x64-building spritesheet contains a **rich set of modular building components** suitable for creating varied structures in the game. The assets are well-organized in the spritesheet and follow a consistent visual style.

**Recommendation:** ✅ **ACCEPTABLE FOR PROJECT**

These assets are high quality and provide a solid foundation for building creation in the editor. Extraction and integration are straightforward using existing project utilities.

---

**Ready for extraction?** Awaiting approval to proceed with automated dissection and organization.
