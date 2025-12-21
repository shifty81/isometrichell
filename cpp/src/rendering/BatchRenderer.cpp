#include "rendering/BatchRenderer.h"
#include <glm/gtc/matrix_transform.hpp>
#include <algorithm>
#include <iostream>

// Batch renderer vertex shader
const char* batchVertexShader = R"(
#version 330 core
layout (location = 0) in vec3 aPos;
layout (location = 1) in vec4 aColor;
layout (location = 2) in vec2 aTexCoord;
layout (location = 3) in float aTexIndex;

out vec4 vColor;
out vec2 vTexCoord;
out float vTexIndex;

uniform mat4 view;
uniform mat4 projection;

void main() {
    gl_Position = projection * view * vec4(aPos, 1.0);
    vColor = aColor;
    vTexCoord = aTexCoord;
    vTexIndex = aTexIndex;
}
)";

// Batch renderer fragment shader
const char* batchFragmentShader = R"(
#version 330 core
out vec4 FragColor;

in vec4 vColor;
in vec2 vTexCoord;
in float vTexIndex;

uniform sampler2D textures[32];

void main() {
    int index = int(vTexIndex);
    vec4 texColor = texture(textures[index], vTexCoord);
    FragColor = texColor * vColor;
}
)";

BatchRenderer::BatchRenderer()
    : VAO(0)
    , VBO(0)
    , EBO(0)
    , maxQuads(0)
    , currentQuadCount(0)
    , viewMatrix(1.0f)
    , projectionMatrix(1.0f)
    , drawCallCount(0)
    , quadCount(0)
{
}

BatchRenderer::~BatchRenderer() {
    if (VAO != 0) {
        glDeleteVertexArrays(1, &VAO);
        glDeleteBuffers(1, &VBO);
        glDeleteBuffers(1, &EBO);
    }
}

bool BatchRenderer::initialize(size_t maxQuadCount) {
    this->maxQuads = maxQuadCount;
    
    // Reserve space for vertices (4 vertices per quad)
    vertices.reserve(maxQuadCount * 4);
    
    // Reserve space for textures (max 32 texture slots)
    textures.reserve(32);
    
    // Create batch shader
    if (!createBatchShader()) {
        std::cerr << "Failed to create batch shader" << std::endl;
        return false;
    }
    
    // Setup buffers
    setupBuffers();
    
    std::cout << "Batch renderer initialized (max " << maxQuads << " quads)" << std::endl;
    return true;
}

void BatchRenderer::begin() {
    vertices.clear();
    textures.clear();
    currentQuadCount = 0;
}

void BatchRenderer::end() {
    flush();
}

void BatchRenderer::flush() {
    if (vertices.empty()) {
        return;
    }
    
    // Upload vertex data
    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    glBufferSubData(GL_ARRAY_BUFFER, 0, vertices.size() * sizeof(Vertex), vertices.data());
    
    // Bind textures
    for (size_t i = 0; i < textures.size(); ++i) {
        if (textures[i]) {
            textures[i]->bind(static_cast<int>(i));
        }
    }
    
    // Set texture samplers
    shader->use();
    shader->setMat4("view", viewMatrix);
    shader->setMat4("projection", projectionMatrix);
    for (int i = 0; i < 32; ++i) {
        shader->setInt(("textures[" + std::to_string(i) + "]").c_str(), i);
    }
    
    // Draw
    glBindVertexArray(VAO);
    glDrawElements(GL_TRIANGLES, static_cast<GLsizei>(currentQuadCount * 6), GL_UNSIGNED_INT, 0);
    glBindVertexArray(0);
    
    // Update statistics
    drawCallCount++;
    quadCount += currentQuadCount;
    
    // Clear batch
    vertices.clear();
    textures.clear();
    currentQuadCount = 0;
}

