import { defineConfig } from 'vite';
import * as path from 'node:path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
        },
      },
    },
  },
  server: {
    port: 8080,
  },
  resolve: {
    alias: {
      '@objects': path.resolve(__dirname, '../src/objects'),
      '@scenes': path.resolve(__dirname, '../src/scenes'),
      '@utils': path.resolve(__dirname, '../src/utils'),
    },
  },
  plugins: [tsconfigPaths()],
});
