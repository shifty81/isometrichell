# Player Character Tiles

This directory contains individual character frames extracted from the player sprite sheets.

## Overview

All character animations have been extracted from their original sprite sheets located in `assets/Charachters/Player/` and organized into separate folders for easy use in the game.

**Total Animations**: 23  
**Total Frames**: 644 (28 frames per animation)  
**Frame Size**: 256x256 pixels (RGBA)  
**Original Sprite Sheet Grid**: 7 columns × 4 rows

## Directory Structure

Each animation has its own folder containing 28 individually numbered frames:

```
player/
├── Attack1/         (28 frames: Attack1-000.png to Attack1-027.png)
├── Attack2/         (28 frames: Attack2-000.png to Attack2-027.png)
├── Attack3/         (28 frames: Attack3-000.png to Attack3-027.png)
├── Attack4/         (28 frames: Attack4-000.png to Attack4-027.png)
├── CrouchIdle/      (28 frames: CrouchIdle-000.png to CrouchIdle-027.png)
├── CrouchRun/       (28 frames: CrouchRun-000.png to CrouchRun-027.png)
├── Die/             (28 frames: Die-000.png to Die-027.png)
├── Idle/            (28 frames: Idle-000.png to Idle-027.png)
├── Idle2/           (28 frames: Idle2-000.png to Idle2-027.png)
├── Idle3/           (28 frames: Idle3-000.png to Idle3-027.png)
├── RideIdle/        (28 frames: RideIdle-000.png to RideIdle-027.png)
├── RideRun/         (28 frames: RideRun-000.png to RideRun-027.png)
├── Run/             (28 frames: Run-000.png to Run-027.png)
├── RunAttack/       (28 frames: RunAttack-000.png to RunAttack-027.png)
├── RunBackwards/    (28 frames: RunBackwards-000.png to RunBackwards-027.png)
├── RunBackwardsAttack/ (28 frames: RunBackwardsAttack-000.png to RunBackwardsAttack-027.png)
├── StrafeLeft/      (28 frames: StrafeLeft-000.png to StrafeLeft-027.png)
├── StrafeLeftAttack/ (28 frames: StrafeLeftAttack-000.png to StrafeLeftAttack-027.png)
├── StrafeRight/     (28 frames: StrafeRight-000.png to StrafeRight-027.png)
├── StrafeRightAttack/ (28 frames: StrafeRightAttack-000.png to StrafeRightAttack-027.png)
├── TakeDamage/      (28 frames: TakeDamage-000.png to TakeDamage-027.png)
├── Taunt/           (28 frames: Taunt-000.png to Taunt-027.png)
└── Walk/            (28 frames: Walk-000.png to Walk-027.png)
```

## Animation Descriptions

### Movement Animations
- **Idle**: Basic idle standing animation
- **Idle2**: Alternative idle animation (variant 2)
- **Idle3**: Alternative idle animation (variant 3)
- **Walk**: Walking animation
- **Run**: Running animation
- **RunBackwards**: Running backwards animation
- **StrafeLeft**: Strafing left animation
- **StrafeRight**: Strafing right animation

### Combat Animations
- **Attack1**: First attack animation
- **Attack2**: Second attack animation
- **Attack3**: Third attack animation
- **Attack4**: Fourth attack animation
- **RunAttack**: Attack while running
- **RunBackwardsAttack**: Attack while running backwards
- **StrafeLeftAttack**: Attack while strafing left
- **StrafeRightAttack**: Attack while strafing right

### Special Animations
- **CrouchIdle**: Idle while crouched
- **CrouchRun**: Running while crouched
- **RideIdle**: Idle while riding (e.g., on a mount)
- **RideRun**: Running while riding
- **TakeDamage**: Taking damage animation
- **Die**: Death animation
- **Taunt**: Taunt/emote animation

## Usage in Game

These individual frames can be loaded sequentially to create smooth animations. Each animation folder contains frames numbered from 000 to 027, representing the animation sequence from start to finish.

Example loading pattern:
```javascript
// Load all frames for the Idle animation
const idleFrames = [];
for (let i = 0; i < 28; i++) {
    const frameNumber = i.toString().padStart(3, '0');
    idleFrames.push(`assets/individual/charachter/player/Idle/Idle-${frameNumber}.png`);
}
```

## Original Files

The original sprite sheets remain intact at: `assets/Charachters/Player/`

These can be used if you prefer to work with sprite sheets instead of individual frames.

## Extraction Script

The tiles were extracted using the utility script: `utils/extract_character_tiles.py`

To re-extract or extract additional character sprite sheets, run:
```bash
python3 utils/extract_character_tiles.py
```

## Technical Details

- **Format**: PNG with transparency (RGBA)
- **Tile Size**: 256×256 pixels
- **Source Grid**: 7 columns × 4 rows
- **Frames per Animation**: 28
- **Total Size**: ~50MB (all animations)

## Notes

- All frames are consistently sized at 256×256 pixels
- Transparency is preserved from the original sprite sheets
- Frame numbering is zero-padded for proper sorting (000-027)
- The character sprite within each 256×256 frame is approximately 160×173 pixels
