#include "ui/UIRenderer.h"
#include "rendering/Shader.h"
#include "utils/Logger.h"
#include <glm/gtc/matrix_transform.hpp>

// ===== UIElement Implementation =====

bool UIElement::contains(float x, float y) const {
    return x >= position.x && x <= position.x + size.x &&
           y >= position.y && y <= position.y + size.y;
}

// ===== UIButton Implementation =====

UIButton::UIButton(float x, float y, float width, float height, const std::string& text)
    : UIElement(x, y, width, height)
    , text(text)
    , hovered(false)
    , color(0.2f, 0.3f, 0.4f)
    , hoverColor(0.3f, 0.4f, 0.5f)
    , textColor(1.0f, 1.0f, 1.0f)
{
}

void UIButton::render() {
    // Rendered by UIRenderer
}

void UIButton::handleClick() {
    if (enabled && clickCallback) {
        clickCallback();
    }
}

// ===== UIPanel Implementation =====

UIPanel::UIPanel(float x, float y, float width, float height)
    : UIElement(x, y, width, height)
    , color(0.1f, 0.1f, 0.1f, 0.8f)
{
}

void UIPanel::render() {
    // Rendered by UIRenderer
}

// ===== UILabel Implementation =====

UILabel::UILabel(float x, float y, const std::string& text)
    : UIElement(x, y, 0, 0)
    , text(text)
    , color(1.0f, 1.0f, 1.0f)
    , scale(1.0f)
{
}

void UILabel::render() {
    // Rendered by UIRenderer
}

// ===== UIRenderer Implementation =====

UIRenderer::UIRenderer()
    : screenWidth(1280)
    , screenHeight(720)
    , VAO(0)
    , VBO(0)
    , fontVAO(0)
    , fontVBO(0)
{
}

UIRenderer::~UIRenderer() {
    shutdown();
}

bool UIRenderer::initialize(int width, int height) {
    screenWidth = width;
    screenHeight = height;
    
    LOG_INFO("Initializing UI Renderer");
    
    // Create simple UI shader
    // For now, we'll use a basic shader
    // TODO: Create proper UI shaders
    
    setupQuadBuffers();
    initSimpleFontRendering();
    
    LOG_INFO("UI Renderer initialized");
    return true;
}

void UIRenderer::shutdown() {
    if (VAO != 0) {
        glDeleteVertexArrays(1, &VAO);
        glDeleteBuffers(1, &VBO);
        VAO = 0;
        VBO = 0;
    }
    
    if (fontVAO != 0) {
        glDeleteVertexArrays(1, &fontVAO);
        glDeleteBuffers(1, &fontVBO);
        fontVAO = 0;
        fontVBO = 0;
    }
}

void UIRenderer::setupQuadBuffers() {
    // Create VAO and VBO for rendering quads
    glGenVertexArrays(1, &VAO);
    glGenBuffers(1, &VBO);
    
    glBindVertexArray(VAO);
    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    
    // Reserve space for a quad (6 vertices, 2D position only)
    glBufferData(GL_ARRAY_BUFFER, sizeof(float) * 6 * 2, nullptr, GL_DYNAMIC_DRAW);
    
    // Position attribute
    glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, 2 * sizeof(float), (void*)0);
    glEnableVertexAttribArray(0);
    
    glBindVertexArray(0);
}

void UIRenderer::initSimpleFontRendering() {
    // Initialize simple font rendering
    glGenVertexArrays(1, &fontVAO);
    glGenBuffers(1, &fontVBO);
    
    glBindVertexArray(fontVAO);
    glBindBuffer(GL_ARRAY_BUFFER, fontVBO);
    glBufferData(GL_ARRAY_BUFFER, sizeof(float) * 6 * 4, nullptr, GL_DYNAMIC_DRAW);
    
    glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, 4 * sizeof(float), (void*)0);
    glEnableVertexAttribArray(0);
    glVertexAttribPointer(1, 2, GL_FLOAT, GL_FALSE, 4 * sizeof(float), (void*)(2 * sizeof(float)));
    glEnableVertexAttribArray(1);
    
    glBindVertexArray(0);
}

void UIRenderer::beginFrame() {
    // Enable blending for UI
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    
    // Disable depth test for UI (always on top)
    glDisable(GL_DEPTH_TEST);
}

void UIRenderer::endFrame() {
    // Restore OpenGL state
    glDisable(GL_BLEND);
    glEnable(GL_DEPTH_TEST);
}

void UIRenderer::drawRect(float x, float y, float width, float height, const glm::vec4& color) {
    // Convert screen coordinates to NDC
    float ndcX = (x / screenWidth) * 2.0f - 1.0f;
    float ndcY = 1.0f - (y / screenHeight) * 2.0f;
    float ndcWidth = (width / screenWidth) * 2.0f;
    float ndcHeight = (height / screenHeight) * 2.0f;
    
    // Create quad vertices
    float vertices[] = {
        ndcX, ndcY - ndcHeight,
        ndcX + ndcWidth, ndcY - ndcHeight,
        ndcX + ndcWidth, ndcY,
        
        ndcX, ndcY - ndcHeight,
        ndcX + ndcWidth, ndcY,
        ndcX, ndcY
    };
    
    glBindVertexArray(VAO);
    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    glBufferSubData(GL_ARRAY_BUFFER, 0, sizeof(vertices), vertices);
    
    // Simple color rendering without shader for now
    // TODO: Use proper shader
    glColor4f(color.r, color.g, color.b, color.a);
    glDrawArrays(GL_TRIANGLES, 0, 6);
    
    glBindVertexArray(0);
}

void UIRenderer::drawRectOutline(float x, float y, float width, float height, const glm::vec4& color, float thickness) {
    // Draw 4 lines for outline
    drawRect(x, y, width, thickness, color); // Top
    drawRect(x, y + height - thickness, width, thickness, color); // Bottom
    drawRect(x, y, thickness, height, color); // Left
    drawRect(x + width - thickness, y, thickness, height, color); // Right
}

void UIRenderer::drawText(const std::string& text, float x, float y, float scale, const glm::vec3& color) {
    // Simple text rendering using fixed-width characters
    // This is a placeholder - proper font rendering would use FreeType
    
    const float charWidth = 8.0f * scale;
    const float charHeight = 12.0f * scale;
    
    float currentX = x;
    for (char c : text) {
        // Very simple character rendering as rectangles
        // In a real implementation, this would render actual glyphs
        drawRect(currentX, y, charWidth, charHeight, glm::vec4(color, 1.0f));
        currentX += charWidth;
    }
}

void UIRenderer::resize(int width, int height) {
    screenWidth = width;
    screenHeight = height;
}
