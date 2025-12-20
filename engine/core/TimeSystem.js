/**
 * TimeSystem Class
 * Manages game time, day/night cycle, and time controls
 */
class TimeSystem {
    constructor() {
        // Time configuration
        this.currentTime = 6 * 60; // Start at 6:00 AM (in minutes since midnight)
        this.timeScale = 60; // 1 real second = 60 game minutes (1 real minute = 1 game hour)
        this.isPaused = false;
        
        // Day configuration
        this.currentDay = 1;
        this.currentSeason = 'spring';
        
        // Time of day periods (in minutes since midnight)
        this.periods = {
            dawn: { start: 5 * 60, end: 7 * 60 },      // 5:00 - 7:00
            morning: { start: 7 * 60, end: 12 * 60 },  // 7:00 - 12:00
            afternoon: { start: 12 * 60, end: 17 * 60 }, // 12:00 - 17:00
            dusk: { start: 17 * 60, end: 19 * 60 },    // 17:00 - 19:00
            night: { start: 19 * 60, end: 5 * 60 }     // 19:00 - 5:00 (next day)
        };
        
        // Listeners for time events
        this.listeners = {
            onHourChange: [],
            onDayChange: [],
            onPeriodChange: []
        };
        
        this.lastHour = this.getHour();
        this.lastPeriod = this.getPeriod();
    }
    
    /**
     * Update time system
     */
    update(deltaTime) {
        if (this.isPaused) return;
        
        const prevTime = this.currentTime;
        const prevHour = this.lastHour;
        const prevPeriod = this.lastPeriod;
        
        // Update time (deltaTime is in seconds, timeScale converts to game minutes)
        this.currentTime += deltaTime * this.timeScale;
        
        // Handle day transition
        if (this.currentTime >= 24 * 60) {
            this.currentTime -= 24 * 60;
            this.currentDay++;
            this._notifyListeners('onDayChange', this.currentDay);
        }
        
        // Check for hour change
        const currentHour = this.getHour();
        if (currentHour !== prevHour) {
            this.lastHour = currentHour;
            this._notifyListeners('onHourChange', currentHour);
        }
        
        // Check for period change
        const currentPeriod = this.getPeriod();
        if (currentPeriod !== prevPeriod) {
            this.lastPeriod = currentPeriod;
            this._notifyListeners('onPeriodChange', currentPeriod);
        }
    }
    
    /**
     * Get current hour (0-23)
     */
    getHour() {
        return Math.floor(this.currentTime / 60) % 24;
    }
    
    /**
     * Get current minute (0-59)
     */
    getMinute() {
        return Math.floor(this.currentTime % 60);
    }
    
    /**
     * Get formatted time string (HH:MM)
     */
    getTimeString() {
        const hour = this.getHour();
        const minute = this.getMinute();
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }
    
    /**
     * Get formatted time string with AM/PM
     */
    getTimeString12Hour() {
        let hour = this.getHour();
        const minute = this.getMinute();
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12; // Convert to 12-hour format
        return `${hour}:${String(minute).padStart(2, '0')} ${ampm}`;
    }
    
    /**
     * Get current time period (dawn, morning, afternoon, dusk, night)
     */
    getPeriod() {
        const time = this.currentTime;
        
        if (time >= this.periods.dawn.start && time < this.periods.dawn.end) {
            return 'dawn';
        } else if (time >= this.periods.morning.start && time < this.periods.morning.end) {
            return 'morning';
        } else if (time >= this.periods.afternoon.start && time < this.periods.afternoon.end) {
            return 'afternoon';
        } else if (time >= this.periods.dusk.start && time < this.periods.dusk.end) {
            return 'dusk';
        } else {
            return 'night';
        }
    }
    
    /**
     * Get light level (0-1) based on time of day
     */
    getLightLevel() {
        const period = this.getPeriod();
        
        switch (period) {
            case 'dawn':
                // Gradually increase from 0.3 to 1.0
                const dawnProgress = (this.currentTime - this.periods.dawn.start) / 
                                   (this.periods.dawn.end - this.periods.dawn.start);
                return 0.3 + (dawnProgress * 0.7);
            
            case 'morning':
            case 'afternoon':
                return 1.0; // Full daylight
            
            case 'dusk':
                // Gradually decrease from 1.0 to 0.3
                const duskProgress = (this.currentTime - this.periods.dusk.start) / 
                                   (this.periods.dusk.end - this.periods.dusk.start);
                return 1.0 - (duskProgress * 0.7);
            
            case 'night':
                return 0.3; // Dark
            
            default:
                return 1.0;
        }
    }
    
    /**
     * Get ambient color based on time of day
     */
    getAmbientColor() {
        const period = this.getPeriod();
        
        switch (period) {
            case 'dawn':
                return { r: 255, g: 200, b: 150 }; // Orange-ish
            case 'morning':
                return { r: 255, g: 255, b: 255 }; // White (neutral)
            case 'afternoon':
                return { r: 255, g: 250, b: 230 }; // Slightly warm
            case 'dusk':
                return { r: 255, g: 150, b: 100 }; // Orange-red
            case 'night':
                return { r: 100, g: 120, b: 180 }; // Blue-ish
            default:
                return { r: 255, g: 255, b: 255 };
        }
    }
    
    /**
     * Set time scale (how fast time passes)
     */
    setTimeScale(scale) {
        this.timeScale = Math.max(0, scale);
    }
    
    /**
     * Pause time
     */
    pause() {
        this.isPaused = true;
    }
    
    /**
     * Resume time
     */
    resume() {
        this.isPaused = false;
    }
    
    /**
     * Toggle pause
     */
    togglePause() {
        this.isPaused = !this.isPaused;
        return this.isPaused;
    }
    
    /**
     * Set time directly (in minutes since midnight)
     */
    setTime(minutes) {
        this.currentTime = Math.max(0, Math.min(24 * 60 - 1, minutes));
    }
    
    /**
     * Set time by hour and minute
     */
    setTimeByHourMinute(hour, minute) {
        this.setTime(hour * 60 + minute);
    }
    
    /**
     * Add event listener
     */
    addEventListener(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event].push(callback);
        }
    }
    
    /**
     * Remove event listener
     */
    removeEventListener(event, callback) {
        if (this.listeners[event]) {
            const index = this.listeners[event].indexOf(callback);
            if (index > -1) {
                this.listeners[event].splice(index, 1);
            }
        }
    }
    
    /**
     * Notify listeners of an event
     */
    _notifyListeners(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }
    
    /**
     * Get day string (Day 1, Day 2, etc.)
     */
    getDayString() {
        return `Day ${this.currentDay}`;
    }
    
    /**
     * Is it daytime?
     */
    isDaytime() {
        const period = this.getPeriod();
        return period === 'dawn' || period === 'morning' || period === 'afternoon';
    }
    
    /**
     * Is it nighttime?
     */
    isNighttime() {
        return !this.isDaytime();
    }
}
