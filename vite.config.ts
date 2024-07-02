import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import path from 'path'
import viteCompression from 'vite-plugin-compression'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    AutoImport({
      imports: ["vue"],
      // vueTemplate: true,
      dts: "src/typings/auto-imports.d.ts"
    }),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz'
    }),
    // dts()
  ],
  build: {
    minify: 'esbuild',
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, "./src/index.ts"),
      name: 'LtContextmenu',
      fileName: (format) => `lt-contextmenu.${format}.js`
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  esbuild: {
    drop: ['console', 'debugger'],
  }
})
