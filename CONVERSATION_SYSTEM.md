# Conversation System Design (Sims-like)

## Overview
A dynamic conversation system inspired by The Sims 4, featuring isometric character portraits, emotional expressions, dialogue choices, and social interaction mechanics.

## Core Components

### 1. Portrait System

#### Portrait Manager
```javascript
class PortraitManager {
    constructor(assetLoader) {
        this.portraits = new Map(); // Character ID -> Portrait data
        this.expressions = ['neutral', 'happy', 'sad', 'angry', 'surprised', 'thinking', 'flirty', 'mean'];
    }
    
    loadCharacterPortrait(characterId, portraitSheet) {
        // Load portrait with multiple expressions
        // Each expression is a frame in the sprite sheet
    }
    
    getPortrait(characterId, expression) {
        // Return the appropriate portrait frame
    }
}
```

#### Portrait Specifications
- **Style**: Isometric 2:1 ratio to match game aesthetic
- **Size**: 128x64 or 256x128 pixels per portrait
- **Expressions**: 8 base emotions minimum
  - Neutral (default)
  - Happy (positive interactions)
  - Sad (negative mood, rejection)
  - Angry (conflict, argument)
  - Surprised (unexpected events)
  - Thinking (decision making)
  - Flirty (romantic interactions)
  - Mean (hostile actions)

#### Implementation with Current Assets
```javascript
// Use knight sprites as placeholder portraits
// Extract head region from character sprites
// Scale to portrait size (128x64)

async loadPortraits() {
    const characterSprites = [
        { id: 'player', path: 'assets/knight.png' },
        { id: 'npc1', path: 'assets/knight5.png' }
    ];
    
    for (const char of characterSprites) {
        const image = await this.loadImage(char.path);
        // Extract top portion for portrait
        this.createPortraitFromSprite(char.id, image);
    }
}
```

### 2. Conversation UI

#### UI Layout
```
+----------------------------------------------------------+
|                    [Game World View]                      |
|                                                          |
|                    [Isometric Scene]                      |
|                                                          |
+----------------------------------------------------------+
|  Conversation UI (Bottom 200px)                          |
|  +---------------------------------------------------+   |
|  | [Portrait] | Text: "Hello! How are you today?"  |   |
|  | [NPC Name] | [Typing effect animation]          |   |
|  +---------------------------------------------------+   |
|  | [Relationship Bar] [Mood Indicators]              |   |
|  +---------------------------------------------------+   |
|  | Choice 1: "Friendly Chat" [+Friendship]           |   |
|  | Choice 2: "Ask About Work" [+Interest]            |   |
|  | Choice 3: "Flirt" [+Romance] 💗                  |   |
|  | Choice 4: "Be Rude" [-Friendship] ⚠️             |   |
|  +---------------------------------------------------+   |
+----------------------------------------------------------+
```

