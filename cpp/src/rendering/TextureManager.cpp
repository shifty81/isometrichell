#include "rendering/TextureManager.h"
#include <iostream>
#include <sstream>
#include <iomanip>

TextureManager::TextureManager() {
}

TextureManager::~TextureManager() {
    clear();
}

bool TextureManager::loadTexture(const std::string& name, const std::string& path, bool generateMipmap) {
    // Check if already loaded
    if (hasTexture(name)) {
        std::cout << "Texture '" << name << "' already loaded" << std::endl;
        return true;
    }
    
    auto texture = std::make_unique<Texture>();
    if (texture->loadFromFile(path.c_str(), generateMipmap)) {
        textures[name] = std::move(texture);
        return true;
    }
    
    return false;
}

bool TextureManager::loadTileVariations(const std::string& baseName, const std::string& directory, int count) {
    int loaded = 0;
    
    for (int i = 0; i < count; ++i) {
        std::string textureName = formatTextureName(baseName, i);
        
        // Format: baseName_64x32-000.png (e.g., grass_green_64x32-000.png)
        std::stringstream pathStream;
        pathStream << directory << baseName << "_64x32-" 
                   << std::setfill('0') << std::setw(3) << i << ".png";
        
        std::string path = pathStream.str();
        
        if (loadTexture(textureName, path, true)) {
            loaded++;
        }
    }
    
    if (loaded > 0) {
        std::cout << "Loaded " << loaded << "/" << count << " variations of " << baseName << std::endl;
    }
    
    return loaded > 0;
}

bool TextureManager::loadGroundTiles() {
    std::cout << "Loading ground tile textures..." << std::endl;
    
    // List of tile types to load
    const std::vector<std::string> tileTypes = {
        "grass_green",
        "grass_dry",
        "grass_medium",
        "dirt",
        "dirt_dark",
        "sand",
        "stone_path",
        "forest_ground"
    };
    
    const int tilesPerType = 10; // Load first 10 variations of each tile type
    const std::string baseDir = "assets/individual/ground_tiles/";
    
    int totalLoaded = 0;
    for (const auto& tileType : tileTypes) {
        std::string directory = baseDir + tileType + "_64x32/";
        if (loadTileVariations(tileType, directory, tilesPerType)) {
            totalLoaded += tilesPerType;
        }
    }
    
    std::cout << "Ground tiles loaded: " << totalLoaded << " total textures" << std::endl;
    return totalLoaded > 0;
}

bool TextureManager::loadDecorations() {
    std::cout << "Loading decoration textures..." << std::endl;
    
    int loaded = 0;
    
    // Load tree variations (20 types)
    const int treeCount = 20;
    const std::string treeDir = "assets/individual/trees/trees_64x32_shaded/";
    
    for (int i = 0; i < treeCount; ++i) {
        std::stringstream pathStream;
        pathStream << treeDir << "trees_64x32_shaded-" 
                   << std::setfill('0') << std::setw(3) << i << ".png";
        
        std::string textureName = formatTextureName("tree", i);
        if (loadTexture(textureName, pathStream.str(), true)) {
            loaded++;
        }
    }
    
    // Load bushes (from main assets directory)
    std::vector<std::pair<std::string, std::string>> bushes = {
        {"bush_1", "assets/hjm-bushes_01-alpha.png"},
        {"bush_2", "assets/hjm-bushes_02-alpha.png"},
        {"bush_3", "assets/hjm-bushes_03-alpha.png"}
    };
    
    for (const auto& bush : bushes) {
        if (loadTexture(bush.first, bush.second, true)) {
            loaded++;
        }
    }
    
    // Load rocks
    std::vector<std::pair<std::string, std::string>> rocks = {
        {"rocks_1", "assets/hjm-assorted_rocks_1.png"},
        {"rocks_2", "assets/hjm-assorted_rocks_2.png"}
    };
    
    for (const auto& rock : rocks) {
        if (loadTexture(rock.first, rock.second, true)) {
            loaded++;
        }
    }
    
    // Load pond decoration
    if (loadTexture("pond", "assets/hjm-pond_1.png", true)) {
        loaded++;
    }
    
    std::cout << "Decorations loaded: " << loaded << " total textures" << std::endl;
    return loaded > 0;
}

Texture* TextureManager::getTexture(const std::string& name) {
    auto it = textures.find(name);
    if (it != textures.end()) {
        return it->second.get();
    }
    return nullptr;
}

const Texture* TextureManager::getTexture(const std::string& name) const {
    auto it = textures.find(name);
    if (it != textures.end()) {
        return it->second.get();
    }
    return nullptr;
}

Texture* TextureManager::getTileVariation(const std::string& baseName, int variation) {
    std::string textureName = formatTextureName(baseName, variation);
    return getTexture(textureName);
}

bool TextureManager::hasTexture(const std::string& name) const {
    return textures.find(name) != textures.end();
}

void TextureManager::clear() {
    textures.clear();
}

std::string TextureManager::formatTextureName(const std::string& baseName, int index) const {
    std::stringstream ss;
    ss << baseName << "_" << index;
    return ss.str();
}
