#!/usr/bin/env python3
"""
World to WorldEd Exporter
Exports the procedurally generated world to WorldEd-compatible format
"""

import os
import json
from pathlib import Path
from datetime import datetime


class WorldEdExporter:
    """Export game world to WorldEd format"""
    
    def __init__(self, project_root):
        self.project_root = Path(project_root)
        self.output_dir = self.project_root / 'worlded_export'
        self.output_dir.mkdir(exist_ok=True)
        
    def export_world_data(self, world_data):
        """
        Export world data to WorldEd-compatible format
        
        Args:
            world_data: Dictionary containing world information
                - width: World width in tiles
                - height: World height in tiles
                - tiles: 2D array of tile data
                - buildings: List of building/structure data
        """
        print("=" * 70)
        print("EXPORTING WORLD TO WORLDED FORMAT")
        print("=" * 70)
        print()
        
        # Create export structure
        export_data = {
            'version': '1.0',
            'exported_at': datetime.now().isoformat(),
            'world': {
                'width': world_data.get('width', 100),
                'height': world_data.get('height', 100),
                'name': world_data.get('name', 'DailyGrind_World')
            },
            'tiles': [],
            'buildings': [],
            'ploppables': []
        }
        
        # Export tiles
        print("Exporting ground tiles...")
        tiles = world_data.get('tiles', [])
        for y, row in enumerate(tiles):
            for x, tile in enumerate(row):
                tile_data = {
                    'x': x,
                    'y': y,
                    'type': tile.get('type', 'grass'),
                    'biome': tile.get('biome', 'plains'),
                    'decoration': tile.get('decoration', None)
                }
                export_data['tiles'].append(tile_data)
        
        print(f"  Exported {len(export_data['tiles'])} tiles")
        
        # Export buildings and ploppables
        print("\nExporting buildings and ploppables...")
        buildings = world_data.get('buildings', [])
        for building in buildings:
            self._export_building(building, export_data)
        
        print(f"  Exported {len(export_data['buildings'])} buildings")
        print(f"  Exported {len(export_data['ploppables'])} ploppables")
        
        # Save to files
        self._save_export(export_data)
        
        # Create WorldEd-compatible map file
        self._create_worlded_map(export_data)
        
        print("\n" + "=" * 70)
        print("EXPORT COMPLETE")
        print("=" * 70)
        print(f"\nOutput directory: {self.output_dir}")
        print("\nFiles created:")
        print("  - world_export.json       (JSON data)")
        print("  - world_map.tmx          (Tiled/WorldEd map)")
        print("  - ploppables/            (Building prefabs)")
        print()
        
    def _export_building(self, building, export_data):
        """Export a single building"""
        building_type = building.get('type', 'generic')
        
        # Check if this is a ploppable (complete building with interior)
        if building.get('has_interior', False) or building.get('is_ploppable', False):
            ploppable = self._create_ploppable(building)
            export_data['ploppables'].append(ploppable)
        else:
            # Regular building tile
            export_data['buildings'].append({
                'x': building.get('x', 0),
                'y': building.get('y', 0),
                'type': building_type,
                'sprite_id': building.get('sprite_id', '')
            })
    
    def _create_ploppable(self, building):
        """Create a ploppable building prefab"""
        building_type = building.get('type', 'generic')
        subtype = building.get('subtype', '')
        
        # Generate descriptive name based on type
        name = self._generate_ploppable_name(building_type, subtype)
        
        ploppable = {
            'name': name,
            'type': building_type,
            'subtype': subtype,
            'x': building.get('x', 0),
            'y': building.get('y', 0),
            'width': building.get('width', 10),
            'height': building.get('height', 10),
            'has_interior': True,
            'rooms': building.get('rooms', []),
            'doors': building.get('doors', []),
            'windows': building.get('windows', []),
            'metadata': {
                'description': building.get('description', ''),
                'tags': building.get('tags', [])
            }
        }
        
        # Save individual ploppable file
        self._save_ploppable(ploppable)
        
        return ploppable
    
    def _generate_ploppable_name(self, building_type, subtype):
        """Generate descriptive name for ploppable"""
        
        # Store type naming
        store_types = {
            'grocery': 'GroceryStore',
            'hardware': 'HardwareStore',
            'clothing': 'ClothingStore',
            'convenience': 'ConvenienceStore',
            'pharmacy': 'Pharmacy',
            'electronics': 'ElectronicsStore',
            'bookstore': 'Bookstore',
            'restaurant': 'Restaurant',
            'cafe': 'Cafe',
            'bar': 'Bar'
        }
        
        if building_type == 'store':
            base_name = store_types.get(subtype, 'GenericStore')
            return f"{base_name}_{subtype.title()}"
        elif building_type == 'house':
            return f"House_{subtype.title() if subtype else 'Residential'}"
        elif building_type == 'warehouse':
            return f"Warehouse_{subtype.title() if subtype else 'Storage'}"
        elif building_type == 'office':
            return f"Office_{subtype.title() if subtype else 'Commercial'}"
        elif building_type == 'factory':
            return f"Factory_{subtype.title() if subtype else 'Industrial'}"
        else:
            return f"{building_type.title()}_{subtype.title() if subtype else 'Generic'}"
    
    def _save_ploppable(self, ploppable):
        """Save ploppable as individual file"""
        ploppables_dir = self.output_dir / 'ploppables'
        ploppables_dir.mkdir(exist_ok=True)
        
        # Create subdirectory by type
        type_dir = ploppables_dir / ploppable['type']
        type_dir.mkdir(exist_ok=True)
        
        filename = f"{ploppable['name']}.json"
        filepath = type_dir / filename
        
        with open(filepath, 'w') as f:
            json.dump(ploppable, f, indent=2)
    
    def _save_export(self, export_data):
        """Save main export file"""
        output_file = self.output_dir / 'world_export.json'
        
        with open(output_file, 'w') as f:
            json.dump(export_data, f, indent=2)
        
        print(f"\nSaved: {output_file}")
    
    def _create_worlded_map(self, export_data):
        """Create WorldEd-compatible TMX map file"""
        world = export_data['world']
        width = world['width']
        height = world['height']
        
        # TMX header
        tmx_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<map version="1.10" tiledversion="1.10.2" orientation="isometric" renderorder="right-down" 
     width="{width}" height="{height}" tilewidth="64" tileheight="32" infinite="0" 
     nextlayerid="10" nextobjectid="1">
     
 <!-- Tileset references -->
 <tileset firstgid="1" source="../tilesheets/ground/grass_green.tsx"/>
 <tileset firstgid="145" source="../tilesheets/ground/dirt.tsx"/>
 <tileset firstgid="289" source="../tilesheets/ground/sand.tsx"/>
 <tileset firstgid="433" source="../tilesheets/ground/stone_path.tsx"/>
 <tileset firstgid="577" source="../tilesheets/vegetation/trees_shaded.tsx"/>
 <tileset firstgid="721" source="../tilesheets/buildings/iso_64x64_buildings.tsx"/>
 
 <!-- Ground Layer -->
 <layer id="1" name="Ground" width="{width}" height="{height}">
  <data encoding="csv">
