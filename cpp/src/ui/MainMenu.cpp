#include "ui/MainMenu.h"
#include "engine/Engine.h"
#include "engine/Input.h"
#include "utils/Logger.h"

MainMenu::MainMenu(Engine* engine, GameStateManager* stateManager)
    : engine(engine)
    , stateManager(stateManager)
    , mouseX(0)
    , mouseY(0)
{
}

MainMenu::~MainMenu() {
    shutdown();
}

bool MainMenu::initialize() {
    LOG_INFO("Initializing Main Menu");
    
    createUI();
    
    LOG_INFO("Main Menu initialized");
    return true;
}

void MainMenu::shutdown() {
    menuButtons.clear();
    backgroundPanel.reset();
    titleLabel.reset();
}

void MainMenu::createUI() {
    int screenWidth = engine->getWidth();
    int screenHeight = engine->getHeight();
    
    // Create semi-transparent background panel
    backgroundPanel = std::make_unique<UIPanel>(0, 0, screenWidth, screenHeight);
    backgroundPanel->setColor(glm::vec4(0.05f, 0.05f, 0.1f, 0.95f));
    
    // Create title label
    float titleX = static_cast<float>(screenWidth / 2 - 200);
    float titleY = 100.0f;
    titleLabel = std::make_unique<UILabel>(titleX, titleY, "THE DAILY GRIND");
    titleLabel->setScale(2.0f);
    titleLabel->setColor(glm::vec3(1.0f, 0.9f, 0.7f));
    
    // Create menu buttons
    float buttonWidth = 300;
    float startY = 250;
    float spacing = 70;
    float centerX = screenWidth / 2 - buttonWidth / 2;
    
    createMenuButton("New Game", centerX, startY + spacing * 0, [this]() { onNewGame(); });
    createMenuButton("Continue", centerX, startY + spacing * 1, [this]() { onContinue(); });
    createMenuButton("Editor", centerX, startY + spacing * 2, [this]() { onEditor(); });
    createMenuButton("Mod Browser", centerX, startY + spacing * 3, [this]() { onModBrowser(); });
    createMenuButton("Settings", centerX, startY + spacing * 4, [this]() { onSettings(); });
    createMenuButton("Exit", centerX, startY + spacing * 5, [this]() { onExit(); });
}

void MainMenu::createMenuButton(const std::string& text, float x, float y, std::function<void()> callback) {
    auto button = std::make_unique<UIButton>(x, y, 300, 50, text);
    button->setColor(glm::vec3(0.2f, 0.3f, 0.4f));
    button->setHoverColor(glm::vec3(0.3f, 0.5f, 0.6f));
    button->setTextColor(glm::vec3(1.0f, 1.0f, 1.0f));
    button->onClick(callback);
    menuButtons.push_back(std::move(button));
}

void MainMenu::update(float deltaTime) {
    (void)deltaTime; // Unused for now
    // Update button hover states
    for (auto& button : menuButtons) {
        bool wasHovered = button->isHovered();
        bool isHovered = button->contains(mouseX, mouseY);
        button->setHovered(isHovered);
        
        // Log hover state changes
        if (isHovered && !wasHovered) {
            LOG_DEBUG("Button hovered: " + button->getText());
        }
    }
}

void MainMenu::render(UIRenderer* uiRenderer) {
    if (!uiRenderer) return;
    
    uiRenderer->beginFrame();
    
    // Render background
    if (backgroundPanel) {
        auto color = backgroundPanel->getColor();
        auto pos = backgroundPanel->getPosition();
        auto size = backgroundPanel->getSize();
        uiRenderer->drawRect(pos.x, pos.y, size.x, size.y, color);
    }
    
    // Render title
    if (titleLabel) {
        auto pos = titleLabel->getPosition();
        auto color = titleLabel->getColor();
        uiRenderer->drawText(titleLabel->getText(), pos.x, pos.y, 2.0f, color);
    }
    
    // Render buttons
    for (const auto& button : menuButtons) {
        if (!button->isVisible()) continue;
        
        auto pos = button->getPosition();
        auto size = button->getSize();
        
        // Draw button background
        glm::vec3 bgColor = button->isHovered() ? 
            glm::vec3(0.3f, 0.5f, 0.6f) : glm::vec3(0.2f, 0.3f, 0.4f);
        uiRenderer->drawRect(pos.x, pos.y, size.x, size.y, glm::vec4(bgColor, 1.0f));
        
        // Draw button border
        glm::vec4 borderColor = button->isHovered() ? 
            glm::vec4(0.6f, 0.8f, 0.9f, 1.0f) : glm::vec4(0.4f, 0.5f, 0.6f, 1.0f);
        uiRenderer->drawRectOutline(pos.x, pos.y, size.x, size.y, borderColor, 2.0f);
        
        // Draw button text (centered)
        float textX = pos.x + 20;
        float textY = pos.y + 15;
        uiRenderer->drawText(button->getText(), textX, textY, 1.0f, glm::vec3(1.0f));
    }
    
    uiRenderer->endFrame();
}

void MainMenu::handleInput() {
    // Input is handled via mouse callbacks
}

void MainMenu::handleMouseMove(float x, float y) {
    mouseX = x;
    mouseY = y;
}

void MainMenu::handleMouseClick(float x, float y) {
    // Check if any button was clicked
    for (auto& button : menuButtons) {
        if (button->isVisible() && button->isEnabled() && button->contains(x, y)) {
            LOG_INFO("Button clicked: " + button->getText());
            button->handleClick();
            break;
        }
    }
}

// Button callbacks

void MainMenu::onNewGame() {
    LOG_INFO("New Game clicked");
    stateManager->setState(GameState::NEW_GAME);
    // TODO: Implement new game setup screen
}

void MainMenu::onContinue() {
    LOG_INFO("Continue clicked");
    stateManager->setState(GameState::LOAD_GAME);
    // TODO: Implement save game selection screen
}

void MainMenu::onEditor() {
    LOG_INFO("Editor clicked");
    stateManager->setState(GameState::EDITOR);
    // TODO: Implement in-game editor
}

void MainMenu::onModBrowser() {
    LOG_INFO("Mod Browser clicked");
    stateManager->setState(GameState::MOD_BROWSER);
    // TODO: Implement mod browser
}

void MainMenu::onSettings() {
    LOG_INFO("Settings clicked");
    stateManager->setState(GameState::SETTINGS);
    // TODO: Implement settings screen
}

void MainMenu::onExit() {
    LOG_INFO("Exit clicked");
    stateManager->setState(GameState::EXITING);
}
