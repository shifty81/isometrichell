#include "rendering/OpenGLBackend.h"
#include "utils/Logger.h"
#include <iostream>

OpenGLBackend::OpenGLBackend()
    : initialized(false)
{
}

OpenGLBackend::~OpenGLBackend() {
    shutdown();
}

bool OpenGLBackend::initialize() {
    if (initialized) {
        LOG_WARNING("OpenGL backend already initialized");
        return true;
    }
    
    LOG_INFO("Initializing OpenGL backend");
    
    // Get OpenGL version info
    const GLubyte* version = glGetString(GL_VERSION);
    const GLubyte* vendor = glGetString(GL_VENDOR);
    const GLubyte* renderer = glGetString(GL_RENDERER);
    
    if (version) {
        versionString = reinterpret_cast<const char*>(version);
        LOG_INFO(std::string("OpenGL Version: ") + versionString);
        LOG_INFO(std::string("OpenGL Vendor: ") + reinterpret_cast<const char*>(vendor));
        LOG_INFO(std::string("OpenGL Renderer: ") + reinterpret_cast<const char*>(renderer));
    }
    
    // Enable default OpenGL features
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    
    // Enable depth testing for 3D rendering
    glEnable(GL_DEPTH_TEST);
    glDepthFunc(GL_LEQUAL);
    
    // Enable back-face culling for performance
    glEnable(GL_CULL_FACE);
    glCullFace(GL_BACK);
    glFrontFace(GL_CCW);
    
    initialized = true;
    LOG_INFO("OpenGL backend initialized successfully");
    return true;
}

void OpenGLBackend::shutdown() {
    if (!initialized) {
        return;
    }
    
    LOG_INFO("Shutting down OpenGL backend");
    initialized = false;
}

void OpenGLBackend::beginFrame() {
    // Nothing special needed for OpenGL
}

void OpenGLBackend::endFrame() {
    // Nothing special needed for OpenGL
}

void OpenGLBackend::clear(float r, float g, float b, float a) {
    glClearColor(r, g, b, a);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
}

void OpenGLBackend::clearDepth() {
    glClear(GL_DEPTH_BUFFER_BIT);
}

void OpenGLBackend::setViewport(int x, int y, int width, int height) {
    glViewport(x, y, width, height);
}

void OpenGLBackend::enableDepthTest(bool enable) {
    if (enable) {
        glEnable(GL_DEPTH_TEST);
    } else {
        glDisable(GL_DEPTH_TEST);
    }
}

void OpenGLBackend::enableBlending(bool enable) {
    if (enable) {
        glEnable(GL_BLEND);
    } else {
        glDisable(GL_BLEND);
    }
}

void OpenGLBackend::setBlendMode(int srcFactor, int dstFactor) {
    glBlendFunc(srcFactor, dstFactor);
}

const char* OpenGLBackend::getName() const {
    return "OpenGL";
}

const char* OpenGLBackend::getVersion() const {
    return versionString.c_str();
}

RenderBackendType OpenGLBackend::getType() const {
    return RenderBackendType::OpenGL;
}
