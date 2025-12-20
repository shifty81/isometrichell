#!/usr/bin/env python3
"""
Character Tile Extractor Utility

This script extracts individual character frames from sprite sheets in
assets/Charachters/Player/ and saves them to assets/individual/charachter/player/
for easy use in the game.

Each sprite sheet is a 7x4 grid of 256x256 tiles (28 frames per animation).
"""

import os
import sys
from pathlib import Path
from PIL import Image


def extract_character_tiles(input_path, output_dir, animation_name):
    """
    Extract individual character frames from a sprite sheet.
    
    Args:
        input_path: Path to the input sprite sheet image
        output_dir: Directory where individual tiles will be saved
        animation_name: Name of the animation (e.g., 'Idle', 'Run', 'Attack1')
    
    Returns:
        Number of tiles extracted
    """
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Open the sprite sheet
    img = Image.open(input_path)
    width, height = img.size
    
    # Character sprites are 256x256 in a 7x4 grid
    tile_width = 256
    tile_height = 256
    cols = width // tile_width
    rows = height // tile_height
    
    print(f"Processing {animation_name}...")
    print(f"  Input: {input_path}")
    print(f"  Size: {width}x{height}")
    print(f"  Grid: {cols}x{rows} = {cols * rows} frames")
    print(f"  Tile size: {tile_width}x{tile_height}")
    print(f"  Output: {output_dir}/")
    
    # Extract each tile
    tile_num = 0
    for row in range(rows):
        for col in range(cols):
            # Calculate position
            x = col * tile_width
            y = row * tile_height
            
            # Crop the tile
            tile = img.crop((x, y, x + tile_width, y + tile_height))
            
            # Save the tile with descriptive name
            output_file = os.path.join(output_dir, f"{animation_name}-{tile_num:03d}.png")
            tile.save(output_file, 'PNG')
            
            tile_num += 1
    
    print(f"  Created {tile_num} tiles\n")
    return tile_num


def main():
    # Get the project root directory
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    assets_dir = project_root / 'assets'
    
    # Input: assets/Charachters/Player/
    input_dir = assets_dir / 'Charachters' / 'Player'
    
    # Output: assets/individual/charachter/player/
    output_base_dir = assets_dir / 'individual' / 'charachter' / 'player'
    
    print("=" * 70)
    print("Character Tile Extractor")
    print("=" * 70)
    print()
    
    # Check if input directory exists
    if not input_dir.exists():
        print(f"Error: Input directory not found: {input_dir}")
        sys.exit(1)
    
    # Get all PNG files in the Player directory
    sprite_sheets = sorted(input_dir.glob('*.png'))
    
    if not sprite_sheets:
        print(f"Error: No PNG files found in {input_dir}")
        sys.exit(1)
    
    print(f"Found {len(sprite_sheets)} sprite sheets to process")
    print()
    
    total_tiles = 0
    
    # Process each sprite sheet
    for sprite_sheet in sprite_sheets:
        # Get animation name from filename (e.g., 'Idle.png' -> 'Idle')
        animation_name = sprite_sheet.stem
        
        # Create output directory for this animation
        output_dir = output_base_dir / animation_name
        
        # Extract tiles
        tiles = extract_character_tiles(
            str(sprite_sheet),
            str(output_dir),
            animation_name
        )
        total_tiles += tiles
    
    print("=" * 70)
    print(f"Complete! Extracted {total_tiles} character tiles from {len(sprite_sheets)} animations")
    print(f"Location: {output_base_dir}")
    print(f"Original sprite sheets remain at: {input_dir}")
    print("=" * 70)


if __name__ == '__main__':
    main()
