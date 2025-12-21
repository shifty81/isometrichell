#ifndef TEXTURE_MANAGER_H
#define TEXTURE_MANAGER_H

#include <string>
#include <unordered_map>
#include <memory>
#include <vector>
#include "Texture.h"

/**
 * Texture Manager
 * Centralized texture loading and caching system
 */
class TextureManager {
public:
    TextureManager();
    ~TextureManager();
    
    // Load a single texture
    bool loadTexture(const std::string& name, const std::string& path, bool generateMipmap = true);
    
    // Load multiple variations of a tile type
    // e.g., loadTileVariations("grass_green", "assets/individual/ground_tiles/grass_green_64x32/", 10)
    bool loadTileVariations(const std::string& baseName, const std::string& directory, int count);
    
    // Load decoration textures (trees, bushes, rocks)
    bool loadDecorations();
    
    // Load all ground tile textures
    bool loadGroundTiles();
    
    // Get texture by name
    Texture* getTexture(const std::string& name);
    const Texture* getTexture(const std::string& name) const;
    
    // Get a tile variation texture
    // e.g., getTileVariation("grass_green", 5) returns "grass_green_5"
    Texture* getTileVariation(const std::string& baseName, int variation);
    
    // Check if texture exists
    bool hasTexture(const std::string& name) const;
    
    // Get number of loaded textures
    size_t getTextureCount() const { return textures.size(); }
    
    // Clear all textures
    void clear();
    
private:
    std::unordered_map<std::string, std::unique_ptr<Texture>> textures;
    
    // Helper to format numbered texture names
    std::string formatTextureName(const std::string& baseName, int index) const;
};

#endif // TEXTURE_MANAGER_H
