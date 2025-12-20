#!/usr/bin/env python3
"""
Tile Sheet Splitter Utility

This script splits tilesheet images into individual tiles and organizes them
into the assets/individual/ directory structure for easy use in the map editor.
"""

import os
import sys
import subprocess
from pathlib import Path


def split_tilesheet(input_path, output_dir, tile_width, tile_height, cols, rows, prefix):
    """
    Split a tilesheet into individual tiles using ImageMagick.
    
    Args:
        input_path: Path to the input tilesheet image
        output_dir: Directory where individual tiles will be saved
        tile_width: Width of each tile in pixels
        tile_height: Height of each tile in pixels
        cols: Number of columns in the tilesheet
        rows: Number of rows in the tilesheet
        prefix: Prefix for output filenames
    """
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"Splitting {input_path}...")
    print(f"  Tile size: {tile_width}x{tile_height}")
    print(f"  Grid: {cols}x{rows} = {cols * rows} tiles")
    print(f"  Output: {output_dir}/")
    
    # Use ImageMagick's convert with crop to split the image
    # Format: convert input.png -crop WxH+X+Y output-%d.png
    tile_num = 0
    for row in range(rows):
        for col in range(cols):
            x = col * tile_width
            y = row * tile_height
            
            output_file = os.path.join(output_dir, f"{prefix}-{tile_num:03d}.png")
            
            cmd = [
                'convert',
                input_path,
                '-crop', f'{tile_width}x{tile_height}+{x}+{y}',
                '+repage',  # Remove virtual canvas
                output_file
            ]
            
            try:
                subprocess.run(cmd, check=True, capture_output=True)
                tile_num += 1
            except subprocess.CalledProcessError as e:
                print(f"  Error processing tile at ({col}, {row}): {e.stderr.decode()}")
    
    print(f"  Created {tile_num} tiles\n")
    return tile_num


def main():
    # Get the project root directory
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    assets_dir = project_root / 'assets'
    individual_dir = assets_dir / 'individual'
    
    print("=" * 70)
    print("Tile Sheet Splitter")
    print("=" * 70)
    print()
    
    total_tiles = 0
    
    # Process ground tiles (64x32 versions)
    print("Processing Ground Tiles (64x32)...")
    print("-" * 70)
    
    ground_tiles_64 = [
        ('grass_green_64x32.png', 'grass_green_64x32'),
        ('grass_dry_64x32.png', 'grass_dry_64x32'),
        ('grass_medium_64x32.png', 'grass_medium_64x32'),
        ('dirt_64x32.png', 'dirt_64x32'),
        ('dirt_dark_64x32.png', 'dirt_dark_64x32'),
        ('sand_64x32.png', 'sand_64x32'),
        ('stone_path_64x32.png', 'stone_path_64x32'),
        ('forest_ground_64x32.png', 'forest_ground_64x32'),
    ]
    
    for filename, prefix in ground_tiles_64:
        input_path = assets_dir / 'ground_tiles_sheets' / filename
        if input_path.exists():
            output_dir = individual_dir / 'ground_tiles' / prefix
            tiles = split_tilesheet(
                str(input_path),
                str(output_dir),
                tile_width=64,
                tile_height=32,
                cols=8,
                rows=7,
                prefix=prefix
            )
            total_tiles += tiles
        else:
            print(f"  Skipping {filename} (not found)\n")
    
    # Process ground tiles (128x64 versions)
    print("Processing Ground Tiles (128x64)...")
    print("-" * 70)
    
    ground_tiles_128 = [
        ('grass_green_128x64.png', 'grass_green_128x64'),
        ('grass_dry_128x64.png', 'grass_dry_128x64'),
        ('grass_medium_128x64.png', 'grass_medium_128x64'),
        ('dirt_128x64.png', 'dirt_128x64'),
        ('dirt_dark_128x64.png', 'dirt_dark_128x64'),
        ('sand_128x64.png', 'sand_128x64'),
        ('stone_path_128x64.png', 'stone_path_128x64'),
        ('forest_ground_128x64.png', 'forest_ground_128x64'),
    ]
    
    for filename, prefix in ground_tiles_128:
        input_path = assets_dir / 'ground_tiles_sheets' / filename
        if input_path.exists():
            output_dir = individual_dir / 'ground_tiles' / prefix
            tiles = split_tilesheet(
                str(input_path),
                str(output_dir),
                tile_width=128,
                tile_height=64,
                cols=8,
                rows=7,
                prefix=prefix
            )
            total_tiles += tiles
        else:
            print(f"  Skipping {filename} (not found)\n")
    
    # Process tree sheets (64x64 sprites in 10x7 grid)
    print("Processing Tree Sheets (64x64)...")
    print("-" * 70)
    
    tree_sheets_64 = [
        ('trees_64x32_shaded.png', 'trees_64x32_shaded'),
        ('trees_64x32_no_shadow.png', 'trees_64x32_no_shadow'),
        ('trees_64x32_cloudy.png', 'trees_64x32_cloudy'),
    ]
    
    for filename, prefix in tree_sheets_64:
        input_path = assets_dir / 'isometric_trees_pack' / 'sheets' / filename
        if input_path.exists():
            output_dir = individual_dir / 'trees' / prefix
            tiles = split_tilesheet(
                str(input_path),
                str(output_dir),
                tile_width=64,
                tile_height=64,
                cols=10,
                rows=7,
                prefix=prefix
            )
            total_tiles += tiles
        else:
            print(f"  Skipping {filename} (not found)\n")
    
    # Process tree sheets (128x128 sprites in 10x7 grid)
    print("Processing Tree Sheets (128x128)...")
    print("-" * 70)
    
    tree_sheets_128 = [
        ('trees_128x64_shaded.png', 'trees_128x64_shaded'),
        ('trees_128x64_no_shadow.png', 'trees_128x64_no_shadow'),
        ('trees_128x64_cloudy.png', 'trees_128x64_cloudy'),
    ]
    
    for filename, prefix in tree_sheets_128:
        input_path = assets_dir / 'isometric_trees_pack' / 'sheets' / filename
        if input_path.exists():
            output_dir = individual_dir / 'trees' / prefix
            tiles = split_tilesheet(
                str(input_path),
                str(output_dir),
                tile_width=128,
                tile_height=128,
                cols=10,
                rows=7,
                prefix=prefix
            )
            total_tiles += tiles
        else:
            print(f"  Skipping {filename} (not found)\n")
    
    print("=" * 70)
    print(f"Complete! Created {total_tiles} individual tiles")
    print(f"Location: {individual_dir}")
    print("=" * 70)


if __name__ == '__main__':
    main()