'''
        
        # Export ground tiles
        tile_map = {
            'grass': 1,
            'dirt': 145,
            'sand': 289,
            'stone': 433,
            'water': 1
        }
        
        for y in range(height):
            row_data = []
            for x in range(width):
                # Find tile at this position
                tile_type = 'grass'  # Default
                for tile in export_data['tiles']:
                    if tile['x'] == x and tile['y'] == y:
                        tile_type = tile['type']
                        break
                
                tile_gid = tile_map.get(tile_type, 1)
                row_data.append(str(tile_gid))
            
            tmx_content += ','.join(row_data)
            if y < height - 1:
                tmx_content += ',\n'
            else:
                tmx_content += '\n'
        
        tmx_content += '''  </data>
 </layer>
 
 <!-- Decorations Layer -->
 <layer id="2" name="Vegetation" width="{}" height="{}">
  <data encoding="csv">
'''.format(width, height)
        
        # Export decorations
        for y in range(height):
            row_data = ['0'] * width
            tmx_content += ','.join(row_data)
            if y < height - 1:
                tmx_content += ',\n'
            else:
                tmx_content += '\n'
        
        tmx_content += '''  </data>
 </layer>
 
 <!-- Buildings Layer -->
 <layer id="3" name="Buildings" width="{}" height="{}">
  <data encoding="csv">
'''.format(width, height)
        
        # Export buildings
        for y in range(height):
            row_data = ['0'] * width
            tmx_content += ','.join(row_data)
            if y < height - 1:
                tmx_content += ',\n'
            else:
                tmx_content += '\n'
        
        tmx_content += '''  </data>
 </layer>
 
 <!-- Paths Layer (for gravel paths and sidewalks) -->
 <layer id="4" name="Paths" width="{}" height="{}">
  <properties>
   <property name="editable" value="true"/>
   <property name="description" value="Use this layer to draw gravel paths and sidewalks"/>
  </properties>
  <data encoding="csv">
