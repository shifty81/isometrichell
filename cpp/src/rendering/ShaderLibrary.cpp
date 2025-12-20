#include "rendering/ShaderLibrary.h"
#include <iostream>

// Built-in shader sources

// Default sprite shader
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

// 2D Lighting shader
const char* lightingVertexShader = R"(
#version 330 core
layout (location = 0) in vec2 aPos;
layout (location = 1) in vec2 aTexCoord;

out vec2 TexCoord;
out vec2 FragPos;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main() {
    vec4 worldPos = model * vec4(aPos, 0.0, 1.0);
    gl_Position = projection * view * worldPos;
    FragPos = worldPos.xy;
    TexCoord = aTexCoord;
}
)";

const char* lightingFragmentShader = R"(
#version 330 core
out vec4 FragColor;

in vec2 TexCoord;
in vec2 FragPos;

uniform sampler2D texture1;
uniform vec4 color;
uniform bool useTexture;

// Lighting uniforms
uniform vec2 lightPos;
uniform vec3 lightColor;
uniform float lightRadius;
uniform float ambientStrength;

void main() {
    vec4 texColor = useTexture ? texture(texture1, TexCoord) : vec4(1.0);
    texColor *= color;
    
    // Calculate lighting
    float distance = length(lightPos - FragPos);
    float attenuation = 1.0 - clamp(distance / lightRadius, 0.0, 1.0);
    
    vec3 ambient = ambientStrength * lightColor;
    vec3 diffuse = attenuation * lightColor;
    
    vec3 lighting = ambient + diffuse;
    FragColor = vec4(texColor.rgb * lighting, texColor.a);
}
)";

// Post-processing shader (grayscale example)
const char* postProcessVertexShader = R"(
#version 330 core
layout (location = 0) in vec2 aPos;
layout (location = 1) in vec2 aTexCoord;

out vec2 TexCoord;

void main() {
    gl_Position = vec4(aPos, 0.0, 1.0);
    TexCoord = aTexCoord;
}
)";

const char* postProcessFragmentShader = R"(
#version 330 core
out vec4 FragColor;

in vec2 TexCoord;

uniform sampler2D screenTexture;
uniform float grayscale;
uniform float contrast;
uniform float brightness;

void main() {
    vec4 color = texture(screenTexture, TexCoord);
    
    // Apply brightness
    color.rgb += brightness;
    
    // Apply contrast
    color.rgb = (color.rgb - 0.5) * contrast + 0.5;
    
    // Apply grayscale
    if (grayscale > 0.0) {
        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        color.rgb = mix(color.rgb, vec3(gray), grayscale);
    }
    
    FragColor = color;
}
)";

ShaderLibrary::ShaderLibrary() {
}

ShaderLibrary::~ShaderLibrary() {
    clear();
}

bool ShaderLibrary::loadFromFiles(const std::string& name, const char* vertexPath, const char* fragmentPath) {
    auto shader = std::make_unique<Shader>();
    
    if (!shader->loadFromFiles(vertexPath, fragmentPath)) {
        std::cerr << "Failed to load shader '" << name << "' from files" << std::endl;
        return false;
    }
    
    shaders[name] = std::move(shader);
    std::cout << "Shader '" << name << "' loaded from files" << std::endl;
    return true;
}

bool ShaderLibrary::loadFromSource(const std::string& name, const char* vertexSource, const char* fragmentSource) {
    auto shader = std::make_unique<Shader>();
    
    if (!shader->loadFromSource(vertexSource, fragmentSource)) {
        std::cerr << "Failed to load shader '" << name << "' from source" << std::endl;
        return false;
    }
    
    shaders[name] = std::move(shader);
    std::cout << "Shader '" << name << "' loaded from source" << std::endl;
    return true;
}

Shader* ShaderLibrary::get(const std::string& name) {
    auto it = shaders.find(name);
    if (it != shaders.end()) {
        return it->second.get();
    }
    return nullptr;
}

const Shader* ShaderLibrary::get(const std::string& name) const {
    auto it = shaders.find(name);
    if (it != shaders.end()) {
        return it->second.get();
    }
    return nullptr;
}

bool ShaderLibrary::has(const std::string& name) const {
    return shaders.find(name) != shaders.end();
}

void ShaderLibrary::remove(const std::string& name) {
    shaders.erase(name);
}

void ShaderLibrary::clear() {
    shaders.clear();
}

bool ShaderLibrary::loadBuiltInShaders() {
    bool success = true;
    
    success &= loadDefaultShader();
    success &= loadLightingShader();
    success &= loadPostProcessingShaders();
    
    if (success) {
        std::cout << "All built-in shaders loaded successfully" << std::endl;
    } else {
        std::cerr << "Some built-in shaders failed to load" << std::endl;
    }
    
    return success;
}

bool ShaderLibrary::loadDefaultShader() {
    return loadFromSource("default", defaultVertexShader, defaultFragmentShader);
}

bool ShaderLibrary::loadLightingShader() {
    return loadFromSource("lighting", lightingVertexShader, lightingFragmentShader);
}

bool ShaderLibrary::loadPostProcessingShaders() {
    return loadFromSource("postprocess", postProcessVertexShader, postProcessFragmentShader);
}
