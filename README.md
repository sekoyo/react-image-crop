# React image crop

A responsive image cropping tool for React.

![ReactCrop Demo](https://raw.githubusercontent.com/DominicTobias/react-image-crop/master/crop-demo.gif)

## Features

- Responsive
- Touch enabled
- Free-form or fixed aspect crops
- Keyboard support for nudging selection
- Min/max crop size

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
<ReactCrop src='path/to/image.jpg' />
```

You can of course pass a blob path or base64 data.

#### crop (optional)

All crop values are in percentages, and are relative to the image. All crop params are optional.

```jsx
var crop = {
	x: 20,
	y: 10,
	width: 30,
	height: 10
}

<ReactCrop src='path/to/image.jpg' crop={crop} />
```

If you want a fixed aspect you only need to specify a width *or* a height:

 ```jsx
var crop = {
	width: 30,
	aspect: 16/9
}
```

..Or you can omit both and only specify the aspect.

#### minWidth (optional)

A minimum crop width.

#### minHeight (optional)

A minimum crop height.

#### onChange(crop) (optional)

A callback which happens for every change of the crop (i.e. many times as you are dragging/resizing). Passes the current crop state object.

#### onComplete(crop) (optional)

A callback which happens after a resize, drag, or nudge. Passes the current crop state object.

## What about showing the crop on the client?

I wanted to keep this component focused so I didn't provide this. Normally a cropped image will be rendered and cached by a backend. However here are some tips for client-side crop previews:

- You can fake a crop in pure CSS, but in order to do this you need to know the maximum width & height of the crop preview and then perform the calc again if the container size changes (since this technique is only possible using pixels). It's advantage is that it's instantaneous:

Example: https://gist.github.com/DominicTobias/6aa43d03bc12232ef723

- The other technique is to map the cropped image to a canvas, and then get the base64 of the canvas via [toDataURL](https://developer.mozilla.org/en/docs/Web/API/HTMLCanvasElement) and set this as an image source. The advantage is that the preview behaves like a proper image and is responsive. Now this is important:

1. [toDataURL](https://developer.mozilla.org/en/docs/Web/API/HTMLCanvasElement) is synchronous and will block the main thread, for large images this could be for as long as a couple of seconds. *Always* use `toDataURL('image/jpeg')` otherwise it will default to `image/png` and the conversion will be significantly slower.

2. Keep an eye out for when this lands on more browsers [toBlob](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob), as it will be both faster than `toDataURL` and asynchronous.

Example: https://gist.github.com/DominicTobias/b1fb501349893922ec7f

