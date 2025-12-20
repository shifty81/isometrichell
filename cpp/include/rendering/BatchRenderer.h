#ifndef BATCH_RENDERER_H
#define BATCH_RENDERER_H

#include <glad/glad.h>
#include <glm/glm.hpp>
#include <vector>
#include <memory>
#include "Shader.h"
#include "Texture.h"

/**
 * Batch Renderer for efficient sprite rendering
 * Batches multiple sprites into a single draw call for better performance
 */
class BatchRenderer {
public:
    BatchRenderer();
    ~BatchRenderer();
    
    // Initialize the batch renderer
    bool initialize(size_t maxQuads = 10000);
    
    // Begin/end batch
    void begin();
    void end();
    
    // Flush current batch (submit to GPU)
    void flush();
    
    // Draw a textured quad (batched)
    void drawQuad(
        const glm::vec2& position,
        const glm::vec2& size,
        const Texture* texture,
        const glm::vec4& color = glm::vec4(1.0f),
        float rotation = 0.0f,
        const glm::vec2& texCoordMin = glm::vec2(0.0f, 0.0f),
        const glm::vec2& texCoordMax = glm::vec2(1.0f, 1.0f),
        float depth = 0.0f
    );
    
    // Set view and projection matrices
    void setViewMatrix(const glm::mat4& view);
    void setProjectionMatrix(const glm::mat4& projection);
    
    // Get statistics
    size_t getDrawCallCount() const { return drawCallCount; }
    size_t getQuadCount() const { return quadCount; }
    void resetStatistics();
    
private:
    struct Vertex {
        glm::vec3 position;
        glm::vec4 color;
        glm::vec2 texCoord;
        float texIndex;
    };
    
    // Rendering resources
    GLuint VAO, VBO, EBO;
    std::unique_ptr<Shader> shader;
    
    // Batch data
    std::vector<Vertex> vertices;
    std::vector<const Texture*> textures;
    size_t maxQuads;
    size_t currentQuadCount;
    
    // Matrices
    glm::mat4 viewMatrix;
    glm::mat4 projectionMatrix;
    
    // Statistics
    size_t drawCallCount;
    size_t quadCount;
    
    // Helper methods
    void setupBuffers();
    bool createBatchShader();
    float getTextureIndex(const Texture* texture);
};

#endif // BATCH_RENDERER_H
