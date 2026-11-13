/// <reference types="node" />

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';
import {createRequire} from 'node:module';
import {env} from 'node:process';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

const projectRoot = url.fileURLToPath(new URL('.', import.meta.url));

function copyStandaloneFolders() {
  return {
    name: 'copy-standalone-folders',
    closeBundle() {
      const distDir = path.resolve(projectRoot, 'dist');
      for (const folder of ['js', 'images']) {
        const src = path.resolve(projectRoot, folder);
        const dest = path.resolve(distDir, folder);
        if (fs.existsSync(src)) {
          fs.cpSync(src, dest, {recursive: true});
        }
      }
    },
  };
}

export default () => {
  return {
    base: './',
    plugins: [tailwindcss(), react(), copyStandaloneFolders()],
    resolve: {
      alias: {
        '@': projectRoot,
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: env.DISABLE_HMR === 'true' ? null : {},
    },
  };
};
