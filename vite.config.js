// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        desktop: resolve(__dirname, 'desktop/index.html'),
        mobile: resolve(__dirname, 'mobile/index.html'),
        /*
        main: resolve(__dirname, 'MWW-Web/index.html'),
        desktop: resolve(__dirname, 'MWW-Web/desktop/index.html'),
        mobile: resolve(__dirname, 'MWW-Web/mobile/index.html'),
        */
      },
    },
  },
});
