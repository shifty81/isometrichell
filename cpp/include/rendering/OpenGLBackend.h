#ifndef OPENGL_BACKEND_H
#define OPENGL_BACKEND_H

#include "RenderBackend.h"
#include <glad/glad.h>

/**
 * OpenGL Rendering Backend Implementation
 */
class OpenGLBackend : public RenderBackend {
public:
    OpenGLBackend();
    ~OpenGLBackend() override;
    
    // RenderBackend interface
    bool initialize() override;
    void shutdown() override;
    
    void beginFrame() override;
    void endFrame() override;
    
    void clear(float r, float g, float b, float a) override;
    void clearDepth() override;
    
    void setViewport(int x, int y, int width, int height) override;
    void enableDepthTest(bool enable) override;
    void enableBlending(bool enable) override;
    void setBlendMode(int srcFactor, int dstFactor) override;
    
    const char* getName() const override;
    const char* getVersion() const override;
    RenderBackendType getType() const override;
    
private:
    bool initialized;
    std::string versionString;
};

#endif // OPENGL_BACKEND_H
