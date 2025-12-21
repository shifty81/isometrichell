#!/usr/bin/env python3
"""
Sprite Sheet Manager

This tool creates metadata for sprite sheets so they can be used directly in the game
without needing to extract individual tiles. This is more efficient and keeps source
images intact.
"""

import os
import sys
import json
from pathlib import Path


class SpriteSheetManager:
    """
    Manages sprite sheet metadata and creates configuration files for using
    sprite sheets directly in the game engine.
    """
    
    def __init__(self, project_root):
        self.project_root = Path(project_root)
        self.assets_dir = self.project_root / 'assets'
        self.metadata_dir = self.assets_dir / 'sprite_metadata'
        self.metadata_dir.mkdir(exist_ok=True)
    
    def create_vehicle_metadata(self):
        """Create metadata for vehicle sprite sheets."""
        print("\n" + "=" * 70)
        print("Creating Vehicle Sprite Sheet Metadata")
        print("=" * 70)
        
        vehicles_dir = self.assets_dir / 'TBD' / 'vehicles' / 'isometric_vehicles'
        
        if not vehicles_dir.exists():
            print("  Vehicle directory not found")
            return
        
        metadata = {
            "description": "Isometric vehicle sprite sheets",
            "sheets": []
        }
        
        vehicle_sheets = [f for f in vehicles_dir.glob('*.png') 
                         if 'collection' not in f.name.lower()]
        
        for sheet in vehicle_sheets:
            sheet_info = {
                "name": sheet.stem,
                "file": f"assets/TBD/vehicles/isometric_vehicles/{sheet.name}",
                "sprite_width": 32,
                "sprite_height": 32,
                "cols": 8,
                "rows": 8,
                "total_sprites": 64,
                "usage": "Vehicle sprites with multiple angles and types for directional movement"
            }
            metadata["sheets"].append(sheet_info)
            print(f"  Added: {sheet.name} (8x8 grid, 64 sprites)")
        
        # Save metadata
        output_file = self.metadata_dir / 'vehicles.json'
        with open(output_file, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"\n  Saved metadata to: {output_file.relative_to(self.project_root)}")
        return output_file
    
    def create_ground_tiles_metadata(self):
        """Create metadata for ground tile sprite sheets."""
        print("\n" + "=" * 70)
        print("Creating Ground Tiles Sprite Sheet Metadata")
        print("=" * 70)
        
        ground_dir = self.assets_dir / 'ground_tiles_sheets'
        
        if not ground_dir.exists():
            print("  Ground tiles directory not found")
            return
        
        metadata = {
            "description": "Isometric ground tile sprite sheets",
            "sheets": []
        }
        
        # 64x32 versions
        for png in sorted(ground_dir.glob('*_64x32.png')):
            sheet_info = {
                "name": png.stem,
                "file": f"assets/ground_tiles_sheets/{png.name}",
                "sprite_width": 64,
                "sprite_height": 32,
                "cols": 8,
                "rows": 7,
                "total_sprites": 56,
                "usage": "Standard resolution isometric ground tiles"
            }
            metadata["sheets"].append(sheet_info)
            print(f"  Added: {png.name} (8x7 grid, 56 tiles)")
        
        # 128x64 versions
        for png in sorted(ground_dir.glob('*_128x64.png')):
            sheet_info = {
                "name": png.stem,
                "file": f"assets/ground_tiles_sheets/{png.name}",
                "sprite_width": 128,
                "sprite_height": 64,
                "cols": 8,
                "rows": 7,
                "total_sprites": 56,
                "usage": "High resolution isometric ground tiles"
            }
            metadata["sheets"].append(sheet_info)
            print(f"  Added: {png.name} (8x7 grid, 56 tiles)")
        
        output_file = self.metadata_dir / 'ground_tiles.json'
        with open(output_file, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"\n  Saved metadata to: {output_file.relative_to(self.project_root)}")
        return output_file
    
    def create_tree_metadata(self):
        """Create metadata for tree sprite sheets."""
        print("\n" + "=" * 70)
        print("Creating Tree Sprite Sheet Metadata")
        print("=" * 70)
        
        tree_dir = self.assets_dir / 'isometric_trees_pack' / 'sheets'
        
        if not tree_dir.exists():
            print("  Tree sheets directory not found")
            return
        
        metadata = {
            "description": "Isometric tree sprite sheets",
            "sheets": []
        }
        
        # 64x64 versions (for 64x32 tiles)
        for png in sorted(tree_dir.glob('*_64x32*.png')):
            sheet_info = {
                "name": png.stem,
                "file": f"assets/isometric_trees_pack/sheets/{png.name}",
                "sprite_width": 64,
                "sprite_height": 64,
                "cols": 10,
                "rows": 7,
                "total_sprites": 70,
                "usage": "Tree sprites for standard resolution tiles"
            }
            metadata["sheets"].append(sheet_info)
            print(f"  Added: {png.name} (10x7 grid, 70 sprites)")
        
        # 128x128 versions (for 128x64 tiles)
        for png in sorted(tree_dir.glob('*_128x64*.png')):
            sheet_info = {
                "name": png.stem,
                "file": f"assets/isometric_trees_pack/sheets/{png.name}",
                "sprite_width": 128,
                "sprite_height": 128,
                "cols": 10,
                "rows": 7,
                "total_sprites": 70,
                "usage": "Tree sprites for high resolution tiles"
            }
            metadata["sheets"].append(sheet_info)
            print(f"  Added: {png.name} (10x7 grid, 70 sprites)")
        
        output_file = self.metadata_dir / 'trees.json'
        with open(output_file, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"\n  Saved metadata to: {output_file.relative_to(self.project_root)}")
        return output_file
    
    def create_dungeon_metadata(self):
        """Create metadata for dungeon pack sprite sheets."""
        print("\n" + "=" * 70)
        print("Creating Dungeon Pack Sprite Sheet Metadata")
        print("=" * 70)
        
        dungeon_dir = self.assets_dir / 'TBD' / 'dungeon_pack'
        
        if not dungeon_dir.exists():
            print("  Dungeon pack directory not found")
            return
        
        # Find all sprite sheets in dungeon pack
        png_files = list(dungeon_dir.rglob('*.png'))
        
        metadata = {
            "description": "Dungeon pack sprite sheets and tiles",
            "note": "Contains 747 PNG files - mix of sprite sheets and individual tiles",
            "sheets": [],
            "individual_tiles": []
        }
        
        # Categorize by size
        for png in png_files:
            # Simple heuristic: files > 10KB likely to be sprite sheets
            if png.stat().st_size > 10240:
                rel_path = png.relative_to(self.assets_dir)
                metadata["sheets"].append({
                    "name": png.stem,
                    "file": str(rel_path),
                    "note": "Sprite sheet - dimensions need inspection"
                })
            else:
                rel_path = png.relative_to(self.assets_dir)
                metadata["individual_tiles"].append(str(rel_path))
        
        print(f"  Found {len(metadata['sheets'])} sprite sheets")
        print(f"  Found {len(metadata['individual_tiles'])} individual tiles")
        
        output_file = self.metadata_dir / 'dungeon.json'
        with open(output_file, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"\n  Saved metadata to: {output_file.relative_to(self.project_root)}")
        return output_file
    
    def create_all_metadata(self):
        """Create metadata for all sprite sheets."""
        print("=" * 70)
        print("Sprite Sheet Metadata Generator")
        print("=" * 70)
        print("\nGenerating metadata to use sprite sheets directly without extraction...")
        
        results = {}
        results['vehicles'] = self.create_vehicle_metadata()
        results['ground_tiles'] = self.create_ground_tiles_metadata()
        results['trees'] = self.create_tree_metadata()
        results['dungeon'] = self.create_dungeon_metadata()
        
        print("\n" + "=" * 70)
        print("Metadata Generation Complete")
        print("=" * 70)
        print(f"\nMetadata files created in: {self.metadata_dir.relative_to(self.project_root)}")
        print("\nThese metadata files can be used by the game engine to:")
        print("  - Load sprite sheets directly")
        print("  - Extract specific sprites at runtime")
        print("  - Support animations and directional movement")
        print("  - Keep source images intact")
        
        return results


