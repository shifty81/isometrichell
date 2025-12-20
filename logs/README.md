# Logs Directory

This directory contains log files from both the JavaScript web editor and the C++ game engine.

## Log Files

### JavaScript Web Editor Logs
- **Browser Console**: All logs are captured in the browser console and can be downloaded
- **localStorage**: Logs are also stored in browser's localStorage for persistence
- **Download**: Press `Ctrl+Shift+L` to download logs as a text file
- **Format**: `game-log-[sessionId].txt`

### C++ Game Engine Logs
- **File**: `engine.log`
- **Location**: This directory (`logs/engine.log`)
- **Format**: Plain text with timestamps and log levels
- **Persistence**: Appended to on each run with new session headers

## Log Levels

Both systems use similar log levels:

- **DEBUG**: Detailed diagnostic information
- **INFO**: General informational messages
- **WARNING**: Warning messages about potential issues
- **ERROR**: Error messages when something goes wrong
- **FATAL**: Critical errors that cause the application to crash

## Downloading Logs

### Web Editor
1. Open the web editor in your browser
2. Press `Ctrl+Shift+L` to download the current session log
3. Or click the "Download Error Log" button if an error occurs

### C++ Engine
- Logs are automatically written to `logs/engine.log`
- You can view this file with any text editor
- The file is appended to on each run

## Log Format

### JavaScript Logs
```
[2025-12-20T12:34:56.789Z] [INFO] Logger initialized
[2025-12-20T12:34:57.123Z] [ERROR] Failed to load asset: texture.png
```

### C++ Logs
```
[2025-12-20 12:34:56.789] [INFO] Engine initialized successfully
[2025-12-20 12:34:57.123] [ERROR] Failed to load texture
```

## Error Reporting

If you experience crashes or errors:

1. **Web Editor**: Use `Ctrl+Shift+L` to download the log file
2. **C++ Engine**: Check `logs/engine.log` for error messages
3. Include these log files when reporting issues

## Clearing Logs

### Web Editor
- Logs are stored in browser's localStorage
- Clear browser data to remove old logs
- Each session gets a unique ID

### C++ Engine
- Delete `logs/engine.log` to start fresh
- Or rename it to keep a backup

## Privacy

Logs may contain:
- System information
- File paths
- Error messages and stack traces
- Performance metrics

Logs do NOT contain:
- Personal user data
- Passwords or credentials
- Network traffic
