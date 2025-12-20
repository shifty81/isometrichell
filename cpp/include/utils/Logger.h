#pragma once

#include <string>
#include <fstream>
#include <memory>
#include <chrono>
#include <sstream>
#include <iomanip>
#include <mutex>

/**
 * Logger System
 * Thread-safe logging system for capturing errors, warnings, and events
 */
class Logger {
public:
    enum class Level {
        DEBUG,
        INFO,
        WARNING,
        ERROR,
        FATAL
    };

    /**
     * Get the singleton instance
     */
    static Logger& getInstance();

    /**
     * Initialize the logger with a log file path
     */
    bool initialize(const std::string& logFilePath = "logs/engine.log");

    /**
     * Log a message
     */
    void log(Level level, const std::string& message);
    void debug(const std::string& message);
    void info(const std::string& message);
    void warning(const std::string& message);
    void error(const std::string& message);
    void fatal(const std::string& message);

    /**
     * Flush logs to disk
     */
    void flush();

    /**
     * Shutdown the logger
     */
    void shutdown();

    /**
     * Get the current timestamp as a formatted string
     */
    static std::string getTimestamp();

    /**
     * Get level as string
     */
    static std::string levelToString(Level level);

private:
    Logger();
    ~Logger();
    
    // Prevent copying
    Logger(const Logger&) = delete;
    Logger& operator=(const Logger&) = delete;

    std::ofstream logFile;
    std::mutex logMutex;
    bool initialized;
    std::string sessionId;

    /**
     * Generate a unique session ID
     */
    std::string generateSessionId();

    /**
     * Write log entry to file and console
     */
    void writeLog(Level level, const std::string& message);
};

// Convenience macros for logging
#define LOG_DEBUG(msg) Logger::getInstance().debug(msg)
#define LOG_INFO(msg) Logger::getInstance().info(msg)
#define LOG_WARNING(msg) Logger::getInstance().warning(msg)
#define LOG_ERROR(msg) Logger::getInstance().error(msg)
#define LOG_FATAL(msg) Logger::getInstance().fatal(msg)
