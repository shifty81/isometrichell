/**
 * Character Selection UI
 * Handles the character creation screen with live 3D preview
 */
class CharacterSelectionUI {
    constructor(canvas, ctx, assetLoader) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.assetLoader = assetLoader;
        this.customization = new CharacterCustomization();
        this.isActive = false;
        this.onComplete = null; // Callback when character creation is complete
        
        // UI state
        this.currentTab = 'gender'; // 'gender', 'appearance', 'clothing'
        this.selectedOption = null;
        this.mousePos = { x: 0, y: 0 };
        this.isDragging = false;
        this.dragStartX = 0;
        
        // Preview area
        this.previewArea = {
            x: canvas.width * 0.6,
            y: canvas.height * 0.1,
            width: canvas.width * 0.35,
            height: canvas.height * 0.6
        };
        
        // UI layout
        this.layout = {
            tabY: 100,
            tabHeight: 50,
            optionsX: 50,
            optionsY: 200,
            optionHeight: 60,
            buttonY: canvas.height - 100
        };
        
        this._setupEventListeners();
    }

    /**
     * Setup event listeners
     */
    _setupEventListeners() {
        this.canvas.addEventListener('click', (e) => {
            if (!this.isActive) return;
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this._handleClick(x, y);
        });

        this.canvas.addEventListener('mousedown', (e) => {
            if (!this.isActive) return;
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Check if clicking in preview area
            if (this._isInPreviewArea(x, y)) {
                this.isDragging = true;
                this.dragStartX = x;
            }
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.isActive) return;
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.mousePos = { x, y };
            
            // Handle drag to rotate
            if (this.isDragging) {
                const deltaX = x - this.dragStartX;
                this.customization.rotate(deltaX * 0.5);
                this.dragStartX = x;
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
    }

    /**
     * Check if point is in preview area
     */
    _isInPreviewArea(x, y) {
        return x >= this.previewArea.x && x <= this.previewArea.x + this.previewArea.width &&
               y >= this.previewArea.y && y <= this.previewArea.y + this.previewArea.height;
    }

    /**
     * Handle click events
     */
    _handleClick(x, y) {
        // Check tab clicks
        const tabs = ['gender', 'appearance', 'clothing'];
        const tabWidth = 150;
        const tabSpacing = 20;
        
        for (let i = 0; i < tabs.length; i++) {
            const tabX = this.layout.optionsX + i * (tabWidth + tabSpacing);
            if (x >= tabX && x <= tabX + tabWidth &&
                y >= this.layout.tabY && y <= this.layout.tabY + this.layout.tabHeight) {
                this.currentTab = tabs[i];
                return;
            }
        }

        // Check option clicks based on current tab
        this._handleOptionClick(x, y);

        // Check button clicks
        this._handleButtonClick(x, y);
    }

    /**
     * Handle option clicks
     */
    _handleOptionClick(x, y) {
        const optionWidth = 300;
        let currentY = this.layout.optionsY;

        if (this.currentTab === 'gender') {
            // Gender selection
            for (let i = 0; i < this.customization.options.genders.length; i++) {
                if (x >= this.layout.optionsX && x <= this.layout.optionsX + optionWidth &&
                    y >= currentY && y <= currentY + this.layout.optionHeight) {
                    this.customization.setGender(this.customization.options.genders[i]);
                    return;
                }
                currentY += this.layout.optionHeight + 10;
            }
        } else if (this.currentTab === 'appearance') {
            // Skin tone selection
            for (let i = 0; i < this.customization.options.skinTones.length; i++) {
                if (x >= this.layout.optionsX && x <= this.layout.optionsX + optionWidth &&
                    y >= currentY && y <= currentY + this.layout.optionHeight) {
                    this.customization.setSkinTone(i);
                    return;
                }
                currentY += this.layout.optionHeight + 10;
            }
        } else if (this.currentTab === 'clothing') {
            // Clothing selection (simplified)
            const shirts = this.customization.options.shirts;
            for (let i = 0; i < shirts.length; i++) {
                if (x >= this.layout.optionsX && x <= this.layout.optionsX + optionWidth &&
                    y >= currentY && y <= currentY + this.layout.optionHeight) {
                    this.customization.setClothing('shirt', shirts[i].id);
                    return;
                }
                currentY += this.layout.optionHeight + 10;
            }
        }
    }

    /**
     * Handle button clicks
     */
    _handleButtonClick(x, y) {
        const buttonWidth = 150;
        const buttonHeight = 50;
        
        // Randomize button
        const randomizeX = this.layout.optionsX;
        const randomizeY = this.layout.buttonY;
        if (x >= randomizeX && x <= randomizeX + buttonWidth &&
            y >= randomizeY && y <= randomizeY + buttonHeight) {
            this.customization.randomize();
            return;
        }

        // Confirm button
        const confirmX = this.layout.optionsX + buttonWidth + 20;
        const confirmY = this.layout.buttonY;
        if (x >= confirmX && x <= confirmX + buttonWidth &&
            y >= confirmY && y <= confirmY + buttonHeight) {
            this._confirmCharacter();
            return;
        }
    }

    /**
     * Confirm character selection
     */
    _confirmCharacter() {
        this.isActive = false;
        if (this.onComplete) {
            this.onComplete(this.customization.exportCharacter());
        }
    }

    /**
     * Show character selection screen
     */
    show(callback) {
        this.isActive = true;
        this.onComplete = callback;
        this.customization = new CharacterCustomization();
    }

    /**
     * Hide character selection screen
     */
    hide() {
        this.isActive = false;
    }

    /**
     * Render character selection UI
     */
    render() {
        if (!this.isActive) return;

        // Dark background overlay
        this.ctx.fillStyle = 'rgba(20, 20, 20, 0.95)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Title
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Create Your Character', this.canvas.width / 2, 50);

        // Render tabs
        this._renderTabs();

        // Render options based on current tab
        this._renderOptions();

        // Render preview
        this._renderPreview();

        // Render buttons
        this._renderButtons();

        // Instructions
        this.ctx.fillStyle = '#888888';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Drag the preview to rotate your character', this.canvas.width / 2, this.canvas.height - 30);
    }

    /**
     * Render tabs
     */
    _renderTabs() {
        const tabs = [
            { id: 'gender', label: 'Gender' },
            { id: 'appearance', label: 'Appearance' },
            { id: 'clothing', label: 'Clothing' }
        ];
        const tabWidth = 150;
        const tabSpacing = 20;

        for (let i = 0; i < tabs.length; i++) {
            const tab = tabs[i];
            const x = this.layout.optionsX + i * (tabWidth + tabSpacing);
            const y = this.layout.tabY;
            const isActive = this.currentTab === tab.id;

            // Tab background
            this.ctx.fillStyle = isActive ? '#4CAF50' : 'rgba(100, 100, 100, 0.5)';
            this.ctx.fillRect(x, y, tabWidth, this.layout.tabHeight);

            // Tab border
            this.ctx.strokeStyle = isActive ? '#66BB6A' : '#666666';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, y, tabWidth, this.layout.tabHeight);

            // Tab text
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(tab.label, x + tabWidth / 2, y + this.layout.tabHeight / 2 + 6);
        }
    }

    /**
     * Render options based on current tab
     */
    _renderOptions() {
        const optionWidth = 300;
        let currentY = this.layout.optionsY;

        this.ctx.textAlign = 'left';

        if (this.currentTab === 'gender') {
            this._renderGenderOptions(currentY, optionWidth);
        } else if (this.currentTab === 'appearance') {
            this._renderAppearanceOptions(currentY, optionWidth);
        } else if (this.currentTab === 'clothing') {
            this._renderClothingOptions(currentY, optionWidth);
        }
    }

    /**
     * Render gender options
     */
    _renderGenderOptions(startY, width) {
        let y = startY;
        
        for (const gender of this.customization.options.genders) {
            const isSelected = this.customization.appearance.gender === gender;
            
            // Option background
            this.ctx.fillStyle = isSelected ? 'rgba(76, 175, 80, 0.3)' : 'rgba(50, 50, 50, 0.5)';
            this.ctx.fillRect(this.layout.optionsX, y, width, this.layout.optionHeight);

            // Option border
            this.ctx.strokeStyle = isSelected ? '#4CAF50' : '#555555';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(this.layout.optionsX, y, width, this.layout.optionHeight);

            // Option text
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = 'bold 20px Arial';
            this.ctx.fillText(
                gender.charAt(0).toUpperCase() + gender.slice(1),
                this.layout.optionsX + 20,
                y + this.layout.optionHeight / 2 + 7
            );

            y += this.layout.optionHeight + 10;
        }
    }

    /**
     * Render appearance options
     */
    _renderAppearanceOptions(startY, width) {
        let y = startY;
        
        this.ctx.font = 'bold 18px Arial';
        this.ctx.fillStyle = '#CCCCCC';
        this.ctx.fillText('Skin Tone:', this.layout.optionsX, y - 10);
        
        for (let i = 0; i < this.customization.options.skinTones.length; i++) {
            const isSelected = this.customization.appearance.skinTone === i;
            
            // Option background
            this.ctx.fillStyle = isSelected ? 'rgba(76, 175, 80, 0.3)' : 'rgba(50, 50, 50, 0.5)';
            this.ctx.fillRect(this.layout.optionsX, y, width, this.layout.optionHeight);

            // Option border
            this.ctx.strokeStyle = isSelected ? '#4CAF50' : '#555555';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(this.layout.optionsX, y, width, this.layout.optionHeight);

            // Skin tone preview
            this.ctx.fillStyle = this.customization.getSkinToneColor(i);
            this.ctx.fillRect(this.layout.optionsX + 10, y + 10, 40, 40);
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.strokeRect(this.layout.optionsX + 10, y + 10, 40, 40);

            // Option text
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = '16px Arial';
            this.ctx.fillText(
                this.customization.options.skinTones[i],
                this.layout.optionsX + 60,
                y + this.layout.optionHeight / 2 + 5
            );

            y += this.layout.optionHeight + 10;
        }
    }

    /**
     * Render clothing options
     */
    _renderClothingOptions(startY, width) {
        let y = startY;
        
        this.ctx.font = 'bold 18px Arial';
        this.ctx.fillStyle = '#CCCCCC';
        this.ctx.fillText('Shirt:', this.layout.optionsX, y - 10);
        
        const shirts = this.customization.options.shirts;
        for (let i = 0; i < Math.min(shirts.length, 4); i++) {
            const shirt = shirts[i];
            const isSelected = this.customization.appearance.clothing.shirt === shirt.id;
            
            // Option background
            this.ctx.fillStyle = isSelected ? 'rgba(76, 175, 80, 0.3)' : 'rgba(50, 50, 50, 0.5)';
            this.ctx.fillRect(this.layout.optionsX, y, width, this.layout.optionHeight);

            // Option border
            this.ctx.strokeStyle = isSelected ? '#4CAF50' : '#555555';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(this.layout.optionsX, y, width, this.layout.optionHeight);

            // Color preview
            this.ctx.fillStyle = shirt.color;
            this.ctx.fillRect(this.layout.optionsX + 10, y + 10, 40, 40);
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.strokeRect(this.layout.optionsX + 10, y + 10, 40, 40);

            // Option text
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = '16px Arial';
            this.ctx.fillText(shirt.name, this.layout.optionsX + 60, y + this.layout.optionHeight / 2 + 5);

            y += this.layout.optionHeight + 10;
        }
    }

    /**
     * Render character preview
     */
    _renderPreview() {
        const area = this.previewArea;
        
        // Preview background
        this.ctx.fillStyle = 'rgba(40, 40, 40, 0.8)';
        this.ctx.fillRect(area.x, area.y, area.width, area.height);

        // Preview border
        this.ctx.strokeStyle = '#4CAF50';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(area.x, area.y, area.width, area.height);

        // Title
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Preview', area.x + area.width / 2, area.y + 30);

        // Draw simplified character representation
        const centerX = area.x + area.width / 2;
        const centerY = area.y + area.height / 2;
        const scale = 2.0;

        // Character shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY + 80 * scale, 30 * scale, 10 * scale, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Body
        const skinColor = this.customization.getSkinToneColor();
        const shirtColor = this._getClothingColor('shirt');
        
        // Shirt/body
        this.ctx.fillStyle = shirtColor;
        this.ctx.fillRect(centerX - 25 * scale, centerY - 20 * scale, 50 * scale, 60 * scale);

        // Head
        this.ctx.fillStyle = skinColor;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY - 50 * scale, 20 * scale, 0, Math.PI * 2);
        this.ctx.fill();

        // Hair (simplified)
        this.ctx.fillStyle = this.customization.appearance.hairColor;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY - 60 * scale, 22 * scale, 0, Math.PI);
        this.ctx.fill();

        // Rotation indicator
        this.ctx.fillStyle = '#666666';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            `Rotation: ${Math.round(this.customization.rotation)}°`,
            centerX,
            area.y + area.height - 20
        );
    }

    /**
     * Get clothing color by category
     */
    _getClothingColor(category) {
        const itemId = this.customization.appearance.clothing[category];
        if (!itemId) return '#3498db';
        
        const items = this.customization.options[category + 's'] || this.customization.options.shirts;
        const item = items.find(i => i.id === itemId);
        return item ? item.color : '#3498db';
    }

    /**
     * Render buttons
     */
    _renderButtons() {
        const buttonWidth = 150;
        const buttonHeight = 50;

        // Randomize button
        this._renderButton(
            this.layout.optionsX,
            this.layout.buttonY,
            buttonWidth,
            buttonHeight,
            'Randomize',
            '#FF9800'
        );

        // Confirm button
        this._renderButton(
            this.layout.optionsX + buttonWidth + 20,
            this.layout.buttonY,
            buttonWidth,
            buttonHeight,
            'Confirm',
            '#4CAF50'
        );
    }

    /**
     * Render a button
     */
    _renderButton(x, y, width, height, text, color) {
        // Check if mouse is over button
        const isHover = this.mousePos.x >= x && this.mousePos.x <= x + width &&
                       this.mousePos.y >= y && this.mousePos.y <= y + height;

        // Button background with proper alpha
        const alpha = isHover ? '1.0' : '0.8';
        this.ctx.fillStyle = color.startsWith('#') ? 
            this._hexToRgba(color, parseFloat(alpha)) : color;
        this.ctx.fillRect(x, y, width, height);

        // Button border
        this.ctx.strokeStyle = isHover ? '#FFFFFF' : color;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);

        // Button text
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, x + width / 2, y + height / 2 + 6);
    }

    /**
     * Convert hex color to rgba
     */
    _hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
}
