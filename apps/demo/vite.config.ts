import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      'parallax-scene-studio/style.css': resolve(__dirname, '../../packages/parallax-scene-studio/src/style.css'),
      'parallax-scene-studio': resolve(__dirname, '../../packages/parallax-scene-studio/src/index.ts')
    }
  }
});

