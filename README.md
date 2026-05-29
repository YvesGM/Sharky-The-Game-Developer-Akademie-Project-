# Sharky – Canvas Game Project
**Sharky** is a browser-based 2D underwater game built with vanilla JavaScript, HTML5 Canvas and modular ES6 architecture. The player controls Sharky through an animated underwater level, collects coins and poison bottles, fights enemies, avoids hazards and defeats the final boss.
The project was developed as an academy and portfolio project with a focus on object-oriented JavaScript, canvas rendering, collision detection, animation handling, modular code organization and responsive game UI.

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Gameplay](#gameplay)
- [Controls](#controls)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Core Architecture](#core-architecture)
- [Game Systems](#game-systems)
- [Installation](#installation)
- [Run Locally](#run-locally)
- [Development Notes](#development-notes)
- [Assets and Credits](#assets-and-credits)
- [Possible Future Improvements](#possible-future-improvements)

---

## Overview
Sharky is a side-scrolling underwater action game. The game starts from a custom start screen and runs inside an HTML5 canvas. The world is built from multiple background layers, static barriers, collectibles, enemies and a final boss encounter.

The game includes:
- Canvas-based rendering
- Player movement and camera scrolling
- Animated character states
- Collectible items
- Enemy collision and damage logic
- Fin attack and bubble attack mechanics
- Poison bubble mechanic
- Final boss fight
- HUD for health, coins and poison
- Sound effects and background music
- Start, win and game-over screens
- Mobile controls
- Fullscreen support
- Impressum and credits modal

---

## Features

### Player
- Animated idle, long idle, swim, hurt, electric shock, attack and death states
- Horizontal and vertical movement
- Direction-aware rendering
- Health system with staged life bar updates
- Collision-based damage handling
- Fin slap attack
- Bubble attack
- Poison bubble attack after collecting enough poison bottles

### Enemies
- Multiple pufferfish variants
- Multiple jellyfish variants
- Enemy movement patterns
- Enemy death states
- Jellyfish electric shock damage behavior
- Final boss with intro, fighting state and health logic

### Collectibles
- Coins
- Poison bottles
- HUD updates after collection
- Collection sound feedback

### World
- Wide side-scrolling level
- Repeating layered underwater background
- Static barriers and level obstacles
- Camera following the player
- Device-pixel-ratio-aware canvas scaling

### UI
- Start screen
- Game over screen
- Win screen
- Score display
- Instruction panel
- Fullscreen button
- Restart button
- Mobile touch controls
- Legal and credits modal

### Audio
- Background music
- Button click sound
- Coin collection sound
- Poison bottle collection sound
- Hurt sound
- Jellyfish shock sound
- Bubble sound
- Enemy death sound
- Boss intro sound
- Boss hit sound
- Game over sound
- Win sound

---

## Gameplay
The goal is to guide Sharky through the underwater world, collect coins and poison bottles, defeat enemies and survive until the final boss.

The player can use two attack types:
1. **Fin Attack**  
   A close-range attack used against normal enemies and the final boss.

2. **Bubble Attack**  
   A ranged attack. After collecting enough poison bottles, Sharky can fire a stronger poison bubble.

The game ends when Sharky loses all health or when the final boss is defeated.

---

## Controls

### Keyboard
| Key | Action |
| --- | --- |
| Arrow Up | Move up |
| Arrow Down | Move down |
| Arrow Left | Move left |
| Arrow Right | Move right |
| Space | Bubble attack |
| D | Fin attack |
| R | Restart game |

### Mobile / Touch
The game includes on-screen mobile controls:
- Directional buttons for movement
- `Bubble` button for bubble attack
- `Attack` button for fin attack

---

## Tech Stack
- **HTML5**
- **CSS3**
- **Vanilla JavaScript**
- **ES6 Modules**
- **Object-Oriented Programming**
- **HTML5 Canvas API**
- **Native Audio API**

No external JavaScript framework is required.

---

## Project Structure
```txt
.
├── index.html
├── assets/
│   ├── audio/
│   │   ├── music/
│   │   └── sfx/
│   ├── css/
│   │   ├── components/
│   │   ├── layout/
│   │   ├── ui/
│   │   └── style.css
│   ├── fonts/
│   └── img/
├── lib/
│   ├── classes/
│   │   ├── audio/
│   │   ├── background/
│   │   ├── characters/
│   │   ├── entities/
│   │   ├── hud/
│   │   ├── keyboard/
│   │   └── world/
│   ├── configs/
│   │   ├── audio/
│   │   ├── background/
│   │   ├── camera/
│   │   ├── characters/
│   │   ├── entities/
│   │   └── hud/
│   └── storage/
│       ├── characters/
│       ├── entities/
│       └── hud/
└── logic/
    ├── game.js
    └── world/
        ├── background/
        ├── characters/
        ├── entities/
        ├── hud/
        ├── keyboard/
        ├── legals/
        └── world.js
```

---

## Core Architecture
The project is separated into three main layers:

### `assets/`
Contains all static resources:
- Images
- Sprite animations
- Background layers
- Audio files
- Fonts
- CSS files

### `lib/`
Contains reusable game classes, configuration files and storage arrays.

Important responsibilities:
- Base object classes
- Player class
- Enemy classes
- Collectible classes
- HUD classes
- Audio manager
- Game object configuration
- Asset path storage

### `logic/`
Contains the active game flow and rendering logic.

Important responsibilities:
- Game initialization
- Keyboard and mobile input handling
- Canvas setup
- Game loop
- Camera updates
- Collision checks
- Attack checks
- HUD rendering
- UI event handling
- Legal modal handling

---

## Game Systems

### Game Initialization
The game starts in `logic/game.js`.

This file initializes:
- Mobile controls
- Legal modal
- Sound credits
- Start button
- Restart buttons
- Fullscreen button
- Keyboard controls

The actual canvas world is loaded only after the player starts the game.

---

### Game Loop
The main game loop is handled in `logic/world/world.js`.

Each frame performs the following steps:
1. Clear canvas
2. Check restart input
3. Update running game logic
4. Draw translated world objects
5. Update camera position
6. Draw fixed overlay elements
7. Request the next animation frame

The loop uses `requestAnimationFrame()` for smooth browser-native rendering.

---

### Canvas Resolution
The canvas uses a base resolution of:
```txt
1920 x 1080
```

The actual canvas resolution is scaled by `window.devicePixelRatio` to keep the rendering sharp on high-density displays.

---

### Camera System
The world is wider than the visible canvas. The camera follows Sharky horizontally and translates the world rendering with:
```js
ctx.translate(-camera_x, 0);
```

This keeps Sharky visible while the background, enemies, collectibles and barriers move relative to the camera.

---

### Collision System
The game uses rectangular hitboxes for collision detection.
Collisions are checked between:

- Sharky and enemies
- Sharky and collectibles
- Sharky and barriers
- Sharky's attack box and enemies
- Bubble projectiles and enemies

The project also includes a debug hitbox mode in the world logic, which can be used during development to inspect collision areas.

---

### Attack System
Sharky supports two main attacks.

#### Fin Attack
The fin attack is a close-range attack with a limited active hit window. It is mainly used to damage enemies and the final boss.

#### Bubble Attack
The bubble attack is a ranged attack. The bubble is spawned after the attack animation reaches the intended timing window, so the projectile appears in sync with the animation.

#### Poison Bubble
After collecting enough poison bottles, Sharky can shoot a stronger poison bubble.

---

### Enemy System
Enemies are stored in configuration files and instantiated before the game starts.

Enemy types include:
- Green pufferfish
- Red pufferfish
- Rainbow pufferfish
- Yellow jellyfish
- Lila jellyfish
- Final boss

Each enemy class controls its own animation behavior, movement behavior, hitbox offset and death behavior.

---

### Boss System
The final boss is placed near the end of the level and includes multiple states, such as:
- Sleeping
- Intro / appearing
- Fighting
- Dead

The boss can damage Sharky during the fighting state and can be damaged by Sharky's fin attack.

---

### HUD System
The HUD displays:
- Health
- Collected coins
- Collected poison bottles

HUD graphics are handled through reusable HUD bar classes and dedicated HUD storage/configuration files.

---

### Audio System
Audio is handled through a central `AudioManagerClass`.

The audio manager provides:
- `play(soundName)`
- `playMusic(soundName)`
- `stop(soundName)`
- `stopAllMusic()`

This keeps sound playback centralized and avoids scattering raw `Audio` calls across the project.

---

## Installation
Clone or download the project:
```bash
git clone <repository-url>
cd <project-folder>
```

No package installation is required because the project does not depend on npm packages.

---

## Run Locally
Because the project uses ES6 module imports, it should be started through a local development server instead of opening `index.html` directly via `file://`.

### Option 1: VS Code Live Server
1. Open the project in VS Code.
2. Install the `Live Server` extension.
3. Right-click `index.html`.
4. Select `Open with Live Server`.

### Option 2: Python Local Server
From the project root:
```bash
python -m http.server 5500
```

Then open:
```txt
http://localhost:5500
```

### Option 3: Node Local Server
```bash
npx serve .
```

---

## Development Notes

### Recommended Browser
Use a modern desktop browser such as Chrome, Firefox or Edge.

### Audio Autoplay
Browsers usually block audio until the first user interaction. The game starts background music only after the player presses the start button.

### Responsive Layout
The project includes responsive CSS for:
- Desktop layout
- Smaller browser windows
- Mobile controls
- Fullscreen mode

### File Naming
Some asset folders contain spaces and special naming from the original asset package. When changing paths, keep all imports and storage references synchronized.

---

## Assets and Credits
This project uses visual game assets from the Developer Akademie Sharky asset package.
Audio files are listed inside the in-game credits modal. The credits modal is available through the `Impressum & Credits` button.
This project was created as an educational and portfolio project.

---

## Possible Future Improvements
- Add a pause menu
- Add difficulty levels
- Add checkpoint system
- Add better enemy wave balancing
- Add more boss attack patterns
- Add animated UI transitions
- Add persistent high score storage
- Add accessibility improvements
- Add touch-control scaling options
- Add loading screen for large assets
- Add automated linting and formatting setup
- Add unit-like tests for collision helper functions

---

## Project Status
The project already includes the core gameplay loop, player mechanics, enemies, collectibles, HUD, audio, UI overlays and final boss logic.

Current focus areas:
- Gameplay polish
- Animation timing
- Sound timing
- Collision fine-tuning
- Responsive UI improvements
- Final code cleanup and documentation

---

## Author
Created by **Yves Gildemeister** as part of an academy and portfolio game project.
