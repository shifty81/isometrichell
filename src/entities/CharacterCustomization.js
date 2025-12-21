/**
 * Character Appearance Class
 * Defines visual appearance of a character
 */
class CharacterAppearance {
    constructor() {
        this.gender = 'male'; // 'male' or 'female'
        this.skinTone = 0; // 0-5
        this.hairStyle = 0; // 0-10
        this.hairColor = '#000000';
        this.bodyType = 'average'; // 'slim', 'average', 'muscular', 'heavy'
        
        // Clothing
        this.clothing = {
            shirt: 'tshirt_blue',
            pants: 'jeans_blue',
            shoes: 'sneakers_white',
            hat: null,
            jacket: null
        };
        
        // Facial features (for close-up views)
        this.facialFeatures = {
            eyeColor: '#0000FF',
            facialHair: null // null, 'beard', 'mustache', 'goatee'
        };
    }

    /**
     * Clone appearance
     */
    clone() {
        const appearance = new CharacterAppearance();
        appearance.gender = this.gender;
        appearance.skinTone = this.skinTone;
        appearance.hairStyle = this.hairStyle;
        appearance.hairColor = this.hairColor;
        appearance.bodyType = this.bodyType;
        appearance.clothing = { ...this.clothing };
        appearance.facialFeatures = { ...this.facialFeatures };
        return appearance;
    }

    /**
     * Serialize to JSON
     */
    toJSON() {
        return {
            gender: this.gender,
            skinTone: this.skinTone,
            hairStyle: this.hairStyle,
            hairColor: this.hairColor,
            bodyType: this.bodyType,
            clothing: this.clothing,
            facialFeatures: this.facialFeatures
        };
    }

    /**
     * Load from JSON
     */
    fromJSON(data) {
        this.gender = data.gender || 'male';
        this.skinTone = data.skinTone || 0;
        this.hairStyle = data.hairStyle || 0;
        this.hairColor = data.hairColor || '#000000';
        this.bodyType = data.bodyType || 'average';
        this.clothing = data.clothing || this.clothing;
        this.facialFeatures = data.facialFeatures || this.facialFeatures;
    }
}

/**
 * Character Customization System
 * Handles character creation and customization
 */
class CharacterCustomization {
    constructor() {
        this.appearance = new CharacterAppearance();
        this.rotation = 0; // For 3D preview rotation (0-360 degrees)
        this.previewScale = 1.0;
        
        // Available options
        this.options = {
            genders: ['male', 'female'],
            skinTones: ['light', 'medium-light', 'medium', 'medium-dark', 'dark', 'very-dark'],
            hairStyles: {
                male: ['buzz_cut', 'short', 'medium', 'long', 'mohawk', 'bald', 'ponytail', 'dreadlocks', 'afro', 'spiky', 'slicked_back'],
                female: ['short', 'medium', 'long', 'ponytail', 'bun', 'braids', 'curly', 'pixie', 'bob', 'bangs', 'twin_tails']
            },
            bodyTypes: ['slim', 'average', 'muscular', 'heavy'],
            shirts: [
                { id: 'tshirt_white', name: 'White T-Shirt', color: '#FFFFFF' },
                { id: 'tshirt_black', name: 'Black T-Shirt', color: '#000000' },
                { id: 'tshirt_blue', name: 'Blue T-Shirt', color: '#0066CC' },
                { id: 'tshirt_red', name: 'Red T-Shirt', color: '#CC0000' },
                { id: 'shirt_plaid', name: 'Plaid Shirt', color: '#CC6600' },
                { id: 'hoodie_gray', name: 'Gray Hoodie', color: '#666666' }
            ],
            pants: [
                { id: 'jeans_blue', name: 'Blue Jeans', color: '#336699' },
                { id: 'jeans_black', name: 'Black Jeans', color: '#111111' },
                { id: 'cargo_green', name: 'Cargo Pants', color: '#556B2F' },
                { id: 'shorts_khaki', name: 'Khaki Shorts', color: '#C3B091' }
            ],
            shoes: [
                { id: 'sneakers_white', name: 'White Sneakers', color: '#F0F0F0' },
                { id: 'boots_brown', name: 'Brown Boots', color: '#654321' },
                { id: 'sandals', name: 'Sandals', color: '#DEB887' }
            ]
        };
    }

