# TBD (To Be Determined) Assets

This folder contains game assets that **have not yet been integrated** into the game engines (C++ or Web Editor). These assets are organized and ready for future integration.

## 📋 Contents

### 1. `dungeon_pack/`
**747 PNG files** - Complete dungeon tileset pack
- Characters
- Isometric dungeon tiles
- Angular view tiles
- Sample maps

**Status**: Not integrated  
**Next Steps**: Create Tiled tileset configuration, integrate into game engine

---

### 2. `snow_tilesets/`
**528 PNG files** - Comprehensive winter/snow themed assets
- Snow terrain tiles
- Ice walls and floors
- Winter water and bridges
- Snow-covered plants and rocks
- Mine entrances
- Object props

**Status**: Not integrated  
**Next Steps**: Create Tiled tilesets for winter levels, add seasonal variation support

---

### 3. `cave_extras/`
**Isometric cave components**
- Cave walls and floors
- Stalactites and stalagmites
- Cave decorations

**Status**: Not integrated  
**Next Steps**: Integrate with dungeon system

---

### 4. `hdri_textures/`
**HDRI and texture files** (IRR folder)
- High Dynamic Range Images for lighting
- Various texture files

**Status**: Not integrated  
**Next Steps**: Evaluate if needed for 2D isometric game or use in future 3D features

---

### 5. `bricks/`
**Brick texture files**
- Various brick patterns and colors

**Status**: Not integrated  
**Next Steps**: Use for building textures or walls

---

### 6. `vehicles/`
**Isometric vehicle sprites**
- Multiple colored vehicle collections (red, blue, green, yellow, orange, black, white, grey)
- Complete vehicle collection sheet

**Status**: Partially documented but not yet rendered in-game  
**Next Steps**: Create vehicle entity system, add vehicle sprites to game

---

### 7. `misc_sprites/`
**Miscellaneous sprite collections**
- Various isometric sprites
- UI elements

**Status**: Not integrated  
**Next Steps**: Categorize and integrate as needed

---

### 8. `loose_files/`
**Individual asset files** from the root assets folder:
- `Pirate Ship Tile Set Sheet.png` - Naval/ship tiles
- `TileObjectsRubbleWalls.png` - Destruction/debris
- `grass5.png`, `grass6.png` - Additional grass textures
- `spr_Greenlands_iso_day_0.png` - Daytime environment tileset
- `spr_Greenlands_iso_night_0.png` - Nighttime environment tileset
- `tilemapPacck.png` - General tilemap
- `Knight01.png` - Knight sprite variant

**Status**: Not integrated  
**Next Steps**: Review each file, create appropriate tilesets, integrate into game

---

### 9. `tools_archives/`
**External tool archives**:
- `TileZed.7z` - Building/interior editor tool
- `WorldEd.7z` - World/outdoor map editor tool

**Status**: Tools available, setup documented in `docs/WORLDEDIT_TILEZED_SETUP.md`  
**Next Steps**: Users can extract and use these professional map editing tools

---

## 🎯 Integration Priority

### High Priority (Immediate Use)
1. **Vehicles** - Create entity system for moving vehicles
2. **Loose files** - Greenlands tilesets for richer environments
3. **Pirate Ship** - Naval gameplay features

### Medium Priority (Phase 2-3)
1. **Dungeon Pack** - Interior/underground gameplay
2. **Cave Extras** - Underground exploration
3. **Bricks** - Building variety and detail

### Low Priority (Future Features)
1. **Snow Tilesets** - Seasonal variations
2. **HDRI Textures** - Advanced lighting (if moving to 3D)
3. **Misc Sprites** - As needed for specific features

---

## 📚 Integration Workflow

When you're ready to integrate assets from this folder:

### Quick Extraction Method

Use the automated extraction tools:

```bash
# 1. List available assets
python3 utils/extract_tbd_assets.py --list

# 2. Extract specific category
python3 utils/extract_tbd_assets.py --vehicles
python3 utils/extract_tbd_assets.py --dungeon
python3 utils/extract_tbd_assets.py --snow

# 3. Test extracted assets in the editor
./launch-editor.sh

# 4. Assets are now in assets/individual/ for use
```

### Manual Integration Method

For more control over the integration process:

1. **Review the asset files** in the appropriate subfolder
2. **Extract or copy assets** to `assets/individual/` using extraction tools
3. **Create Tiled tileset** (`.tsx` file) in `/tilesheets/` directory if needed
4. **Add asset loading code** to:
   - `engine/assets/AssetLoader.js` (Web Editor)
   - C++ engine asset loader (if applicable)
5. **Update documentation**:
   - `docs/ASSET_CATALOG.md` - Add to integrated assets
   - `docs/ASSET_USAGE.md` - Document how to use the assets
6. **Test in both engines** (Web Editor and C++ Engine)
7. **Update this README** to reflect the change

### Complete Workflow Guide

See **[docs/ASSET_WORKFLOW.md](../../docs/ASSET_WORKFLOW.md)** for the complete asset extraction, organization, and archival workflow.

---

## 🤝 Contributing

When adding new assets that aren't yet integrated:

1. Place them in the appropriate `assets/TBD/` subfolder
2. If no suitable subfolder exists, create one with a descriptive name
3. Update this README with:
   - Asset description
   - File count or details
   - Intended use case
   - Integration priority

---

## 📝 Notes

- All assets in this folder are **safe to use** - they just haven't been integrated yet
- Assets are organized to make future integration easier
- Moving assets out of TBD happens as features are developed
- Tool archives (`tools_archives/`) can be extracted and used following the setup guides in `/docs/`

---

**Last Updated**: 2025-12-21  
**Maintainer**: The Daily Grind Development Team
