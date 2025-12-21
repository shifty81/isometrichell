/**
 * Inventory Slot Class
 */
class InventorySlot {
    constructor(type, position = null) {
        this.type = type; // 'hand_left', 'hand_right', 'back', 'body', 'pocket', etc.
        this.item = null;
        this.position = position; // For grid-based inventories
        this.locked = false;
    }

    /**
     * Check if slot can accept item
     */
    canAccept(item) {
        if (this.locked || this.item !== null) {
            return false;
        }

        // Type-specific restrictions
        switch (this.type) {
            case 'hand_left':
            case 'hand_right':
                return item.type === 'tool' || item.weight <= 2.0;
            case 'back':
                return item.type === 'container' && 
                       (item.containerType === 'backpack' || item.containerType === 'rig');
            case 'body':
                return item.type === 'wearable';
            case 'pocket':
                return item.weight <= 0.5 && item.volume <= 0.2;
            default:
                return true;
        }
    }

    /**
     * Place item in slot
     */
    place(item) {
        if (this.canAccept(item)) {
            this.item = item;
            return true;
        }
        return false;
    }

    /**
     * Remove item from slot
     */
    remove() {
        const item = this.item;
        this.item = null;
        return item;
    }

    /**
     * Check if slot is empty
     */
    isEmpty() {
        return this.item === null;
    }
}

/**
 * Inventory System Class
 */
class InventorySystem {
    constructor(player) {
        this.player = player;
        
        // Equipment slots
        this.slots = {
            hand_left: new InventorySlot('hand_left'),
            hand_right: new InventorySlot('hand_right'),
            back: new InventorySlot('back'),
            body: new InventorySlot('body'),
            head: new InventorySlot('head'),
            feet: new InventorySlot('feet')
        };

        // Pocket inventory (quick access)
        this.pockets = [];
        for (let i = 0; i < 4; i++) {
            this.pockets.push(new InventorySlot('pocket', i));
        }

        // Containers (backpacks, toolboxes attached to back slot)
        this.containers = [];

        // Toolbox reference (enables carrying tools efficiently)
        this.toolbox = null;
    }

    /**
     * Equip item to specific slot
     */
    equip(item, slotName) {
        if (!this.slots.hasOwnProperty(slotName)) {
            return { success: false, message: 'Invalid slot' };
        }

        const slot = this.slots[slotName];
        
        if (!slot.isEmpty()) {
            return { success: false, message: 'Slot already occupied' };
        }

        if (!slot.canAccept(item)) {
            return { success: false, message: 'Item cannot be equipped in this slot' };
        }

        // Special handling for tools requiring toolbox
        if (item.type === 'tool' && item.requiresToolbox && !this.toolbox) {
            return { success: false, message: 'Requires toolbox to carry' };
        }

        slot.place(item);
        
        // If it's a container on back, add to containers list
        if (slotName === 'back' && item.type === 'container') {
            this.containers.push(item);
            item.isEquipped = true;
            
            // Check if it's a toolbox
            if (item.containerType === 'toolbox') {
                this.toolbox = item;
            }
        }

        return { success: true, message: `Equipped ${item.name}` };
    }

    /**
     * Unequip item from slot
     */
    unequip(slotName) {
        if (!this.slots.hasOwnProperty(slotName)) {
            return { success: false, message: 'Invalid slot' };
        }

        const slot = this.slots[slotName];
        if (slot.isEmpty()) {
            return { success: false, message: 'Slot is empty' };
        }

        const item = slot.remove();

        // Remove from containers if it was on back
        if (slotName === 'back' && item.type === 'container') {
            const index = this.containers.indexOf(item);
            if (index !== -1) {
                this.containers.splice(index, 1);
            }
            item.isEquipped = false;

            // Clear toolbox reference
            if (item === this.toolbox) {
                this.toolbox = null;
            }
        }

        return { success: true, item: item, message: `Unequipped ${item.name}` };
    }

