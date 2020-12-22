Note: You can see changes before (and after) v9 in GitHub Releases.

# 9.0.0

- Change to Typescript. Types are now bundled in. `@types/react-image-crop` is only for <= v8.
- Package is now only exported as an ESM module. There is no "main" entry in package.json only a "module" one.
- There is no default export and the component is called `Crop` instead of `ReactCrop`, you must do `import { Crop } from 'react-image-crop'.
- The `lib/` directory is renamed to `src/` and the `.scss` file is now located at `src/Crop.scss`.
- The `.css` file is now located at `dist/styles.css` instead of `dist/ReactCrop.scss`.
- `crossorigin` prop has been renamed to `crossOrigin`.
- `crop` prop is required. If you want to start with no crop then import `EMPTY_CROP` and set that e.g. `const [crop, setCrop] = useState(EMPTY_CROP)`.
- Dropped support for IE and old browsers.
