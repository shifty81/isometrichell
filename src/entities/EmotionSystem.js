/**
 * Emotion System - Sims 4-Style Moodlets and Emotional States
 * Integrates with survival needs and city NPC interactions
 * Provides dynamic gameplay through emotional states
 */

class Moodlet {
    constructor(id, name, emotion, strength, duration, description) {
        this.id = id;
        this.name = name;
        this.emotion = emotion; // Which emotion this contributes to
        this.strength = strength; // How much it contributes (1-10)
        this.duration = duration; // Duration in seconds (-1 for permanent)
        this.description = description;
        this.startTime = Date.now();
        this.decayRate = 0; // Optional decay over time
    }
    
    isExpired() {
        if (this.duration === -1) return false;
        return (Date.now() - this.startTime) / 1000 > this.duration;
    }
    
    getCurrentStrength() {
        if (this.decayRate === 0) return this.strength;
        
        const elapsed = (Date.now() - this.startTime) / 1000;
        const decayed = this.strength - (elapsed * this.decayRate);
        return Math.max(0, decayed);
    }
}

class EmotionSystem {
    constructor() {
        // Core emotions
        this.emotions = {
            // Survival-focused
            FEAR: { name: 'Fear', color: '#8B00FF', icon: '😨' },
            HOPE: { name: 'Hope', color: '#FFD700', icon: '😊' },
            CALM: { name: 'Calm', color: '#87CEEB', icon: '😌' },
            ANGRY: { name: 'Angry', color: '#FF0000', icon: '😠' },
            FOCUSED: { name: 'Focused', color: '#4169E1', icon: '🎯' },
            EXHAUSTED: { name: 'Exhausted', color: '#696969', icon: '😴' },
            
            // City/Social-focused
            AFFECTION: { name: 'Affection', color: '#FF69B4', icon: '❤️' },
            LONELINESS: { name: 'Loneliness', color: '#4B0082', icon: '😔' },
            CURIOSITY: { name: 'Curiosity', color: '#32CD32', icon: '🤔' },
            CONTENTMENT: { name: 'Contentment', color: '#90EE90', icon: '😄' },
            JEALOUSY: { name: 'Jealousy', color: '#8B4513', icon: '😒' },
            DISTRUST: { name: 'Distrust', color: '#2F4F4F', icon: '🤨' }
        };
        
        // Active moodlets
        this.moodlets = [];
        
        // Current dominant emotion
        this.currentEmotion = 'CALM';
        this.emotionIntensity = 0;
        
        // Emotion scores (accumulated from moodlets)
        this.emotionScores = {};
        this.resetEmotionScores();
        
        // Moodlet templates
        this.moodletTemplates = this._initializeMoodletTemplates();
    }
    
    resetEmotionScores() {
        for (const emotion in this.emotions) {
            this.emotionScores[emotion] = 0;
        }
    }
    
