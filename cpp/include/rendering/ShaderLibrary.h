#ifndef SHADER_LIBRARY_H
#define SHADER_LIBRARY_H

#include <string>
#include <unordered_map>
#include <memory>
#include "Shader.h"

/**
 * Shader Library for managing multiple shaders
 * Provides shader caching and retrieval by name
 */
class ShaderLibrary {
public:
    ShaderLibrary();
    ~ShaderLibrary();
    
    // Load shader from files
    bool loadFromFiles(const std::string& name, const char* vertexPath, const char* fragmentPath);
    
    // Load shader from source code
    bool loadFromSource(const std::string& name, const char* vertexSource, const char* fragmentSource);
    
    // Get shader by name
    Shader* get(const std::string& name);
    const Shader* get(const std::string& name) const;
    
    // Check if shader exists
    bool has(const std::string& name) const;
    
    // Remove shader
    void remove(const std::string& name);
    
    // Clear all shaders
    void clear();
    
    // Load common built-in shaders
    bool loadBuiltInShaders();
    
private:
    std::unordered_map<std::string, std::unique_ptr<Shader>> shaders;
    
    // Built-in shader sources
    bool loadDefaultShader();
    bool loadLightingShader();
    bool loadPostProcessingShaders();
};

#endif // SHADER_LIBRARY_H
