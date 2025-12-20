#ifndef RENDER_BACKEND_H
#define RENDER_BACKEND_H

#include <glm/glm.hpp>
#include <string>

/**
 * Rendering Backend Type
 */
enum class RenderBackendType {
    OpenGL,
    DirectX11,
    Auto  // Select best available backend
};

/**
 * Abstract Rendering Backend Interface
 * Provides a common interface for different rendering APIs (OpenGL, DirectX)
 */
class RenderBackend {
public:
    virtual ~RenderBackend() = default;
    
    // Initialization
    virtual bool initialize() = 0;
    virtual void shutdown() = 0;
    
    // Frame operations
    virtual void beginFrame() = 0;
    virtual void endFrame() = 0;
    
    // Clear operations
    virtual void clear(float r, float g, float b, float a) = 0;
    virtual void clearDepth() = 0;
    
    // State management
    virtual void setViewport(int x, int y, int width, int height) = 0;
    virtual void enableDepthTest(bool enable) = 0;
    virtual void enableBlending(bool enable) = 0;
    virtual void setBlendMode(int srcFactor, int dstFactor) = 0;
    
    // Get backend info
    virtual const char* getName() const = 0;
    virtual const char* getVersion() const = 0;
    virtual RenderBackendType getType() const = 0;
};

#endif // RENDER_BACKEND_H
