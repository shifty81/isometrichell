#ifndef SHADER_H
#define SHADER_H

#include <glad/glad.h>
#include <glm/glm.hpp>
#include <string>

/**
 * Shader Program Management
 * Handles shader compilation and uniform setting
 */
class Shader {
public:
    Shader();
    ~Shader();
    
    // Load and compile shaders from source code
    bool loadFromSource(const char* vertexSource, const char* fragmentSource);
    
    // Load shaders from files
    bool loadFromFiles(const char* vertexPath, const char* fragmentPath);
    
    // Use this shader program
    void use() const;
    
    // Uniform setters
    void setInt(const char* name, int value) const;
    void setFloat(const char* name, float value) const;
    void setVec2(const char* name, const glm::vec2& value) const;
    void setVec3(const char* name, const glm::vec3& value) const;
    void setVec4(const char* name, const glm::vec4& value) const;
    void setMat4(const char* name, const glm::mat4& value) const;
    
    // Get program ID
    GLuint getID() const { return programID; }
    
private:
    GLuint programID;
    
    // Compile a shader
    GLuint compileShader(GLenum type, const char* source);
    
    // Link shader program
    bool linkProgram(GLuint vertexShader, GLuint fragmentShader);
    
    // Check compilation/linking errors
    void checkCompileErrors(GLuint shader, const char* type);
};

#endif // SHADER_H