#### Conversation UI Class
```javascript
class ConversationUI {
    constructor(canvasWidth, canvasHeight) {
        this.visible = false;
        this.x = 0;
        this.y = canvasHeight - 220; // Bottom of screen
        this.width = canvasWidth;
        this.height = 220;
        
        this.currentText = '';
        this.displayedText = '';
        this.typeSpeed = 0.05; // Seconds per character
        this.choices = [];
        
        this.speaker = null;
        this.speakerPortrait = null;
        this.speakerExpression = 'neutral';
    }
    
    show(speaker, text, choices) {
        this.visible = true;
        this.speaker = speaker;
        this.currentText = text;
        this.displayedText = '';
        this.choices = choices;
        this.startTyping();
    }
    
    hide() {
        this.visible = false;
    }
    
    update(deltaTime) {
        if (this.visible && this.displayedText.length < this.currentText.length) {
            this.updateTyping(deltaTime);
        }
    }
    
    render(renderer, portraitManager) {
        if (!this.visible) return;
        
        // Draw semi-transparent background
        renderer.fillRect(
            this.x, this.y, this.width, this.height,
            'rgba(0, 0, 0, 0.85)'
        );
        
        // Draw portrait
        const portrait = portraitManager.getPortrait(
            this.speaker.id,
            this.speakerExpression
        );
        if (portrait) {
            renderer.drawImage(portrait, this.x + 20, this.y + 20, 128, 64);
        }
        
        // Draw speaker name
        renderer.fillText(
            this.speaker.name,
            this.x + 160,
            this.y + 25,
            '16px Arial',
            '#ffffff'
        );
        
        // Draw dialogue text with typing effect
        renderer.fillText(
            this.displayedText,
            this.x + 160,
            this.y + 50,
            '14px Arial',
            '#ffffff',
            this.width - 180
        );
        
        // Draw relationship indicators
        this.renderRelationshipBar(renderer);
        
        // Draw choices if text is fully displayed
        if (this.displayedText.length === this.currentText.length) {
            this.renderChoices(renderer);
        }
    }
    
    updateTyping(deltaTime) {
        // Typing effect implementation
        this.typeTimer += deltaTime;
        if (this.typeTimer >= this.typeSpeed) {
            this.typeTimer = 0;
            if (this.displayedText.length < this.currentText.length) {
                this.displayedText += this.currentText[this.displayedText.length];
                // Play typing sound
                audioManager.playSfx('text_type', 0.3);
            }
        }
    }
    
    renderChoices(renderer) {
        const choiceY = this.y + 120;
        const choiceHeight = 30;
        
        for (let i = 0; i < this.choices.length; i++) {
            const choice = this.choices[i];
            const y = choiceY + (i * (choiceHeight + 5));
            
            // Draw choice button
            renderer.fillRect(
                this.x + 20,
                y,
                this.width - 40,
                choiceHeight,
                'rgba(50, 50, 50, 0.8)'
            );
            
            // Draw choice text
            renderer.fillText(
                choice.text,
                this.x + 30,
                y + 20,
                '14px Arial',
                '#ffffff'
            );
            
            // Draw effect indicator
            if (choice.effect) {
                const effectText = this.formatEffect(choice.effect);
                renderer.fillText(
                    effectText,
                    this.x + this.width - 150,
                    y + 20,
                    '12px Arial',
                    this.getEffectColor(choice.effect)
                );
            }
        }
    }
}
```

### 3. Dialogue System

#### Dialogue Tree Structure
```javascript
// Dialogue node structure
{
    id: 'greeting_1',
    speaker: 'npc',
    text: 'Hello! How are you today?',
    expression: 'happy',
    choices: [
        {
            text: 'Friendly Chat',
            nextNode: 'friendly_2',
            requirements: null,
            effects: {
                friendship: +5,
                mood: +2
            }
        },
        {
            text: 'Ask About Work',
            nextNode: 'work_2',
            requirements: { curiosity: 3 },
            effects: {
                friendship: +2,
                interest: +3
            }
        },
        {
            text: 'Flirt',
            nextNode: 'flirt_2',
            requirements: { romance: 5, charisma: 3 },
            effects: {
                romance: +5,
                friendship: +1
            }
        },
        {
            text: 'Be Rude',
            nextNode: 'rude_2',
            requirements: null,
            effects: {
                friendship: -10,
                mood: -5
            },
            warning: true
        }
    ]
}
```

#### Dialogue Manager
```javascript
class DialogueManager {
    constructor() {
        this.dialogueTrees = new Map();
        this.currentConversation = null;
        this.currentNode = null;
    }
    
    loadDialogueTree(treeId, treeData) {
        this.dialogueTrees.set(treeId, treeData);
    }
    
    startConversation(npc, player, startNodeId) {
        const tree = this.dialogueTrees.get(npc.dialogueTreeId);
        if (!tree) return false;
        
        this.currentConversation = {
            npc: npc,
            player: player,
            tree: tree
        };
        
        this.setNode(startNodeId || tree.startNode);
        return true;
    }
    
    setNode(nodeId) {
        const node = this.currentConversation.tree.nodes[nodeId];
        if (!node) return false;
        
        this.currentNode = node;
        
        // Filter choices based on requirements
        const validChoices = this.filterChoices(
            node.choices,
            this.currentConversation.player
        );
        
        // Show in UI
        conversationUI.show(
            this.currentConversation.npc,
            node.text,
            validChoices
        );
        
        return true;
    }
    
    filterChoices(choices, player) {
        return choices.filter(choice => {
            if (!choice.requirements) return true;
            
            for (const [skill, level] of Object.entries(choice.requirements)) {
                if (player.skills[skill] < level) {
                    return false;
                }
            }
            return true;
        });
    }
    
    selectChoice(choiceIndex) {
        if (!this.currentNode) return;
        
        const choice = this.currentNode.choices[choiceIndex];
        if (!choice) return;
        
        // Apply effects
        this.applyChoiceEffects(choice.effects);
        
        // Move to next node
        if (choice.nextNode) {
            this.setNode(choice.nextNode);
        } else {
            this.endConversation();
        }
    }
    
    applyChoiceEffects(effects) {
        const { npc, player } = this.currentConversation;
        
        for (const [attribute, change] of Object.entries(effects)) {
            // Update relationship
            if (attribute === 'friendship' || attribute === 'romance') {
                npc.relationships[player.id][attribute] += change;
            }
            // Update player stats
            else {
                player.stats[attribute] += change;
            }
        }
    }
    
    endConversation() {
        conversationUI.hide();
        this.currentConversation = null;
        this.currentNode = null;
    }
}
```