    /**
     * Add item to pocket
     */
    addToPocket(item, index = -1) {
        // Try specific pocket
        if (index >= 0 && index < this.pockets.length) {
            const slot = this.pockets[index];
            if (slot.place(item)) {
                return { success: true, index: index };
            }
        }

        // Try any empty pocket
        for (let i = 0; i < this.pockets.length; i++) {
            if (this.pockets[i].place(item)) {
                return { success: true, index: i };
            }
        }

        return { success: false, message: 'No pocket space available' };
    }

    /**
     * Remove item from pocket
     */
    removeFromPocket(index) {
        if (index < 0 || index >= this.pockets.length) {
            return { success: false, message: 'Invalid pocket index' };
        }

        const item = this.pockets[index].remove();
        if (item) {
            return { success: true, item: item };
        }

        return { success: false, message: 'Pocket is empty' };
    }

    /**
     * Add item to any container
     */
    addToContainer(item) {
        for (const container of this.containers) {
            if (container.addItem(item)) {
                return { success: true, container: container };
            }
        }
        return { success: false, message: 'No container space available' };
    }

    /**
     * Get total carrying capacity
     */
    getTotalCapacity() {
        let capacity = 10; // Base carrying capacity in kg
        
        // Add container capacities
        for (const container of this.containers) {
            capacity += container.capacity;
        }

        return capacity;
    }

    /**
     * Get current total weight
     */
    getTotalWeight() {
        let weight = 0;

        // Equipment slots
        for (const [name, slot] of Object.entries(this.slots)) {
            if (!slot.isEmpty()) {
                weight += slot.item.weight;
                
                // Add container contents
                if (slot.item instanceof ContainerItem) {
                    weight += slot.item.getTotalWeight();
                }
            }
        }

        // Pockets
        for (const pocket of this.pockets) {
            if (!pocket.isEmpty()) {
                weight += pocket.item.weight;
            }
        }

        return weight;
    }

    /**
     * Check if over-encumbered
     */
    isOverEncumbered() {
        return this.getTotalWeight() > this.getTotalCapacity();
    }

    /**
     * Get equipped item from slot
     */
    getEquipped(slotName) {
        if (this.slots.hasOwnProperty(slotName)) {
            return this.slots[slotName].item;
        }
        return null;
    }

    /**
     * Find item in inventory
     */
    findItem(itemId) {
        // Check equipment slots
        for (const [name, slot] of Object.entries(this.slots)) {
            if (!slot.isEmpty() && slot.item.id === itemId) {
                return { location: 'slot', slotName: name, item: slot.item };
            }
        }

        // Check pockets
        for (let i = 0; i < this.pockets.length; i++) {
            const pocket = this.pockets[i];
            if (!pocket.isEmpty() && pocket.item.id === itemId) {
                return { location: 'pocket', index: i, item: pocket.item };
            }
        }

        // Check containers
        for (const container of this.containers) {
            for (const item of container.contents) {
                if (item.id === itemId) {
                    return { location: 'container', container: container, item: item };
                }
            }
        }

        return null;
    }

    /**
     * Get all items in inventory
     */
    getAllItems() {
        const items = [];

        // Equipment slots
        for (const [name, slot] of Object.entries(this.slots)) {
            if (!slot.isEmpty()) {
                items.push({ location: 'slot', slotName: name, item: slot.item });
            }
        }

        // Pockets
        for (let i = 0; i < this.pockets.length; i++) {
            const pocket = this.pockets[i];
            if (!pocket.isEmpty()) {
                items.push({ location: 'pocket', index: i, item: pocket.item });
            }
        }

        // Container contents
        for (const container of this.containers) {
            for (const item of container.contents) {
                items.push({ location: 'container', container: container, item: item });
            }
        }

        return items;
    }

    /**
     * Get inventory summary
     */
    getSummary() {
        return {
            totalWeight: this.getTotalWeight().toFixed(2),
            totalCapacity: this.getTotalCapacity().toFixed(2),
            overEncumbered: this.isOverEncumbered(),
            itemCount: this.getAllItems().length,
            hasToolbox: this.toolbox !== null,
            containers: this.containers.length
        };
    }
}
