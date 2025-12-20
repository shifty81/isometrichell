#ifndef FRAMEBUFFER_H
#define FRAMEBUFFER_H

#include <glad/glad.h>
#include <memory>
#include "Texture.h"

/**
 * Framebuffer for render-to-texture operations
 * Supports color and depth attachments
 */
class Framebuffer {
public:
    Framebuffer();
    ~Framebuffer();
    
    // Create framebuffer with specified dimensions
    bool create(int width, int height, bool withDepth = true);
    
    // Bind/unbind framebuffer
    void bind() const;
    void unbind() const;
    
    // Resize framebuffer
    void resize(int width, int height);
    
    // Get color texture
    const Texture* getColorTexture() const { return colorTexture.get(); }
    Texture* getColorTexture() { return colorTexture.get(); }
    
    // Get dimensions
    int getWidth() const { return width; }
    int getHeight() const { return height; }
    
    // Check if framebuffer is valid
    bool isValid() const { return fbo != 0; }
    
private:
    GLuint fbo;
    GLuint rbo;  // Renderbuffer for depth
    std::unique_ptr<Texture> colorTexture;
    int width;
    int height;
    bool withDepth;
    
    // Helper methods
    void cleanup();
    bool checkStatus() const;
};

#endif // FRAMEBUFFER_H