void BatchRenderer::drawQuad(
    const glm::vec2& position,
    const glm::vec2& size,
    const Texture* texture,
    const glm::vec4& color,
    float rotation,
    const glm::vec2& texCoordMin,
    const glm::vec2& texCoordMax,
    float depth)
{
    // Check if we need to flush
    if (currentQuadCount >= maxQuads || textures.size() >= 32) {
        flush();
    }
    
    // Get texture index
    float texIndex = getTextureIndex(texture);
    
    // Calculate quad vertices with rotation
    glm::vec2 quadVertices[4];
    if (rotation != 0.0f) {
        glm::vec2 center = position + size * 0.5f;
        float cos_r = cos(glm::radians(rotation));
        float sin_r = sin(glm::radians(rotation));
        
        glm::vec2 offsets[4] = {
            glm::vec2(0.0f, size.y),
            glm::vec2(size.x, size.y),
            glm::vec2(size.x, 0.0f),
            glm::vec2(0.0f, 0.0f)
        };
        
        for (int i = 0; i < 4; ++i) {
            glm::vec2 offset = offsets[i] - size * 0.5f;
            quadVertices[i] = center + glm::vec2(
                offset.x * cos_r - offset.y * sin_r,
                offset.x * sin_r + offset.y * cos_r
            );
        }
    } else {
        quadVertices[0] = position + glm::vec2(0.0f, size.y);
        quadVertices[1] = position + glm::vec2(size.x, size.y);
        quadVertices[2] = position + glm::vec2(size.x, 0.0f);
        quadVertices[3] = position + glm::vec2(0.0f, 0.0f);
    }
    
    // Add vertices to batch
    glm::vec2 texCoords[4] = {
        glm::vec2(texCoordMin.x, texCoordMax.y),
        glm::vec2(texCoordMax.x, texCoordMax.y),
        glm::vec2(texCoordMax.x, texCoordMin.y),
        glm::vec2(texCoordMin.x, texCoordMin.y)
    };
    
    for (int i = 0; i < 4; ++i) {
        Vertex vertex;
        vertex.position = glm::vec3(quadVertices[i], depth);
        vertex.color = color;
        vertex.texCoord = texCoords[i];
        vertex.texIndex = texIndex;
        this->vertices.push_back(vertex);
    }
    
    currentQuadCount++;
}

void BatchRenderer::setViewMatrix(const glm::mat4& view) {
    viewMatrix = view;
}

void BatchRenderer::setProjectionMatrix(const glm::mat4& projection) {
    projectionMatrix = projection;
}

void BatchRenderer::resetStatistics() {
    drawCallCount = 0;
    quadCount = 0;
}

void BatchRenderer::setupBuffers() {
    // Generate VAO, VBO, EBO
    glGenVertexArrays(1, &VAO);
    glBindVertexArray(VAO);
    
    // Create VBO
    glGenBuffers(1, &VBO);
    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    glBufferData(GL_ARRAY_BUFFER, maxQuads * 4 * sizeof(Vertex), nullptr, GL_DYNAMIC_DRAW);
    
    // Create EBO
    std::vector<unsigned int> indices;
    indices.reserve(maxQuads * 6);
    for (size_t i = 0; i < maxQuads; ++i) {
        unsigned int offset = static_cast<unsigned int>(i * 4);
        indices.push_back(offset + 0);
        indices.push_back(offset + 1);
        indices.push_back(offset + 2);
        indices.push_back(offset + 2);
        indices.push_back(offset + 3);
        indices.push_back(offset + 0);
    }
    
    glGenBuffers(1, &EBO);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, indices.size() * sizeof(unsigned int), indices.data(), GL_STATIC_DRAW);
    
    // Setup vertex attributes
    // Position
    glEnableVertexAttribArray(0);
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)offsetof(Vertex, position));
    
    // Color
    glEnableVertexAttribArray(1);
    glVertexAttribPointer(1, 4, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)offsetof(Vertex, color));
    
    // TexCoord
    glEnableVertexAttribArray(2);
    glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)offsetof(Vertex, texCoord));
    
    // TexIndex
    glEnableVertexAttribArray(3);
    glVertexAttribPointer(3, 1, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)offsetof(Vertex, texIndex));
    
    glBindVertexArray(0);
}

bool BatchRenderer::createBatchShader() {
    shader = std::make_unique<Shader>();
    
    if (!shader->loadFromSource(batchVertexShader, batchFragmentShader)) {
        std::cerr << "Failed to create batch shader" << std::endl;
        return false;
    }
    
    return true;
}

float BatchRenderer::getTextureIndex(const Texture* texture) {
    if (!texture) {
        return 0.0f;
    }
    
    // Check if texture is already in the batch
    for (size_t i = 0; i < textures.size(); ++i) {
        if (textures[i] == texture) {
            return static_cast<float>(i);
        }
    }
    
    // Add new texture
    if (textures.size() >= 32) {
        // Need to flush if we run out of texture slots
        flush();
    }
    
    textures.push_back(texture);
    return static_cast<float>(textures.size() - 1);
}
