import { defineConfig } from 'tsup';
import { copyFile } from 'node:fs/promises';

export default defineConfig({
  name: 'build',
  entry: ['src/index.ts'],
  outDir: 'dist',
  clean: true,
  target: 'es2023',
  platform: 'node',
  minify: false,
  bundle: true,
  skipNodeModulesBundle: true,
  sourcemap: false,
  // format: ['esm', 'cjs'],
  format: ['esm'],
  // dts: true,
  shims: true,
  onSuccess: async () => {
    await copyFile('src/prettier.config.js', 'dist/prettier.config.js');
  }
});
