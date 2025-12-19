#ifndef TEXTURE_H
#define TEXTURE_H

#include <glad/glad.h>
#include <string>

/**
 * Texture Management
 * Handles texture loading and binding
 */
class Texture {
public:
    Texture();
    ~Texture();
    
    // Load texture from file
    bool loadFromFile(const char* path, bool generateMipmap = true);
    
    // Load texture from memory
    bool loadFromMemory(unsigned char* data, int width, int height, int channels);
    
    // Bind texture to a texture unit
    void bind(unsigned int unit = 0) const;
    
    // Unbind texture
    void unbind() const;
    
    // Get texture properties
    int getWidth() const { return width; }
    int getHeight() const { return height; }
    GLuint getID() const { return textureID; }
    
    // Set texture parameters
    void setWrapMode(GLenum wrapS, GLenum wrapT);
    void setFilterMode(GLenum minFilter, GLenum magFilter);
    
    // Enable/disable mipmapping
    void enableMipmapping(bool enable = true);
    
    // Set texture quality level (for LOD control)
    enum class Quality {
        LOW,      // Use lower resolution mipmaps
        MEDIUM,   // Standard quality
        HIGH,     // High quality filtering
        ULTRA     // Maximum quality
    };
    void setQuality(Quality quality);
    
    // Get actual loaded dimensions
    int getActualWidth() const { return width; }
    int getActualHeight() const { return height; }
    
private:
    GLuint textureID;
    int width;
    int height;
    int channels;
    bool mipmapsEnabled;
};

#endif // TEXTURE_H
