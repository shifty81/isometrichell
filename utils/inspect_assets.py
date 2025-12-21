#!/usr/bin/env python3
"""
Asset Inspector

This tool examines sprite sheets and assets to determine the best approach:
- Use as sprite sheet (if viable for project)
- Extract to individual tiles (if sprite sheet not suitable)
- Modify/resize (if dimensions don't match project needs)

Provides recommendations based on image dimensions, grid layout, and project requirements.
"""

import os
import sys
from pathlib import Path
try:
    from PIL import Image
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False
    print("Warning: PIL/Pillow not available. Install with: pip install Pillow")


class AssetInspector:
    """
    Inspects assets and provides recommendations for integration.
    """
    
    # Project standards for isometric tiles
    STANDARD_TILE_SIZES = [
        (32, 32),   # Small isometric sprites
        (64, 32),   # Standard isometric diamond
        (64, 64),   # Standard square sprites
        (128, 64),  # High-res isometric diamond
        (128, 128), # High-res square sprites
    ]
    
    COMMON_GRID_SIZES = [
        (4, 4), (8, 8), (10, 7), (16, 16)
    ]
    
    def __init__(self, project_root):
        self.project_root = Path(project_root)
        self.assets_dir = self.project_root / 'assets'
        
    def inspect_image(self, image_path, verbose=True):
        """
        Inspect an image file and provide recommendations.
        
        Returns dict with:
        - viable_as_sheet: bool
        - recommendation: str
        - details: dict
        """
        if not PIL_AVAILABLE:
            return {
                "viable_as_sheet": False,
                "recommendation": "Cannot inspect - PIL not available",
                "details": {}
            }
        
        try:
            img = Image.open(image_path)
            width, height = img.size
            mode = img.mode
            
            result = {
                "file": image_path.name,
                "dimensions": f"{width}x{height}",
                "mode": mode,
                "has_alpha": mode in ('RGBA', 'LA', 'PA'),
                "file_size": image_path.stat().st_size / 1024,  # KB
            }
            
            if verbose:
                print(f"\n{'=' * 70}")
                print(f"Inspecting: {image_path.name}")
                print(f"{'=' * 70}")
                print(f"  Dimensions: {width}x{height}")
                print(f"  Color Mode: {mode}")
                print(f"  Has Alpha: {'Yes' if result['has_alpha'] else 'No'}")
                print(f"  File Size: {result['file_size']:.2f} KB")
            
            # Check if dimensions suggest a sprite sheet (power of 2, or common sizes)
            is_power_of_2 = (width & (width - 1)) == 0 and (height & (height - 1)) == 0
            is_large = width >= 128 and height >= 128
            
            # Try to detect grid patterns
            grid_info = self._detect_grid(width, height, verbose)
            
            result.update(grid_info)
            
            # Determine viability
            if grid_info['suggested_grids']:
                result['viable_as_sheet'] = True
                result['recommendation'] = "✅ VIABLE AS SPRITE SHEET"
                
                if verbose:
                    print(f"\n  {'=' * 66}")
                    print(f"  ✅ Recommendation: USE AS SPRITE SHEET")
                    print(f"  {'=' * 66}")
                    print(f"  This image appears to be a sprite sheet.")
                    print(f"  Suggested grid layouts:")
                    for grid, sprite_size in grid_info['suggested_grids']:
                        tiles = grid[0] * grid[1]
                        print(f"    - {grid[0]}x{grid[1]} grid = {tiles} sprites of {sprite_size[0]}x{sprite_size[1]}px")
                    print(f"\n  Action: Use create_sprite_metadata.py to generate metadata")
                    
            elif is_large and len(grid_info['possible_extractions']) > 0:
                result['viable_as_sheet'] = False
                result['recommendation'] = "⚠️ EXTRACT INDIVIDUAL TILES"
                
                if verbose:
                    print(f"\n  {'=' * 66}")
                    print(f"  ⚠️  Recommendation: EXTRACT TO INDIVIDUAL TILES")
                    print(f"  {'=' * 66}")
                    print(f"  Image doesn't match standard grid patterns.")
                    print(f"  Possible extraction options:")
                    for option in grid_info['possible_extractions'][:3]:
                        print(f"    - {option}")
                    print(f"\n  Action: Use split_tilesheets.py or manual extraction")
                    
            elif width < 64 or height < 64:
                result['viable_as_sheet'] = False
                result['recommendation'] = "📝 INDIVIDUAL TILE"
                
                if verbose:
                    print(f"\n  {'=' * 66}")
                    print(f"  📝 Recommendation: USE AS INDIVIDUAL TILE")
                    print(f"  {'=' * 66}")
                    print(f"  Image is small, likely already an individual tile.")
                    print(f"\n  Action: Copy directly to assets/individual/")
                    
            else:
                result['viable_as_sheet'] = False
                result['recommendation'] = "🔍 NEEDS MANUAL REVIEW"
                
                if verbose:
                    print(f"\n  {'=' * 66}")
                    print(f"  🔍 Recommendation: MANUAL REVIEW NEEDED")
                    print(f"  {'=' * 66}")
                    print(f"  Cannot determine optimal usage automatically.")
                    print(f"  Please inspect image manually to decide:")
                    print(f"    - If it contains multiple sprites: extract or create metadata")
                    print(f"    - If it's a single asset: use as-is")
                    print(f"    - If size is wrong: resize to standard dimensions")
            
            # Check if resize is recommended
            resize_recommendation = self._check_resize_needed(width, height)
            if resize_recommendation:
                result['resize_recommendation'] = resize_recommendation
                if verbose:
                    print(f"\n  💡 Size Adjustment Recommendation:")
                    print(f"     {resize_recommendation}")
            
            return result
            
        except Exception as e:
            print(f"  ❌ Error inspecting {image_path.name}: {e}")
            return {
                "viable_as_sheet": False,
                "recommendation": f"Error: {e}",
                "details": {}
            }
    
    def _detect_grid(self, width, height, verbose=False):
        """Detect possible grid layouts in the image."""
        suggested_grids = []
        possible_extractions = []
        
        # Check against standard tile sizes
        for tile_w, tile_h in self.STANDARD_TILE_SIZES:
            if width % tile_w == 0 and height % tile_h == 0:
                cols = width // tile_w
                rows = height // tile_h
                
                # Check if it's a reasonable grid
                if cols >= 2 and rows >= 2 and cols <= 32 and rows <= 32:
                    suggested_grids.append(((cols, rows), (tile_w, tile_h)))
                elif cols >= 1 and rows >= 1:
                    possible_extractions.append(
                        f"Extract {cols}x{rows} tiles of {tile_w}x{tile_h}px"
                    )
        
        # Sort by total sprites (prefer grids with more sprites)
        suggested_grids.sort(key=lambda x: x[0][0] * x[0][1], reverse=True)
        
        return {
            'suggested_grids': suggested_grids,
            'possible_extractions': possible_extractions
        }
    
    def _check_resize_needed(self, width, height):
        """Check if image should be resized to match project standards."""
        # Check if dimensions are close to standard sizes
        for std_w, std_h in self.STANDARD_TILE_SIZES:
            # If within 10% of standard size, suggest resize
            if abs(width - std_w) / std_w < 0.1 and abs(height - std_h) / std_h < 0.1:
                if width != std_w or height != std_h:
                    return f"Consider resizing from {width}x{height} to {std_w}x{std_h} (standard size)"
        
        # Check if dimensions are odd numbers (prefer even dimensions)
        if width % 2 != 0 or height % 2 != 0:
            new_w = width if width % 2 == 0 else width + 1
            new_h = height if height % 2 == 0 else height + 1
            return f"Consider resizing to {new_w}x{new_h} (even dimensions)"
        
        return None
    
    def inspect_directory(self, directory, pattern="*.png", summary=True):
        """Inspect all images in a directory."""
        dir_path = Path(directory)
        
        if not dir_path.exists():
            print(f"Directory not found: {directory}")
            return []
        
        images = list(dir_path.glob(pattern))
        
        if not images:
            print(f"No images found matching {pattern} in {directory}")
            return []
        
        print(f"\n{'=' * 70}")
        print(f"Inspecting Directory: {dir_path.relative_to(self.project_root)}")
        print(f"{'=' * 70}")
        print(f"Found {len(images)} images matching {pattern}")
        
        results = []
        for img_path in sorted(images):
            result = self.inspect_image(img_path, verbose=True)
            results.append(result)
        
        if summary and len(results) > 1:
            self._print_summary(results)
        
        return results
    
    def _print_summary(self, results):
        """Print summary of inspection results."""
        print(f"\n{'=' * 70}")
        print("SUMMARY")
        print(f"{'=' * 70}")
        
        viable_sheets = sum(1 for r in results if r.get('viable_as_sheet'))
        need_extraction = sum(1 for r in results if r.get('recommendation') == "⚠️ EXTRACT INDIVIDUAL TILES")
        individual = sum(1 for r in results if r.get('recommendation') == "📝 INDIVIDUAL TILE")
        needs_review = sum(1 for r in results if r.get('recommendation') == "🔍 NEEDS MANUAL REVIEW")
        
        print(f"\n  ✅ Viable as sprite sheets: {viable_sheets}")
        print(f"  ⚠️  Need extraction: {need_extraction}")
        print(f"  📝 Individual tiles: {individual}")
        print(f"  🔍 Need manual review: {needs_review}")
        
        print(f"\n  Total images inspected: {len(results)}")
        
        print(f"\nNext Steps:")
        if viable_sheets > 0:
            print(f"  1. For sprite sheets: python3 utils/create_sprite_metadata.py")
        if need_extraction > 0:
            print(f"  2. For extraction: python3 utils/split_tilesheets.py")
        if individual > 0:
            print(f"  3. For individual tiles: Copy to assets/individual/")


