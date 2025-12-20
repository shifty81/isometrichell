/**
 * EditorUI Class
 * Manages the UI for the tile editor with asset library
 */
class EditorUI {
    constructor(assetLoader, world, camera) {
        this.assetLoader = assetLoader;
        this.world = world;
        this.camera = camera;
        this.visible = false;
        this.selectedAsset = null;
        this.selectedTool = 'tile'; // 'tile', 'decoration', 'building'
        this.assetCategories = {
            tiles: [],
            decorations: [],
            buildings: [],
            characters: []
        };
        
        this.createUI();
        this.populateAssetLibrary();
    }
    
    /**
     * Create the UI structure
     */
    createUI() {
        // Create main editor panel
        this.panel = document.createElement('div');
        this.panel.id = 'editorPanel';
        this.panel.style.cssText = `
            position: fixed;
            right: 10px;
            top: 10px;
            width: 320px;
            max-height: 90vh;
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #444;
            border-radius: 8px;
            padding: 15px;
            color: #fff;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            overflow-y: auto;
            display: none;
            z-index: 1000;
        `;
        
        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #444;
        `;
        header.textContent = '🎨 Asset Library';
        this.panel.appendChild(header);
        
        // Tool selector
        const toolSelector = document.createElement('div');
        toolSelector.style.cssText = `
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #444;
        `;
        toolSelector.innerHTML = `
            <div style="margin-bottom: 5px; font-weight: bold;">Tool:</div>
            <div id="toolButtons" style="display: flex; gap: 5px;"></div>
        `;
        this.panel.appendChild(toolSelector);
        
        // Create tool buttons
        const toolButtons = toolSelector.querySelector('#toolButtons');
        const tools = [
            { name: 'Tiles', value: 'tile', icon: '🟩' },
            { name: 'Decorations', value: 'decoration', icon: '🌳' },
            { name: 'Buildings', value: 'building', icon: '🏠' },
            { name: 'Characters', value: 'character', icon: '🧍' }
        ];
        
        tools.forEach(tool => {
            const btn = document.createElement('button');
            btn.textContent = tool.icon;
            btn.title = tool.name;
            btn.style.cssText = `
                padding: 8px 12px;
                background: #333;
                border: 2px solid #555;
                color: #fff;
                cursor: pointer;
                border-radius: 4px;
                flex: 1;
            `;
            btn.onclick = () => this.selectTool(tool.value);
            btn.dataset.tool = tool.value;
            toolButtons.appendChild(btn);
        });
        
        // Asset library container
        this.assetLibrary = document.createElement('div');
        this.assetLibrary.id = 'assetLibrary';
        this.assetLibrary.style.cssText = `
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            margin-top: 10px;
        `;
        this.panel.appendChild(this.assetLibrary);
        
        // Info panel
        this.infoPanel = document.createElement('div');
        this.infoPanel.style.cssText = `
            margin-top: 15px;
            padding: 10px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
            font-size: 10px;
        `;
        this.infoPanel.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">Selected:</div>
            <div id="selectedInfo">None</div>
        `;
        this.panel.appendChild(this.infoPanel);
        
        // Instructions
        const instructions = document.createElement('div');
        instructions.style.cssText = `
            margin-top: 15px;
            padding: 10px;
            background: rgba(0, 100, 200, 0.1);
            border: 1px solid rgba(0, 150, 255, 0.3);
            border-radius: 4px;
            font-size: 10px;
        `;
        instructions.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">Controls:</div>
            <div>• E - Toggle Editor</div>
            <div>• Left Click - Place Asset</div>
            <div>• Right Click - Remove Asset</div>
            <div>• WASD - Move Camera</div>
        `;
        this.panel.appendChild(instructions);
        
        document.body.appendChild(this.panel);
    }
    
    /**
     * Populate asset library with loaded assets
     */
    populateAssetLibrary() {
        // Categorize assets
        const images = this.assetLoader.images;
        
        images.forEach((img, name) => {
            if (name.includes('grass') || name.includes('dirt') || name.includes('sand') || 
                name.includes('stone') || name.includes('forest_ground')) {
                this.assetCategories.tiles.push({ name, img, type: 'tile' });
            } else if (name.includes('tree') || name.includes('bush') || name.includes('rock') || 
                       name.includes('pond')) {
                this.assetCategories.decorations.push({ name, img, type: 'decoration' });
            } else if (name.includes('building') || name.includes('house') || name.includes('treehouse')) {
                this.assetCategories.buildings.push({ name, img, type: 'building' });
            } else if (name.includes('knight') || name.includes('character')) {
                this.assetCategories.characters.push({ name, img, type: 'character' });
            }
        });
        
        // Sort each category alphabetically
        Object.values(this.assetCategories).forEach(category => {
            category.sort((a, b) => a.name.localeCompare(b.name));
        });
    }
    
    /**
     * Select a tool
     */
    selectTool(tool) {
        this.selectedTool = tool;
        
        // Update button styles
        document.querySelectorAll('#toolButtons button').forEach(btn => {
            if (btn.dataset.tool === tool) {
                btn.style.background = '#0066cc';
                btn.style.borderColor = '#0088ff';
            } else {
                btn.style.background = '#333';
                btn.style.borderColor = '#555';
            }
        });
        
        // Update asset library display
        this.updateAssetLibrary();
    }
    
    /**
     * Update asset library display based on selected tool
     */
    updateAssetLibrary() {
        this.assetLibrary.innerHTML = '';
        
        let assets = [];
        switch (this.selectedTool) {
            case 'tile':
                assets = this.assetCategories.tiles;
                break;
            case 'decoration':
                assets = this.assetCategories.decorations;
                break;
            case 'building':
                assets = this.assetCategories.buildings;
                break;
            case 'character':
                assets = this.assetCategories.characters;
                break;
        }
        
        if (assets.length === 0) {
            this.assetLibrary.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #888;">No assets in this category</div>';
            return;
        }
        
        assets.forEach(asset => {
            const assetBtn = document.createElement('div');
            assetBtn.style.cssText = `
                width: 90px;
                height: 90px;
                background: #222;
                border: 2px solid #444;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 5px;
                transition: all 0.2s;
            `;
            
            // Create canvas for asset preview
            const canvas = document.createElement('canvas');
            canvas.width = 70;
            canvas.height = 70;
            const ctx = canvas.getContext('2d');
            
            // Draw asset preview
            const scale = Math.min(70 / asset.img.width, 70 / asset.img.height);
            const w = asset.img.width * scale;
            const h = asset.img.height * scale;
            const x = (70 - w) / 2;
            const y = (70 - h) / 2;
            ctx.drawImage(asset.img, x, y, w, h);
            
            assetBtn.appendChild(canvas);
            
            // Asset name
            const nameLabel = document.createElement('div');
            nameLabel.textContent = asset.name.substring(0, 10) + (asset.name.length > 10 ? '...' : '');
            nameLabel.style.cssText = `
                font-size: 9px;
                margin-top: 3px;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 100%;
            `;
            nameLabel.title = asset.name;
            assetBtn.appendChild(nameLabel);
            
            // Click handler
            assetBtn.onclick = () => this.selectAsset(asset);
            assetBtn.dataset.assetName = asset.name;
            
            this.assetLibrary.appendChild(assetBtn);
        });
    }
    
    /**
     * Select an asset
     */
    selectAsset(asset) {
        this.selectedAsset = asset;
        
        // Update asset button styles
        document.querySelectorAll('#assetLibrary > div').forEach(btn => {
            if (btn.dataset.assetName === asset.name) {
                btn.style.borderColor = '#0088ff';
                btn.style.background = '#003366';
            } else {
                btn.style.borderColor = '#444';
                btn.style.background = '#222';
            }
        });
        
        // Update info panel
        document.getElementById('selectedInfo').textContent = asset.name;
        
        console.log('Selected asset:', asset.name);
    }
    
    /**
     * Toggle editor visibility
     */
    toggle() {
        this.visible = !this.visible;
        this.panel.style.display = this.visible ? 'block' : 'none';
        
        if (this.visible && this.selectedTool === 'tile') {
            this.selectTool('tile');
        }
        
        console.log('Editor UI:', this.visible ? 'shown' : 'hidden');
    }
    
    /**
     * Check if editor is visible
     */
    isVisible() {
        return this.visible;
    }
    
    /**
     * Get selected asset
     */
    getSelectedAsset() {
        return this.selectedAsset;
    }
    
    /**
     * Get selected tool
     */
    getSelectedTool() {
        return this.selectedTool;
    }
}
