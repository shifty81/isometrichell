#!/usr/bin/env python3
"""
Asset Archive Utility

This script archives processed tileset files after they have been extracted into
individual tiles. It helps conserve space by moving large original tilesets to
the archives directory while keeping the individual tiles in the active project.
"""

import os
import sys
import shutil
from pathlib import Path
from datetime import datetime


class AssetArchiver:
    """Handles archiving of processed asset files."""
    
    def __init__(self, project_root):
        self.project_root = Path(project_root)
        self.assets_dir = self.project_root / 'assets'
        self.archives_dir = self.assets_dir / 'archives'
        self.individual_dir = self.assets_dir / 'individual'
        
        # Create archives directory structure
        self.archives_dir.mkdir(exist_ok=True)
        
    def archive_ground_tiles(self, verify_only=False):
        """Archive ground tile sheets that have been extracted."""
        print("\n" + "=" * 70)
        print("Archiving Ground Tile Sheets")
        print("=" * 70)
        
        source_dir = self.assets_dir / 'ground_tiles_sheets'
        archive_dir = self.archives_dir / 'ground_tiles_sheets'
        
        if not source_dir.exists():
            print(f"  Source directory not found: {source_dir}")
            return []
        
        # Check which tilesets have been extracted
        expected_extractions = {
            'grass_green_64x32.png': self.individual_dir / 'ground_tiles' / 'grass_green_64x32',
            'grass_dry_64x32.png': self.individual_dir / 'ground_tiles' / 'grass_dry_64x32',
            'grass_medium_64x32.png': self.individual_dir / 'ground_tiles' / 'grass_medium_64x32',
            'dirt_64x32.png': self.individual_dir / 'ground_tiles' / 'dirt_64x32',
            'dirt_dark_64x32.png': self.individual_dir / 'ground_tiles' / 'dirt_dark_64x32',
            'sand_64x32.png': self.individual_dir / 'ground_tiles' / 'sand_64x32',
            'stone_path_64x32.png': self.individual_dir / 'ground_tiles' / 'stone_path_64x32',
            'forest_ground_64x32.png': self.individual_dir / 'ground_tiles' / 'forest_ground_64x32',
            'grass_green_128x64.png': self.individual_dir / 'ground_tiles' / 'grass_green_128x64',
            'grass_dry_128x64.png': self.individual_dir / 'ground_tiles' / 'grass_dry_128x64',
            'grass_medium_128x64.png': self.individual_dir / 'ground_tiles' / 'grass_medium_128x64',
            'dirt_128x64.png': self.individual_dir / 'ground_tiles' / 'dirt_128x64',
            'dirt_dark_128x64.png': self.individual_dir / 'ground_tiles' / 'dirt_dark_128x64',
            'sand_128x64.png': self.individual_dir / 'ground_tiles' / 'sand_128x64',
            'stone_path_128x64.png': self.individual_dir / 'ground_tiles' / 'stone_path_128x64',
            'forest_ground_128x64.png': self.individual_dir / 'ground_tiles' / 'forest_ground_128x64',
        }
        
        archived = []
        for filename, extract_dir in expected_extractions.items():
            source_file = source_dir / filename
            
            if not source_file.exists():
                continue
                
            # Check if extraction exists and has tiles
            if extract_dir.exists() and len(list(extract_dir.glob('*.png'))) > 0:
                print(f"\n  ✓ {filename}")
                print(f"    Extracted tiles: {len(list(extract_dir.glob('*.png')))} files")
                
                if not verify_only:
                    archive_dir.mkdir(parents=True, exist_ok=True)
                    dest_file = archive_dir / filename
                    
                    # Move the file
                    shutil.move(str(source_file), str(dest_file))
                    print(f"    Archived to: {dest_file.relative_to(self.project_root)}")
                    archived.append(filename)
                else:
                    print(f"    Would archive to: archives/ground_tiles_sheets/{filename}")
            else:
                print(f"\n  ✗ {filename}")
                print(f"    Individual tiles not found or incomplete")
                print(f"    Run 'python3 utils/split_tilesheets.py' first")
        
        return archived
    
    def archive_tree_sheets(self, verify_only=False):
        """Archive tree sprite sheets that have been extracted."""
        print("\n" + "=" * 70)
        print("Archiving Tree Sprite Sheets")
        print("=" * 70)
        
        source_dir = self.assets_dir / 'isometric_trees_pack' / 'sheets'
        archive_dir = self.archives_dir / 'tree_sheets'
        
        if not source_dir.exists():
            print(f"  Source directory not found: {source_dir}")
            return []
        
        expected_extractions = {
            'trees_64x32_shaded.png': self.individual_dir / 'trees' / 'trees_64x32_shaded',
            'trees_64x32_no_shadow.png': self.individual_dir / 'trees' / 'trees_64x32_no_shadow',
            'trees_64x32_cloudy.png': self.individual_dir / 'trees' / 'trees_64x32_cloudy',
            'trees_128x64_shaded.png': self.individual_dir / 'trees' / 'trees_128x64_shaded',
            'trees_128x64_no_shadow.png': self.individual_dir / 'trees' / 'trees_128x64_no_shadow',
            'trees_128x64_cloudy.png': self.individual_dir / 'trees' / 'trees_128x64_cloudy',
        }
        
        archived = []
        for filename, extract_dir in expected_extractions.items():
            source_file = source_dir / filename
            
            if not source_file.exists():
                continue
                
            if extract_dir.exists() and len(list(extract_dir.glob('*.png'))) > 0:
                print(f"\n  ✓ {filename}")
                print(f"    Extracted tiles: {len(list(extract_dir.glob('*.png')))} files")
                
                if not verify_only:
                    archive_dir.mkdir(parents=True, exist_ok=True)
                    dest_file = archive_dir / filename
                    
                    shutil.move(str(source_file), str(dest_file))
                    print(f"    Archived to: {dest_file.relative_to(self.project_root)}")
                    archived.append(filename)
                else:
                    print(f"    Would archive to: archives/tree_sheets/{filename}")
            else:
                print(f"\n  ✗ {filename}")
                print(f"    Individual tiles not found or incomplete")
        
        return archived
    
    def archive_source_files(self, verify_only=False):
        """Archive source files like .blend files."""
        print("\n" + "=" * 70)
        print("Archiving Source Files")
        print("=" * 70)
        
        source_dir = self.assets_dir / 'ground_tiles_source_blend_packed'
        archive_dir = self.archives_dir / 'source_files'
        
        if not source_dir.exists():
            print(f"  Source directory not found: {source_dir}")
            return []
        
        archived = []
        blend_files = list(source_dir.glob('*.blend'))
        
        if not blend_files:
            print("  No .blend files found")
            return []
        
        for source_file in blend_files:
            print(f"\n  ✓ {source_file.name}")
            print(f"    Size: {source_file.stat().st_size / (1024*1024):.2f} MB")
            
            if not verify_only:
                archive_dir.mkdir(parents=True, exist_ok=True)
                dest_file = archive_dir / source_file.name
                
                shutil.move(str(source_file), str(dest_file))
                print(f"    Archived to: {dest_file.relative_to(self.project_root)}")
                archived.append(source_file.name)
            else:
                print(f"    Would archive to: archives/source_files/{source_file.name}")
        
        return archived
    
    def update_archive_log(self, ground_tiles, tree_sheets, source_files):
        """Update the archive README with logged entries."""
        readme_path = self.archives_dir / 'README.md'
        
        if not readme_path.exists():
            print("\n  Warning: Archive README not found")
            return
        
        # Read current README
        with open(readme_path, 'r') as f:
            content = f.read()
        
        # Find the archive log table
        if '## 📝 Archive Log' not in content:
            print("\n  Warning: Archive log section not found in README")
            return
        
        # Generate log entries
        date = datetime.now().strftime('%Y-%m-%d')
        entries = []
        
        if ground_tiles:
            entries.append(f"| {date} | Ground Tiles | {len(ground_tiles)} sheets | Extracted to individual tiles |")
        if tree_sheets:
            entries.append(f"| {date} | Tree Sheets | {len(tree_sheets)} sheets | Extracted to individual tiles |")
        if source_files:
            entries.append(f"| {date} | Source Files | {len(source_files)} files | Blender source files |")
        
        if not entries:
            return
        
        # Replace the example entry or add new entries
        lines = content.split('\n')
        log_section_index = -1
        
        for i, line in enumerate(lines):
            if '## 📝 Archive Log' in line:
                log_section_index = i
                break
        
        if log_section_index >= 0:
            # Find the table
            table_start = -1
            for i in range(log_section_index, len(lines)):
                if '| Date | Asset Type |' in lines[i]:
                    table_start = i
                    break
            
            if table_start >= 0:
                # Remove example entry if it exists
                new_lines = lines[:table_start + 2]  # Keep header and separator
                
                # Add new entries
                for entry in entries:
                    new_lines.append(entry)
                
                # Keep remaining content
                separator_line = table_start + 2
                for i in range(separator_line + 1, len(lines)):
                    if lines[i].strip() and not lines[i].startswith('| TBD'):
                        new_lines.extend(lines[i:])
                        break
                
                # Write updated content
                with open(readme_path, 'w') as f:
                    f.write('\n'.join(new_lines))
                
                print(f"\n  Updated archive log with {len(entries)} entries")


