/**
 * Item Base Class
 * Base class for all items in the game
 */
class Item {
    constructor(id, name, description, type, weight = 0, volume = 0) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type; // 'tool', 'container', 'wearable', 'consumable', etc.
        this.weight = weight; // in kg
        this.volume = volume; // in liters
        this.icon = null; // sprite/image reference
        this.stackable = false;
        this.stackSize = 1;
        this.quality = 100; // 0-100, affects durability
    }

    /**
     * Get item info for tooltip
     */
    getInfo() {
        return {
            name: this.name,
            description: this.description,
            type: this.type,
            weight: `${this.weight.toFixed(2)} kg`,
            volume: `${this.volume.toFixed(2)} L`,
            quality: `${Math.round(this.quality)}%`
        };
    }

    /**
     * Use the item
     */
    use(player, world) {
        // Override in subclasses
        return false;
    }

    /**
     * Clone this item
     */
    clone() {
        const ItemClass = this.constructor;
        return new ItemClass();
    }
}

/**
 * Tool Item Class
 */
class ToolItem extends Item {
    constructor(id, name, description, toolType, efficiency = 1.0) {
        super(id, name, description, 'tool', 0.5, 0.1);
        this.toolType = toolType; // 'axe', 'pickaxe', 'hammer', 'screwdriver', etc.
        this.efficiency = efficiency; // Multiplier for gathering/crafting speed
        this.requiresToolbox = true; // Most tools require toolbox to carry efficiently
    }

    clone() {
        return new ToolItem(this.id, this.name, this.description, this.toolType, this.efficiency);
    }
}

/**
 * Container Item Class
 */
class ContainerItem extends Item {
    constructor(id, name, description, capacity, containerType = 'generic') {
        super(id, name, description, 'container', 1.0, 5.0);
        this.containerType = containerType; // 'backpack', 'toolbox', 'firstaid', 'hardcase'
        this.capacity = capacity; // Maximum weight it can hold
        this.volumeCapacity = capacity * 2; // Volume capacity
        this.contents = [];
        this.isEquipped = false;
    }

    clone() {
        const item = new ContainerItem(this.id, this.name, this.description, this.capacity, this.containerType);
        item.contents = [];
        item.isEquipped = false;
        return item;
    }

    /**
     * Add item to container
     */
    addItem(item) {
        const totalWeight = this.getTotalWeight();
        const totalVolume = this.getTotalVolume();
        
        if (totalWeight + item.weight <= this.capacity && 
            totalVolume + item.volume <= this.volumeCapacity) {
            this.contents.push(item);
            return true;
        }
        return false;
    }

