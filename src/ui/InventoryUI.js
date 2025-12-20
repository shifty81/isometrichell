/**
 * Inventory UI
 * Visual interface for managing player inventory
 */
class InventoryUI {
    constructor(canvas, ctx, inventorySystem) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.inventorySystem = inventorySystem;
        this.isOpen = false;
        
        // UI layout
        this.panel = {
            x: 100,
            y: 100,
            width: 800,
            height: 600
        };
        
        // Slot rendering
        this.slotSize = 64;
        this.slotSpacing = 8;
        
        // Dragging state
        this.draggedItem = null;
        this.dragSourceLocation = null;
        this.mousePos = { x: 0, y: 0 };
        this.hoveredSlot = null;
        
        this._setupEventListeners();
    }

    /**
     * Setup event listeners
     */
    _setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => {
            if (!this.isOpen) return;
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this._handleMouseDown(x, y);
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.isOpen) return;
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.mousePos = { x, y };
            this._updateHoveredSlot(x, y);
        });

        this.canvas.addEventListener('mouseup', (e) => {
            if (!this.isOpen) return;
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this._handleMouseUp(x, y);
        });

        this.canvas.addEventListener('click', (e) => {
            if (!this.isOpen) return;
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this._handleClick(x, y);
        });
    }

    /**
     * Handle click events
     */
    _handleClick(x, y) {
        // Check close button
        const buttonSize = 30;
        const buttonX = this.panel.x + this.panel.width - buttonSize - 10;
        const buttonY = this.panel.y + 10;
        
        if (x >= buttonX && x <= buttonX + buttonSize &&
            y >= buttonY && y <= buttonY + buttonSize) {
            this.close();
            return;
        }
    }

    /**
     * Handle mouse down
     */
    _handleMouseDown(x, y) {
        // Check if clicking on an item
        const slot = this._getSlotAtPosition(x, y);
        if (slot && slot.item) {
            this.draggedItem = slot.item;
            this.dragSourceLocation = slot.location;
        }
    }

    /**
     * Handle mouse up
     */
    _handleMouseUp(x, y) {
        if (!this.draggedItem) return;

        const targetSlot = this._getSlotAtPosition(x, y);
        
        if (targetSlot && !targetSlot.item) {
            // Attempt to move item to target slot
            this._moveItem(this.dragSourceLocation, targetSlot.location);
        }

        // Reset drag state
        this.draggedItem = null;
        this.dragSourceLocation = null;
    }

    /**
     * Move item between slots
     */
    _moveItem(source, target) {
        // TODO: Implement full drag-and-drop item movement
        // This requires more complex logic to handle different slot types,
        // container transfers, and item swapping
        console.log('Move item from', source, 'to', target);
        console.log('Note: Full drag-and-drop will be implemented in future update');
    }

    /**
     * Get slot at screen position
     */
    _getSlotAtPosition(x, y) {
        // Check equipment slots
        const equipSlots = this._getEquipmentSlotPositions();
        for (const [name, pos] of Object.entries(equipSlots)) {
            if (x >= pos.x && x <= pos.x + this.slotSize &&
                y >= pos.y && y <= pos.y + this.slotSize) {
                return {
                    location: { type: 'equipment', slot: name },
                    item: this.inventorySystem.getEquipped(name),
                    position: pos
                };
            }
        }

        // Check pocket slots
        const pocketPositions = this._getPocketSlotPositions();
        for (let i = 0; i < pocketPositions.length; i++) {
            const pos = pocketPositions[i];
            if (x >= pos.x && x <= pos.x + this.slotSize &&
                y >= pos.y && y <= pos.y + this.slotSize) {
                const pocket = this.inventorySystem.pockets[i];
                return {
                    location: { type: 'pocket', index: i },
                    item: pocket.item,
                    position: pos
                };
            }
        }

        return null;
    }

    /**
     * Update hovered slot
     */
    _updateHoveredSlot(x, y) {
        this.hoveredSlot = this._getSlotAtPosition(x, y);
    }

    /**
     * Get equipment slot positions
     */
    _getEquipmentSlotPositions() {
        const baseX = this.panel.x + 50;
        const baseY = this.panel.y + 100;
        
        return {
            head: { x: baseX + 80, y: baseY },
            body: { x: baseX + 80, y: baseY + 80 },
            hand_left: { x: baseX, y: baseY + 80 },
            hand_right: { x: baseX + 160, y: baseY + 80 },
            back: { x: baseX + 80, y: baseY + 160 },
            feet: { x: baseX + 80, y: baseY + 240 }
        };
    }

    /**
     * Get pocket slot positions
     */
    _getPocketSlotPositions() {
        const baseX = this.panel.x + 300;
        const baseY = this.panel.y + 100;
        const positions = [];
        
        for (let i = 0; i < 4; i++) {
            positions.push({
                x: baseX + (i % 2) * (this.slotSize + this.slotSpacing),
                y: baseY + Math.floor(i / 2) * (this.slotSize + this.slotSpacing)
            });
        }
        
        return positions;
    }

    /**
     * Toggle inventory open/closed
     */
    toggle() {
        this.isOpen = !this.isOpen;
    }

    /**
     * Open inventory
     */
    open() {
        this.isOpen = true;
    }

    /**
     * Close inventory
     */
    close() {
        this.isOpen = false;
    }

    /**
     * Render inventory UI
     */
    render() {
        if (!this.isOpen) return;

        // Semi-transparent background overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Panel background
        this.ctx.fillStyle = 'rgba(30, 30, 30, 0.95)';
        this.ctx.fillRect(this.panel.x, this.panel.y, this.panel.width, this.panel.height);

        // Panel border
        this.ctx.strokeStyle = '#4CAF50';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(this.panel.x, this.panel.y, this.panel.width, this.panel.height);

        // Title
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.font = 'bold 28px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Inventory', this.panel.x + 20, this.panel.y + 40);

        // Render equipment slots
        this._renderEquipmentSlots();

        // Render pocket slots
        this._renderPocketSlots();

        // Render container area
        this._renderContainerArea();

        // Render stats
        this._renderStats();

        // Render tooltip if hovering over item
        if (this.hoveredSlot && this.hoveredSlot.item) {
            this._renderTooltip(this.hoveredSlot.item);
        }

        // Render dragged item
        if (this.draggedItem) {
            this._renderDraggedItem();
        }

        // Close button
        this._renderCloseButton();
    }

    /**
     * Render equipment slots
     */
    _renderEquipmentSlots() {
        const positions = this._getEquipmentSlotPositions();
        const slotLabels = {
            head: 'Head',
            body: 'Body',
            hand_left: 'Left Hand',
            hand_right: 'Right Hand',
            back: 'Back',
            feet: 'Feet'
        };

        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';

        for (const [slotName, pos] of Object.entries(positions)) {
            // Slot background
            this.ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
            this.ctx.fillRect(pos.x, pos.y, this.slotSize, this.slotSize);

            // Slot border
            const isHovered = this.hoveredSlot && 
                            this.hoveredSlot.location.type === 'equipment' &&
                            this.hoveredSlot.location.slot === slotName;
            this.ctx.strokeStyle = isHovered ? '#4CAF50' : '#666666';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(pos.x, pos.y, this.slotSize, this.slotSize);

            // Slot label
            this.ctx.fillStyle = '#AAAAAA';
            this.ctx.font = '10px Arial';
            this.ctx.fillText(slotLabels[slotName], pos.x + this.slotSize / 2, pos.y - 5);

            // Render item if equipped
            const item = this.inventorySystem.getEquipped(slotName);
            if (item && item !== this.draggedItem) {
                this._renderItemIcon(item, pos.x, pos.y);
            }
        }
    }

    /**
     * Render pocket slots
     */
    _renderPocketSlots() {
        const positions = this._getPocketSlotPositions();

        // Section title
        this.ctx.fillStyle = '#CCCCCC';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Quick Access', this.panel.x + 300, this.panel.y + 80);

        for (let i = 0; i < positions.length; i++) {
            const pos = positions[i];
            const pocket = this.inventorySystem.pockets[i];

            // Slot background
            this.ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
            this.ctx.fillRect(pos.x, pos.y, this.slotSize, this.slotSize);

            // Slot border
            const isHovered = this.hoveredSlot && 
                            this.hoveredSlot.location.type === 'pocket' &&
                            this.hoveredSlot.location.index === i;
            this.ctx.strokeStyle = isHovered ? '#4CAF50' : '#666666';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(pos.x, pos.y, this.slotSize, this.slotSize);

            // Slot number
            this.ctx.fillStyle = '#666666';
            this.ctx.font = '10px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`${i + 1}`, pos.x + 10, pos.y + 12);

            // Render item if present
            if (pocket.item && pocket.item !== this.draggedItem) {
                this._renderItemIcon(pocket.item, pos.x, pos.y);
            }
        }
    }

    /**
     * Render container area
     */
    _renderContainerArea() {
        const baseX = this.panel.x + 300;
        const baseY = this.panel.y + 250;

        // Section title
        this.ctx.fillStyle = '#CCCCCC';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Containers', baseX, baseY - 10);

        // List containers
        const containers = this.inventorySystem.containers;
        if (containers.length === 0) {
            this.ctx.fillStyle = '#666666';
            this.ctx.font = '14px Arial';
            this.ctx.fillText('No containers equipped', baseX, baseY + 30);
        } else {
            let y = baseY + 10;
            for (const container of containers) {
                // Container name
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.font = 'bold 14px Arial';
                this.ctx.fillText(container.name, baseX, y);

                // Capacity bar
                const barWidth = 200;
                const barHeight = 12;
                const fillPercent = container.getTotalWeight() / container.capacity;
                
                this.ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
                this.ctx.fillRect(baseX, y + 5, barWidth, barHeight);
                
                this.ctx.fillStyle = fillPercent > 0.9 ? '#FF4444' : 
                                    fillPercent > 0.7 ? '#FFAA00' : '#4CAF50';
                this.ctx.fillRect(baseX, y + 5, barWidth * fillPercent, barHeight);
                
                this.ctx.strokeStyle = '#666666';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(baseX, y + 5, barWidth, barHeight);

                // Weight text
                this.ctx.fillStyle = '#AAAAAA';
                this.ctx.font = '12px Arial';
                this.ctx.fillText(
                    `${container.getTotalWeight().toFixed(1)}/${container.capacity} kg`,
                    baseX + barWidth + 10,
                    y + 15
                );

                y += 40;
            }
        }
    }

    /**
     * Render stats
     */
    _renderStats() {
        const baseX = this.panel.x + 550;
        const baseY = this.panel.y + 100;
        const summary = this.inventorySystem.getSummary();

        // Section title
        this.ctx.fillStyle = '#CCCCCC';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Stats', baseX, baseY - 10);

        // Stats
        const stats = [
            ['Weight:', `${summary.totalWeight}/${summary.totalCapacity} kg`],
            ['Items:', summary.itemCount],
            ['Toolbox:', summary.hasToolbox ? 'Yes' : 'No'],
            ['Status:', summary.overEncumbered ? '⚠️ Overencumbered' : '✓ OK']
        ];

        this.ctx.font = '14px Arial';
        let y = baseY + 10;
        
        for (const [label, value] of stats) {
            this.ctx.fillStyle = '#AAAAAA';
            this.ctx.fillText(label, baseX, y);
            
            this.ctx.fillStyle = summary.overEncumbered && label === 'Status:' ? '#FF4444' : '#FFFFFF';
            this.ctx.fillText(String(value), baseX + 100, y);
            
            y += 25;
        }
    }

    /**
     * Render item icon
     */
    _renderItemIcon(item, x, y) {
        // For now, render a colored square based on item type
        const typeColors = {
            tool: '#FFA726',
            container: '#66BB6A',
            consumable: '#42A5F5',
            deployable: '#AB47BC',
            wearable: '#EC407A'
        };

        this.ctx.fillStyle = typeColors[item.type] || '#CCCCCC';
        this.ctx.fillRect(x + 4, y + 4, this.slotSize - 8, this.slotSize - 8);

        // Item initial
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(item.name.charAt(0), x + this.slotSize / 2, y + this.slotSize / 2 + 8);
    }

    /**
     * Render tooltip
     */
    _renderTooltip(item) {
        const tooltipWidth = 250;
        const tooltipPadding = 10;
        const lineHeight = 20;
        const info = item.getInfo();
        const lines = Object.entries(info);

        const tooltipHeight = tooltipPadding * 2 + lines.length * lineHeight;
        
        // Position tooltip near mouse
        let x = this.mousePos.x + 20;
        let y = this.mousePos.y + 20;
        
        // Keep tooltip on screen
        if (x + tooltipWidth > this.canvas.width) {
            x = this.mousePos.x - tooltipWidth - 20;
        }
        if (y + tooltipHeight > this.canvas.height) {
            y = this.canvas.height - tooltipHeight;
        }

        // Tooltip background
        this.ctx.fillStyle = 'rgba(20, 20, 20, 0.95)';
        this.ctx.fillRect(x, y, tooltipWidth, tooltipHeight);

        // Tooltip border
        this.ctx.strokeStyle = '#4CAF50';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, tooltipWidth, tooltipHeight);

        // Tooltip text
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'left';
        let currentY = y + tooltipPadding + 15;

        for (const [key, value] of lines) {
            // Label
            this.ctx.fillStyle = '#AAAAAA';
            this.ctx.fillText(key + ':', x + tooltipPadding, currentY);

            // Value
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fillText(String(value), x + tooltipPadding + 100, currentY);

            currentY += lineHeight;
        }
    }

    /**
     * Render dragged item
     */
    _renderDraggedItem() {
        if (!this.draggedItem) return;

        const x = this.mousePos.x - this.slotSize / 2;
        const y = this.mousePos.y - this.slotSize / 2;

        // Semi-transparent item
        this.ctx.globalAlpha = 0.7;
        this._renderItemIcon(this.draggedItem, x, y);
        this.ctx.globalAlpha = 1.0;
    }

    /**
     * Render close button
     */
    _renderCloseButton() {
        const buttonSize = 30;
        const x = this.panel.x + this.panel.width - buttonSize - 10;
        const y = this.panel.y + 10;

        // Check if hovering
        const isHover = this.mousePos.x >= x && this.mousePos.x <= x + buttonSize &&
                       this.mousePos.y >= y && this.mousePos.y <= y + buttonSize;

        // Button background
        this.ctx.fillStyle = isHover ? '#FF5555' : '#CC0000';
        this.ctx.fillRect(x, y, buttonSize, buttonSize);

        // X symbol
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(x + 8, y + 8);
        this.ctx.lineTo(x + buttonSize - 8, y + buttonSize - 8);
        this.ctx.moveTo(x + buttonSize - 8, y + 8);
        this.ctx.lineTo(x + 8, y + buttonSize - 8);
        this.ctx.stroke();
    }
}
