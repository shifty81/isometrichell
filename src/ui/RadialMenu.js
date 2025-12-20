/**
 * Radial Menu System for Emotional Interactions
 * Provides context-sensitive interaction options based on emotions
 */

class RadialMenu {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.isOpen = false;
        this.centerX = 0;
        this.centerY = 0;
        this.radius = 100;
        this.options = [];
        this.selectedIndex = -1;
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetEntity = null;
        
        // Colors
        this.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        this.hoverColor = 'rgba(100, 200, 255, 0.9)';
        this.textColor = '#FFFFFF';
        this.iconSize = 24;
        
        this._setupEventListeners();
    }
    
    _setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isOpen) {
                const rect = this.canvas.getBoundingClientRect();
                this.mouseX = e.clientX - rect.left;
                this.mouseY = e.clientY - rect.top;
                this._updateSelection();
            }
        });
        
        this.canvas.addEventListener('click', (e) => {
            if (this.isOpen && this.selectedIndex !== -1) {
                this._executeOption(this.options[this.selectedIndex]);
                this.close();
            }
        });
        
        // Close on right-click or escape
        this.canvas.addEventListener('contextmenu', (e) => {
            if (this.isOpen) {
                e.preventDefault();
                this.close();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }
    
    open(x, y, options, targetEntity = null) {
        this.isOpen = true;
        this.centerX = x;
        this.centerY = y;
        this.options = options;
        this.targetEntity = targetEntity;
        this.selectedIndex = -1;
        
        // Adjust position if near screen edges
        const padding = 120;
        if (this.centerX < padding) this.centerX = padding;
        if (this.centerX > this.canvas.width - padding) this.centerX = this.canvas.width - padding;
        if (this.centerY < padding) this.centerY = padding;
        if (this.centerY > this.canvas.height - padding) this.centerY = this.canvas.height - padding;
    }
    
    close() {
        this.isOpen = false;
        this.selectedIndex = -1;
        this.targetEntity = null;
    }
    
    _updateSelection() {
        const dx = this.mouseX - this.centerX;
        const dy = this.mouseY - this.centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only select if mouse is within menu radius
        if (distance < 30 || distance > this.radius + 40) {
            this.selectedIndex = -1;
            return;
        }
        
        // Calculate angle
        let angle = Math.atan2(dy, dx);
        if (angle < 0) angle += Math.PI * 2;
        
        // Determine which slice
        const sliceAngle = (Math.PI * 2) / this.options.length;
        const adjustedAngle = angle + sliceAngle / 2;
        this.selectedIndex = Math.floor(adjustedAngle / sliceAngle) % this.options.length;
    }
    
    _executeOption(option) {
        if (option.callback) {
            option.callback(this.targetEntity);
        }
        
        // Dispatch custom event
        const event = new CustomEvent('radialMenuSelect', {
            detail: {
                option: option,
                target: this.targetEntity
            }
        });
        document.dispatchEvent(event);
    }
    
    render() {
        if (!this.isOpen) return;
        
        const numOptions = this.options.length;
        const sliceAngle = (Math.PI * 2) / numOptions;
        
        this.ctx.save();
        
        // Draw center circle
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 30, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw each option slice
        for (let i = 0; i < numOptions; i++) {
            const startAngle = i * sliceAngle - Math.PI / 2;
            const endAngle = startAngle + sliceAngle;
            const midAngle = startAngle + sliceAngle / 2;
            
            const option = this.options[i];
            const isSelected = i === this.selectedIndex;
            
            // Draw slice
            this.ctx.fillStyle = isSelected ? this.hoverColor : this.backgroundColor;
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.arc(this.centerX, this.centerY, this.radius, startAngle, endAngle);
            this.lineTo(this.centerX, this.centerY);
            this.ctx.fill();
            
            // Draw slice outline
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.arc(this.centerX, this.centerY, this.radius, startAngle, endAngle);
            this.ctx.lineTo(this.centerX, this.centerY);
            this.ctx.stroke();
            
            // Calculate text position
            const textDistance = this.radius * 0.65;
            const textX = this.centerX + Math.cos(midAngle) * textDistance;
            const textY = this.centerY + Math.sin(midAngle) * textDistance;
            
            // Draw emotion icon/indicator if present
            if (option.emotion && option.emotion !== 'neutral') {
                const iconDistance = this.radius * 0.4;
                const iconX = this.centerX + Math.cos(midAngle) * iconDistance;
                const iconY = this.centerY + Math.sin(midAngle) * iconDistance;
                
                this.ctx.fillStyle = this._getEmotionColor(option.emotion);
                this.ctx.beginPath();
                this.ctx.arc(iconX, iconY, 8, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            // Draw text
            this.ctx.fillStyle = this.textColor;
            this.ctx.font = isSelected ? 'bold 14px Arial' : '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(option.name, textX, textY);
            
            // Draw keyboard shortcut if available
            if (option.shortcut && isSelected) {
                this.ctx.font = '10px Arial';
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                this.ctx.fillText(`[${option.shortcut}]`, textX, textY + 15);
            }
        }
        
        // Draw center "Cancel" text
        this.ctx.fillStyle = this.textColor;
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('Cancel', this.centerX, this.centerY);
        
        this.ctx.restore();
    }
    
    _getEmotionColor(emotion) {
        const colors = {
            'FEAR': '#8B00FF',
            'HOPE': '#FFD700',
            'CALM': '#87CEEB',
            'ANGRY': '#FF0000',
            'FOCUSED': '#4169E1',
            'EXHAUSTED': '#696969',
            'AFFECTION': '#FF69B4',
            'LONELINESS': '#4B0082',
            'CURIOSITY': '#32CD32',
            'CONTENTMENT': '#90EE90',
            'JEALOUSY': '#8B4513',
            'DISTRUST': '#2F4F4F'
        };
        return colors[emotion] || '#FFFFFF';
    }
}

/**
 * Emotional Interaction Manager
 * Handles interactions between entities based on emotional states
 */
class EmotionalInteractionManager {
    constructor(emotionSystem, radialMenu) {
        this.emotionSystem = emotionSystem;
        this.radialMenu = radialMenu;
        this.interactions = this._initializeInteractions();
    }
    
    _initializeInteractions() {
        return {
            // Social interactions
            'talk': {
                name: 'Talk',
                emotion: 'neutral',
                execute: (target) => {
                    console.log('Talking to', target);
                    // Chance to add moodlet based on conversation
                    if (Math.random() > 0.7) {
                        this.emotionSystem.addMoodlet('MADE_NEW_FRIEND', 3600);
                    }
                }
            },
            'flirt': {
                name: 'Flirt',
                emotion: 'AFFECTION',
                requiresEmotion: 'AFFECTION',
                minIntensity: 5,
                execute: (target) => {
                    console.log('Flirting with', target);
                    // Success/failure based on relationship and emotion
                    if (Math.random() > 0.5) {
                        this.emotionSystem.addMoodlet('SUCCESSFUL_ROMANCE', 14400);
                    } else {
                        this.emotionSystem.addMoodlet('REJECTED', 7200);
                    }
                }
            },
            'comfort': {
                name: 'Comfort',
                emotion: 'HOPE',
                execute: (target) => {
                    console.log('Comforting', target);
                    this.emotionSystem.addMoodlet('HELPED_SOMEONE', 3600);
                    // Target also receives comfort moodlet
                }
            },
            'rant': {
                name: 'Rant',
                emotion: 'ANGRY',
                requiresEmotion: 'ANGRY',
                minIntensity: 6,
                execute: (target) => {
                    console.log('Ranting at', target);
                    // Slightly reduces anger
                }
            },
            'share_feelings': {
                name: 'Share Feelings',
                emotion: 'LONELINESS',
                execute: (target) => {
                    console.log('Sharing feelings with', target);
                    // Reduces loneliness
                }
            },
            'hug': {
                name: 'Hug',
                emotion: 'AFFECTION',
                execute: (target) => {
                    console.log('Hugging', target);
                    this.emotionSystem.addMoodlet('HELPED_SOMEONE', 1800);
                }
            },
            'gift': {
                name: 'Give Gift',
                emotion: 'AFFECTION',
                execute: (target) => {
                    console.log('Giving gift to', target);
                    // Improves relationship significantly
                }
            },
            'intimidate': {
                name: 'Intimidate',
                emotion: 'ANGRY',
                execute: (target) => {
                    console.log('Intimidating', target);
                    // Success based on intimidation modifier
                }
            }
        };
    }
    
    showInteractionMenu(x, y, targetEntity, player) {
        // Get available interactions based on player's emotion
        const availableInteractions = this.emotionSystem.getAvailableInteractions(targetEntity);
        
        // Convert to radial menu options
        const menuOptions = availableInteractions.map(interaction => {
            const interactionData = this.interactions[interaction.id];
            return {
                id: interaction.id,
                name: interaction.name,
                emotion: interaction.emotion,
                callback: (target) => {
                    if (interactionData && interactionData.execute) {
                        interactionData.execute(target);
                    }
                }
            };
        });
        
        this.radialMenu.open(x, y, menuOptions, targetEntity);
    }
}