    _initializeMoodletTemplates() {
        return {
            // Survival-based moodlets
            STARVING: {
                name: 'Starving',
                emotion: 'ANGRY',
                strength: 8,
                duration: -1,
                description: 'Desperately need food'
            },
            WELL_FED: {
                name: 'Well Fed',
                emotion: 'CONTENTMENT',
                strength: 5,
                duration: 3600,
                description: 'Recently ate a good meal'
            },
            DEHYDRATED: {
                name: 'Dehydrated',
                emotion: 'EXHAUSTED',
                strength: 7,
                duration: -1,
                description: 'Critically need water'
            },
            REFRESHED: {
                name: 'Refreshed',
                emotion: 'CALM',
                strength: 4,
                duration: 1800,
                description: 'Just drank clean water'
            },
            EXHAUSTED_SURVIVAL: {
                name: 'Exhausted',
                emotion: 'EXHAUSTED',
                strength: 6,
                duration: -1,
                description: 'Need sleep urgently'
            },
            WELL_RESTED: {
                name: 'Well Rested',
                emotion: 'FOCUSED',
                strength: 6,
                duration: 7200,
                description: 'Got a full night\'s sleep'
            },
            
            // Danger/Fear moodlets
            UNDER_ATTACK: {
                name: 'Under Attack!',
                emotion: 'FEAR',
                strength: 10,
                duration: 300,
                description: 'Being chased or attacked'
            },
            SAFE_SHELTER: {
                name: 'Safe Shelter',
                emotion: 'CALM',
                strength: 5,
                duration: -1,
                description: 'Inside a secure building'
            },
            NEAR_DEATH: {
                name: 'Near Death',
                emotion: 'FEAR',
                strength: 9,
                duration: 600,
                description: 'Almost died recently'
            },
            
            // Environmental moodlets
            BEAUTIFUL_SUNSET: {
                name: 'Beautiful Sunset',
                emotion: 'HOPE',
                strength: 4,
                duration: 600,
                description: 'Witnessed a stunning sunset'
            },
            STORM: {
                name: 'Storm',
                emotion: 'FEAR',
                strength: 3,
                duration: -1,
                description: 'Caught in a storm'
            },
            SUNNY_DAY: {
                name: 'Sunny Day',
                emotion: 'HOPE',
                strength: 3,
                duration: -1,
                description: 'Beautiful weather'
            },
            COLD_NIGHT: {
                name: 'Cold Night',
                emotion: 'EXHAUSTED',
                strength: 4,
                duration: -1,
                description: 'Freezing in the cold'
            },
            
            // Social moodlets
            HELPED_SOMEONE: {
                name: 'Helped Someone',
                emotion: 'CONTENTMENT',
                strength: 6,
                duration: 3600,
                description: 'Feels good to help others'
            },
            FRIEND_INJURED: {
                name: 'Friend Injured',
                emotion: 'LONELINESS',
                strength: 7,
                duration: 7200,
                description: 'A friend is hurt'
            },
            SUCCESSFUL_ROMANCE: {
                name: 'Successful Romance',
                emotion: 'AFFECTION',
                strength: 8,
                duration: 14400,
                description: 'Romance is blooming'
            },
            REJECTED: {
                name: 'Rejected',
                emotion: 'LONELINESS',
                strength: 6,
                duration: 7200,
                description: 'Romance attempt failed'
            },
            ROBBED: {
                name: 'Robbed',
                emotion: 'ANGRY',
                strength: 8,
                duration: 3600,
                description: 'Someone stole from you'
            },
            MADE_NEW_FRIEND: {
                name: 'Made New Friend',
                emotion: 'HOPE',
                strength: 7,
                duration: 10800,
                description: 'Connected with someone new'
            },
            BETRAYED: {
                name: 'Betrayed',
                emotion: 'DISTRUST',
                strength: 9,
                duration: 86400,
                description: 'Someone betrayed your trust'
            },
            
            // Discovery/Achievement moodlets
            FOUND_MEDICINE: {
                name: 'Found Medicine',
                emotion: 'HOPE',
                strength: 7,
                duration: 1800,
                description: 'Found rare medical supplies'
            },
            LEARNED_SKILL: {
                name: 'Learned New Skill',
                emotion: 'FOCUSED',
                strength: 6,
                duration: 7200,
                description: 'Mastered something new'
            },
            DISCOVERED_LOCATION: {
                name: 'Discovered Location',
                emotion: 'CURIOSITY',
                strength: 5,
                duration: 3600,
                description: 'Found a new place'
            }
        };
    }
    
    addMoodlet(templateId, customDuration = null) {
        const template = this.moodletTemplates[templateId];
        if (!template) {
            console.warn(`Unknown moodlet template: ${templateId}`);
            return null;
        }
        
        const duration = customDuration !== null ? customDuration : template.duration;
        const moodlet = new Moodlet(
            `${templateId}_${Date.now()}`,
            template.name,
            template.emotion,
            template.strength,
            duration,
            template.description
        );
        
        this.moodlets.push(moodlet);
        this.updateEmotionState();
        
        return moodlet;
    }
    
    removeMoodlet(moodletId) {
        const index = this.moodlets.findIndex(m => m.id === moodletId);
        if (index !== -1) {
            this.moodlets.splice(index, 1);
            this.updateEmotionState();
        }
    }
    
    update(deltaTime) {
        // Remove expired moodlets
        this.moodlets = this.moodlets.filter(m => !m.isExpired());
        
        // Update emotion state
        this.updateEmotionState();
    }
    
    updateEmotionState() {
        // Reset scores
        this.resetEmotionScores();
        
        // Calculate emotion scores from all active moodlets
        for (const moodlet of this.moodlets) {
            const emotion = moodlet.emotion;
            const strength = moodlet.getCurrentStrength();
            this.emotionScores[emotion] += strength;
        }
        
        // Find dominant emotion
        let maxScore = 0;
        let dominantEmotion = 'CALM';
        
        for (const emotion in this.emotionScores) {
            if (this.emotionScores[emotion] > maxScore) {
                maxScore = this.emotionScores[emotion];
                dominantEmotion = emotion;
            }
        }
        
        this.currentEmotion = dominantEmotion;
        this.emotionIntensity = Math.min(10, maxScore);
    }
    
    getCurrentEmotion() {
        return {
            emotion: this.currentEmotion,
            intensity: this.emotionIntensity,
            info: this.emotions[this.currentEmotion],
            moodlets: this.moodlets.map(m => ({
                name: m.name,
                description: m.description,
                strength: m.getCurrentStrength(),
                timeRemaining: m.duration === -1 ? 'Permanent' : 
                    Math.max(0, m.duration - (Date.now() - m.startTime) / 1000)
            }))
        };
    }
    
