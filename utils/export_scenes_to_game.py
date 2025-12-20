#!/usr/bin/env python3
"""
Export WorldEd Scenes Back to Game
Converts edited TMX scene files back to game-compatible JSON format
Enables hot-reload workflow for rapid iteration
"""

import os
import sys
import xml.etree.ElementTree as ET
import json
from pathlib import Path
from datetime import datetime


class TMXSceneParser:
    """Parse TMX scene files from WorldEd"""
    
    def parse(self, tmx_file):
        """Parse TMX file and extract scene data"""
        print(f"Parsing: {tmx_file}")
        
        tree = ET.parse(tmx_file)
        root = tree.getroot()
        
        # Extract map properties
        scene_data = {
            'name': Path(tmx_file).stem.replace('_Scene', ''),
            'width': int(root.get('width', 10)),
            'height': int(root.get('height', 10)),
            'tile_width': int(root.get('tilewidth', 64)),
            'tile_height': int(root.get('tileheight', 32)),
            'properties': {},
            'layers': {},
            'objects': []
        }
        
        # Parse properties
        for props in root.findall('.//properties'):
            for prop in props.findall('property'):
                scene_data['properties'][prop.get('name')] = prop.get('value')
        
        # Parse tile layers
        for layer in root.findall('layer'):
            layer_data = self._parse_layer(layer, scene_data['width'], scene_data['height'])
            scene_data['layers'][layer.get('name')] = layer_data
        
        # Parse object groups
        for objgroup in root.findall('objectgroup'):
            objects = self._parse_object_group(objgroup)
            scene_data['objects'].extend(objects)
        
        return scene_data
    
    def _parse_layer(self, layer, width, height):
        """Parse a tile layer"""
        layer_data = {
            'name': layer.get('name'),
            'visible': layer.get('visible', '1') == '1',
            'properties': {},
            'tiles': []
        }
        
        # Parse layer properties
        for props in layer.findall('.//properties'):
            for prop in props.findall('property'):
                layer_data['properties'][prop.get('name')] = prop.get('value')
        
        # Parse tile data
        data_elem = layer.find('data')
        if data_elem is not None and data_elem.get('encoding') == 'csv':
            csv_data = data_elem.text.strip()
            rows = csv_data.split('\n')
            
            for y, row in enumerate(rows):
                tiles_row = []
                for x, tile_gid in enumerate(row.split(',')):
                    gid = int(tile_gid.strip())
                    if gid > 0:
                        tiles_row.append({'x': x, 'y': y, 'gid': gid})
                
                if tiles_row:
                    layer_data['tiles'].extend(tiles_row)
        
        return layer_data
    
    def _parse_object_group(self, objgroup):
        """Parse an object group"""
        objects = []
        
        for obj in objgroup.findall('object'):
            obj_data = {
                'id': int(obj.get('id', 0)),
                'name': obj.get('name', ''),
                'type': obj.get('type', ''),
                'x': float(obj.get('x', 0)),
                'y': float(obj.get('y', 0)),
                'width': float(obj.get('width', 0)),
                'height': float(obj.get('height', 0)),
                'properties': {},
                'group': objgroup.get('name')
            }
            
            # Parse object properties
            for props in obj.findall('.//properties'):
                for prop in props.findall('property'):
                    obj_data['properties'][prop.get('name')] = prop.get('value')
            
            objects.append(obj_data)
        
        return objects


