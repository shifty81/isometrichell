/**
 * SurvivalAttributes Class
 * Manages character survival needs (hunger, thirst, energy, health, hygiene, temperature)
 */
class SurvivalAttributes {
    constructor() {
        // Attribute values (0-100)
        this.hunger = 100;      // Decreases over time, restored by eating
        this.thirst = 100;      // Decreases faster than hunger, restored by drinking
        this.energy = 100;      // Decreases with activity, restored by sleeping
        this.health = 100;      // Affected by injuries, illness, starvation
        this.hygiene = 100;     // Affects social interactions and health
        this.temperature = 37;  // Body temperature in Celsius (normal: 36-38)
        
        // Decay rates (per game hour)
        this.hungerDecayRate = 2.0;
        this.thirstDecayRate = 3.5;
        this.energyDecayRate = 1.5;
        this.hygieneDecayRate = 0.8;
        
        // Activity multipliers
        this.activityMultiplier = 1.0; // Increases with movement/work
        
        // Status effects
        this.statusEffects = new Set();
        
        // Thresholds for warnings
        this.thresholds = {
            critical: 20,
            warning: 40,
            good: 70
        };
    }
    
    /**
     * Update all attributes (called with game time delta)
     */
    update(deltaTime, timeSystem = null) {
        if (!timeSystem) return;
        
        // Convert real-time delta to game hours
        const gameHoursPassed = (deltaTime * timeSystem.timeScale) / 3600;
        
        // Apply decay to attributes
        this.hunger = Math.max(0, this.hunger - (this.hungerDecayRate * gameHoursPassed * this.activityMultiplier));
        this.thirst = Math.max(0, this.thirst - (this.thirstDecayRate * gameHoursPassed * this.activityMultiplier));
        this.energy = Math.max(0, this.energy - (this.energyDecayRate * gameHoursPassed * this.activityMultiplier));
        this.hygiene = Math.max(0, this.hygiene - (this.hygieneDecayRate * gameHoursPassed));
        
        // Health effects from other attributes
        this.updateHealthEffects(gameHoursPassed);
        
        // Temperature regulation
        this.updateTemperature(gameHoursPassed, timeSystem);
        
        // Update status effects
        this.updateStatusEffects();
        
        // Reset activity multiplier
        this.activityMultiplier = 1.0;
    }
    
    /**
     * Update health based on other attributes
     */
    updateHealthEffects(gameHoursPassed) {
        // Starvation damage
        if (this.hunger <= 0) {
            this.health = Math.max(0, this.health - (5 * gameHoursPassed));
        } else if (this.hunger < 20) {
            this.health = Math.max(0, this.health - (1 * gameHoursPassed));
        }
        
        // Dehydration damage (more severe)
        if (this.thirst <= 0) {
            this.health = Math.max(0, this.health - (10 * gameHoursPassed));
        } else if (this.thirst < 20) {
            this.health = Math.max(0, this.health - (2 * gameHoursPassed));
        }
        
        // Exhaustion effects
        if (this.energy <= 0) {
            this.health = Math.max(0, this.health - (0.5 * gameHoursPassed));
        }
        
        // Poor hygiene can affect health over time
        if (this.hygiene < 30) {
            this.health = Math.max(0, this.health - (0.2 * gameHoursPassed));
        }
        
        // Natural healing when all needs are met
        if (this.hunger > 70 && this.thirst > 70 && this.energy > 70 && this.health < 100) {
            this.health = Math.min(100, this.health + (2 * gameHoursPassed));
        }
    }
    
    /**
     * Update body temperature based on environment and time
     */
    updateTemperature(gameHoursPassed, timeSystem) {
        const targetTemp = 37; // Normal body temperature
        const period = timeSystem.getPeriod();
        
        // Environmental temperature influence
        let envTemp = 20; // Default comfortable temp
        if (period === 'night' || period === 'dawn') {
            envTemp = 15; // Colder at night
        } else if (period === 'afternoon') {
            envTemp = 25; // Warmer in afternoon
        }
        
        // Gradually adjust body temperature toward normal
        const tempDiff = targetTemp - this.temperature;
        this.temperature += tempDiff * 0.1 * gameHoursPassed;
        
        // Keep temperature in realistic bounds
        this.temperature = Math.max(35, Math.min(40, this.temperature));
        
        // Hypothermia effects
        if (this.temperature < 36) {
            this.energy = Math.max(0, this.energy - (2 * gameHoursPassed));
        }
        
        // Hyperthermia effects
        if (this.temperature > 38.5) {
            this.thirst = Math.max(0, this.thirst - (1 * gameHoursPassed));
        }
    }
    
