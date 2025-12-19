#include "rendering/Shader.h"
#include <iostream>
#include <fstream>
#include <sstream>
#include <glm/gtc/type_ptr.hpp>

Shader::Shader() : programID(0) {
}

Shader::~Shader() {
    if (programID != 0) {
        glDeleteProgram(programID);
    }
}

bool Shader::loadFromSource(const char* vertexSource, const char* fragmentSource) {
    // Compile shaders
    GLuint vertexShader = compileShader(GL_VERTEX_SHADER, vertexSource);
    if (vertexShader == 0) return false;
    
    GLuint fragmentShader = compileShader(GL_FRAGMENT_SHADER, fragmentSource);
    if (fragmentShader == 0) {
        glDeleteShader(vertexShader);
        return false;
    }
    
    // Link program
    bool success = linkProgram(vertexShader, fragmentShader);
    
    // Clean up shaders (they're linked into the program now)
    glDeleteShader(vertexShader);
    glDeleteShader(fragmentShader);
    
    return success;
}

bool Shader::loadFromFiles(const char* vertexPath, const char* fragmentPath) {
    // Read vertex shader file
    std::ifstream vShaderFile(vertexPath);
    if (!vShaderFile.is_open()) {
        std::cerr << "Failed to open vertex shader file: " << vertexPath << std::endl;
        return false;
    }
    std::stringstream vShaderStream;
    vShaderStream << vShaderFile.rdbuf();
    std::string vertexCode = vShaderStream.str();
    
    // Read fragment shader file
    std::ifstream fShaderFile(fragmentPath);
    if (!fShaderFile.is_open()) {
        std::cerr << "Failed to open fragment shader file: " << fragmentPath << std::endl;
        return false;
    }
    std::stringstream fShaderStream;
    fShaderStream << fShaderFile.rdbuf();
    std::string fragmentCode = fShaderStream.str();
    
    return loadFromSource(vertexCode.c_str(), fragmentCode.c_str());
}

void Shader::use() const {
    glUseProgram(programID);
}

void Shader::setInt(const char* name, int value) const {
    glUniform1i(glGetUniformLocation(programID, name), value);
}

void Shader::setFloat(const char* name, float value) const {
    glUniform1f(glGetUniformLocation(programID, name), value);
}

void Shader::setVec2(const char* name, const glm::vec2& value) const {
    glUniform2f(glGetUniformLocation(programID, name), value.x, value.y);
}

void Shader::setVec3(const char* name, const glm::vec3& value) const {
    glUniform3f(glGetUniformLocation(programID, name), value.x, value.y, value.z);
}

void Shader::setVec4(const char* name, const glm::vec4& value) const {
    glUniform4f(glGetUniformLocation(programID, name), value.x, value.y, value.z, value.w);
}

void Shader::setMat4(const char* name, const glm::mat4& value) const {
    glUniformMatrix4fv(glGetUniformLocation(programID, name), 1, GL_FALSE, glm::value_ptr(value));
}

GLuint Shader::compileShader(GLenum type, const char* source) {
    GLuint shader = glCreateShader(type);
    glShaderSource(shader, 1, &source, nullptr);
    glCompileShader(shader);
    
    // Check for errors
    GLint success;
    glGetShaderiv(shader, GL_COMPILE_STATUS, &success);
    if (!success) {
        GLchar infoLog[512];
        glGetShaderInfoLog(shader, 512, nullptr, infoLog);
        std::cerr << "Shader compilation error (" 
                  << (type == GL_VERTEX_SHADER ? "vertex" : "fragment") 
                  << "):\n" << infoLog << std::endl;
        glDeleteShader(shader);
        return 0;
    }
    
    return shader;
}

bool Shader::linkProgram(GLuint vertexShader, GLuint fragmentShader) {
    programID = glCreateProgram();
    glAttachShader(programID, vertexShader);
    glAttachShader(programID, fragmentShader);
    glLinkProgram(programID);
    
    // Check for errors
    GLint success;
    glGetProgramiv(programID, GL_LINK_STATUS, &success);
    if (!success) {
        GLchar infoLog[512];
        glGetProgramInfoLog(programID, 512, nullptr, infoLog);
        std::cerr << "Shader linking error:\n" << infoLog << std::endl;
        glDeleteProgram(programID);
        programID = 0;
        return false;
    }
    
    return true;
}

void Shader::checkCompileErrors(GLuint shader, const char* type) {
    GLint success;
    GLchar infoLog[1024];
    
    if (std::string(type) != "PROGRAM") {
        glGetShaderiv(shader, GL_COMPILE_STATUS, &success);
        if (!success) {
            glGetShaderInfoLog(shader, 1024, nullptr, infoLog);
            std::cerr << "Shader compilation error of type: " << type << "\n" 
                      << infoLog << std::endl;
        }
    } else {
        glGetProgramiv(shader, GL_LINK_STATUS, &success);
        if (!success) {
            glGetProgramInfoLog(shader, 1024, nullptr, infoLog);
            std::cerr << "Shader linking error of type: " << type << "\n" 
                      << infoLog << std::endl;
        }
    }
}
