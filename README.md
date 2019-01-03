# React Image Crop

A responsive image cropping tool for React.

[![React Image Crop on NPM](https://img.shields.io/npm/v/react-image-crop.svg)](https://www.npmjs.com/package/react-image-crop)

[Sandbox Demo](https://codesandbox.io/s/72py4jlll6)

![ReactCrop Demo](https://raw.githubusercontent.com/DominicTobias/react-image-crop/master/crop-demo.gif)

## Table of Contents
1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [CDN](#cdn)
5. [Props](#props)
6. [FAQ](#faq)
    1. [What about showing the crop on the client?](#what-about-showing-the-crop-on-the-client)
    2. [How to handle image EXIF orientation/rotation](#how-to-handle-image-exif-orientationrotation)
7. [Contributing / Developing](#contributing--developing)

## Features

- Responsive
- Touch enabled
- Free-form or fixed aspect crops
- Keyboard support for nudging selection
- Min/max crop size
- No dependencies/small footprint (~4.63KB gzipped)

## Installation
```
npm i react-image-crop --save
```

## Usage

Include the main js module, e.g.:

```js
var ReactCrop = require('react-image-crop');
// or es6:
import ReactCrop from 'react-image-crop';
```

Include either `dist/ReactCrop.css` or `ReactCrop.scss`.

```js
import 'react-image-crop/dist/ReactCrop.css';
// or scss:
import 'react-image-crop/lib/ReactCrop.scss';
```

## CDN

If you prefer to include ReactCrop globally by marking `react-image-crop` as external in your application, then include `react-image-crop` from one of the following CDNs:

* **cdnjs** *(Coming soon)*

* [**unpkg**](https://unpkg.com/react-image-crop/)
```html
<script src="https://unpkg.com/react-image-crop/dist/ReactCrop.min.js"></script>
```

Note when importing the script globally using a `<script>` tag access the component with `ReactCrop.Component`.

## Props

#### src (required)

```jsx
<ReactCrop src="path/to/image.jpg" />
```

You can of course pass a blob url (using `URL.createObjectURL()` and `URL.revokeObjectURL()`) or base64 data.

#### onChange(crop, pixelCrop) (required)

A callback which happens for every change of the crop (i.e. many times as you are dragging/resizing). Passes the current crop state object, as well as a pixel-converted crop for your convenience.

Note you _must_ implement this callback and update your crop state, otherwise nothing will change!

```js
onChange = (crop) => {
  this.setState({ crop });
}
```

#### crop (required*)

All crop values are in percentages, and are relative to the image. All crop params are optional.

&#42; _While you can initially omit the crop object, any subsequent change will need to be saved to state in the `onChange` callback and passed here._

```js
crop: {
  x: 20,
  y: 10,
  width: 30,
  height: 10
}

<ReactCrop src="path/to/image.jpg" crop={this.state.crop} />
```

If you want a fixed aspect you can either omit `width` and `height`:

 ```js
crop: {
  aspect: 16/9
}
```

Or specify one of the dimensions:

```js
crop: {
  aspect: 16/9,
  width: 50,
}
```

In this case the other dimension will be calculated and `onChange` and `onComplete` will be fired with the completed crop, so that the crop will be rendered on the next pass.

#### minWidth (optional)

A minimum crop width, as a percentage of the image width.

#### minHeight (optional)

A minimum crop height, as a percentage of the image height.

#### maxWidth (optional)

A maximum crop width, as a percentage of the image width.

#### maxHeight (optional)

A maximum crop height, as a percentage of the image height.

#### keepSelection (optional)

If true is passed then selection can't be disabled if the user clicks outside the selection area.

#### disabled (optional)

If true then the user cannot resize or draw a new crop. A class of `ReactCrop--disabled` is also added to the container for user styling.

#### locked (optional)

If true then the user cannot create or resize a crop, but can still drag the existing crop around. A class of `ReactCrop--locked` is also added to the container for user styling.

#### className (optional)

A string of classes to add to the main `ReactCrop` element.

#### style (optional)

Inline styles object to be passed to the image wrapper element.

#### imageStyle (optional)

Inline styles object to be passed to the image element.

#### onComplete(crop, pixelCrop) (optional)

A callback which happens after a resize, drag, or nudge. Passes the current crop state object, as well as a pixel-converted crop for your convenience.

#### onImageLoaded(image, pixelCrop) (optional)

A callback which happens when the image is loaded. Passes the image DOM element and the pixelCrop if a crop has been specified by this point.

#### onImageError(event) (optional)

This event is called if the image had an error loading.

#### onDragStart() (optional)

A callback which happens when a user starts dragging or resizing. It is convenient to manipulate elements outside this component.

#### onDragEnd() (optional)

A callback which happens when a user releases the cursor or touch after dragging or resizing.

#### crossorigin (optional)

Allows setting the crossorigin attribute on the image.

## FAQ

### What about showing the crop on the client?

I wanted to keep this component focused so I didn't provide this. Normally a cropped image will be rendered and cached by a backend.

However here's a ready to use function that returns a file blob for the cropped part after providing some parameters you already have when using this package:

```js
/**
 * @param {File} image - Image File Object
 * @param {Object} pixelCrop - pixelCrop Object from the 2nd argument of onChange or onComplete
 * @param {String} fileName - Name of the returned file in Promise
 */
function getCroppedImg(image, pixelCrop, fileName) {

  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // As Base64 string
  // const base64Image = canvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      blob.name = fileName;
      resolve(blob);
    }, 'image/jpeg');
  });
}

async test() {
  const croppedImg = await getCroppedImg(image, pixelCrop, returnedFileName);
}
```

Some things to note:

1. [toDataURL](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL) is synchronous and will block the main thread, for large images this could be for as long as a couple of seconds. *Always* use `toDataURL('image/jpeg')` otherwise it will default to `image/png` and the conversion will be significantly slower.

2. [toBlob](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob) is both faster and asynchronous, but not supported on old browsers (this is quickly becoming irrelevant).

3. Another option to make the conversion faster is to scale the image down before converting it.

### How to handle image EXIF orientation/rotation

You might find that some images are rotated incorrectly. Unfortunately this is a browser wide issue not related to this library. You need to fix your image before passing it in.

You can use the following library to load images, which will correct the rotation for you: https://github.com/blueimp/JavaScript-Load-Image/

## Contributing / Developing

To develop run `npm start`, this will recompile your JS and SCSS on changes.

You can test your changes by opening `demo/index.html` in a browser (you don't need to be running a server).