def main():
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Create sprite sheet metadata for direct usage in game'
    )
    parser.add_argument(
        '--vehicles',
        action='store_true',
        help='Create vehicle sprite sheet metadata'
    )
    parser.add_argument(
        '--ground-tiles',
        action='store_true',
        help='Create ground tiles sprite sheet metadata'
    )
    parser.add_argument(
        '--trees',
        action='store_true',
        help='Create tree sprite sheet metadata'
    )
    parser.add_argument(
        '--dungeon',
        action='store_true',
        help='Create dungeon pack metadata'
    )
    parser.add_argument(
        '--all',
        action='store_true',
        help='Create all sprite sheet metadata'
    )
    
    args = parser.parse_args()
    
    # Get project root
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    manager = SpriteSheetManager(project_root)
    
    # Determine what to create
    create_vehicles = args.vehicles or args.all
    create_ground = args.ground_tiles or args.all
    create_trees = args.trees or args.all
    create_dungeon = args.dungeon or args.all
    
    # If nothing specified, create all
    if not (create_vehicles or create_ground or create_trees or create_dungeon):
        manager.create_all_metadata()
        return
    
    # Create selected metadata
    print("=" * 70)
    print("Sprite Sheet Metadata Generator")
    print("=" * 70)
    
    if create_vehicles:
        manager.create_vehicle_metadata()
    
    if create_ground:
        manager.create_ground_tiles_metadata()
    
    if create_trees:
        manager.create_tree_metadata()
    
    if create_dungeon:
        manager.create_dungeon_metadata()
    
    print("\n" + "=" * 70)
    print("Complete!")
    print("=" * 70)


if __name__ == '__main__':
    main()
