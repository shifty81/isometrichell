#ifndef DIRECTX_BACKEND_H
#define DIRECTX_BACKEND_H

#include "RenderBackend.h"

#ifdef _WIN32
    #include <d3d11.h>
    #include <wrl/client.h>
    using Microsoft::WRL::ComPtr;
    #define DIRECTX_AVAILABLE
#endif

/**
 * DirectX 11 Rendering Backend Implementation
 * Only available on Windows platforms
 */
class DirectXBackend : public RenderBackend {
public:
    DirectXBackend();
    ~DirectXBackend() override;
    
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
    
#ifdef DIRECTX_AVAILABLE
    // DirectX-specific methods
    ID3D11Device* getDevice() const { return device.Get(); }
    ID3D11DeviceContext* getDeviceContext() const { return deviceContext.Get(); }
    IDXGISwapChain* getSwapChain() const { return swapChain.Get(); }
#endif

private:
    bool initialized;
    
#ifdef DIRECTX_AVAILABLE
    // DirectX 11 resources
    ComPtr<ID3D11Device> device;
    ComPtr<ID3D11DeviceContext> deviceContext;
    ComPtr<IDXGISwapChain> swapChain;
    ComPtr<ID3D11RenderTargetView> renderTargetView;
    ComPtr<ID3D11DepthStencilView> depthStencilView;
    ComPtr<ID3D11DepthStencilState> depthStencilState;
    ComPtr<ID3D11BlendState> blendState;
    
    // State tracking
    bool depthTestEnabled;
    bool blendingEnabled;
    
    // Helper methods
    bool createDeviceAndSwapChain();
    bool createRenderTargetView();
    bool createDepthStencilView();
    bool createBlendState();
    bool createDepthStencilState();
#endif
};

#endif // DIRECTX_BACKEND_H
