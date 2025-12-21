#!/usr/bin/env python3
"""
TBD Asset Extractor

This script helps extract and organize assets from the assets/TBD/ folder
into individual tiles that can be used in the game editor and engine.
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path


class TBDAssetExtractor:
    """
    Extracts and organizes assets from the assets/TBD/ folder.
    
    This class handles extraction of unprocessed assets into individual files
    that can be used in the game editor and engine. Supports multiple asset
    types including vehicles, dungeon packs, and snow tilesets.
    
    Main Methods:
        - list_available_assets(): List all asset categories in TBD
        - extract_vehicles(): Copy vehicle sprite sheets
        - extract_dungeon_pack(): Extract dungeon pack tiles
        - extract_snow_tilesets(): Extract snow tileset assets
        
    Usage:
        extractor = TBDAssetExtractor(project_root)
        extractor.list_available_assets()
        extractor.extract_vehicles(verify_only=False)
    
    Output:
        Extracted files are placed in assets/individual/{category}/
    """
    
    # Patterns for files to skip during extraction
    SKIP_PATTERNS = ['collection', 'all']
    
    def __init__(self, project_root):
        self.project_root = Path(project_root)
        self.assets_dir = self.project_root / 'assets'
        self.tbd_dir = self.assets_dir / 'TBD'
        self.individual_dir = self.assets_dir / 'individual'
    
    def list_available_assets(self):
        """List all available asset categories in TBD folder."""
        print("=" * 70)
        print("Available Assets in TBD Folder")
        print("=" * 70)
        
        if not self.tbd_dir.exists():
            print("TBD folder not found!")
            return []
        
        categories = []
        for item in sorted(self.tbd_dir.iterdir()):
            if item.is_dir() and item.name not in ['tools_archives', 'loose_files']:
                png_count = len(list(item.rglob('*.png')))
                if png_count > 0:
                    categories.append(item.name)
                    print(f"\n  {item.name}/")
                    print(f"    PNG files: {png_count}")
                    
                    # Show subdirectories
                    subdirs = [d for d in item.iterdir() if d.is_dir()]
                    if subdirs:
                        print(f"    Subdirectories: {', '.join([d.name for d in subdirs[:5]])}")
                        if len(subdirs) > 5:
                            print(f"                    ... and {len(subdirs) - 5} more")
        
        print("\n" + "=" * 70)
        return categories
    
    def extract_tileset(self, input_path, tile_width, tile_height, cols, rows, output_category, prefix):
        """
        Extract a tileset into individual tiles.
        
        Args:
            input_path: Path to tileset image
            tile_width: Width of each tile
            tile_height: Height of each tile
            cols: Number of columns
            rows: Number of rows
            output_category: Category for output (e.g., 'vehicles', 'buildings')
            prefix: Prefix for output filenames
        """
        output_dir = self.individual_dir / output_category / prefix
        output_dir.mkdir(parents=True, exist_ok=True)
        
        print(f"\nExtracting {input_path.name}...")
        print(f"  Tile size: {tile_width}x{tile_height}")
        print(f"  Grid: {cols}x{rows} = {cols * rows} tiles")
        print(f"  Output: {output_dir.relative_to(self.project_root)}")
        
        tile_num = 0
        for row in range(rows):
            for col in range(cols):
                x = col * tile_width
                y = row * tile_height
                
                output_file = output_dir / f"{prefix}-{tile_num:03d}.png"
                
                cmd = [
                    'convert',
                    str(input_path),
                    '-crop', f'{tile_width}x{tile_height}+{x}+{y}',
                    '+repage',
                    str(output_file)
                ]
                
                try:
                    subprocess.run(cmd, check=True, capture_output=True)
                    tile_num += 1
                except subprocess.CalledProcessError as e:
                    print(f"  Error at tile ({col}, {row}): {e.stderr.decode()}")
        
        print(f"  Created {tile_num} tiles")
        return tile_num
    
    def extract_vehicles(self, verify_only=False):
        """Extract vehicle sprites from TBD/vehicles."""
        print("\n" + "=" * 70)
        print("Extracting Vehicle Sprites")
        print("=" * 70)
        
        vehicles_dir = self.tbd_dir / 'vehicles' / 'isometric_vehicles'
        
        if not vehicles_dir.exists():
            print("  Vehicle directory not found")
            return []
        
        # Look for vehicle sprite sheets
        vehicle_sheets = list(vehicles_dir.glob('*.png'))
        
        if not vehicle_sheets:
            print("  No vehicle sheets found")
            return []
        
        extracted = []
        for sheet in vehicle_sheets:
            # Skip collection sheets and similar files
            if any(pattern in sheet.name.lower() for pattern in self.SKIP_PATTERNS):
                print(f"\n  Skipping collection sheet: {sheet.name}")
                continue
            
            print(f"\n  Found: {sheet.name}")
            
            if not verify_only:
                # Note: Vehicle sheets are copied as-is rather than split into grids.
                # If grid-based extraction is needed, extend the extract_tileset method
                # or add a separate vehicle-specific extraction method with grid params.
                
                output_dir = self.individual_dir / 'vehicles'
                output_dir.mkdir(parents=True, exist_ok=True)
                
                dest = output_dir / sheet.name
                if not dest.exists():
                    shutil.copy2(str(sheet), str(dest))
                    print(f"    Copied to: {dest.relative_to(self.project_root)}")
                    extracted.append(sheet.name)
            else:
                print(f"    Would copy to: assets/individual/vehicles/{sheet.name}")
        
        return extracted
    
    def extract_dungeon_pack(self, verify_only=False):
        """Extract dungeon pack tiles."""
        print("\n" + "=" * 70)
        print("Extracting Dungeon Pack")
        print("=" * 70)
        
        dungeon_dir = self.tbd_dir / 'dungeon_pack'
        
        if not dungeon_dir.exists():
            print("  Dungeon pack directory not found")
            return []
        
        # Find all PNG files in dungeon pack
        png_files = list(dungeon_dir.rglob('*.png'))
        
        print(f"\n  Found {len(png_files)} PNG files")
        
        if not verify_only:
            output_dir = self.individual_dir / 'dungeon'
            output_dir.mkdir(parents=True, exist_ok=True)
            
            # Organize by subdirectory
            extracted = []
            for png in png_files:
                # Get relative path from dungeon_pack
                rel_path = png.relative_to(dungeon_dir)
                
                # Create corresponding output structure
                output_subdir = output_dir / rel_path.parent
                output_subdir.mkdir(parents=True, exist_ok=True)
                
                dest = output_subdir / png.name
                if not dest.exists():
                    shutil.copy2(str(png), str(dest))
                    extracted.append(str(rel_path))
            
            print(f"  Copied {len(extracted)} files to assets/individual/dungeon/")
            return extracted
        else:
            print(f"  Would copy {len(png_files)} files to assets/individual/dungeon/")
            return []
    
    def extract_snow_tilesets(self, verify_only=False):
        """Extract snow tileset assets."""
        print("\n" + "=" * 70)
        print("Extracting Snow Tilesets")
        print("=" * 70)
        
        snow_dir = self.tbd_dir / 'snow_tilesets'
        
        if not snow_dir.exists():
            print("  Snow tilesets directory not found")
            return []
        
        # Find all PNG files
        png_files = list(snow_dir.rglob('*.png'))
        
        print(f"\n  Found {len(png_files)} PNG files")
        
        if not verify_only:
            output_dir = self.individual_dir / 'snow'
            output_dir.mkdir(parents=True, exist_ok=True)
            
            extracted = []
            for png in png_files:
                rel_path = png.relative_to(snow_dir)
                
                output_subdir = output_dir / rel_path.parent
                output_subdir.mkdir(parents=True, exist_ok=True)
                
                dest = output_subdir / png.name
                if not dest.exists():
                    shutil.copy2(str(png), str(dest))
                    extracted.append(str(rel_path))
            
            print(f"  Copied {len(extracted)} files to assets/individual/snow/")
            return extracted
        else:
            print(f"  Would copy {len(png_files)} files to assets/individual/snow/")
            return []


def main():
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Extract assets from TBD folder to individual tiles'
    )
    parser.add_argument(
        '--list',
        action='store_true',
        help='List available asset categories in TBD folder'
    )
    parser.add_argument(
        '--verify-only',
        action='store_true',
        help='Only verify what would be extracted without copying files'
    )
    parser.add_argument(
        '--vehicles',
        action='store_true',
        help='Extract vehicle sprites'
    )
    parser.add_argument(
        '--dungeon',
        action='store_true',
        help='Extract dungeon pack'
    )
    parser.add_argument(
        '--snow',
        action='store_true',
        help='Extract snow tilesets'
    )
    parser.add_argument(
        '--all',
        action='store_true',
        help='Extract all available assets'
    )
    
    args = parser.parse_args()
    
    # Get project root
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    extractor = TBDAssetExtractor(project_root)
    
    print("=" * 70)
    print("TBD Asset Extractor")
    print("=" * 70)
    
    # List mode
    if args.list:
        extractor.list_available_assets()
        return
    
    if args.verify_only:
        print("\nVERIFY ONLY MODE - No files will be copied")
    
    # Determine what to extract
    extract_vehicles = args.vehicles or args.all
    extract_dungeon = args.dungeon or args.all
    extract_snow = args.snow or args.all
    
    # If nothing specified, show help
    if not (extract_vehicles or extract_dungeon or extract_snow):
        parser.print_help()
        print("\n" + "=" * 70)
        print("Example usage:")
        print("  python3 utils/extract_tbd_assets.py --list")
        print("  python3 utils/extract_tbd_assets.py --verify-only --all")
        print("  python3 utils/extract_tbd_assets.py --vehicles")
        print("  python3 utils/extract_tbd_assets.py --all")
        print("=" * 70)
        return
    
    # Extract selected categories
    results = {}
    
    if extract_vehicles:
        results['vehicles'] = extractor.extract_vehicles(args.verify_only)
    
    if extract_dungeon:
        results['dungeon'] = extractor.extract_dungeon_pack(args.verify_only)
    
    if extract_snow:
        results['snow'] = extractor.extract_snow_tilesets(args.verify_only)
    
    # Summary
    print("\n" + "=" * 70)
    if args.verify_only:
        print("Verification Complete")
        print("\nTo actually extract files, run without --verify-only flag")
    else:
        print("Extraction Complete")
        total = sum(len(v) for v in results.values())
        print(f"\nTotal files extracted: {total}")
        for category, files in results.items():
            if files:
                print(f"  {category}: {len(files)}")
    print("=" * 70)
    
    if not args.verify_only:
        print("\nNext steps:")
        print("  1. Review extracted assets in assets/individual/")
        print("  2. Test assets in the game editor")
        print("  3. Update documentation if needed")


if __name__ == '__main__':
    main()
