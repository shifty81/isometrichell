#ifndef RENDERER_H
#define RENDERER_H

#include <glad/glad.h>
#include <glm/glm.hpp>
#include <memory>
#include "Shader.h"
#include "Texture.h"

/**
 * 2D Sprite Renderer
 * Handles rendering of textured quads (sprites/tiles)
 */
class Renderer {
public:
    Renderer();
    ~Renderer();
    
    // Initialize renderer
    bool initialize();
    
    // Begin/end frame
    void beginFrame();
    void endFrame();
    
    // Clear screen
    void clear(float r = 0.0f, float g = 0.0f, float b = 0.0f, float a = 1.0f);
    
    // Set view and projection matrices
    void setViewMatrix(const glm::mat4& view);
    void setProjectionMatrix(const glm::mat4& projection);
    
    // Draw a textured quad (sprite/tile)
    void drawQuad(
        const glm::vec2& position,
        const glm::vec2& size,
        const Texture* texture,
        const glm::vec4& color = glm::vec4(1.0f),
        float rotation = 0.0f,
        const glm::vec2& texCoordMin = glm::vec2(0.0f, 0.0f),
        const glm::vec2& texCoordMax = glm::vec2(1.0f, 1.0f)
    );
    
    // Draw a colored quad (no texture)
    void drawColoredQuad(
        const glm::vec2& position,
        const glm::vec2& size,
        const glm::vec4& color = glm::vec4(1.0f),
        float rotation = 0.0f
    );
    
    // Get default shader
    Shader* getShader() { return shader.get(); }
    
private:
    // Shader and VAO/VBO for quad rendering
    std::unique_ptr<Shader> shader;
    GLuint VAO, VBO, EBO;
    
    // View and projection matrices
    glm::mat4 viewMatrix;
    glm::mat4 projectionMatrix;
    
    // Setup quad geometry
    void setupQuad();
    
    // Create default shader
    bool createDefaultShader();
};

#endif // RENDERER_H