class GameFormatConverter:
    """Convert parsed TMX data to game format"""
    
    def __init__(self):
        self.tile_mappings = {
            # Map TMX tile GIDs to game tile types
            1: {'type': 'floor', 'walkable': True},
            145: {'type': 'wall', 'walkable': False, 'blocks_vision': True},
            146: {'type': 'wall_corner', 'walkable': False, 'blocks_vision': True},
            147: {'type': 'door', 'walkable': False, 'blocks_vision': True, 'interactable': True},
            148: {'type': 'window', 'walkable': False, 'blocks_vision': False, 'transparent': True},
            225: {'type': 'furniture', 'walkable': False, 'interactable': True},
        }
    
    def convert(self, scene_data):
        """Convert scene data to game format"""
        game_data = {
            'scene_name': scene_data['name'],
            'scene_type': scene_data['properties'].get('scene_type', 'interior'),
            'scene_subtype': scene_data['properties'].get('scene_subtype', ''),
            'editable': scene_data['properties'].get('editable', 'true') == 'true',
            'hot_reload': scene_data['properties'].get('hot_reload', 'true') == 'true',
            
            'dimensions': {
                'width': scene_data['width'],
                'height': scene_data['height'],
                'tile_width': scene_data['tile_width'],
                'tile_height': scene_data['tile_height']
            },
            
            'tiles': self._convert_tiles(scene_data),
            'collision_map': self._generate_collision_map(scene_data),
            'doors': self._extract_doors(scene_data),
            'windows': self._extract_windows(scene_data),
            'furniture': self._extract_furniture(scene_data),
            'walls': self._extract_walls(scene_data),
            'rooms': self._extract_rooms(scene_data),
            'lighting': self._extract_lighting(scene_data),
            'spawn_points': self._extract_spawn_points(scene_data),
            
            'metadata': {
                'exported_at': datetime.now().isoformat(),
                'source': 'WorldEd',
                'source_file': f"{scene_data['name']}_Scene.tmx",
                'hot_reload_compatible': True,
                'version': '1.0'
            }
        }
        
        return game_data
    
    def _convert_tiles(self, scene_data):
        """Convert all tiles to game format"""
        tiles = []
        
        for layer_name, layer_data in scene_data['layers'].items():
            for tile in layer_data['tiles']:
                gid = tile['gid']
                tile_info = self.tile_mappings.get(gid, {'type': 'unknown'})
                
                tiles.append({
                    'x': tile['x'],
                    'y': tile['y'],
                    'layer': layer_name,
                    'type': tile_info['type'],
                    'gid': gid,
                    'properties': tile_info
                })
        
        return tiles
    
    def _generate_collision_map(self, scene_data):
        """Generate collision map"""
        width = scene_data['width']
        height = scene_data['height']
        collision_map = [[True] * width for _ in range(height)]
        
        # Mark non-walkable tiles
        for layer_name in ['Walls', 'Doors', 'Furniture', 'Windows']:
            if layer_name in scene_data['layers']:
                for tile in scene_data['layers'][layer_name]['tiles']:
                    if tile['gid'] > 0:
                        x, y = tile['x'], tile['y']
                        if 0 <= x < width and 0 <= y < height:
                            # Check if tile is walkable
                            tile_info = self.tile_mappings.get(tile['gid'], {})
                            if not tile_info.get('walkable', True):
                                collision_map[y][x] = False
        
        return collision_map
    
    def _extract_doors(self, scene_data):
        """Extract door data"""
        doors = []
        
        if 'Doors' in scene_data['layers']:
            for tile in scene_data['layers']['Doors']['tiles']:
                if tile['gid'] == 147:  # Door tile
                    doors.append({
                        'x': tile['x'],
                        'y': tile['y'],
                        'type': 'door',
                        'is_open': False,
                        'interactable': True,
                        'blocks_vision': True,
                        'blocks_movement': True
                    })
        
        return doors
    
    def _extract_windows(self, scene_data):
        """Extract window data"""
        windows = []
        
        if 'Windows' in scene_data['layers']:
            for tile in scene_data['layers']['Windows']['tiles']:
                if tile['gid'] == 148:  # Window tile
                    windows.append({
                        'x': tile['x'],
                        'y': tile['y'],
                        'type': 'window',
                        'transparent': True,
                        'blocks_movement': True,
                        'blocks_vision': False
                    })
        
        return windows
    
    def _extract_furniture(self, scene_data):
        """Extract furniture data"""
        furniture = []
        
        if 'Furniture' in scene_data['layers']:
            for tile in scene_data['layers']['Furniture']['tiles']:
                if tile['gid'] >= 225:  # Furniture tiles
                    furniture.append({
                        'x': tile['x'],
                        'y': tile['y'],
                        'type': 'furniture',
                        'gid': tile['gid'],
                        'interactable': True,
                        'blocks_movement': True
                    })
        
        return furniture
    
    def _extract_walls(self, scene_data):
        """Extract wall data"""
        walls = []
        
        if 'Walls' in scene_data['layers']:
            for tile in scene_data['layers']['Walls']['tiles']:
                if tile['gid'] >= 145:  # Wall tiles
                    walls.append({
                        'x': tile['x'],
                        'y': tile['y'],
                        'type': 'wall',
                        'blocks_movement': True,
                        'blocks_vision': True
                    })
        
        return walls
    
    def _extract_rooms(self, scene_data):
        """Extract room definitions"""
        rooms = []
        
        for obj in scene_data['objects']:
            if obj['group'] == 'Room_Definitions':
                rooms.append({
                    'id': f"room_{obj['id']}",
                    'name': obj['name'],
                    'type': obj['type'],
                    'bounds': {
                        'x': int(obj['x'] / 64),
                        'y': int(obj['y'] / 32),
                        'width': int(obj['width'] / 64),
                        'height': int(obj['height'] / 32)
                    },
                    'properties': obj['properties']
                })
        
        return rooms
    
    def _extract_lighting(self, scene_data):
        """Extract lighting data"""
        lighting = []
        
        for obj in scene_data['objects']:
            if obj['group'] == 'Lighting' and obj['type'] == 'light_source':
                lighting.append({
                    'x': int(obj['x'] / 64),
                    'y': int(obj['y'] / 32),
                    'brightness': float(obj['properties'].get('brightness', 1.0)),
                    'radius': float(obj['properties'].get('radius', 5)),
                    'type': 'point_light'
                })
        
        return lighting
    
    def _extract_spawn_points(self, scene_data):
        """Extract spawn point data"""
        spawn_points = []
        
        for obj in scene_data['objects']:
            if obj['group'] == 'Spawn_Points':
                spawn_points.append({
                    'x': int(obj['x'] / 64),
                    'y': int(obj['y'] / 32),
                    'type': obj['type'],
                    'properties': obj['properties']
                })
        
        return spawn_points