### 4. Social Interaction Mechanics

#### Conversation Topics
```javascript
class ConversationTopic {
    static TOPICS = {
        SMALL_TALK: {
            name: 'Small Talk',
            friendshipGain: 2,
            skillRequirement: null,
            duration: 30 // seconds
        },
        DEEP_CONVERSATION: {
            name: 'Deep Conversation',
            friendshipGain: 5,
            skillRequirement: { charisma: 3 },
            duration: 60
        },
        TELL_JOKE: {
            name: 'Tell Joke',
            friendshipGain: 3,
            moodGain: 2,
            skillRequirement: { humor: 2 },
            duration: 20
        },
        GOSSIP: {
            name: 'Gossip',
            friendshipGain: 4,
            friendshipLoss: -2, // With gossiped person
            skillRequirement: { charisma: 2 },
            duration: 45
        },
        FLIRT: {
            name: 'Flirt',
            romanceGain: 5,
            skillRequirement: { charisma: 3, attractiveness: 2 },
            requiresRelationship: 10, // Minimum friendship
            duration: 40
        },
        ARGUE: {
            name: 'Argue',
            friendshipLoss: -10,
            skillRequirement: null,
            duration: 30
        },
        COMPLIMENT: {
            name: 'Compliment',
            friendshipGain: 3,
            confidenceGain: 2,
            duration: 15
        },
        ASK_ABOUT_DAY: {
            name: 'Ask About Day',
            friendshipGain: 1,
            interestGain: 2,
            duration: 20
        }
    };
}
```

#### Dynamic Choice Generation
```javascript
class DynamicChoiceGenerator {
    generateChoices(npc, player, context) {
        const choices = [];
        
        // Always available choices
        choices.push({
            text: 'Small Talk',
            topic: ConversationTopic.TOPICS.SMALL_TALK,
            probability: 1.0
        });
        
        choices.push({
            text: 'Compliment',
            topic: ConversationTopic.TOPICS.COMPLIMENT,
            probability: 1.0
        });
        
        // Relationship-dependent choices
        const relationship = npc.relationships[player.id];
        
        if (relationship.friendship > 20) {
            choices.push({
                text: 'Deep Conversation',
                topic: ConversationTopic.TOPICS.DEEP_CONVERSATION,
                probability: 1.0
            });
        }
        
        if (relationship.friendship > 30 && relationship.romance > 10) {
            choices.push({
                text: 'Flirt',
                topic: ConversationTopic.TOPICS.FLIRT,
                probability: 0.8
            });
        }
        
        // Skill-dependent choices
        if (player.skills.humor >= 2) {
            choices.push({
                text: 'Tell Joke',
                topic: ConversationTopic.TOPICS.TELL_JOKE,
                probability: 0.9
            });
        }
        
        // Mood-dependent choices
        if (player.mood < 0) {
            choices.push({
                text: 'Be Rude',
                topic: ConversationTopic.TOPICS.ARGUE,
                probability: 0.6
            });
        }
        
        // Random element (Sims-style)
        return this.randomizeChoices(choices, 4); // Show 4 random choices
    }
    
    randomizeChoices(choices, maxChoices) {
        // Filter by probability
        const availableChoices = choices.filter(choice => 
            Math.random() < choice.probability
        );
        
        // Shuffle and take max choices
        return this.shuffle(availableChoices).slice(0, maxChoices);
    }
}
```

### 5. Relationship System Integration