    /**
     * Remove item from container
     */
    removeItem(item) {
        const index = this.contents.indexOf(item);
        if (index !== -1) {
            this.contents.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Get total weight of contents
     */
    getTotalWeight() {
        return this.contents.reduce((sum, item) => sum + item.weight, 0);
    }

    /**
     * Get total volume of contents
     */
    getTotalVolume() {
        return this.contents.reduce((sum, item) => sum + item.volume, 0);
    }
}

/**
 * Water Bottle Item Class
 */
class WaterBottleItem extends Item {
    constructor() {
        super('water_bottle', 'Water Bottle', 'A refillable water container', 'consumable', 0.5, 0.5);
        this.capacity = 1.0; // 1 liter
        this.current = 0; // Current amount
        this.isBoiled = false; // Safe to drink
        this.source = null; // 'fountain', 'natural', null
        this.attachments = []; // Filter, purifier, etc.
    }

    clone() {
        const item = new WaterBottleItem();
        item.current = this.current;
        item.isBoiled = this.isBoiled;
        item.source = this.source;
        item.attachments = [...this.attachments];
        return item;
    }

    /**
     * Fill from water source
     */
    fill(source, amount = this.capacity) {
        this.current = Math.min(this.capacity, amount);
        this.source = source;
        this.isBoiled = (source === 'fountain'); // Fountain water is safe
        return true;
    }

    /**
     * Drink from bottle
     */
    drink(player, amount = 0.25) {
        if (this.current <= 0) {
            return { success: false, message: 'Water bottle is empty' };
        }

        const drinkAmount = Math.min(amount, this.current);
        this.current -= drinkAmount;

        // Check for dysentery risk
        if (!this.isBoiled && this.source === 'natural' && !this.hasAttachment('filter')) {
            const dysenteryRisk = Math.random() < 0.3; // 30% chance
            if (dysenteryRisk) {
                return { 
                    success: true, 
                    hydration: drinkAmount * 80,
                    effect: 'dysentery',
                    message: 'You drank contaminated water!' 
                };
            }
        }

        return { 
            success: true, 
            hydration: drinkAmount * 100,
            message: `Drank ${drinkAmount.toFixed(2)}L of water` 
        };
    }

    /**
     * Boil water to make it safe
     */
    boil() {
        if (this.current > 0) {
            this.isBoiled = true;
            return true;
        }
        return false;
    }

    /**
     * Add attachment (filter, purifier)
     */
    addAttachment(attachment) {
        if (!this.attachments.includes(attachment)) {
            this.attachments.push(attachment);
            return true;
        }
        return false;
    }

    /**
     * Check if has specific attachment
     */
    hasAttachment(attachmentType) {
        return this.attachments.includes(attachmentType);
    }

    getInfo() {
        const info = super.getInfo();
        info.fill = `${(this.current / this.capacity * 100).toFixed(0)}%`;
        info.safe = this.isBoiled ? 'Yes' : 'No';
        if (this.attachments.length > 0) {
            info.attachments = this.attachments.join(', ');
        }
        return info;
    }
}

/**
 * Rig Item Class (Deployable tent/camping rig)
 */
class RigItem extends Item {
    constructor() {
        super('tent_rig', 'Tent Rig', 'A deployable camping rig with attachment points', 'deployable', 5.0, 10.0);
        this.isDeployed = false;
        this.attachmentSlots = {
            backpack: null,
            toolbox: null,
            firstaid: null,
            hardcase: null,
            bedroll: null,
            container1: null,
            container2: null
        };
        this.position = { x: 0, y: 0 }; // World position when deployed
    }

    clone() {
        const item = new RigItem();
        item.isDeployed = false;
        item.attachmentSlots = {
            backpack: null,
            toolbox: null,
            firstaid: null,
            hardcase: null,
            bedroll: null,
            container1: null,
            container2: null
        };
        item.position = { x: 0, y: 0 };
        return item;
    }

    /**
     * Deploy rig at location
     */
    deploy(x, y, world) {
        // Check if location is valid
        const tile = world.getTile(Math.floor(x), Math.floor(y));
        if (!tile || !tile.isWalkable()) {
            return false;
        }

        this.isDeployed = true;
        this.position = { x, y };
        return true;
    }

    /**
     * Pack up rig
     */
    packUp() {
        this.isDeployed = false;
        this.position = { x: 0, y: 0 };
        return true;
    }

    /**
     * Attach container to rig
     */
    attachContainer(slotName, container) {
        if (this.attachmentSlots.hasOwnProperty(slotName) && 
            this.attachmentSlots[slotName] === null &&
            container instanceof ContainerItem) {
            this.attachmentSlots[slotName] = container;
            return true;
        }
        return false;
    }

    /**
     * Detach container from rig
     */
    detachContainer(slotName) {
        if (this.attachmentSlots.hasOwnProperty(slotName) && 
            this.attachmentSlots[slotName] !== null) {
            const container = this.attachmentSlots[slotName];
            this.attachmentSlots[slotName] = null;
            return container;
        }
        return null;
    }

    /**
     * Get all attached containers
     */
    getAttachedContainers() {
        const containers = [];
        for (const [slot, container] of Object.entries(this.attachmentSlots)) {
            if (container !== null) {
                containers.push({ slot, container });
            }
        }
        return containers;
    }
}
