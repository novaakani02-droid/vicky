import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import {defineConfig} from 'vite';

function copyStandaloneFolders() {
  return {
    name: 'copy-standalone-folders',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      for (const folder of ['js', 'images']) {
        const src = path.resolve(__dirname, folder);
        const dest = path.resolve(distDir, folder);
        if (fs.existsSync(src)) {
          fs.cpSync(src, dest, {recursive: true});
        }
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), copyStandaloneFolders()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
