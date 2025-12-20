# WorldEdit/TileZed Quick Reference

Quick commands and steps for using the WorldEdit and TileZed integration.

## 🚀 Quick Setup

```bash
# 1. Download worlded.7z and tilezed.7z
# 2. Place in project root
# 3. Run setup:
./tools/setup-editors.sh
```

## 📦 Prerequisites

```bash
# Ubuntu/Debian
sudo apt-get install p7zip-full default-jre

# macOS
brew install p7zip openjdk
```

## 🎮 Launch Commands

```bash
# Launch TileZed (includes BuildingEd)
./launch-tilezed.sh

# Launch WorldEd (outdoor maps)
./launch-worlded.sh
```

## 📂 File Locations

| Item | Location |
|------|----------|
| Archives to place | Project root: `worlded.7z`, `tilezed.7z` |
| Extracted tools | `tools/zomboid_editors/` (gitignored) |
| Tileset configs | `tools/tilesets/*.tiles` |
| Exported maps | `tiled_maps/world/` or `tiled_maps/interiors/` |
| Game assets | `assets/` (used by editors) |
| Launch scripts | `./launch-tilezed.sh`, `./launch-worlded.sh` |

## 🔧 Setup Options

```bash
# Option 1: Direct
./tools/setup-editors.sh

# Option 2: npm
npm run setup:editors

# Option 3: During build
./build-engine.sh --setup-editors

# Option 4: CMake
cmake .. -DSETUP_EDITORS=ON
```

## 🗺️ Create Maps

### WorldEd (Outdoor)
1. Launch: `./launch-worlded.sh`
2. Create map (neighborhoods, towns)
3. Export: File → Export → TMX
4. Save to: `tiled_maps/world/your_map.tmx`

### BuildingEd (Interiors)
1. Launch: `./launch-tilezed.sh`
2. Access BuildingEd from TileZed
3. Design interior (multi-floor support)
4. Export: File → Export → TMX
5. Save to: `tiled_maps/interiors/your_building.tmx`

## 🎨 Available Tilesets

After setup, these tilesets are available in editors:

- `DailyGrind_Ground` - Terrain tiles
- `DailyGrind_Trees` - Vegetation
- `DailyGrind_Buildings` - Structures
- `DailyGrind_Characters` - Sprites
- `DailyGrind_Vehicles` - Vehicles

## 🔄 Load Maps in Game

**C++ Engine:**
```cpp
world->loadFromTMX("tiled_maps/world/main_town.tmx");
```

**Web Editor:**
```javascript
await world.loadFromTiled("tiled_maps/world/main_town.tmx");
```

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| Archives not found | Name files `worlded.7z` and `tilezed.7z` in root |
| Can't extract .7z | Install: `sudo apt-get install p7zip-full` |
| Editors won't launch | Install Java: `sudo apt-get install default-jre` |
| Assets not showing | Run: `./tools/setup-tilesets.sh` |
| Permission denied | Run: `chmod +x tools/zomboid_editors/*` |

## 📚 Documentation

- **Quick Start**: [WORLDEDIT_TILEZED_SETUP.md](WORLDEDIT_TILEZED_SETUP.md)
- **Complete Guide**: [WORLDEDIT_INTEGRATION_COMPLETE.md](WORLDEDIT_INTEGRATION_COMPLETE.md)
- **Integration Details**: [TILEZED_INTEGRATION.md](TILEZED_INTEGRATION.md)
- **TMX Format**: [TILED_GUIDE.md](TILED_GUIDE.md)

## 🔄 Update Editors

```bash
# 1. Remove old installation
rm -rf tools/zomboid_editors

# 2. Place new archives in root
# 3. Run setup again
./tools/setup-editors.sh
```

## 🎯 Workflow Summary

```
┌─────────────────┐
│ 1. Setup Once   │ ./tools/setup-editors.sh
└────────┬────────┘
         │
┌────────▼────────┐
│ 2. Create Maps  │ Launch editors, design levels
└────────┬────────┘
         │
┌────────▼────────┐
│ 3. Export TMX   │ Save to tiled_maps/
└────────┬────────┘
         │
┌────────▼────────┐
│ 4. Load in Game │ world->loadFromTMX()
└─────────────────┘
```

## 💡 Tips

- **Test First**: Create a small test map before big projects
- **Version Control**: Commit TMX files to track map changes
- **Organize**: Use subdirectories (world/, interiors/, dungeons/)
- **Backup**: Keep copies of important maps
- **Document**: Add comments in TMX metadata

## 📍 File Structure

```
TheDailyGrind/
├── worlded.7z              ← Place here
├── tilezed.7z              ← Place here
├── launch-tilezed.sh       ← Auto-created
├── launch-worlded.sh       ← Auto-created
├── tools/
│   ├── setup-editors.sh    ← Run this
│   ├── zomboid_editors/    ← Extracted (gitignored)
│   └── tilesets/           ← Configs for assets
├── tiled_maps/
│   ├── world/              ← Your outdoor maps
│   └── interiors/          ← Your building interiors
└── assets/                 ← Used by editors
```

## 🎓 Learning Resources

- [TileZed Wiki](https://pzwiki.net/wiki/TileZed)
- [WorldEd Wiki](https://pzwiki.net/wiki/WorldEd)
- [BuildingEd Wiki](https://pzwiki.net/wiki/BuildingEd)
- [Mapping Guide](https://steamcommunity.com/sharedfiles/filedetails/?id=853478035)

## ⚖️ License

TileZed/WorldEd are GPL-2.0. Our usage:
- ✅ Use tools for custom content
- ✅ Use our own assets
- ❌ Don't use PZ's copyrighted assets

---

**Need Help?** See full documentation in `docs/` directory.
