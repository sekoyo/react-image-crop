# React Image Crop

A responsive image cropping tool for React.

[![React Image Crop on NPM](https://img.shields.io/npm/v/react-image-crop.svg)](https://www.npmjs.com/package/react-image-crop)

![ReactCrop Demo](https://raw.githubusercontent.com/DominicTobias/react-image-crop/master/crop-demo.gif)

## Features

- Responsive
- Touch enabled
- Free-form or fixed aspect crops
- Keyboard support for nudging selection
- Min/max crop size

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

## Props

#### src (required)

```jsx
<ReactCrop src="path/to/image.jpg" />
```

You can of course pass a blob path or base64 data.

#### crop (optional)

All crop values are in percentages, and are relative to the image. All crop params are optional.

```js
var crop = {
  x: 20,
  y: 10,
  width: 30,
  height: 10
}

<ReactCrop src="path/to/image.jpg" crop={crop} />
```

If you want a fixed aspect you only need to specify a width *or* a height:

 ```js
var crop = {
  width: 30,
  aspect: 16/9
}
```

..Or you can omit both and only specify the aspect.

Please note that the values will be adjusted if the cropping area is outside of the image boundaries.

Be aware that if the parent re-renders, the crop will be reset to whatever it initially was, unless you keep it updated:

```js
onCropComplete(crop) {
  this.setState({ crop });
}
```

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

If true then the user cannot modify or draw a new crop. A class of `ReactCrop--disabled` is also added to the container for user styling.

#### onChange(crop, pixelCrop) (optional)

A callback which happens for every change of the crop (i.e. many times as you are dragging/resizing). Passes the current crop state object, as well as a pixel-converted crop for your convenience. This callback is not called on the load even if the crop was adjusted.

*Note* that when setting state in a callback you must also ensure that you set the new crop state, otherwise your component will re-render with whatever crop state was initially set.

#### onComplete(crop, pixelCrop) (optional)

A callback which happens after a resize, drag, or nudge. Passes the current crop state object, as well as a pixel-converted crop for your convenience.

*Note* that when setting state in a callback you must also ensure that you set the new crop state, otherwise your component will re-render with whatever crop state was initially set.

#### onImageLoaded(crop, image, pixelCrop) (optional)

A callback which happens when the image is loaded. Passes the current crop state object and the image DOM element, as well as a pixel-converted crop for your convenience. If the crop was adjusted during the load, this callback gives you the adjusted crop.

*Note* that when setting state in a callback you must also ensure that you set the new crop state, otherwise your component will re-render with whatever crop state was initially set.

#### onAspectRatioChange(crop, pixelCrop) (optional)

A callback which happens when the new aspect ratio is passed to the component. Passes the current crop state object, as well as a pixel-converted crop for your convenience.

*Note* that when setting state in a callback you must also ensure that you set the new crop state, otherwise your component will re-render with whatever crop state was initially set.

#### onDragStart() (optional)

A callback which happens when a user starts dragging or resizing. It is convenient to manipulate elements outside this component.

#### onDragEnd() (optional)

A callback which happens when a user releases the cursor or touch after dragging or resizing.

#### crossorigin (optional)

Allows setting the crossorigin attribute used for the img tags.

## What about showing the crop on the client?

I wanted to keep this component focused so I didn't provide this. Normally a cropped image will be rendered and cached by a backend. However here are some tips for client-side crop previews:

- You can fake a crop in pure CSS, but in order to do this you need to know the maximum width & height of the crop preview and then perform the calc again if the container size changes (since this technique is only possible using pixels). It's advantage is that it's instantaneous:

[Example gist](https://gist.github.com/DominicTobias/6aa43d03bc12232ef723)

- The other technique is to map the cropped image to a canvas, and then get the base64 of the canvas via [toDataURL](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL) and set this as an image source. The advantage is that the preview behaves like a proper image and is responsive. Now this is important:

1. [toDataURL](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL) is synchronous and will block the main thread, for large images this could be for as long as a couple of seconds. *Always* use `toDataURL('image/jpeg')` otherwise it will default to `image/png` and the conversion will be significantly slower.

2. Keep an eye out for [toBlob](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob) when this lands on more browsers, as it will be both faster and asynchronous.

3. Another option to make the conversion faster is to scale the image down before converting it to a base64 (see example in gist).

[Example gist](https://gist.github.com/DominicTobias/b1fb501349893922ec7f)

## Contributing / Developing

To develop run `npm start`, this will recompile your JS and SCSS on changes.

You can test your changes by opening `demo/index.html` in a browser (you don't need to be running a server).

When you are happy with your changes you can build to dist with `npm run release`.
