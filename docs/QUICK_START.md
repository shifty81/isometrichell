# Quick Start Guide

> **New to the project? Start here!**

---

## 📋 Required Reading (5 minutes)

Before doing anything else, read these in order:

1. **[README.md](../README.md)** - Project overview (2 min)
2. **[DIRECTORY_STRUCTURE.md](DIRECTORY_STRUCTURE.md)** - ⭐ **REQUIRED** - Structure and conventions (3 min)

---

## 🎯 Quick Links

| I want to... | Go to... |
|--------------|----------|
| **Understand the project** | [README.md](../README.md) |
| **Know where files go** | [DIRECTORY_STRUCTURE.md](DIRECTORY_STRUCTURE.md) ⭐ |
| **Contribute code/assets** | [CONTRIBUTING.md](CONTRIBUTING.md) |
| **See what's unintegrated** | [assets/TBD/README.md](../assets/TBD/README.md) |
| **Understand architecture** | [ARCHITECTURE.md](ARCHITECTURE.md) |
| **See development roadmap** | [ROADMAP.md](ROADMAP.md) |
| **Build the C++ engine** | [CPP_BUILD.md](CPP_BUILD.md) |
| **Use Tiled editor** | [TILED_GUIDE.md](TILED_GUIDE.md) |
| **Find assets** | [ASSET_CATALOG.md](ASSET_CATALOG.md) |
| **Create visual docs** | [visual/README.md](visual/README.md) |

---

## 🚀 Setup in 3 Steps

### 1. Clone and Install
```bash
git clone https://github.com/shifty81/TheDailyGrind.git
cd TheDailyGrind
npm install  # Optional, for npm scripts
```

### 2. Test Setup
```bash
npm test
# or
./verify-setup.sh
```

### 3. Launch Editor
```bash
./launch-editor.sh
# Opens web editor at http://localhost:8000
```

**Optional**: Build C++ engine
```bash
./launch-engine.sh
# Builds and launches C++ game engine
```

---

## 📁 Project Structure (Quick View)

```
TheDailyGrind/
├── assets/
│   ├── TBD/              ← 📦 Unintegrated assets (1,409 files)
│   └── [other]/          ← ✅ Integrated assets
├── cpp/                  ← C++ game engine
├── engine/               ← Web editor - engine systems
├── src/                  ← Web editor - game logic
├── docs/                 ← Documentation
│   ├── visual/          ← Visual diagrams
│   ├── DIRECTORY_STRUCTURE.md ← ⭐ Read this!
│   └── CONTRIBUTING.md   ← Contribution guide
├── tilesheets/           ← Tiled tileset configs
└── tiled_maps/           ← Map files
```

---

## 🎨 For Visual Learners

This project is designed with visual learners in mind:

- ✅ **Emojis** mark important sections
- ✅ **Tables** organize information
- ✅ **Directory trees** show structure visually
- ✅ **Flowcharts** explain processes
- ✅ **`docs/visual/`** folder for diagrams

---

## 🎮 What Can I Do?

### Explore the Web Editor
```bash
./launch-editor.sh
```
- Create levels visually
- Place buildings and trees
- Test gameplay mechanics
- Export scenes

### Build a C++ Game
```bash
./launch-engine.sh
```
- High-performance native game
- OpenGL rendering
- Isometric world
- Play your created levels

### Create Maps in Tiled
- Install [Tiled](https://www.mapeditor.org/)
- Open `tiled_maps/template_map_highres.tmx`
- Use organized tilesets
- Export to JSON for game

---

## 📦 About Unintegrated Assets (TBD)

The `assets/TBD/` folder contains **1,409 files** ready for future integration:

| Category | Files | What It Is |
|----------|-------|------------|
| Dungeon Pack | 753 | Complete dungeon tileset |
| Snow Tilesets | 573 | Winter/snow themed assets |
| Vehicles | 11 | Isometric vehicle sprites |
| Cave Extras | 17 | Cave decorations |
| Others | 55 | HDRI, bricks, misc sprites |

See [assets/TBD/README.md](../assets/TBD/README.md) for complete inventory.

---

## 🤝 How to Contribute

1. **Read** [DIRECTORY_STRUCTURE.md](DIRECTORY_STRUCTURE.md) ⭐
2. **Read** [CONTRIBUTING.md](CONTRIBUTING.md)
3. **Follow** naming conventions
4. **Place** unintegrated assets in `assets/TBD/`
5. **Update** documentation
6. **Submit** PR with checklist

---

## ⚡ Quick Commands

```bash
# Test setup
npm test

# Launch web editor
./launch-editor.sh

# Build C++ engine
./build-engine.sh

# Launch C++ engine
./launch-engine.sh

# Verify assets
ls -la assets/

# Check TBD assets
ls -la assets/TBD/
```

---

## 🆘 Need Help?

- **File placement?** → [DIRECTORY_STRUCTURE.md](DIRECTORY_STRUCTURE.md)
- **How to contribute?** → [CONTRIBUTING.md](CONTRIBUTING.md)
- **Asset location?** → [ASSET_CATALOG.md](ASSET_CATALOG.md)
- **Build errors?** → [CPP_BUILD.md](CPP_BUILD.md)
- **Questions?** → Open an issue on GitHub

---

## ✅ Next Steps

1. ✅ Read [DIRECTORY_STRUCTURE.md](DIRECTORY_STRUCTURE.md)
2. ✅ Run `npm test` to verify setup
3. ✅ Launch web editor or C++ engine
4. ✅ Explore the codebase
5. ✅ Read [CONTRIBUTING.md](CONTRIBUTING.md) before making changes

---

**Welcome to The Daily Grind!** 🎮

This is a well-organized, professionally structured project. Enjoy exploring!

---

**Last Updated**: 2025-12-21
