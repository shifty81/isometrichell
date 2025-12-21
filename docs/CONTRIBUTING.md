# Contributing to The Daily Grind

Thank you for your interest in contributing to **The Daily Grind**! This document provides guidelines to ensure consistency and quality across the project.

---

## 📋 Table of Contents

1. [Before You Start](#before-you-start)
2. [Directory Structure & Naming Conventions](#directory-structure--naming-conventions)
3. [Asset Management](#asset-management)
4. [Code Style Guidelines](#code-style-guidelines)
5. [Pull Request Process](#pull-request-process)
6. [Documentation Requirements](#documentation-requirements)
7. [Testing Requirements](#testing-requirements)

---

## 🚀 Before You Start

### Read These First

- **[README.md](../README.md)** - Project overview and features
- **[docs/DIRECTORY_STRUCTURE.md](DIRECTORY_STRUCTURE.md)** - **REQUIRED READING** for all contributors
- **[docs/ARCHITECTURE.md](ARCHITECTURE.md)** - Technical architecture
- **[docs/ROADMAP.md](ROADMAP.md)** - Development roadmap

### Understanding Our Standards

**The Daily Grind** follows strict organizational standards:

> **Every file has a place, and every place has a purpose.**

This means:
- ✅ Organized directory structure (see [DIRECTORY_STRUCTURE.md](DIRECTORY_STRUCTURE.md))
- ✅ Consistent naming conventions
- ✅ Proper documentation
- ✅ Visual aids for visual learners
- ✅ Unintegrated assets go to `assets/TBD/`

---

## 📁 Directory Structure & Naming Conventions

### **MANDATORY REQUIREMENT**

**All pull requests MUST adhere to the directory structure and naming conventions** defined in [docs/DIRECTORY_STRUCTURE.md](DIRECTORY_STRUCTURE.md).

### Quick Reference

```
TheDailyGrind/
├── assets/              # Game assets
│   ├── TBD/            # Unintegrated assets ONLY
│   └── [category]/     # Integrated assets by category
├── cpp/                # C++ engine code
├── engine/             # Web editor - engine systems
├── src/                # Web editor - game logic
├── docs/               # Documentation
│   └── visual/         # Visual diagrams and flowcharts
├── tilesheets/         # Tiled tileset configs
└── tiled_maps/         # Map files
```

### Key Rules

1. **Unintegrated assets** → `assets/TBD/<category>/`
2. **Integrated assets** → `assets/<category>/`
3. **C++ code** → Headers in `cpp/include/`, implementation in `cpp/src/`
4. **Web code** → Engine in `engine/`, game logic in `src/`
5. **Documentation** → All docs in `docs/`, visual aids in `docs/visual/`

---

## 🎨 Asset Management

### Adding New Assets

#### Step 1: Determine Integration Status

**Not Ready for Integration?**
- Place in `assets/TBD/<appropriate_category>/`
- Create subfolder if category doesn't exist
- Add entry to `assets/TBD/README.md`

**Ready for Integration?**
- Place in `assets/<appropriate_category>/`
- Follow the integration workflow below

#### Step 2: Integration Workflow

1. **Organize Files**
   ```bash
   assets/
   └── ground_tiles_sheets/
       └── grass_green_64x32.png
   ```

2. **Create Tiled Tileset** (if applicable)
   ```bash
   tilesheets/
   └── ground/
       └── grass_green.tsx
   ```

3. **Add to Asset Loader**
   ```javascript
   // engine/assets/AssetLoader.js
   {
       name: 'grass_green',
       path: 'assets/ground_tiles_sheets/grass_green_64x32.png'
   }
   ```

4. **Update Documentation**
   - `docs/ASSET_CATALOG.md` - Add to catalog
   - `docs/ASSET_USAGE.md` - Document usage
   - `assets/TBD/README.md` - Remove from TBD (if moving from there)

5. **Test**
   - Test in web editor
   - Test in C++ engine (if applicable)
   - Test in Tiled Map Editor

### Asset Naming Conventions

- **Sprite sheets**: `category_name_size.png`
  - Example: `grass_green_64x32.png`, `trees_128x64_shaded.png`
- **Individual sprites**: `descriptive_name_frame.png`
  - Example: `knight_idle_01.png`, `house_small.png`
- **Audio**: `descriptive_name.ogg/.mp3`
  - Example: `Music.ogg`, `footstep_grass.ogg`

---

## 💻 Code Style Guidelines

### C++ Style

```cpp
// File: cpp/include/rendering/IsometricRenderer.h

#ifndef ISOMETRIC_RENDERER_H
#define ISOMETRIC_RENDERER_H

class IsometricRenderer {
public:
    // Methods: camelCase
    void renderTile(int x, int y);
    
    // Getters/Setters: camelCase with get/set prefix
    float getZoom() const { return m_zoom; }
    void setZoom(float zoom) { m_zoom = zoom; }

private:
    // Members: m_ prefix, camelCase
    float m_zoom;
    int m_tileWidth;
    
    // Constants: SCREAMING_SNAKE_CASE or kPascalCase
    static constexpr float DEFAULT_ZOOM = 1.0f;
};

#endif // ISOMETRIC_RENDERER_H
```

### JavaScript Style

```javascript
// File: engine/rendering/IsometricRenderer.js

class IsometricRenderer {
    // Private fields: # prefix
    #zoom;
    #tileWidth;
    
    // Constants: SCREAMING_SNAKE_CASE
    static DEFAULT_ZOOM = 1.0;
    
    constructor() {
        this.#zoom = IsometricRenderer.DEFAULT_ZOOM;
    }
    
    // Methods: camelCase
    renderTile(x, y) {
        // Implementation
    }
    
    // Getters/Setters
    get zoom() { return this.#zoom; }
    set zoom(value) { this.#zoom = value; }
}

export default IsometricRenderer;
```

### Code Organization

#### C++
- **Headers** → `cpp/include/<category>/ClassName.h`
- **Implementation** → `cpp/src/<category>/ClassName.cpp`
- **One class per file** (generally)
- **Include guards** in all headers

#### JavaScript
- **Classes** → `engine/<category>/ClassName.js` or `src/<category>/ClassName.js`
- **Export** at end of file: `export default ClassName;`
- **One class per file**

---

## 🔄 Pull Request Process

### Before Creating a PR

- [ ] Read [DIRECTORY_STRUCTURE.md](DIRECTORY_STRUCTURE.md)
- [ ] All files in correct directories
- [ ] File names follow conventions
- [ ] Unintegrated assets in `assets/TBD/`
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Tests pass (if applicable)
- [ ] Visual aids added for visual learners (if applicable)

### PR Requirements

Every PR must include:

1. **Clear Description**
   - What does this PR do?
   - Why is it needed?
   - What files were changed and why?

2. **Checklist Completion**
   ```markdown
   - [ ] Files in correct directories
   - [ ] Names follow conventions
   - [ ] Unintegrated assets in TBD
   - [ ] Documentation updated
   - [ ] Visual aids added (if applicable)
   - [ ] Tests pass
   - [ ] Code reviewed
   ```

3. **Updated Documentation**
   - Relevant .md files updated
   - New features documented
   - API changes documented

4. **Visual Aids** (if applicable)
   - Screenshots of UI changes
   - Diagrams for new systems
   - Flowcharts for complex logic

### PR Title Format

```
<type>: <short description>

Examples:
✓ feat: Add vehicle entity system
✓ fix: Correct isometric rendering depth sorting
✓ docs: Update asset catalog with new tilesets
✓ refactor: Reorganize TBD assets folder
✓ asset: Add snow tileset to TBD folder
```

### Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `asset` - Adding or organizing assets
- `chore` - Maintenance tasks

---

## 📚 Documentation Requirements

### What Needs Documentation?

1. **New Features**
   - How to use it
   - Code examples
   - Visual diagrams

2. **New Assets**
   - Update `docs/ASSET_CATALOG.md`
   - Update `docs/ASSET_USAGE.md`
   - Update `assets/TBD/README.md` (if in TBD)

3. **API Changes**
   - Update relevant documentation
   - Add migration guide if breaking change

4. **New Directories/Categories**
   - Update `docs/DIRECTORY_STRUCTURE.md`
   - Add README in new directory

### Documentation Style

- **Clear headings** with emoji for visual appeal
- **Code examples** with syntax highlighting
- **Visual diagrams** where helpful
- **Step-by-step instructions** for complex processes
- **Table of contents** for long documents

### Visual Documentation

For **visual learners**, documentation should include:

- 📊 **Diagrams**: System architecture, data flow
- 📷 **Screenshots**: UI changes, features in action
- 🗺️ **Flowcharts**: Process flows, decision trees
- 📐 **Directory trees**: File structure visualization
- 🎨 **Asset previews**: Show what assets look like

Place visual aids in:
- `docs/visual/` - Permanent diagrams and reference images
- PR description - Screenshots of changes

---

## 🧪 Testing Requirements

### Before Submitting

#### For Code Changes

1. **Build Successfully**
   ```bash
   # C++ Engine
   ./build-engine.sh
   
   # Web Editor
   npm test
   ```

2. **Run Relevant Tests**
   ```bash
   # If you modified rendering
   # Test: ./launch-editor.sh and check rendering
   
   # If you modified C++ engine
   # Test: ./launch-engine.sh and verify functionality
   ```

3. **Manual Testing**
   - Test the specific feature you changed
   - Test related features
   - Check for regressions

#### For Asset Changes

1. **Visual Verification**
   - Load asset in web editor
   - Verify asset appears correctly
   - Check asset in Tiled (if applicable)

2. **Integration Testing**
   - Verify asset loader finds the file
   - Check that asset renders correctly
   - Test in both engines if applicable

---

## 🎯 Contribution Areas

### High Priority

1. **Asset Integration**
   - Move assets from `assets/TBD/` to integrated folders
   - Create Tiled tilesets
   - Document asset usage

2. **Visual Documentation**
   - Create diagrams for `docs/visual/`
   - Add screenshots to documentation
   - Create flowcharts for complex systems

3. **Game Features**
   - Implement features from [ROADMAP.md](ROADMAP.md)
   - Add gameplay systems
   - Improve existing features

### Medium Priority

1. **Code Quality**
   - Refactor for clarity
   - Add comments
   - Improve error handling

2. **Testing**
   - Add unit tests
   - Create integration tests
   - Document test procedures

### Low Priority

1. **Optimization**
   - Performance improvements
   - Memory optimization
   - Code optimization

---

## 🚫 What NOT to Do

### ❌ Don't

1. **Break Directory Structure**
   - Don't place files in wrong directories
   - Don't create directories without updating docs

2. **Ignore Naming Conventions**
   - Don't use inconsistent naming
   - Don't use spaces in file names

3. **Skip Documentation**
   - Don't add features without documenting them
   - Don't move assets without updating asset docs

4. **Leave Assets Loose**
   - Don't put unintegrated assets in main asset folders
   - Don't forget to organize into TBD categories

5. **Submit Incomplete Work**
   - Don't submit broken code
   - Don't submit untested changes

---

## ✅ Good Contribution Checklist

Use this checklist for every contribution:

### Planning
- [ ] Reviewed [DIRECTORY_STRUCTURE.md](DIRECTORY_STRUCTURE.md)
- [ ] Checked [ROADMAP.md](ROADMAP.md) for alignment
- [ ] Planned directory/file structure

### Implementation
- [ ] Files in correct directories
- [ ] Naming conventions followed
- [ ] Code style consistent
- [ ] Comments added where needed

### Assets (if applicable)
- [ ] Unintegrated → `assets/TBD/`
- [ ] Integrated → Proper asset category
- [ ] Asset loader updated
- [ ] Tiled tileset created (if needed)

### Documentation
- [ ] Relevant docs updated
- [ ] Visual aids added for visual learners
- [ ] API documented
- [ ] Examples provided

### Testing
- [ ] Code builds successfully
- [ ] Features work as expected
- [ ] No regressions introduced
- [ ] Manual testing completed

### PR
- [ ] Clear title and description
- [ ] Screenshots/diagrams included
- [ ] Checklist completed
- [ ] Ready for review

---

## 🤝 Community

### Questions?

- **File placement?** → Check [DIRECTORY_STRUCTURE.md](DIRECTORY_STRUCTURE.md)
- **Naming?** → Check naming conventions in this doc
- **Architecture?** → Check [ARCHITECTURE.md](ARCHITECTURE.md)
- **Roadmap?** → Check [ROADMAP.md](ROADMAP.md)

### Discussion

- Open an issue for questions
- Propose major changes in discussions
- Be respectful and constructive

---

## 📝 Summary

**Three Golden Rules:**

1. **📁 Follow the structure** - Everything has a place
2. **🏷️ Name consistently** - Follow the conventions
3. **📚 Document everything** - Help visual learners with diagrams

**Remember:**
> This project emphasizes organization, consistency, and visual clarity. Every PR should maintain and improve these qualities.

---

**Thank you for contributing to The Daily Grind!** 🎮

**Version**: 1.0  
**Last Updated**: 2025-12-21  
**Questions?** Open an issue or discussion
