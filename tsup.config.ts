import { defineConfig } from 'tsup'
import { sassPlugin } from 'esbuild-sass-plugin'

export default defineConfig({
  entry: ['src/index.ts'],
  sourcemap: true,
  dts: true,
  clean: true,
  format: ['esm', 'cjs'],
  // minify: true, // leave off - easier to read downstream and bundlers will minify
  esbuildPlugins: [sassPlugin()],
  platform: 'browser',
})
