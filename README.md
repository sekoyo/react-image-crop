# React Image Crop

An image cropping tool for React with no dependencies.

[![React Image Crop on NPM](https://img.shields.io/npm/v/react-image-crop.svg)](https://www.npmjs.com/package/react-image-crop)

[Demo using class](https://codesandbox.io/s/72py4jlll6) |
[Demo using hook](https://codesandbox.io/s/react-image-crop-demo-with-react-hooks-y831o)

![ReactCrop Demo](https://raw.githubusercontent.com/DominicTobias/react-image-crop/master/crop-demo.gif)

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Example](#example)
5. [CDN](#cdn)
6. [Props](#props)
7. [FAQ](#faq)
   1. [What about showing the crop on the client?](#what-about-showing-the-crop-on-the-client)
   2. [How to correct image EXIF orientation/rotation](#how-to-correct-image-exif-orientationrotation)
   3. [How to filter, rotate and annotate](#how-to-filter-rotate-and-annotate)
   4. [How can I center the crop?](#how-can-i-center-the-crop)
8. [Contributing / Developing](#contributing--developing)

## Features

- Responsive (you can use pixels or percentages).
- Touch enabled.
- Free-form or fixed aspect crops.
- Keyboard support for nudging selection.
- No dependencies/small footprint (5KB gzip).
- Min/max crop size.

If React Image Crop doesn't cover your requirements then I advise to take a look at [Pintura](https://gumroad.com/a/611955827). It features cropping, rotating, filtering, annotation, and lots more.

[Learn more about Pintura here](https://gumroad.com/a/611955827)

## Installation

```
npm i react-image-crop --save
```

## Usage

Include the main js module:

```js
import ReactCrop from 'react-image-crop';
```

Include either `dist/ReactCrop.css` or `ReactCrop.scss`.

```js
import 'react-image-crop/dist/ReactCrop.css';
// or scss:
import 'react-image-crop/lib/ReactCrop.scss';
```

## Example

```js
function CropDemo({ src }) {
  const [crop, setCrop] = useState({ aspect: 16 / 9 });
  return <ReactCrop src={src} crop={crop} onChange={newCrop => setCrop(newCrop)} />;
}
```

See the [sandbox demo](https://codesandbox.io/s/72py4jlll6) for a more complete example.

## CDN

If you prefer to include ReactCrop globally by marking `react-image-crop` as external in your application, then include `react-image-crop` from the following CDN:

- [**unpkg**](https://unpkg.com/react-image-crop/)

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

#### onChange(crop, percentCrop) (required)

A callback which happens for every change of the crop (i.e. many times as you are dragging/resizing). Passes the current crop state object.

Note you _must_ implement this callback and update your crop state, otherwise nothing will change!

```js
onChange = crop => {
  this.setState({ crop });
};
```

You can use either `crop` or `percentCrop`, the library can handle either interchangeably. Percent crops will be drawn using percentages, not converted to pixels.

#### crop (required\*)

All crop params are initially optional.

\* _While you can initially omit the crop object, any subsequent change will need to be saved to state in the `onChange` and passed into the component._

```js
crop: {
  unit: 'px', // default, can be 'px' or '%'
  x: 130,
  y: 50,
  width: 200,
  height: 200
}

<ReactCrop src="path/to/image.jpg" crop={this.state.crop} />
```

If you want a fixed aspect you can either omit `width` and `height`:

```js
crop: {
  aspect: 16 / 9;
}
```

Or specify one or both of the dimensions:

```js
crop: {
  aspect: 16/9,
  width: 50,
}
```

If you specify just one of the dimensions, the other will be calculated for you.

```js
crop: {
  unit: '%',
  width: 50,
  height: 50,
}
```

`unit` is optional and defaults to pixels `px`. It can also be percent `%`. In the above example we make a crop that is 50% of the rendered image size. Since the values are a percentage of the image, it will only be a square if the image is also a square.

#### minWidth (optional)

A minimum crop width, in pixels.

#### minHeight (optional)

A minimum crop height, in pixels.

#### maxWidth (optional)

A maximum crop width, in pixels.

#### maxHeight (optional)

A maximum crop height, in pixels.

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

#### imageAlt (optional)

Add an alt attribute to the image element.

#### onComplete(crop, percentCrop) (optional)

A callback which happens after a resize, drag, or nudge. Passes the current crop state object.

`percentCrop` is the crop as a percentage. A typical use case for it would be to save it so that the user's crop can be restored regardless of the size of the image (for example saving it on desktop, and then using it on a mobile where the image is smaller).

#### onImageLoaded(image) (optional)

A callback which happens when the image is loaded. Passes the image DOM element.

Useful if you want to set a crop based on the image dimensions when using pixels:

```js
onImageLoaded = image => {
  this.setState({ crop: { width: image.width, height: image.height } });
  return false; // Return false when setting crop state in here.
};
```

Note that you must **return false** in this callback if you are changing the crop object.

#### onImageError(event) (optional)

This event is called if the image had an error loading.

#### onDragStart(event) (optional)

A callback which happens when a user starts dragging or resizing. It is convenient to manipulate elements outside this component.

#### onDragEnd(event) (optional)

A callback which happens when a user releases the cursor or touch after dragging or resizing.

#### crossorigin (optional)

Allows setting the crossorigin attribute on the image.

#### renderSelectionAddon(state) (optional)

Render a custom element in crop selection.

#### renderComponent (optional)

Render a custom HTML element in place of an image. Useful if you want to support videos:

```js
const videoComponent = (
  <video
    autoPlay
    loop
    style={{ display: 'block', maxWidth: '100%' }}
    onLoadStart={e => {
      // You must inform ReactCrop when your media has loaded.
      e.target.dispatchEvent(new Event('medialoaded', { bubbles: true }));
    }}
  >
    <source src="sample.mp4" type="video/mp4" />
  </video>
);

<ReactCrop onChange={this.onCropChange} renderComponent={videoComponent} />;
```

#### ruleOfThirds (optional)

Show [rule of thirds](https://en.wikipedia.org/wiki/Rule_of_thirds) lines in the cropped area. Defaults to `false`.

#### circularCrop (optional)

Show the crop area as a circle. If your aspect is not 1 (a square) then the circle will be warped into an oval shape. Defaults to `false`.

#### rotate (optional)

Rotates the image, you should pass a value between `-180` and `180`. Defaults to `0`.

#### scale (optional)

The image source (can be base64 or a blob just like a normal image).

#### zoom (optional)

A non-visual prop to keep pointer coords accurate when a parent element is scaled. Not to be confused with the `scale` prop which scales the image itself. Defaults to `1`.

#### spin (optional)

A non-visual prop to keep pointer coords accurate when a parent element is rotated. Not to be confused with the `rotate` prop which rotates the image itself. Defaults to `0`, range is from `-180` to `180`.

## FAQ

### What about showing the crop on the client?

I wanted to keep this component focused so I didn't provide this. Normally a cropped image will be rendered and cached by a backend.

However here's a ready to use function that returns a file blob for the cropped part after providing some parameters you already have when using this package:

```js
/**
 * @param {HTMLImageElement} image - Image File Object
 * @param {Object} crop - crop Object
 * @param {String} fileName - Name of the returned file in Promise
 */
export function getCroppedImg(image, crop, fileName) {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");

  // New lines to be added
  const pixelRatio = window.devicePixelRatio;
  canvas.width = crop.width * pixelRatio;
  canvas.height = crop.height * pixelRatio;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  // As Base64 string
  // const base64Image = canvas.toDataURL("image/jpeg");
  // return base64Image;

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        blob.name = fileName;
        resolve(blob);
      },
      "image/jpeg",
      1
    );
  });
}

async test() {
  const croppedImg = await getCroppedImg(image, crop, fileName);
}
```

There are other considerations to take into account such as cropping from an off-screen image if your image is sized down. Or taking into account the pixel ratio of the device and setting `image/png` and `imageSmoothingQuality`. For a more advanced example check out the [react hook demo](https://codesandbox.io/s/react-image-crop-demo-with-react-hooks-y831o).

Some things to note:

1. [toDataURL](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL) is synchronous and will block the main thread, for large images this could be for as long as a couple of seconds. We are using `toDataURL('image/jpeg')` otherwise it will default to `image/png` and the conversion will be significantly slower.

2. [toBlob](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob) is both faster and asynchronous, but not supported on old browsers (this is quickly becoming irrelevant).

3. Another option to make the conversion faster is to scale the image down before converting it.

### How to correct image EXIF orientation/rotation

You might find that some images are rotated incorrectly. Unfortunately this is a browser wide issue not related to this library. You need to fix your image before passing it in.

You can use the following library to load images, which will correct the rotation for you: https://github.com/blueimp/JavaScript-Load-Image/

You can read an issue on this subject here: https://github.com/DominicTobias/react-image-crop/issues/181

If you're looking for a complete out of the box image editor which already handles EXIF rotation then consider using [Pintura](https://gumroad.com/a/611955827).

<h3>How to filter, rotate and annotate</h3>

This library is deliberately lightweight and minimal for you to build features on top of. If you wish to perform more advanced image editing out of the box then consider using [Pintura](https://gumroad.com/a/611955827).

![Pintura Demo](https://raw.githubusercontent.com/DominicTobias/react-image-crop/master/doka-demo.gif)

### How can I center the crop?

The easiest way is to use the percentage unit:

```js
crop: {
  unit: '%',
  width: 50,
  height: 50,
  x: 25,
  y: 25
}
```

Also remember to set your crop using the percentCrop on changes or the crop will go off-center if the container size changes (e.g. browser resize):

```js
onCropChange = (crop, percentCrop) => this.setState({ crop: percentCrop });
```

If you need more control over the crop you can set it in [onImageLoaded](#onimageloadedimage-optional). For example to center a percent crop:

```js
const onLoad = useCallback(img => {
  imgRef.current = img;

  const aspect = 16 / 9;
  const width = img.width / aspect < img.height * aspect ? 100 : ((img.height * aspect) / img.width) * 100;
  const height = img.width / aspect > img.height * aspect ? 100 : (img.width / aspect / img.height) * 100;
  const y = (100 - height) / 2;
  const x = (100 - width) / 2;

  setCrop({
    unit: '%',
    width,
    height,
    x,
    y,
    aspect,
  });

  return false; // Return false if you set crop state in here.
}, []);
```

## Contributing / Developing

To develop run `yarn start`, this will recompile your JS and SCSS on changes.

You can test your changes by opening `test/index.html` in a browser (you don't need to be running a server).
