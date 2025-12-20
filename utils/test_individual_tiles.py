#!/usr/bin/env python3
"""
Test individual tiles were created correctly.
Verifies file existence, image dimensions, and proper PNG format.
"""

import os
from pathlib import Path
from PIL import Image


def test_ground_tiles():
    """Test that ground tiles were created with correct dimensions."""
    assets_dir = Path(__file__).parent.parent / 'assets' / 'individual' / 'ground_tiles'
    
    tests = [
        ('grass_green_64x32', 64, 32, 56),
        ('grass_green_128x64', 128, 64, 56),
        ('dirt_64x32', 64, 32, 56),
        ('dirt_128x64', 128, 64, 56),
    ]
    
    print("Testing Ground Tiles...")
    print("-" * 60)
    
    for tileset, width, height, expected_count in tests:
        tileset_dir = assets_dir / tileset
        
        if not tileset_dir.exists():
            print(f"❌ {tileset}: Directory not found")
            continue
        
        # Count PNG files
        tiles = list(tileset_dir.glob('*.png'))
        tile_count = len(tiles)
        
        if tile_count != expected_count:
            print(f"⚠️  {tileset}: Found {tile_count} tiles, expected {expected_count}")
        else:
            print(f"✅ {tileset}: {tile_count} tiles")
        
        # Check first tile dimensions
        if tiles:
            first_tile = tiles[0]
            try:
                img = Image.open(first_tile)
                if img.width == width and img.height == height:
                    print(f"   └─ Dimensions: {img.width}×{img.height} ✓")
                else:
                    print(f"   └─ Dimensions: {img.width}×{img.height} (expected {width}×{height}) ✗")
            except Exception as e:
                print(f"   └─ Error reading image: {e}")
    
    print()


def test_tree_tiles():
    """Test that tree tiles were created with correct dimensions."""
    assets_dir = Path(__file__).parent.parent / 'assets' / 'individual' / 'trees'
    
    tests = [
        ('trees_64x32_shaded', 64, 64, 70),
        ('trees_128x64_shaded', 128, 128, 70),
    ]
    
    print("Testing Tree Tiles...")
    print("-" * 60)
    
    for tileset, width, height, expected_count in tests:
        tileset_dir = assets_dir / tileset
        
        if not tileset_dir.exists():
            print(f"❌ {tileset}: Directory not found")
            continue
        
        # Count PNG files
        tiles = list(tileset_dir.glob('*.png'))
        tile_count = len(tiles)
        
        if tile_count != expected_count:
            print(f"⚠️  {tileset}: Found {tile_count} tiles, expected {expected_count}")
        else:
            print(f"✅ {tileset}: {tile_count} tiles")
        
        # Check first tile dimensions
        if tiles:
            first_tile = tiles[0]
            try:
                img = Image.open(first_tile)
                if img.width == width and img.height == height:
                    print(f"   └─ Dimensions: {img.width}×{img.height} ✓")
                else:
                    print(f"   └─ Dimensions: {img.width}×{img.height} (expected {width}×{height}) ✗")
            except Exception as e:
                print(f"   └─ Error reading image: {e}")
    
    print()


def test_directory_structure():
    """Test that the directory structure is correct."""
    base_dir = Path(__file__).parent.parent / 'assets' / 'individual'
    
    expected_dirs = [
        'ground_tiles',
        'trees',
        'vehicles',
        'buildings',
        'characters',
        'props',
    ]
    
    print("Testing Directory Structure...")
    print("-" * 60)
    
    for dir_name in expected_dirs:
        dir_path = base_dir / dir_name
        if dir_path.exists():
            # Count subdirectories
            subdirs = [d for d in dir_path.iterdir() if d.is_dir()]
            if subdirs:
                print(f"✅ {dir_name}/: {len(subdirs)} tilesets")
            else:
                print(f"⚠️  {dir_name}/: Empty (ready for content)")
        else:
            print(f"❌ {dir_name}/: Not found")
    
    print()


def summary():
    """Print summary statistics."""
    base_dir = Path(__file__).parent.parent / 'assets' / 'individual'
    
    print("Summary Statistics")
    print("=" * 60)
    
    # Count all PNG files
    total_tiles = 0
    total_size = 0
    
    for png_file in base_dir.rglob('*.png'):
        total_tiles += 1
        total_size += png_file.stat().st_size
    
    print(f"Total Individual Tiles: {total_tiles:,}")
    print(f"Total Disk Space: {total_size / (1024*1024):.2f} MB")
    
    # Count tilesets
    ground_tilesets = len([d for d in (base_dir / 'ground_tiles').iterdir() if d.is_dir()])
    tree_tilesets = len([d for d in (base_dir / 'trees').iterdir() if d.is_dir()])
    
    print(f"Ground Tile Tilesets: {ground_tilesets}")
    print(f"Tree Tilesets: {tree_tilesets}")
    print()


def main():
    print("=" * 60)
    print("Individual Tiles Test Suite")
    print("=" * 60)
    print()
    
    test_directory_structure()
    test_ground_tiles()
    test_tree_tiles()
    summary()
    
    print("✅ All tests complete!")


if __name__ == '__main__':
    main()
