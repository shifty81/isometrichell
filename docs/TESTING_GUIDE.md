# Testing Guide - The Daily Grind

This guide will help you verify that all rendering and interactive features are working correctly.

## Quick Start Testing

### 1. Launch the Web Editor

```bash
./launch-editor.sh
```

The editor will start on `http://localhost:8000`. Open this in your browser.

### 2. Verify Core Rendering

Once the page loads, you should see:
- ✅ Isometric world with varied terrain (grass, water, dirt, rocks)
- ✅ Trees and vegetation rendered on the map
- ✅ Boats moving on water tiles
- ✅ FPS counter showing ~60 FPS
- ✅ Camera position displayed
- ✅ "Loading assets..." appears briefly, then shows "Game startup complete!" in console

**Expected Result:** A colorful isometric world with multiple terrain types, trees, and animated boats.

### 3. Test Camera Movement

**Controls:**
- Press `W` or `↑` - Camera moves up
- Press `S` or `↓` - Camera moves down
- Press `A` or `←` - Camera moves left
- Press `D` or `→` - Camera moves right

**Expected Result:** The camera smoothly pans across the world, revealing different parts of the map.

### 4. Test Building Mode

**Steps:**
1. Press `B` to toggle building mode
2. The mode indicator should change to "Mode: Building: House"
3. Move your mouse over the map - you'll see a building preview
4. Press `1` to select House
5. Press `2` to select Tower
6. Press `3` to select Warehouse
7. Click on valid terrain to place a building

**Expected Result:**
- Building preview follows your cursor
- Buildings can be placed on grass/dirt tiles
- Buildings cannot be placed on water or rocks
- Placed buildings appear as 3D isometric cubes

### 5. Test Asset Editor

**Steps:**
1. Press `E` to open the Asset Editor
2. The Asset Library panel appears on the right side
3. You should see 4 tool categories:
   - 🟩 Ground tiles (selected by default)
   - 🌳 Trees and vegetation
   - 🏠 Buildings
   - 🧍 Characters
4. Click on different ground tile thumbnails
5. The "Selected" field updates to show your choice

**Expected Result:**
- Asset library displays all available assets organized by category
- Thumbnails show previews of each asset
- Clicking switches between asset categories
- Selected asset is highlighted

### 6. Test Interactive Tile Hovering

**Steps:**
1. Move your mouse slowly across the map
2. Watch the "Mouse:" indicator in the top-left UI

**Expected Result:**
- White outline highlights the tile under your cursor
- Mouse indicator shows: "Tile: X, Y (tile_type)"
- Hovering over different tiles shows their types (grass_green, water, dirt, etc.)

### 7. Test Boat Spawning

**Steps:**
1. Find a water tile (blue areas)
2. Move your mouse over a water tile
3. Press `Space`

**Expected Result:**
- A new boat spawns at that location
- Boat appears correctly on the water
- Boat moves randomly across water tiles

### 8. Test Audio System

**Steps:**
1. Click anywhere on the screen (required for browser audio)
2. Background music should start playing

**Expected Result:**
- Music plays in the background
- No console errors about audio

## Performance Testing

### Frame Rate Check

**Expected Performance:**
- **Good:** 50-60 FPS consistently
- **Acceptable:** 40-50 FPS
- **Poor:** Below 40 FPS (check browser performance)

### Asset Loading

Open browser console (F12) and check for:
```
📦 Assets loaded successfully
📦 Assets Loaded: 26 / 26
🗺️  World Size: 30x30 tiles
```

**Expected Result:** All 26 assets load without errors.

## Browser Compatibility

### Recommended Browsers
- ✅ Chrome/Chromium (90+)
- ✅ Firefox (88+)
- ✅ Safari (14+)
- ✅ Edge (90+)

### Known Issues
- Safari may have audio autoplay restrictions
- Older browsers may have reduced performance

## Troubleshooting

### Issue: Black/Blank Screen

**Solution:**
1. Check browser console for errors (F12)
2. Verify all assets loaded: Look for "Assets Loaded: 26/26"
3. Try refreshing the page (Ctrl+R)

