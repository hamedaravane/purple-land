import { defineConfig } from 'vite';
import path from 'node:path';

const phasermsg = () => {
  return {
    name: 'phasermsg',
    buildStart() {
      process.stdout.write(`Building for production...\n`);
    },
    buildEnd() {
      process.stdout.write(`✨ Done ✨\n`);
    },
  };
};

export default defineConfig({
  base: './',
  logLevel: 'warning',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        passes: 2,
      },
      mangle: true,
      format: {
        comments: false,
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
  plugins: [phasermsg()],
});