#### Relationship Data
```javascript
class Relationship {
    constructor(characterA, characterB) {
        this.characterA = characterA;
        this.characterB = characterB;
        
        // Relationship values (-100 to +100)
        this.friendship = 0;
        this.romance = 0;
        this.respect = 0;
        this.trust = 0;
        
        // Interaction history
        this.lastInteraction = null;
        this.interactionCount = 0;
        this.conversationTopics = [];
        
        // Relationship status
        this.status = 'stranger'; // stranger, acquaintance, friend, close_friend, romantic_interest, partner, enemy
    }
    
    updateStatus() {
        if (this.friendship < -30) {
            this.status = 'enemy';
        } else if (this.romance > 50 && this.friendship > 40) {
            this.status = 'partner';
        } else if (this.romance > 30 && this.friendship > 30) {
            this.status = 'romantic_interest';
        } else if (this.friendship > 50) {
            this.status = 'close_friend';
        } else if (this.friendship > 20) {
            this.status = 'friend';
        } else if (this.friendship > 5) {
            this.status = 'acquaintance';
        } else {
            this.status = 'stranger';
        }
    }
    
    decay(deltaTime) {
        // Relationships decay over time without interaction
        const daysSinceLastInteraction = (Date.now() - this.lastInteraction) / (1000 * 60 * 60 * 24);
        
        if (daysSinceLastInteraction > 1) {
            this.friendship = Math.max(-100, this.friendship - 0.5 * deltaTime);
            this.romance = Math.max(0, this.romance - 0.7 * deltaTime);
        }
    }
}
```

### 6. Implementation Plan

#### Phase 1: Basic Conversation UI
1. Create ConversationUI class
2. Add portrait rendering
3. Implement typing effect
4. Add choice buttons with click handlers

#### Phase 2: Dialogue System
1. Create DialogueManager
2. Implement dialogue tree structure
3. Add dialogue data format (JSON)
4. Create sample conversations

#### Phase 3: Dynamic Choices
1. Implement DynamicChoiceGenerator
2. Add skill/relationship requirements
3. Implement probability-based selection
4. Add context-aware choices

#### Phase 4: Portrait System
1. Extract portraits from character sprites
2. Create expression variations
3. Implement PortraitManager
4. Add expression changes during conversation

#### Phase 5: Relationship Integration
1. Connect conversation to relationship system
2. Implement relationship effects
3. Add relationship UI indicators
4. Create relationship progression

#### Phase 6: Polish
1. Add animations
2. Implement sound effects
3. Add visual feedback
4. Create comprehensive dialogue database

### 7. Data Format

#### Dialogue Data (JSON)
```json
{
  "dialogueTrees": {
    "npc_greeting": {
      "startNode": "greeting_1",
      "nodes": {
        "greeting_1": {
          "speaker": "npc",
          "text": "Hello! Nice to meet you!",
          "expression": "happy",
          "choices": [
            {
              "text": "Hello! Nice to meet you too!",
              "nextNode": "greeting_2",
              "effects": {
                "friendship": 5
              }
            },
            {
              "text": "Hi.",
              "nextNode": "greeting_neutral",
              "effects": {
                "friendship": 1
              }
            },
            {
              "text": "Whatever.",
              "nextNode": "greeting_rude",
              "effects": {
                "friendship": -5
              }
            }
          ]
        }
      }
    }
  }
}
```

## Integration with Current Assets

### Character Portraits
Use existing character sprites:
- `assets/knight.png` - Player portrait
- `assets/knight5.png` - NPC portrait
- `assets/Charachters/Player/*` - Animation frames can be used for portrait expressions
- `assets/Charachters/Thug/*` - Enemy/hostile NPC portraits

### Audio
- `assets/MusicAndSFX/badadadink.ogg` - Positive choice sound
- `assets/MusicAndSFX/womp.ogg` - Negative choice sound
- `assets/MusicAndSFX/whamp.ogg` - Dialogue advance sound

## Testing Plan

1. **Unit Tests**
   - DialogueManager node navigation
   - Choice filtering
   - Effect application

2. **Integration Tests**
   - ConversationUI rendering
   - Relationship updates
   - Dynamic choice generation

3. **User Tests**
   - Conversation flow
   - Choice clarity
   - Emotional feedback

## Success Criteria

✅ Conversations feel natural and engaging
✅ Choices have meaningful consequences
✅ Portraits reflect emotional state
✅ Relationship system responds to interactions
✅ UI is intuitive and doesn't obstruct gameplay
✅ Performance remains smooth during conversations

## Next Steps

1. Complete Phase 1 asset integration
2. Develop player character system (Phase 2)
3. Implement basic NPC system (Phase 7)
4. Build conversation system (Phase 8)
5. Create dialogue content library