def export_scene(tmx_file, output_dir):
    """Export a single scene file"""
    parser = TMXSceneParser()
    converter = GameFormatConverter()
    
    # Parse TMX
    scene_data = parser.parse(tmx_file)
    
    # Convert to game format
    game_data = converter.convert(scene_data)
    
    # Save JSON
    output_file = output_dir / f"{game_data['scene_name']}.json"
    with open(output_file, 'w') as f:
        json.dump(game_data, f, indent=2)
    
    print(f"  ✅ Exported: {output_file}")
    
    return output_file


def main():
    """Main export function"""
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    scenes_dir = project_root / 'worlded_export' / 'scenes'
    output_dir = project_root / 'assets' / 'buildings' / 'interiors'
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print("\n" + "=" * 70)
    print("EXPORT WORLDED SCENES TO GAME")
    print("=" * 70)
    print()
    
    # Find all scene files
    scene_files = list(scenes_dir.glob('**/*.tmx'))
    
    if not scene_files:
        print("⚠️  No scene files found in worlded_export/scenes/")
        print("\nGenerate scenes first:")
        print("  python3 utils/generate_ploppable_scenes.py")
        return
    
    print(f"Found {len(scene_files)} scene file(s) to export\n")
    
    # Export each scene
    exported = []
    for scene_file in scene_files:
        try:
            output_file = export_scene(scene_file, output_dir)
            exported.append(output_file)
        except Exception as e:
            print(f"  ❌ Error exporting {scene_file}: {e}")
    
    print("\n" + "=" * 70)
    print("EXPORT COMPLETE")
    print("=" * 70)
    print(f"\nExported {len(exported)} scene(s) to: {output_dir}")
    print()
    print("✅ Scenes ready for hot-reload in game!")
    print()
    print("Next steps:")
    print("  1. Launch or reload the game:")
    print("     npm start")
    print()
    print("  2. Changes will be loaded automatically")
    print()
    print("  3. Continue editing in WorldEd and re-export as needed")
    print()
    print("=" * 70)
    print()


if __name__ == '__main__':
    main()