### Issue: Low FPS

**Solution:**
1. Close other browser tabs
2. Disable browser extensions
3. Update graphics drivers
4. Try a different browser

### Issue: Assets Not Loading

**Solution:**
1. Check browser console for 404 errors
2. Verify `assets/` directory exists and contains files
3. Check if web server is running correctly
4. Clear browser cache and reload

### Issue: No Audio

**Solution:**
1. Click on the screen (browsers require user interaction for audio)
2. Check browser audio permissions
3. Verify audio files exist in `assets/MusicAndSFX/`
4. Check browser console for audio errors

### Issue: Building Mode Not Working

**Solution:**
1. Make sure you pressed `B` to enter building mode
2. Check that mode indicator shows "Building: [type]"
3. Verify you're clicking on valid terrain (grass/dirt, not water/rocks)

## Advanced Testing

### Console Logging

Press `Ctrl+Shift+L` to download a detailed log file containing:
- All console messages
- Error traces
- Performance metrics
- Asset loading status

### Developer Tools

Open browser console (F12) to see detailed logs:
- Asset loading progress
- Engine initialization
- FPS and performance data
- User interaction events

## Test Checklist

Use this checklist to verify all features:

- [ ] Web server starts successfully
- [ ] Page loads without errors
- [ ] Assets load (26/26)
- [ ] Isometric world renders
- [ ] Terrain tiles display correctly
- [ ] Trees and vegetation render
- [ ] Boats appear and move on water
- [ ] FPS shows 50-60
- [ ] Camera movement (WASD) works
- [ ] Tile highlighting works
- [ ] Building mode toggles (B key)
- [ ] Building types switch (1/2/3 keys)
- [ ] Building placement works
- [ ] Asset editor opens (E key)
- [ ] Asset categories switch
- [ ] Asset selection works
- [ ] Boat spawning works (Space)
- [ ] Audio plays (after click)
- [ ] No console errors
- [ ] Performance is smooth

## Automated Verification

Run the automated test script:

```bash
npm test
```

This will verify:
- ✅ All required files exist
- ✅ Assets are accessible
- ✅ Dependencies are installed
- ✅ Server can start

## C++ Engine Testing

> **Note:** The C++ engine requires OpenGL dependencies. See [CPP_BUILD.md](CPP_BUILD.md) for setup instructions.

To test the C++ engine:

```bash
# Install dependencies first - see docs/BUILD_DEPENDENCIES.md for your platform

# Build and launch
./launch-engine.sh
```

**Expected Result:** Native OpenGL window opens with isometric rendering.

## Feature Status

| Feature | Web Editor | C++ Engine | Status |
|---------|-----------|------------|--------|
| Isometric Rendering | ✅ | ✅ | Working |
| Asset Loading | ✅ | ✅ | Working |
| Building System | ✅ | ✅ | Working |
| Asset Editor | ✅ | ❌ | Web Only |
| Camera Movement | ✅ | ✅ | Working |
| Entity System | ✅ | ✅ | Working |
| Audio System | ✅ | ❌ | Web Only |
| Tiled Map Import | ✅ | ⚠️ | Partial |

## Next Steps After Testing

Once all tests pass:

1. **Create Content:** Use the asset editor to design levels
2. **Export Scenes:** Save your work for the C++ engine
3. **Build Maps:** Use Tiled or WorldEd for complex levels
4. **Add Features:** Extend the game with new systems
5. **Optimize:** Profile and improve performance

## Getting Help

If tests fail:
1. Review this guide's troubleshooting section
2. Check [BUILD_DEPENDENCIES.md](BUILD_DEPENDENCIES.md) for setup issues
3. View browser console for specific errors
4. Download logs with Ctrl+Shift+L
5. Open an issue in the project repository with your error logs

## Summary

The web editor provides a complete environment for:
- ✅ Visualizing the game world
- ✅ Testing asset rendering
- ✅ Prototyping gameplay features
- ✅ Designing levels interactively
- ✅ Validating game mechanics

All core rendering and interaction features are fully functional and ready for development!