    /**
     * Set character gender
     */
    setGender(gender) {
        if (this.options.genders.includes(gender)) {
            this.appearance.gender = gender;
            return true;
        }
        return false;
    }

    /**
     * Set skin tone
     */
    setSkinTone(index) {
        if (index >= 0 && index < this.options.skinTones.length) {
            this.appearance.skinTone = index;
            return true;
        }
        return false;
    }

    /**
     * Set hair style
     */
    setHairStyle(index) {
        const hairStyles = this.options.hairStyles[this.appearance.gender];
        if (index >= 0 && index < hairStyles.length) {
            this.appearance.hairStyle = index;
            return true;
        }
        return false;
    }

    /**
     * Set hair color
     */
    setHairColor(color) {
        this.appearance.hairColor = color;
        return true;
    }

    /**
     * Set body type
     */
    setBodyType(bodyType) {
        if (this.options.bodyTypes.includes(bodyType)) {
            this.appearance.bodyType = bodyType;
            return true;
        }
        return false;
    }

    /**
     * Set clothing item
     */
    setClothing(category, itemId) {
        if (this.appearance.clothing.hasOwnProperty(category)) {
            this.appearance.clothing[category] = itemId;
            return true;
        }
        return false;
    }

    /**
     * Rotate character preview
     */
    rotate(angle) {
        this.rotation = (this.rotation + angle) % 360;
        if (this.rotation < 0) {
            this.rotation += 360;
        }
    }

    /**
     * Get current rotation in radians
     */
    getRotationRadians() {
        return (this.rotation * Math.PI) / 180;
    }

    /**
     * Get available hair styles for current gender
     */
    getAvailableHairStyles() {
        return this.options.hairStyles[this.appearance.gender];
    }

    /**
     * Get skin tone hex color by index
     */
    getSkinToneColor(index = null) {
        const colors = [
            '#FFE0BD', // light
            '#F1C27D', // medium-light
            '#C68642', // medium
            '#8D5524', // medium-dark
            '#5C4033', // dark
            '#3D2817'  // very-dark
        ];
        const toneIndex = index !== null ? index : this.appearance.skinTone;
        return colors[toneIndex] || colors[0];
    }

    /**
     * Export character data
     */
    exportCharacter() {
        return this.appearance.toJSON();
    }

    /**
     * Import character data
     */
    importCharacter(data) {
        this.appearance.fromJSON(data);
    }

    /**
     * Randomize appearance
     */
    randomize() {
        // Random gender
        this.appearance.gender = this.options.genders[Math.floor(Math.random() * this.options.genders.length)];
        
        // Random skin tone
        this.appearance.skinTone = Math.floor(Math.random() * this.options.skinTones.length);
        
        // Random hair style
        const hairStyles = this.options.hairStyles[this.appearance.gender];
        this.appearance.hairStyle = Math.floor(Math.random() * hairStyles.length);
        
        // Random hair color
        const hairColors = ['#000000', '#3B2414', '#8B4513', '#D2691E', '#FFD700', '#FF0000'];
        this.appearance.hairColor = hairColors[Math.floor(Math.random() * hairColors.length)];
        
        // Random body type
        this.appearance.bodyType = this.options.bodyTypes[Math.floor(Math.random() * this.options.bodyTypes.length)];
        
        // Random clothing
        this.appearance.clothing.shirt = this.options.shirts[Math.floor(Math.random() * this.options.shirts.length)].id;
        this.appearance.clothing.pants = this.options.pants[Math.floor(Math.random() * this.options.pants.length)].id;
        this.appearance.clothing.shoes = this.options.shoes[Math.floor(Math.random() * this.options.shoes.length)].id;
    }
}
