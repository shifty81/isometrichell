#ifndef TIME_H
#define TIME_H

/**
 * Time Management System
 * Handles delta time and frame timing
 */
class Time {
public:
    Time();
    
    // Update time values each frame
    void update();
    
    // Get delta time in seconds
    float getDeltaTime() const { return deltaTime; }
    
    // Get total elapsed time in seconds
    float getTotalTime() const { return totalTime; }
    
    // Get frames per second
    float getFPS() const { return fps; }
    
    // Get current time in seconds (from glfwGetTime)
    static double getCurrentTime();
    
private:
    float deltaTime;      // Time since last frame
    float totalTime;      // Total time since start
    double lastFrameTime; // Time of last frame
    float fps;            // Current FPS
    float fpsTimer;       // Timer for FPS calculation
    int frameCount;       // Frame counter for FPS
};

#endif // TIME_H
