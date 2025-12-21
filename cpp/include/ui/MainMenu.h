#ifndef MAIN_MENU_H
#define MAIN_MENU_H

#include "ui/UIRenderer.h"
#include "game/GameState.h"
#include <memory>
#include <vector>

// Forward declarations
class Engine;

/**
 * Main Menu Screen
 * Displays the main menu and handles navigation
 */
class MainMenu {
public:
    MainMenu(Engine* engine, GameStateManager* stateManager);
    ~MainMenu();
    
    bool initialize();
    void shutdown();
    
    void update(float deltaTime);
    void render(UIRenderer* uiRenderer);
    
    void handleInput();
    void handleMouseMove(float x, float y);
    void handleMouseClick(float x, float y);
    
private:
    Engine* engine;
    GameStateManager* stateManager;
    
    // UI Elements
    std::unique_ptr<UIPanel> backgroundPanel;
    std::unique_ptr<UILabel> titleLabel;
    std::vector<std::unique_ptr<UIButton>> menuButtons;
    
    // Mouse state
    float mouseX, mouseY;
    
    // Setup UI
    void createUI();
    void createMenuButton(const std::string& text, float y, std::function<void()> callback);
    
    // Button callbacks
    void onNewGame();
    void onContinue();
    void onEditor();
    void onModBrowser();
    void onSettings();
    void onExit();
};

#endif // MAIN_MENU_H
