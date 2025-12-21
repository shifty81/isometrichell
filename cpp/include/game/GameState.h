#ifndef GAMESTATE_H
#define GAMESTATE_H

#include <vector>

/**
 * Game State Enumeration
 * Defines all possible game states
 */
enum class GameState {
    MAIN_MENU,      // Main menu screen
    NEW_GAME,       // New game setup screen
    LOAD_GAME,      // Load game selection screen
    IN_GAME,        // Active gameplay
    EDITOR,         // In-game map editor
    MOD_BROWSER,    // Mod management screen
    SETTINGS,       // Settings/options screen
    PAUSED,         // Game paused overlay
    EXITING         // Cleanup and exit
};

/**
 * Game State Manager
 * Manages transitions between different game states
 */
class GameStateManager {
public:
    GameStateManager();
    ~GameStateManager() = default;
    
    // State management
    void setState(GameState newState);
    GameState getState() const { return currentState; }
    GameState getPreviousState() const { return previousState; }
    
    // State queries
    bool isInGame() const { return currentState == GameState::IN_GAME; }
    bool isInMenu() const;
    bool isInEditor() const { return currentState == GameState::EDITOR; }
    bool isPaused() const { return currentState == GameState::PAUSED; }
    
    // State history for back navigation
    void pushState(GameState state);
    GameState popState();
    bool canGoBack() const { return !stateHistory.empty(); }
    
private:
    GameState currentState;
    GameState previousState;
    std::vector<GameState> stateHistory;
    const size_t MAX_HISTORY = 10;
};

#endif // GAMESTATE_H
