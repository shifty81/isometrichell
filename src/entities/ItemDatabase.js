/**
 * Item Database
 * Defines all available items in the game
 */
class ItemDatabase {
    constructor() {
        this.items = new Map();
        this._initializeItems();
    }

    /**
     * Initialize all game items
     */
    _initializeItems() {
        // Tools
        this.registerItem(new ToolItem(
            'axe',
            'Axe',
            'A tool for chopping wood',
            'axe',
            1.2
        ));

        this.registerItem(new ToolItem(
            'pickaxe',
            'Pickaxe',
            'A tool for mining stone',
            'pickaxe',
            1.3
        ));

        this.registerItem(new ToolItem(
            'hammer',
            'Hammer',
            'A tool for construction and repairs',
            'hammer',
            1.0
        ));

        this.registerItem(new ToolItem(
            'screwdriver',
            'Screwdriver',
            'A tool for mechanical work',
            'screwdriver',
            1.1
        ));

        this.registerItem(new ToolItem(
            'wrench',
            'Wrench',
            'A tool for tightening and loosening nuts and bolts',
            'wrench',
            1.0
        ));

        // Containers
        this.registerItem(new ContainerItem(
            'backpack_small',
            'Small Backpack',
            'A basic backpack for carrying items',
            10, // 10kg capacity
            'backpack'
        ));

        this.registerItem(new ContainerItem(
            'backpack_large',
            'Large Backpack',
            'A spacious backpack with lots of room',
            20, // 20kg capacity
            'backpack'
        ));

        this.registerItem(new ContainerItem(
            'toolbox',
            'Toolbox',
            'A sturdy toolbox for organizing and carrying tools',
            8, // 8kg capacity
            'toolbox'
        ));

        this.registerItem(new ContainerItem(
            'firstaid_kit',
            'First Aid Kit',
            'A medical kit for treating injuries',
            3, // 3kg capacity
            'firstaid'
        ));

        this.registerItem(new ContainerItem(
            'hard_case',
            'Hard Case',
            'A waterproof and impact-resistant case',
            5, // 5kg capacity
            'hardcase'
        ));

        // Special items
        this.registerItem(new WaterBottleItem());
        this.registerItem(new RigItem());

        // Bedroll
        this.registerItem(new Item(
            'bedroll',
            'Bedroll',
            'A portable sleeping mat for camping',
            'deployable',
            2.0,
            3.0
        ));

        console.log(`✅ Item database initialized with ${this.items.size} items`);
    }

    /**
     * Register an item in the database
     */
    registerItem(item) {
        this.items.set(item.id, item);
    }

    /**
     * Get item by ID
     */
    getItem(id) {
        return this.items.get(id);
    }

    /**
     * Create a new instance of an item
     */
    createItem(id) {
        const template = this.items.get(id);
        if (!template) {
            console.warn(`Item not found: ${id}`);
            return null;
        }
        return template.clone();
    }

    /**
     * Get all items of a specific type
     */
    getItemsByType(type) {
        const results = [];
        for (const [id, item] of this.items.entries()) {
            if (item.type === type) {
                results.push(item);
            }
        }
        return results;
    }

    /**
     * Get all tool items
     */
    getTools() {
        return this.getItemsByType('tool');
    }

    /**
     * Get all container items
     */
    getContainers() {
        return this.getItemsByType('container');
    }

    /**
     * Search items by name
     */
    searchItems(query) {
        const results = [];
        const lowerQuery = query.toLowerCase();
        
        for (const [id, item] of this.items.entries()) {
            if (item.name.toLowerCase().includes(lowerQuery) ||
                item.description.toLowerCase().includes(lowerQuery)) {
                results.push(item);
            }
        }
        
        return results;
    }

    /**
     * Get all items as array
     */
    getAllItems() {
        return Array.from(this.items.values());
    }
}

// Create global item database instance
const ITEM_DB = new ItemDatabase();
