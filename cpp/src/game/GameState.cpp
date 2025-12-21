#include "game/GameState.h"
#include "utils/Logger.h"
#include <algorithm>

GameStateManager::GameStateManager()
    : currentState(GameState::MAIN_MENU)
    , previousState(GameState::MAIN_MENU)
{
}

void GameStateManager::setState(GameState newState) {
    if (currentState == newState) {
        return;
    }
    
    LOG_INFO("State transition: " + std::to_string(static_cast<int>(currentState)) + 
             " -> " + std::to_string(static_cast<int>(newState)));
    
    previousState = currentState;
    currentState = newState;
}

bool GameStateManager::isInMenu() const {
    return currentState == GameState::MAIN_MENU ||
           currentState == GameState::NEW_GAME ||
           currentState == GameState::LOAD_GAME ||
           currentState == GameState::MOD_BROWSER ||
           currentState == GameState::SETTINGS;
}

void GameStateManager::pushState(GameState state) {
    stateHistory.push_back(currentState);
    
    // Limit history size
    if (stateHistory.size() > MAX_HISTORY) {
        stateHistory.erase(stateHistory.begin());
    }
    
    setState(state);
}

GameState GameStateManager::popState() {
    if (stateHistory.empty()) {
        return currentState;
    }
    
    GameState prevState = stateHistory.back();
    stateHistory.pop_back();
    
    setState(prevState);
    return currentState;
}
