import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ParallaxSceneStudio',
      fileName: 'parallax-scene-studio',
      cssFileName: 'style',
      formats: ['es', 'umd']
    }
  }
});
