/**
 * Logger System
 * Captures and logs all errors, warnings, and important events to log files
 */
class Logger {
    constructor() {
        this.logs = [];
        this.maxLogs = 1000; // Keep last 1000 logs in memory
        this.sessionId = this.generateSessionId();
        this.startTime = new Date();
        
        // Initialize logging
        this.setupConsoleCapture();
        this.setupErrorHandlers();
        
        this.log('INFO', 'Logger initialized', { sessionId: this.sessionId });
    }
    
    /**
     * Generate a unique session ID
     */
    generateSessionId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return `${timestamp}-${random}`;
    }
    
    /**
     * Format timestamp
     */
    getTimestamp() {
        const now = new Date();
        return now.toISOString();
    }
    
    /**
     * Log a message
     */
    log(level, message, data = null) {
        const entry = {
            timestamp: this.getTimestamp(),
            level: level,
            message: message,
            data: data,
            sessionId: this.sessionId
        };
        
        this.logs.push(entry);
        
        // Trim logs if exceeding max
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        
        // Also write to original console
        this.writeToOriginalConsole(level, message, data);
        
        // Store in localStorage for persistence
        this.persistLog(entry);
        
        return entry;
    }
    
    /**
     * Write to original console methods
     */
    writeToOriginalConsole(level, message, data) {
        const prefix = `[${this.getTimestamp()}] [${level}]`;
        
        if (data) {
            switch(level) {
                case 'ERROR':
                    this._originalConsole.error(prefix, message, data);
                    break;
                case 'WARN':
                    this._originalConsole.warn(prefix, message, data);
                    break;
                case 'INFO':
                    this._originalConsole.info(prefix, message, data);
                    break;
                default:
                    this._originalConsole.log(prefix, message, data);
            }
        } else {
            switch(level) {
                case 'ERROR':
                    this._originalConsole.error(prefix, message);
                    break;
                case 'WARN':
                    this._originalConsole.warn(prefix, message);
                    break;
                case 'INFO':
                    this._originalConsole.info(prefix, message);
                    break;
                default:
                    this._originalConsole.log(prefix, message);
            }
        }
    }
    
    /**
     * Persist log entry to localStorage
     */
    persistLog(entry) {
        try {
            const key = `log_${this.sessionId}`;
            let sessionLogs = [];
            
            const existing = localStorage.getItem(key);
            if (existing) {
                sessionLogs = JSON.parse(existing);
            }
            
            sessionLogs.push(entry);
            
            // Keep only last 500 logs per session in localStorage
            if (sessionLogs.length > 500) {
                sessionLogs = sessionLogs.slice(-500);
            }
            
            localStorage.setItem(key, JSON.stringify(sessionLogs));
        } catch (e) {
            // If localStorage is full or unavailable, fail silently
            this._originalConsole.warn('Failed to persist log to localStorage:', e);
        }
    }
    
    /**
     * Setup console capture
     */
    setupConsoleCapture() {
        // Store original console methods
        this._originalConsole = {
            log: console.log.bind(console),
            error: console.error.bind(console),
            warn: console.warn.bind(console),
            info: console.info.bind(console),
            debug: console.debug.bind(console)
        };
        
        // Override console methods
        const self = this;
        
        console.log = function(...args) {
            self.log('LOG', args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '));
        };
        
        console.error = function(...args) {
            self.log('ERROR', args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '));
        };
        
        console.warn = function(...args) {
            self.log('WARN', args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '));
        };
        
        console.info = function(...args) {
            self.log('INFO', args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '));
        };
        
        console.debug = function(...args) {
            self.log('DEBUG', args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '));
        };
    }
    
    /**
     * Setup global error handlers
     */
    setupErrorHandlers() {
        const self = this;
        
        // Catch uncaught errors
        window.addEventListener('error', function(event) {
            self.log('ERROR', 'Uncaught error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error ? {
                    name: event.error.name,
                    message: event.error.message,
                    stack: event.error.stack
                } : null
            });
        });
        
        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', function(event) {
            self.log('ERROR', 'Unhandled promise rejection', {
                reason: event.reason,
                promise: event.promise
            });
        });
    }
    
    /**
     * Get all logs
     */
    getLogs() {
        return this.logs;
    }
    
    /**
     * Get logs by level
     */
    getLogsByLevel(level) {
        return this.logs.filter(log => log.level === level);
    }
    
    /**
     * Export logs as text
     */
    exportLogsAsText() {
        let text = `=== The Daily Grind - Log Export ===\n`;
        text += `Session ID: ${this.sessionId}\n`;
        text += `Start Time: ${this.startTime.toISOString()}\n`;
        text += `Export Time: ${new Date().toISOString()}\n`;
        text += `Total Logs: ${this.logs.length}\n`;
        text += `\n=== Log Entries ===\n\n`;
        
        this.logs.forEach(log => {
            text += `[${log.timestamp}] [${log.level}] ${log.message}\n`;
            if (log.data) {
                text += `  Data: ${JSON.stringify(log.data, null, 2)}\n`;
            }
            text += '\n';
        });
        
        return text;
    }
    
    /**
     * Download logs as a file
     */
    downloadLogs() {
        const text = this.exportLogsAsText();
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `game-log-${this.sessionId}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.log('INFO', 'Logs downloaded');
    }
    
    /**
     * Clear logs
     */
    clearLogs() {
        const oldCount = this.logs.length;
        this.logs = [];
        
        // Clear from localStorage
        try {
            const key = `log_${this.sessionId}`;
            localStorage.removeItem(key);
        } catch (e) {
            this._originalConsole.warn('Failed to clear logs from localStorage:', e);
        }
        
        this.log('INFO', `Cleared ${oldCount} log entries`);
    }
    
    /**
     * Get summary statistics
     */
    getSummary() {
        const summary = {
            sessionId: this.sessionId,
            startTime: this.startTime,
            totalLogs: this.logs.length,
            errors: this.getLogsByLevel('ERROR').length,
            warnings: this.getLogsByLevel('WARN').length,
            info: this.getLogsByLevel('INFO').length
        };
        return summary;
    }
}

// Create global logger instance
window.GameLogger = new Logger();
