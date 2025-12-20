# Quick Start Testing Reference

## Launch & Verify

```bash
# 1. Verify everything is set up
npm test

# 2. Launch the web editor
./launch-editor.sh

# 3. Open in browser
http://localhost:8000
```

## Controls Quick Reference

| Key | Action |
|-----|--------|
| **WASD** or **Arrow Keys** | Move camera |
| **E** | Toggle Asset Editor |
| **B** | Toggle Building Mode |
| **1** / **2** / **3** | Select building type (House/Tower/Warehouse) |
| **Left Click** | Place building or asset |
| **Space** | Spawn boat on water tile |
| **Ctrl+Shift+L** | Download debug logs |

## Features to Test

### ✅ Core Rendering (5 seconds)
1. Open the editor
2. Verify you see an isometric world with:
   - Grass, water, dirt, rocks
   - Trees and vegetation
   - Boats moving on water
   - FPS counter showing ~60

### ✅ Camera Movement (10 seconds)
1. Press **W/A/S/D** or arrow keys
2. Camera should smoothly pan across the map

### ✅ Building Mode (20 seconds)
1. Press **B** to enter building mode
2. Mode indicator changes to "Building: House"
3. Press **1/2/3** to switch building types
4. Move mouse to see preview
5. Click on grass to place building

### ✅ Asset Editor (30 seconds)
1. Press **E** to open Asset Editor
2. Right panel appears with asset library
3. Click tool buttons: 🟩 Ground, 🌳 Trees, 🏠 Buildings, 🧍 Characters
4. Click thumbnails to select assets
5. "Selected" field updates

### ✅ Tile Hovering (5 seconds)
1. Move mouse over map
2. Tiles highlight with white outline
3. Mouse indicator shows tile coordinates and type

### ✅ Boat Spawning (10 seconds)
1. Find a water tile (blue)
2. Move mouse over it
3. Press **Space**
4. New boat appears

### ✅ Audio (5 seconds)
1. Click anywhere on screen
2. Background music starts playing

## Expected Performance

| Metric | Target | Status |
|--------|--------|--------|
| FPS | 50-60 | ✅ |
| Asset Loading | 26/26 | ✅ |
| World Size | 30×30 tiles | ✅ |
| Load Time | < 3 seconds | ✅ |

## Browser Console Checks

Press **F12** and look for:

```
✅ Game startup complete!
📦 Assets Loaded: 26 / 26
🗺️  World Size: 30x30 tiles
🏗️  Building system ready
🎨 Asset Editor ready
```

## Troubleshooting

| Problem | Quick Fix |
|---------|-----------|
| Black screen | Refresh page (Ctrl+R) |
| No assets | Check console for 404 errors |
| Low FPS | Close other tabs, update browser |
| No audio | Click screen, check browser audio |
| Building won't place | Make sure you're on grass/dirt, not water |

## Test Completion Checklist

- [ ] Page loads successfully
- [ ] All 26 assets load
- [ ] World renders with terrain
- [ ] Trees and boats visible
- [ ] FPS shows 50-60
- [ ] Camera moves with WASD
- [ ] Building mode works (B key)
- [ ] Buildings can be placed
- [ ] Asset editor opens (E key)
- [ ] Asset categories work
- [ ] Tile hovering works
- [ ] Boats spawn with Space
- [ ] Audio plays after click

**Total Test Time:** ~2-3 minutes

## What's Working

✅ **Web Editor** - Fully functional
- Complete isometric rendering
- Asset loading system (26 assets)
- Building placement system
- Asset editor UI
- Camera controls
- Entity system (boats)
- Audio system
- Interactive tile hovering

✅ **Documentation** - Comprehensive
- Setup guides
- Testing instructions
- Architecture docs
- Asset catalogs

⚠️ **C++ Engine** - Requires OpenGL libs
- Code is complete
- Needs system dependencies
- See docs/CPP_BUILD.md

## Next Steps After Testing

1. ✅ **Rendering works** - You can visualize the game world
2. ✅ **Testing works** - All interactive features functional
3. 🎯 **Create content** - Use asset editor to design levels
4. 🎯 **Build maps** - Use Tiled or WorldEd for complex scenes
5. 🎯 **Add gameplay** - Implement game mechanics

## For More Details

- **Full testing guide:** `docs/TESTING_GUIDE.md`
- **Setup issues:** `docs/BUILD_DEPENDENCIES.md`
- **C++ engine:** `docs/CPP_BUILD.md`
- **Architecture:** `docs/ARCHITECTURE.md`

---

**Status:** ✅ Ready for development and testing!