    /**
     * Update status effects based on current attributes
     */
    updateStatusEffects() {
        this.statusEffects.clear();
        
        // Hunger status
        if (this.hunger <= 0) {
            this.statusEffects.add('starving');
        } else if (this.hunger < 20) {
            this.statusEffects.add('very_hungry');
        } else if (this.hunger < 40) {
            this.statusEffects.add('hungry');
        }
        
        // Thirst status
        if (this.thirst <= 0) {
            this.statusEffects.add('dehydrated');
        } else if (this.thirst < 20) {
            this.statusEffects.add('very_thirsty');
        } else if (this.thirst < 40) {
            this.statusEffects.add('thirsty');
        }
        
        // Energy status
        if (this.energy <= 0) {
            this.statusEffects.add('exhausted');
        } else if (this.energy < 20) {
            this.statusEffects.add('very_tired');
        } else if (this.energy < 40) {
            this.statusEffects.add('tired');
        }
        
        // Health status
        if (this.health < 20) {
            this.statusEffects.add('critical_health');
        } else if (this.health < 40) {
            this.statusEffects.add('injured');
        }
        
        // Hygiene status
        if (this.hygiene < 20) {
            this.statusEffects.add('filthy');
        } else if (this.hygiene < 40) {
            this.statusEffects.add('dirty');
        }
        
        // Temperature status
        if (this.temperature < 36) {
            this.statusEffects.add('cold');
        } else if (this.temperature > 38.5) {
            this.statusEffects.add('hot');
        }
    }
    
    /**
     * Eat food to restore hunger
     */
    eat(amount) {
        this.hunger = Math.min(100, this.hunger + amount);
    }
    
    /**
     * Drink to restore thirst
     */
    drink(amount) {
        this.thirst = Math.min(100, this.thirst + amount);
    }
    
    /**
     * Sleep to restore energy
     */
    sleep(amount) {
        this.energy = Math.min(100, this.energy + amount);
    }
    
    /**
     * Wash to improve hygiene
     */
    wash(amount) {
        this.hygiene = Math.min(100, this.hygiene + amount);
    }
    
    /**
     * Take damage
     */
    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
    }
    
    /**
     * Heal
     */
    heal(amount) {
        this.health = Math.min(100, this.health + amount);
    }
    
    /**
     * Set activity level (affects decay rates)
     */
    setActivity(multiplier) {
        this.activityMultiplier = multiplier;
    }
    
    /**
     * Get status level for an attribute (critical/warning/good/excellent)
     */
    getStatusLevel(attribute) {
        const value = this[attribute];
        if (value < this.thresholds.critical) {
            return 'critical';
        } else if (value < this.thresholds.warning) {
            return 'warning';
        } else if (value < this.thresholds.good) {
            return 'good';
        } else {
            return 'excellent';
        }
    }
    
    /**
     * Get color for status level
     */
    getStatusColor(attribute) {
        const level = this.getStatusLevel(attribute);
        switch (level) {
            case 'critical': return '#ff4444';
            case 'warning': return '#ffaa00';
            case 'good': return '#ffff00';
            case 'excellent': return '#44ff44';
            default: return '#ffffff';
        }
    }
    
    /**
     * Check if character is alive
     */
    isAlive() {
        return this.health > 0;
    }
    
    /**
     * Get all active status effects
     */
    getStatusEffects() {
        return Array.from(this.statusEffects);
    }
    
    /**
     * Check if has specific status effect
     */
    hasStatusEffect(effect) {
        return this.statusEffects.has(effect);
    }
}