    getEmotionalModifiers() {
        /**
         * Get gameplay modifiers based on current emotion
         * Returns multipliers for various stats
         */
        const modifiers = {
            meleeDamage: 1.0,
            rangedAccuracy: 1.0,
            craftingSpeed: 1.0,
            scavengingSuccess: 1.0,
            movementSpeed: 1.0,
            staminaRegen: 1.0,
            charisma: 1.0,
            intimidation: 1.0,
            bartering: 1.0
        };
        
        const emotion = this.currentEmotion;
        const intensity = this.emotionIntensity / 10; // Normalize to 0-1
        
        switch (emotion) {
            case 'ANGRY':
                modifiers.meleeDamage = 1.0 + (0.3 * intensity);
                modifiers.rangedAccuracy = 1.0 - (0.2 * intensity);
                modifiers.intimidation = 1.0 + (0.5 * intensity);
                modifiers.charisma = 1.0 - (0.3 * intensity);
                break;
                
            case 'FOCUSED':
                modifiers.craftingSpeed = 1.0 + (0.4 * intensity);
                modifiers.rangedAccuracy = 1.0 + (0.2 * intensity);
                modifiers.scavengingSuccess = 1.0 + (0.3 * intensity);
                break;
                
            case 'FEAR':
                modifiers.movementSpeed = 1.0 + (0.3 * intensity);
                modifiers.meleeDamage = 1.0 - (0.3 * intensity);
                modifiers.rangedAccuracy = 1.0 - (0.4 * intensity);
                modifiers.staminaRegen = 1.0 - (0.2 * intensity);
                break;
                
            case 'HOPE':
                modifiers.scavengingSuccess = 1.0 + (0.4 * intensity);
                modifiers.charisma = 1.0 + (0.3 * intensity);
                modifiers.staminaRegen = 1.0 + (0.2 * intensity);
                break;
                
            case 'CALM':
                modifiers.rangedAccuracy = 1.0 + (0.2 * intensity);
                modifiers.craftingSpeed = 1.0 + (0.2 * intensity);
                modifiers.staminaRegen = 1.0 + (0.3 * intensity);
                break;
                
            case 'AFFECTION':
                modifiers.charisma = 1.0 + (0.5 * intensity);
                modifiers.bartering = 1.0 + (0.3 * intensity);
                break;
                
            case 'EXHAUSTED':
                modifiers.movementSpeed = 1.0 - (0.3 * intensity);
                modifiers.craftingSpeed = 1.0 - (0.4 * intensity);
                modifiers.meleeDamage = 1.0 - (0.3 * intensity);
                modifiers.staminaRegen = 1.0 - (0.5 * intensity);
                break;
                
            case 'CURIOSITY':
                modifiers.scavengingSuccess = 1.0 + (0.5 * intensity);
                break;
                
            case 'CONTENTMENT':
                modifiers.staminaRegen = 1.0 + (0.3 * intensity);
                modifiers.charisma = 1.0 + (0.2 * intensity);
                break;
        }
        
        return modifiers;
    }
    
    getAvailableInteractions(targetNPC = null) {
        /**
         * Get available emotional interactions based on current emotion
         * Returns list of interaction options
         */
        const interactions = [];
        const emotion = this.currentEmotion;
        const intensity = this.emotionIntensity;
        
        // Base interactions always available
        interactions.push({ id: 'talk', name: 'Talk', emotion: 'neutral' });
        
        // Emotion-specific interactions
        if (emotion === 'AFFECTION' && intensity >= 5) {
            interactions.push({ id: 'flirt', name: 'Flirt', emotion: 'AFFECTION' });
            interactions.push({ id: 'hug', name: 'Hug', emotion: 'AFFECTION' });
            interactions.push({ id: 'gift', name: 'Give Gift', emotion: 'AFFECTION' });
        }
        
        if (emotion === 'HOPE' || emotion === 'CONTENTMENT') {
            interactions.push({ id: 'comfort', name: 'Comfort', emotion: 'HOPE' });
            interactions.push({ id: 'encourage', name: 'Encourage', emotion: 'HOPE' });
        }
        
        if (emotion === 'ANGRY' && intensity >= 6) {
            interactions.push({ id: 'rant', name: 'Rant', emotion: 'ANGRY' });
            interactions.push({ id: 'intimidate', name: 'Intimidate', emotion: 'ANGRY' });
        }
        
        if (emotion === 'LONELINESS') {
            interactions.push({ id: 'share_feelings', name: 'Share Feelings', emotion: 'LONELINESS' });
            interactions.push({ id: 'ask_help', name: 'Ask for Help', emotion: 'LONELINESS' });
        }
        
        if (emotion === 'CURIOUS') {
            interactions.push({ id: 'ask_about', name: 'Ask About...', emotion: 'CURIOSITY' });
            interactions.push({ id: 'investigate', name: 'Investigate', emotion: 'CURIOSITY' });
        }
        
        if (emotion === 'FOCUSED') {
            interactions.push({ id: 'teach', name: 'Teach Skill', emotion: 'FOCUSED' });
            interactions.push({ id: 'collaborate', name: 'Collaborate', emotion: 'FOCUSED' });
        }
        
        return interactions;
    }
}