'''.format(width, height)
        
        for y in range(height):
            row_data = ['0'] * width
            tmx_content += ','.join(row_data)
            if y < height - 1:
                tmx_content += ',\n'
            else:
                tmx_content += '\n'
        
        tmx_content += '''  </data>
 </layer>
 
 <!-- Object Layer for Ploppables -->
 <objectgroup id="5" name="Ploppables">
  <properties>
   <property name="description" value="Drag and drop ploppable buildings here"/>
  </properties>
'''
        
        # Add ploppable references
        obj_id = 1
        for ploppable in export_data['ploppables']:
            tmx_content += f'''  <object id="{obj_id}" name="{ploppable['name']}" 
          type="{ploppable['type']}" x="{ploppable['x'] * 64}" y="{ploppable['y'] * 32}" 
          width="{ploppable['width'] * 64}" height="{ploppable['height'] * 32}">
   <properties>
    <property name="ploppable" value="true"/>
    <property name="has_interior" value="true"/>
    <property name="prefab" value="ploppables/{ploppable['type']}/{ploppable['name']}.json"/>
   </properties>
  </object>
'''
            obj_id += 1
        
        tmx_content += ''' </objectgroup>
 
</map>
'''
        
        # Save TMX file
        tmx_file = self.output_dir / 'world_map.tmx'
        with open(tmx_file, 'w') as f:
            f.write(tmx_content)
        
        print(f"Saved: {tmx_file}")


def main():
    """Main export function"""
    import sys
    
    # Get project root
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    print("\n" + "=" * 70)
    print("WORLD TO WORLDED EXPORTER")
    print("=" * 70)
    print()
    
    # Example: Export current world
    # In actual use, this would load from the running game
    example_world = {
        'name': 'DailyGrind_Main',
        'width': 100,
        'height': 100,
        'tiles': [],
        'buildings': [
            {
                'type': 'store',
                'subtype': 'grocery',
                'x': 10,
                'y': 10,
                'width': 15,
                'height': 20,
                'has_interior': True,
                'is_ploppable': True,
                'rooms': ['sales_floor', 'storage', 'office'],
                'doors': [{'x': 12, 'y': 10}],
                'windows': [{'x': 11, 'y': 10}, {'x': 13, 'y': 10}],
                'description': 'Main grocery store with full interior'
            },
            {
                'type': 'store',
                'subtype': 'hardware',
                'x': 30,
                'y': 10,
                'width': 12,
                'height': 15,
                'has_interior': True,
                'is_ploppable': True,
                'rooms': ['showroom', 'warehouse'],
                'doors': [{'x': 32, 'y': 10}],
                'windows': [{'x': 31, 'y': 10}],
                'description': 'Hardware store with tools and supplies'
            },
            {
                'type': 'house',
                'subtype': 'suburban',
                'x': 50,
                'y': 20,
                'width': 10,
                'height': 8,
                'has_interior': True,
                'is_ploppable': True,
                'rooms': ['living_room', 'kitchen', 'bedroom', 'bathroom'],
                'doors': [{'x': 55, 'y': 20}],
                'windows': [{'x': 52, 'y': 20}, {'x': 58, 'y': 20}],
                'description': 'Two-story suburban house'
            }
        ]
    }
    
    # Generate tile grid
    for y in range(example_world['height']):
        for x in range(example_world['width']):
            # Determine tile type based on position
            if x < 10 or y < 10 or x >= 90 or y >= 90:
                tile_type = 'grass'
            elif 40 <= x < 60 and 40 <= y < 60:
                tile_type = 'sand'
            else:
                tile_type = 'grass'
            
            example_world['tiles'].append({
                'x': x,
                'y': y,
                'type': tile_type,
                'biome': 'plains',
                'decoration': None
            })
    
    # Create exporter and export
    exporter = WorldEdExporter(project_root)
    exporter.export_world_data(example_world)
    
    print("\n✅ World exported successfully!")
    print("\nNext steps:")
    print("  1. Open WorldEd")
    print("  2. Load: worlded_export/world_map.tmx")
    print("  3. Edit the map using WorldEd tools")
    print("  4. Place ploppables from ploppables/ directory")
    print("  5. Draw paths on the 'Paths' layer")
    print()


if __name__ == '__main__':
    main()
