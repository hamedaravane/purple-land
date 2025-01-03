# Purple Land

A simple yet addictive bubble-popping game built using **Phaser 3** and **TypeScript**. This game demonstrates:

- Basic bubble shooter mechanics
- Matching 3 or more bubbles to pop
- Level progression and increased difficulty
- Responsive mobile-friendly scaling
- Sound effects and simple animations

## Getting Started

1. **Install Dependencies**:

   ```bash
   npm install
2. **Development Server**:

    ```bash
    npm run dev

3. Open http://localhost:8080 in your browser.

## Production Build:

    ```bash
    npm run build

The compiled files will be in the `dist/` folder.

## Game Configuration:

- Adjust `GameConfig.ts` to change `width`, `height`, `scale` `mode`, etc.

- Edit `BubbleShooterScene.ts` to tweak gameplay parameters (`bubble rows`, `difficulty`, etc.).

## Directory Structure
- `assets/`: Contains images, audio, and fonts.
- `src/`: Main game code (TypeScript).
- `config/`: Shared Phaser game config (GameConfig).
- `scenes/`: Game scenes (Main bubble shooter).
- `objects/`, `utils/`, `types/`: Extend as needed for shared classes, utilities, type definitions, etc.
- `webpack.config.js`: Webpack bundling configuration.
- `tsconfig.json`: TypeScript configuration.
- `eslint.config.js`: ESLint configuration for code quality.