def main():
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Archive processed asset files to conserve space'
    )
    parser.add_argument(
        '--verify-only',
        action='store_true',
        help='Only verify what would be archived without moving files'
    )
    parser.add_argument(
        '--ground-tiles',
        action='store_true',
        help='Archive ground tile sheets'
    )
    parser.add_argument(
        '--tree-sheets',
        action='store_true',
        help='Archive tree sprite sheets'
    )
    parser.add_argument(
        '--source-files',
        action='store_true',
        help='Archive source files (.blend, etc.)'
    )
    parser.add_argument(
        '--all',
        action='store_true',
        help='Archive all eligible assets'
    )
    
    args = parser.parse_args()
    
    # Get project root
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    archiver = AssetArchiver(project_root)
    
    print("=" * 70)
    print("Asset Archive Utility")
    print("=" * 70)
    
    if args.verify_only:
        print("\nVERIFY ONLY MODE - No files will be moved")
    
    # Determine what to archive
    archive_ground = args.ground_tiles or args.all
    archive_trees = args.tree_sheets or args.all
    archive_sources = args.source_files or args.all
    
    # If nothing specified, show help
    if not (archive_ground or archive_trees or archive_sources):
        parser.print_help()
        print("\n" + "=" * 70)
        print("Example usage:")
        print("  python3 utils/archive_processed_assets.py --verify-only --all")
        print("  python3 utils/archive_processed_assets.py --ground-tiles")
        print("  python3 utils/archive_processed_assets.py --all")
        print("=" * 70)
        return
    
    ground_tiles = []
    tree_sheets = []
    source_files = []
    
    # Archive selected categories
    if archive_ground:
        ground_tiles = archiver.archive_ground_tiles(args.verify_only)
    
    if archive_trees:
        tree_sheets = archiver.archive_tree_sheets(args.verify_only)
    
    if archive_sources:
        source_files = archiver.archive_source_files(args.verify_only)
    
    # Update log if files were actually moved
    if not args.verify_only and (ground_tiles or tree_sheets or source_files):
        archiver.update_archive_log(ground_tiles, tree_sheets, source_files)
    
    # Summary
    print("\n" + "=" * 70)
    if args.verify_only:
        print("Verification Complete")
        print("\nTo actually archive files, run without --verify-only flag")
    else:
        print("Archive Complete")
        total = len(ground_tiles) + len(tree_sheets) + len(source_files)
        print(f"\nTotal files archived: {total}")
        if ground_tiles:
            print(f"  Ground tiles: {len(ground_tiles)}")
        if tree_sheets:
            print(f"  Tree sheets: {len(tree_sheets)}")
        if source_files:
            print(f"  Source files: {len(source_files)}")
    print("=" * 70)


if __name__ == '__main__':
    main()
