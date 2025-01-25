# Purple Land

Purple Land is a dynamic 2D game built with Phaser 3 and TypeScript. The game features a grid-based bubble-shooting mechanic, immersive visuals, and a smooth player experience. This repository is designed for both development and production environments, ensuring a seamless workflow.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Running the Game](#running-the-game)
- [Game Overview](#game-overview)
   - [Core Mechanics](#core-mechanics)
   - [Game Components](#game-components)
- [Development](#development)
   - [Folder Structure](#folder-structure)
   - [Scripts](#scripts)
   - [Testing](#testing)
- [License](#license)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)

---

## Features
- **Phaser 3 Framework:** Advanced 2D game development capabilities.
- **TypeScript Support:** Type-safe development for robust and maintainable code.
- **Bubble Shooting Mechanics:** Interactive gameplay with grid-based mechanics.
- **Smooth Animations:** Seamless transitions and engaging visuals.
- **Development Tools:** Includes ESLint, Prettier, and Vitest for code quality and testing.

---

## Technologies Used
- **[Phaser 3](https://phaser.io/):** Game development framework.
- **[TypeScript](https://www.typescriptlang.org/):** Strongly-typed programming language.
- **[Vite](https://vitejs.dev/):** Lightning-fast build tool.
- **[ESLint](https://eslint.org/):** JavaScript linting.
- **[Prettier](https://prettier.io/):** Code formatter.
- **[Vitest](https://vitest.dev/):** Testing framework.

---

## Getting Started

### Prerequisites
- Node.js v14.0.0 or higher
- NPM v6.0.0 or higher

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/hamedaravane/purple-land.git
   ```

2. Navigate to the project directory:
   ```bash
   cd purple-land
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Game
To start the game in development mode:
```bash
npm run dev
```

To build the game for production:
```bash
npm run build
```

To test the game:
```bash
npm run test
```

---

## Game Overview

### Core Mechanics
Purple Land revolves around shooting bubbles into a grid. The goal is to strategically match bubbles of the same color to clear them and score points.

### Game Components
1. **Aimer**
   - Handles aiming and shooting of bubbles.
2. **Bubble**
   - Represents individual bubbles with specific colors and behaviors.
3. **BubbleGrid**
   - Manages the grid structure and bubble placement.
4. **BubbleManager**
   - Responsible for spawning and managing bubbles.
5. **GameScene**
   - Main game logic and scene management.

---

## Development

### Folder Structure
```
project-root/
├── src/
│   ├── constants/
│   ├── managers/
│   ├── objects/
│   ├── scenes/
│   ├── types/
│   ├── utils/
│   ├── main.ts
├── public/
│   ├── assets/
│   │   ├── audio
│   │   └── images
├── vite/
├── index.html
└── package.json
```

### Testing
Vitest is used to ensure the reliability of the code. Run the following command for test coverage:
```bash
npm run coverage
```

---

## License
Purple Land is licensed under the **Creative Commons Attribution-NoDerivatives 4.0 International (CC BY-ND 4.0)**. See the [LICENSE file](./LICENSE) for more details.
