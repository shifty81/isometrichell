#include "rendering/DirectXBackend.h"
#include "utils/Logger.h"
#include <iostream>

DirectXBackend::DirectXBackend()
    : initialized(false)
#ifdef DIRECTX_AVAILABLE
    , depthTestEnabled(true)
    , blendingEnabled(true)
#endif
{
}

DirectXBackend::~DirectXBackend() {
    shutdown();
}

bool DirectXBackend::initialize() {
#ifdef DIRECTX_AVAILABLE
    if (initialized) {
        LOG_WARNING("DirectX backend already initialized");
        return true;
    }
    
    LOG_INFO("Initializing DirectX 11 backend");
    
    // Create device and swap chain
    if (!createDeviceAndSwapChain()) {
        LOG_ERROR("Failed to create DirectX device and swap chain");
        return false;
    }
    
    // Create render target view
    if (!createRenderTargetView()) {
        LOG_ERROR("Failed to create DirectX render target view");
        return false;
    }
    
    // Create depth stencil view
    if (!createDepthStencilView()) {
        LOG_ERROR("Failed to create DirectX depth stencil view");
        return false;
    }
    
    // Create blend state
    if (!createBlendState()) {
        LOG_ERROR("Failed to create DirectX blend state");
        return false;
    }
    
    // Create depth stencil state
    if (!createDepthStencilState()) {
        LOG_ERROR("Failed to create DirectX depth stencil state");
        return false;
    }
    
    // Set initial render targets
    deviceContext->OMSetRenderTargets(1, renderTargetView.GetAddressOf(), depthStencilView.Get());
    
    initialized = true;
    LOG_INFO("DirectX 11 backend initialized successfully");
    return true;
#else
    LOG_ERROR("DirectX backend not available on this platform");
    std::cerr << "DirectX backend is only available on Windows" << std::endl;
    return false;
#endif
}

void DirectXBackend::shutdown() {
#ifdef DIRECTX_AVAILABLE
    if (!initialized) {
        return;
    }
    
    LOG_INFO("Shutting down DirectX backend");
    
    // Release resources (ComPtr handles this automatically)
    depthStencilState.Reset();
    blendState.Reset();
    depthStencilView.Reset();
    renderTargetView.Reset();
    swapChain.Reset();
    deviceContext.Reset();
    device.Reset();
    
    initialized = false;
#endif
}

void DirectXBackend::beginFrame() {
#ifdef DIRECTX_AVAILABLE
    // Set render targets
    deviceContext->OMSetRenderTargets(1, renderTargetView.GetAddressOf(), depthStencilView.Get());
#endif
}

void DirectXBackend::endFrame() {
#ifdef DIRECTX_AVAILABLE
    // Present the frame
    if (swapChain) {
        swapChain->Present(1, 0); // VSync enabled
    }
#endif
}

void DirectXBackend::clear(float r, float g, float b, float a) {
#ifdef DIRECTX_AVAILABLE
    float clearColor[4] = { r, g, b, a };
    deviceContext->ClearRenderTargetView(renderTargetView.Get(), clearColor);
    deviceContext->ClearDepthStencilView(depthStencilView.Get(), D3D11_CLEAR_DEPTH | D3D11_CLEAR_STENCIL, 1.0f, 0);
#endif
}

void DirectXBackend::clearDepth() {
#ifdef DIRECTX_AVAILABLE
    deviceContext->ClearDepthStencilView(depthStencilView.Get(), D3D11_CLEAR_DEPTH, 1.0f, 0);
#endif
}

void DirectXBackend::setViewport(int x, int y, int width, int height) {
#ifdef DIRECTX_AVAILABLE
    D3D11_VIEWPORT viewport = {};
    viewport.TopLeftX = static_cast<float>(x);
    viewport.TopLeftY = static_cast<float>(y);
    viewport.Width = static_cast<float>(width);
    viewport.Height = static_cast<float>(height);
    viewport.MinDepth = 0.0f;
    viewport.MaxDepth = 1.0f;
    
    deviceContext->RSSetViewports(1, &viewport);
#endif
}

void DirectXBackend::enableDepthTest(bool enable) {
#ifdef DIRECTX_AVAILABLE
    depthTestEnabled = enable;
    // Update depth stencil state
    if (depthStencilState) {
        deviceContext->OMSetDepthStencilState(depthStencilState.Get(), 1);
    }
#endif
}

void DirectXBackend::enableBlending(bool enable) {
#ifdef DIRECTX_AVAILABLE
    blendingEnabled = enable;
    // Update blend state
    if (blendState) {
        float blendFactor[4] = { 1.0f, 1.0f, 1.0f, 1.0f };
        deviceContext->OMSetBlendState(blendState.Get(), blendFactor, 0xffffffff);
    }
#endif
}

void DirectXBackend::setBlendMode(int srcFactor, int dstFactor) {
#ifdef DIRECTX_AVAILABLE
    (void)srcFactor; // Unused - requires blend state recreation
    (void)dstFactor; // Unused - requires blend state recreation
    // Note: Would need to recreate blend state with new factors
    // This is a simplified implementation
    LOG_WARNING("DirectX setBlendMode requires blend state recreation");
#endif
}

const char* DirectXBackend::getName() const {
    return "DirectX 11";
}

const char* DirectXBackend::getVersion() const {
    return "11.0";
}

RenderBackendType DirectXBackend::getType() const {
    return RenderBackendType::DirectX11;
}

#ifdef DIRECTX_AVAILABLE
bool DirectXBackend::createDeviceAndSwapChain() {
    // This is a placeholder - actual implementation would need window handle
    LOG_WARNING("DirectX device creation requires HWND from GLFW/platform layer");
    LOG_WARNING("Full DirectX implementation requires refactoring window management");
    return false;
}

bool DirectXBackend::createRenderTargetView() {
    return false;
}

bool DirectXBackend::createDepthStencilView() {
    return false;
}

bool DirectXBackend::createBlendState() {
    return false;
}

bool DirectXBackend::createDepthStencilState() {
    return false;
}
#endif