def main():
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Inspect assets and determine if viable as sprite sheet or need extraction'
    )
    parser.add_argument(
        'path',
        nargs='?',
        help='Path to image file or directory to inspect'
    )
    parser.add_argument(
        '--vehicles',
        action='store_true',
        help='Inspect vehicle assets in TBD/vehicles'
    )
    parser.add_argument(
        '--ground-tiles',
        action='store_true',
        help='Inspect ground tile sheets'
    )
    parser.add_argument(
        '--trees',
        action='store_true',
        help='Inspect tree sprite sheets'
    )
    parser.add_argument(
        '--dungeon',
        action='store_true',
        help='Inspect dungeon pack assets'
    )
    parser.add_argument(
        '--tbd',
        action='store_true',
        help='Inspect all assets in TBD folder'
    )
    parser.add_argument(
        '--pattern',
        default='*.png',
        help='File pattern to match (default: *.png)'
    )
    
    args = parser.parse_args()
    
    # Get project root
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    if not PIL_AVAILABLE:
        print("\n❌ Error: PIL/Pillow is required for asset inspection")
        print("Install with: pip install Pillow")
        return 1
    
    inspector = AssetInspector(project_root)
    
    print("=" * 70)
    print("Asset Inspector")
    print("=" * 70)
    print("\nExamining assets to determine optimal usage...")
    
    # Inspect specific path
    if args.path:
        path = Path(args.path)
        if path.is_file():
            inspector.inspect_image(path)
        elif path.is_dir():
            inspector.inspect_directory(path, args.pattern)
        else:
            print(f"Path not found: {args.path}")
            return 1
    
    # Inspect predefined categories
    elif args.vehicles:
        vehicles_dir = project_root / 'assets' / 'TBD' / 'vehicles' / 'isometric_vehicles'
        inspector.inspect_directory(vehicles_dir)
    
    elif args.ground_tiles:
        ground_dir = project_root / 'assets' / 'ground_tiles_sheets'
        inspector.inspect_directory(ground_dir)
    
    elif args.trees:
        trees_dir = project_root / 'assets' / 'isometric_trees_pack' / 'sheets'
        inspector.inspect_directory(trees_dir)
    
    elif args.dungeon:
        dungeon_dir = project_root / 'assets' / 'TBD' / 'dungeon_pack'
        print("\nNote: Dungeon pack contains many files. Inspecting top-level...")
        inspector.inspect_directory(dungeon_dir, recursive=False)
    
    elif args.tbd:
        tbd_dir = project_root / 'assets' / 'TBD'
        print("\nInspecting all PNG files in TBD folder...")
        # Find all PNG files
        for subdir in tbd_dir.iterdir():
            if subdir.is_dir():
                png_files = list(subdir.rglob('*.png'))
                if png_files:
                    print(f"\nSubdirectory: {subdir.name} ({len(png_files)} images)")
    
    else:
        parser.print_help()
        print("\n" + "=" * 70)
        print("Examples:")
        print("  python3 utils/inspect_assets.py assets/sprite.png")
        print("  python3 utils/inspect_assets.py --vehicles")
        print("  python3 utils/inspect_assets.py --ground-tiles")
        print("  python3 utils/inspect_assets.py assets/TBD/vehicles/")
        print("=" * 70)
    
    return 0


if __name__ == '__main__':
    sys.exit(main())
