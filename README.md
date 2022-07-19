# React Annotated Image

An image component that supports drawing annotations 

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Example](#example)
5. [CDN](#cdn)
6. [Props](#props)
7. [FAQ](#faq)
   1. [How can I generate a crop preview in the browser?](#how-can-i-generate-a-crop-preview-in-the-browser)
   2. [How to correct image EXIF orientation/rotation?](#how-to-correct-image-exif-orientationrotation)
   3. [How to filter, rotate and annotate?](#how-to-filter-rotate-and-annotate)
   4. [How can I center the crop?](#how-can-i-center-the-crop)
8. [Contributing / Developing](#contributing--developing)

## Features

- Controlled component 
- Draw rectangles 
- Draw lines 
- Create, select, edit and delete objects 
- Hotkey support 

## Installation

```
npm i react-annotated-image --save
yarn add react-annotated-image
```

This library works with all modern browsers. It does not work with IE.

## Usage

Include the main js module:

```js
import AnnotatedImage from 'react-annotated-image'
```

## Example

```tsx
function Demo({ src }) {
  const [zoom, setZoom] = useState<Zoom>()
  return (
    <AnnotatedImage src={src} zoom={zoom} setZoom={setZoom} />
  )
}
```

## Props

**`onChange: (crop: PixelCrop, percentCrop: PercentCrop) => void`**

A callback which happens for every change of the crop (i.e. many times as you are dragging/resizing). Passes the current crop state object.

Note you _must_ implement this callback and update your crop state, otherwise nothing will change!

```tsx
<ReactCrop crop={crop} onChange={(crop, percentCrop) => setCrop(crop)} />
```

`crop` and `percentCrop` are interchangeable. `crop` uses pixels and `percentCrop` uses percentages to position and size itself. Percent crops are resistant to image/media resizing.

**`crop?: Crop`**

Starting with no crop:

```tsx
const [crop, setCrop] = useState<Crop>()

<ReactCrop crop={crop} onChange={c => setCrop(c)}>
  <img src={src} />
</ReactCrop>
```

Starting with a preselected crop:

```tsx
const [crop, setCrop] = useState<Crop>({
  unit: '%', // Can be 'px' or '%'
  x: 25,
  y: 25,
  width: 50,
  height: 50
})

<ReactCrop crop={crop} onChange={c => setCrop(c)}>
  <img src={src} />
</ReactCrop>
```

⚠️ You must ensure the crop is in bounds and correct to the aspect ratio if manually setting. Aspect ratios can be tricky when using %. You can make use of `centerCrop` and `makeAspectCrop` helpers. See [How can I center the crop?](#how-can-i-center-the-crop) or the [CodeSanbox Demo](https://codesandbox.io/s/react-image-crop-demo-with-react-hooks-y831o) for examples.

**`aspect?: number`**

The aspect ratio of the crop, e.g. `1` for a square or `16 / 9` for landscape. Omit/pass undefined for a free-form crop.

**`minWidth?: number`**

A minimum crop width, in pixels.

**`minHeight?: number`**

A minimum crop height, in pixels.

**`maxWidth?: number`**

A maximum crop width, in pixels.

**`maxHeight?: number`**

A maximum crop height, in pixels.

**`keepSelection?: boolean`**

If true is passed then selection can't be disabled if the user clicks outside the selection area.

**`disabled?: boolean`**

If true then the user cannot resize or draw a new crop. A class of `ReactCrop--disabled` is also added to the container for user styling.

**`locked?: boolean`**

If true then the user cannot create or resize a crop, but can still drag the existing crop around. A class of `ReactCrop--locked` is also added to the container for user styling.

**`className?: string`**

A string of classes to add to the main `ReactCrop` element.

**`style?: React.CSSProperties`**

Inline styles object to be passed to the image wrapper element.

**`onComplete?: (crop: PixelCrop, percentCrop: PercentCrop) => void`**

A callback which happens after a resize, drag, or nudge. Passes the current crop state object.

`percentCrop` is the crop as a percentage. A typical use case for it would be to save it so that the user's crop can be restored regardless of the size of the image (for example saving it on desktop, and then using it on a mobile where the image is smaller).

**`onDragStart?: (e: PointerEvent) => void`**

A callback which happens when a user starts dragging or resizing. It is convenient to manipulate elements outside this component.

**`onDragEnd?: (e: PointerEvent) => void`**

A callback which happens when a user releases the cursor or touch after dragging or resizing.

**`renderSelectionAddon?: (state: ReactCropState) => React.ReactNode`**

Render a custom element inside crop the selection.

**`ruleOfThirds?: boolean`**

Show [rule of thirds](https://en.wikipedia.org/wiki/Rule_of_thirds) lines in the cropped area. Defaults to `false`.

**`circularCrop?: boolean`**

Show the crop area as a circle. If your `aspect` is not `1` (a square) then the circle will be warped into an oval shape. Defaults to `false`.


## Contributing / Developing

To develop run `yarn start`, this will recompile your JS and SCSS on changes.

You can test your changes by opening `test/index.html` in a browser (you don't need to be running a server).
