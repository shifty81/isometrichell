#ifndef UI_RENDERER_H
#define UI_RENDERER_H

#include <glad/glad.h>
#include <glm/glm.hpp>
#include <string>
#include <vector>
#include <memory>
#include <functional>

// Forward declarations
class Shader;

/**
 * UI Element Base Class
 */
class UIElement {
public:
    UIElement(float x, float y, float width, float height)
        : position(x, y), size(width, height), visible(true), enabled(true) {}
    virtual ~UIElement() = default;
    
    virtual void render() = 0;
    virtual bool contains(float x, float y) const;
    
    void setPosition(float x, float y) { position = glm::vec2(x, y); }
    void setSize(float w, float h) { size = glm::vec2(w, h); }
    void setVisible(bool v) { visible = v; }
    void setEnabled(bool e) { enabled = e; }
    
    glm::vec2 getPosition() const { return position; }
    glm::vec2 getSize() const { return size; }
    bool isVisible() const { return visible; }
    bool isEnabled() const { return enabled; }
    
protected:
    glm::vec2 position;
    glm::vec2 size;
    bool visible;
    bool enabled;
};

/**
 * UI Button
 */
class UIButton : public UIElement {
public:
    using ClickCallback = std::function<void()>;
    
    UIButton(float x, float y, float width, float height, const std::string& text);
    ~UIButton() override = default;
    
    void render() override;
    void onClick(ClickCallback callback) { clickCallback = callback; }
    void handleClick();
    
    void setText(const std::string& text) { this->text = text; }
    std::string getText() const { return text; }
    
    void setHovered(bool h) { hovered = h; }
    bool isHovered() const { return hovered; }
    
    // Colors
    void setColor(const glm::vec3& color) { this->color = color; }
    void setHoverColor(const glm::vec3& color) { this->hoverColor = color; }
    void setTextColor(const glm::vec3& color) { this->textColor = color; }
    
private:
    std::string text;
    bool hovered;
    ClickCallback clickCallback;
    
    glm::vec3 color;
    glm::vec3 hoverColor;
    glm::vec3 textColor;
};

/**
 * UI Panel (background rectangle)
 */
class UIPanel : public UIElement {
public:
    UIPanel(float x, float y, float width, float height);
    ~UIPanel() override = default;
    
    void render() override;
    
    void setColor(const glm::vec4& color) { this->color = color; }
    glm::vec4 getColor() const { return color; }
    
private:
    glm::vec4 color; // RGBA
};

/**
 * UI Text Label
 */
class UILabel : public UIElement {
public:
    UILabel(float x, float y, const std::string& text);
    ~UILabel() override = default;
    
    void render() override;
    
    void setText(const std::string& text) { this->text = text; }
    std::string getText() const { return text; }
    
    void setColor(const glm::vec3& color) { this->color = color; }
    void setScale(float scale) { this->scale = scale; }
    
private:
    std::string text;
    glm::vec3 color;
    float scale;
};

/**
 * UI Renderer
 * Handles rendering of UI elements
 */
class UIRenderer {
public:
    UIRenderer();
    ~UIRenderer();
    
    bool initialize(int screenWidth, int screenHeight);
    void shutdown();
    
    // Rendering
    void beginFrame();
    void endFrame();
    
    // Primitive rendering
    void drawRect(float x, float y, float width, float height, const glm::vec4& color);
    void drawRectOutline(float x, float y, float width, float height, const glm::vec4& color, float thickness = 2.0f);
    void drawText(const std::string& text, float x, float y, float scale, const glm::vec3& color);
    
    // Screen dimensions
    void resize(int width, int height);
    int getWidth() const { return screenWidth; }
    int getHeight() const { return screenHeight; }
    
private:
    int screenWidth;
    int screenHeight;
    
    // Shader for UI rendering
    std::unique_ptr<Shader> uiShader;
    
    // Vertex array and buffer for quad rendering
    GLuint VAO, VBO;
    
    // Simple bitmap font rendering (TODO: Replace with proper font rendering)
    void initSimpleFontRendering();
    GLuint fontVAO, fontVBO;
    
    void setupQuadBuffers();
};

#endif // UI_RENDERER_H
