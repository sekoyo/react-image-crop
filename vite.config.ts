import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // root: './demo',
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ReactCrop',
      // the proper extensions will be added
      fileName: 'index',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react', 'react-dom'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        assetFileNames: chunkInfo => {
          if (chunkInfo.name == 'style.css') {
            return 'ReactCrop.css' // For compat with older versions
          }
          return chunkInfo.name || ''
        },
      },
    },
  },
  plugins: [
    react({
      jsxRuntime: 'classic',
    }),
  ],
})
