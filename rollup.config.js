/* eslint-env node */
import replace from '@rollup/plugin-replace';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
// import del from 'rollup-plugin-delete'
import { terser } from "rollup-plugin-terser";
import scss from 'rollup-plugin-scss'

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
};
const external = Object.keys(globals);
const extensions = ['.ts', '.tsx'];

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'esm',
    globals,
  },
  external,
  // inlineDynamicImports: true,
  plugins: [
    // This makes ParcelJS when running in /test throw an error on updates.
    // del({ targets: 'dist/*' }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    commonjs(),
    nodeResolve({
      extensions,
    }),
    typescript(),
    scss({ output: 'dist/styles.css' }),
    terser()
  ],
};
