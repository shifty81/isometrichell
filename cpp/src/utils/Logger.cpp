#include "utils/Logger.h"
#include <iostream>
#include <filesystem>
#include <ctime>
#include <random>

Logger::Logger() 
    : initialized(false)
{
}

Logger::~Logger() {
    shutdown();
}

Logger& Logger::getInstance() {
    static Logger instance;
    return instance;
}

std::string Logger::generateSessionId() {
    auto now = std::chrono::system_clock::now();
    auto timestamp = std::chrono::duration_cast<std::chrono::milliseconds>(
        now.time_since_epoch()
    ).count();
    
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(1000, 9999);
    
    std::stringstream ss;
    ss << timestamp << "-" << dis(gen);
    return ss.str();
}

bool Logger::initialize(const std::string& logFilePath) {
    std::lock_guard<std::mutex> lock(logMutex);
    
    if (initialized) {
        return true;
    }
    
    // Generate session ID
    sessionId = generateSessionId();
    
    // Create logs directory if it doesn't exist
    std::filesystem::path logPath(logFilePath);
    std::filesystem::path logDir = logPath.parent_path();
    
    if (!logDir.empty() && !std::filesystem::exists(logDir)) {
        try {
            std::filesystem::create_directories(logDir);
        } catch (const std::exception& e) {
            std::cerr << "Failed to create logs directory: " << e.what() << std::endl;
            return false;
        }
    }
    
    // Open log file
    logFile.open(logFilePath, std::ios::app);
    if (!logFile.is_open()) {
        std::cerr << "Failed to open log file: " << logFilePath << std::endl;
        return false;
    }
    
    initialized = true;
    
    // Write header
    logFile << "\n========================================" << std::endl;
    logFile << "The Daily Grind - C++ Engine Log" << std::endl;
    logFile << "Session ID: " << sessionId << std::endl;
    logFile << "Start Time: " << getTimestamp() << std::endl;
    logFile << "========================================\n" << std::endl;
    logFile.flush();
    
    std::cout << "Logger initialized - Session ID: " << sessionId << std::endl;
    
    return true;
}

std::string Logger::getTimestamp() {
    auto now = std::chrono::system_clock::now();
    auto time = std::chrono::system_clock::to_time_t(now);
    auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(
        now.time_since_epoch()
    ) % 1000;
    
    std::tm timeinfo;
#ifdef _MSC_VER
    localtime_s(&timeinfo, &time);
#else
    timeinfo = *std::localtime(&time);
#endif
    
    std::stringstream ss;
    ss << std::put_time(&timeinfo, "%Y-%m-%d %H:%M:%S");
    ss << '.' << std::setfill('0') << std::setw(3) << ms.count();
    
    return ss.str();
}

std::string Logger::levelToString(Level level) {
    switch (level) {
        case Level::DEBUG:   return "DEBUG";
        case Level::INFO:    return "INFO";
        case Level::WARNING: return "WARNING";
        case Level::ERROR:   return "ERROR";
        case Level::FATAL:   return "FATAL";
        default:             return "UNKNOWN";
    }
}

void Logger::writeLog(Level level, const std::string& message) {
    std::lock_guard<std::mutex> lock(logMutex);
    
    if (!initialized) {
        // If not initialized, try to initialize with default path
        initialize();
    }
    
    std::string timestamp = getTimestamp();
    std::string levelStr = levelToString(level);
    
    // Format: [timestamp] [LEVEL] message
    std::stringstream logEntry;
    logEntry << "[" << timestamp << "] [" << levelStr << "] " << message;
    
    // Write to file
    if (logFile.is_open()) {
        logFile << logEntry.str() << std::endl;
        
        // Flush immediately for errors and fatal logs
        if (level == Level::ERROR || level == Level::FATAL) {
            logFile.flush();
        }
    }
    
    // Also write to console
    if (level == Level::ERROR || level == Level::FATAL) {
        std::cerr << logEntry.str() << std::endl;
    } else {
        std::cout << logEntry.str() << std::endl;
    }
}

void Logger::log(Level level, const std::string& message) {
    writeLog(level, message);
}

void Logger::debug(const std::string& message) {
    log(Level::DEBUG, message);
}

void Logger::info(const std::string& message) {
    log(Level::INFO, message);
}

void Logger::warning(const std::string& message) {
    log(Level::WARNING, message);
}

void Logger::error(const std::string& message) {
    log(Level::ERROR, message);
}

void Logger::fatal(const std::string& message) {
    log(Level::FATAL, message);
}

void Logger::flush() {
    std::lock_guard<std::mutex> lock(logMutex);
    if (logFile.is_open()) {
        logFile.flush();
    }
}

void Logger::shutdown() {
    std::lock_guard<std::mutex> lock(logMutex);
    
    if (initialized && logFile.is_open()) {
        logFile << "\n[" << getTimestamp() << "] [INFO] Logger shutting down" << std::endl;
        logFile << "========================================\n" << std::endl;
        logFile.close();
        initialized = false;
    }
}
