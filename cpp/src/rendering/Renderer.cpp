#include "rendering/Renderer.h"
#include <glm/gtc/matrix_transform.hpp>
#include <iostream>

// Default vertex shader source
const char* defaultVertexShader = R"(
#version 330 core
layout (location = 0) in vec2 aPos;
layout (location = 1) in vec2 aTexCoord;

out vec2 TexCoord;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main() {
    gl_Position = projection * view * model * vec4(aPos, 0.0, 1.0);
    TexCoord = aTexCoord;
}
)";

// Default fragment shader source
const char* defaultFragmentShader = R"(
#version 330 core
out vec4 FragColor;

in vec2 TexCoord;

uniform sampler2D texture1;
uniform vec4 color;
uniform bool useTexture;

void main() {
    if (useTexture) {
        FragColor = texture(texture1, TexCoord) * color;
    } else {
        FragColor = color;
    }
}
)";

Renderer::Renderer()
    : VAO(0)
    , VBO(0)
    , EBO(0)
    , viewMatrix(1.0f)
    , projectionMatrix(1.0f)
{
}

Renderer::~Renderer() {
    if (VAO != 0) {
        glDeleteVertexArrays(1, &VAO);
        glDeleteBuffers(1, &VBO);
        glDeleteBuffers(1, &EBO);
    }
}

bool Renderer::initialize() {
    // Create default shader
    if (!createDefaultShader()) {
        return false;
    }
    
    // Setup quad geometry
    setupQuad();
    
    std::cout << "Renderer initialized" << std::endl;
    return true;
}

void Renderer::beginFrame() {
    // Nothing special needed here for now
}

void Renderer::endFrame() {
    // Nothing special needed here for now
}

void Renderer::clear(float r, float g, float b, float a) {
    glClearColor(r, g, b, a);
    glClear(GL_COLOR_BUFFER_BIT);
}

void Renderer::setViewMatrix(const glm::mat4& view) {
    viewMatrix = view;
}

void Renderer::setProjectionMatrix(const glm::mat4& projection) {
    projectionMatrix = projection;
}

void Renderer::drawQuad(
    const glm::vec2& position,
    const glm::vec2& size,
    const Texture* texture,
    const glm::vec4& color,
    float rotation,
    const glm::vec2& texCoordMin,
    const glm::vec2& texCoordMax)
{
    // Update texture coordinates in VBO
    float vertices[] = {
        // positions        // texture coords
        0.0f,  size.y,      texCoordMin.x, texCoordMax.y,
        size.x, size.y,     texCoordMax.x, texCoordMax.y,
        size.x, 0.0f,       texCoordMax.x, texCoordMin.y,
        0.0f,  0.0f,        texCoordMin.x, texCoordMin.y
    };
    
    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    glBufferSubData(GL_ARRAY_BUFFER, 0, sizeof(vertices), vertices);
    
    // Setup model matrix
    glm::mat4 model = glm::mat4(1.0f);
    model = glm::translate(model, glm::vec3(position, 0.0f));
    
    if (rotation != 0.0f) {
        model = glm::translate(model, glm::vec3(size.x / 2.0f, size.y / 2.0f, 0.0f));
        model = glm::rotate(model, glm::radians(rotation), glm::vec3(0.0f, 0.0f, 1.0f));
        model = glm::translate(model, glm::vec3(-size.x / 2.0f, -size.y / 2.0f, 0.0f));
    }
    
    // Use shader and set uniforms
    shader->use();
    shader->setMat4("model", model);
    shader->setMat4("view", viewMatrix);
    shader->setMat4("projection", projectionMatrix);
    shader->setVec4("color", color);
    
    if (texture) {
        texture->bind(0);
        shader->setInt("texture1", 0);
        shader->setInt("useTexture", 1);
    } else {
        shader->setInt("useTexture", 0);
    }
    
    // Draw quad
    glBindVertexArray(VAO);
    glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
    glBindVertexArray(0);
}

void Renderer::drawColoredQuad(
    const glm::vec2& position,
    const glm::vec2& size,
    const glm::vec4& color,
    float rotation)
{
    drawQuad(position, size, nullptr, color, rotation);
}

void Renderer::setupQuad() {
    // Quad vertices (position + texture coordinates)
    float vertices[] = {
        // positions   // texture coords
        0.0f, 1.0f,    0.0f, 1.0f,
        1.0f, 1.0f,    1.0f, 1.0f,
        1.0f, 0.0f,    1.0f, 0.0f,
        0.0f, 0.0f,    0.0f, 0.0f
    };
    
    unsigned int indices[] = {
        0, 1, 2,
        2, 3, 0
    };
    
    // Generate and bind VAO
    glGenVertexArrays(1, &VAO);
    glBindVertexArray(VAO);
    
    // Generate and bind VBO
    glGenBuffers(1, &VBO);
    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_DYNAMIC_DRAW);
    
    // Generate and bind EBO
    glGenBuffers(1, &EBO);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);
    
    // Position attribute
    glEnableVertexAttribArray(0);
    glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, 4 * sizeof(float), (void*)0);
    
    // Texture coordinate attribute
    glEnableVertexAttribArray(1);
    glVertexAttribPointer(1, 2, GL_FLOAT, GL_FALSE, 4 * sizeof(float), (void*)(2 * sizeof(float)));
    
    glBindVertexArray(0);
}

bool Renderer::createDefaultShader() {
    shader = std::make_unique<Shader>();
    
    if (!shader->loadFromSource(defaultVertexShader, defaultFragmentShader)) {
        std::cerr << "Failed to create default shader" << std::endl;
        return false;
    }
    
    return true;
}
