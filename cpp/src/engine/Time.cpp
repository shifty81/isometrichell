#include "engine/Time.h"
#include <GLFW/glfw3.h>

Time::Time()
    : deltaTime(0.0f)
    , totalTime(0.0f)
    , lastFrameTime(0.0)
    , fps(0.0f)
    , fpsTimer(0.0f)
    , frameCount(0)
{
    lastFrameTime = glfwGetTime();
}

void Time::update() {
    double currentTime = glfwGetTime();
    deltaTime = static_cast<float>(currentTime - lastFrameTime);
    lastFrameTime = currentTime;
    totalTime += deltaTime;
    
    // Calculate FPS
    frameCount++;
    fpsTimer += deltaTime;
    
    if (fpsTimer >= 1.0f) {
        fps = static_cast<float>(frameCount) / fpsTimer;
        frameCount = 0;
        fpsTimer = 0.0f;
    }
}

double Time::getCurrentTime() {
    return glfwGetTime();
}
