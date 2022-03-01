import { PixelCrop, Crop, Ords } from './types'

export const defaultCrop: Crop = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  unit: 'px',
}

export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max)
}

export function areCropsEqual(cropA: Partial<Crop>, cropB: Partial<Crop>) {
  return (
    cropA.width === cropB.width &&
    cropA.height === cropB.height &&
    cropA.x === cropB.x &&
    cropA.y === cropB.y &&
    cropA.aspect === cropB.aspect &&
    cropA.unit === cropB.unit
  )
}

export function makeAspectCrop(crop: Partial<Crop>, containerWidth: number, containerHeight: number) {
  if (!crop.aspect || isNaN(crop.aspect)) {
    console.error('`crop.aspect` should be a number.', crop)
    return { ...defaultCrop, ...crop }
  }

  const pixelCrop = convertToPixelCrop(crop, containerWidth, containerHeight)

  if (crop.width) {
    pixelCrop.height = pixelCrop.width / crop.aspect
  }

  if (crop.height) {
    pixelCrop.width = pixelCrop.height * crop.aspect
  }

  if (pixelCrop.y + pixelCrop.height > containerHeight) {
    pixelCrop.height = containerHeight - pixelCrop.y
    pixelCrop.width = pixelCrop.height * crop.aspect
  }

  if (pixelCrop.x + pixelCrop.width > containerWidth) {
    pixelCrop.width = containerWidth - pixelCrop.x
    pixelCrop.height = pixelCrop.width / crop.aspect
  }

  return pixelCrop
}

export function convertToPercentCrop(crop: Partial<Crop>, containerWidth: number, containerHeight: number): Crop {
  if (crop.unit === '%') {
    return { ...defaultCrop, ...crop }
  }

  return {
    unit: '%',
    aspect: crop.aspect,
    x: crop.x ? (crop.x / containerWidth) * 100 : 0,
    y: crop.y ? (crop.y / containerHeight) * 100 : 0,
    width: crop.width ? (crop.width / containerWidth) * 100 : 0,
    height: crop.height ? (crop.height / containerHeight) * 100 : 0,
  }
}

export function convertToPixelCrop(crop: Partial<Crop>, containerWidth: number, containerHeight: number): PixelCrop {
  if (!crop.unit) {
    return { ...defaultCrop, ...crop, unit: 'px' }
  }

  if (crop.unit === 'px') {
    return { ...defaultCrop, ...crop, unit: 'px' }
  }

  return {
    unit: 'px',
    aspect: crop.aspect,
    x: crop.x ? (crop.x * containerWidth) / 100 : 0,
    y: crop.y ? (crop.y * containerHeight) / 100 : 0,
    width: crop.width ? (crop.width * containerWidth) / 100 : 0,
    height: crop.height ? (crop.height * containerHeight) / 100 : 0,
  }
}

export function containCrop(
  pixelCrop: PixelCrop,
  ord: Ords,
  containerWidth: number,
  containerHeight: number,
  minWidth = 0,
  minHeight = 0,
  maxWidth = containerWidth,
  maxHeight = containerHeight
) {
  const containedCrop = { ...pixelCrop }
  let _minWidth = minWidth
  let _minHeight = minHeight
  let _maxWidth = maxWidth
  let _maxHeight = maxHeight

  if (containedCrop.aspect) {
    if (containedCrop.aspect > 1) {
      // Landscape - increase width min + max.
      _minWidth = minHeight * containedCrop.aspect
      _maxWidth = maxWidth * containedCrop.aspect
    } else {
      // Portrait - increase height min + max.
      _minHeight = minWidth / containedCrop.aspect
      _maxHeight = maxHeight / containedCrop.aspect
    }
  }

  // Stop underflow on top.
  if (containedCrop.y < 0) {
    containedCrop.height = Math.max(containedCrop.height + containedCrop.y, _minHeight)
    containedCrop.y = 0
  }

  // Stop underflow on left.
  if (containedCrop.x < 0) {
    containedCrop.width = Math.max(containedCrop.width + containedCrop.x, _minWidth)
    containedCrop.x = 0
  }

  // Stop overflow on right.
  const xOverflow = containerWidth - (containedCrop.x + containedCrop.width)
  if (xOverflow < 0) {
    containedCrop.x = Math.min(containedCrop.x, containerWidth - _minWidth)
    containedCrop.width += xOverflow
  }

  // Stop overflow on bottom.
  const yOverflow = containerHeight - (containedCrop.y + containedCrop.height)
  if (yOverflow < 0) {
    containedCrop.y = Math.min(containedCrop.y, containerHeight - _minHeight)
    containedCrop.height += yOverflow
  }

  // Make crop respect min width generally.
  if (containedCrop.width < _minWidth) {
    if (ord === 'sw' || ord == 'nw') {
      // Stops box moving when min is hit.
      containedCrop.x -= _minWidth - containedCrop.width
    }
    containedCrop.width = _minWidth
  }

  // Make crop respect min height generally.
  if (containedCrop.height < _minHeight) {
    if (ord === 'nw' || ord == 'ne') {
      // Stops box moving when min is hit.
      containedCrop.y -= _minHeight - containedCrop.height
    }
    containedCrop.height = _minHeight
  }

  // Make crop respect max width generally.
  if (containedCrop.width > _maxWidth) {
    if (ord === 'sw' || ord == 'nw') {
      // Stops box moving when max is hit.
      containedCrop.x -= _maxWidth - containedCrop.width
    }
    containedCrop.width = _maxWidth
  }

  // Make crop respect max height generally.
  if (containedCrop.height > _maxHeight) {
    if (ord === 'nw' || ord == 'ne') {
      // Stops box moving when min is hit.
      containedCrop.y -= _maxHeight - containedCrop.height
    }
    containedCrop.height = _maxHeight
  }

  // Maintain aspect after size fixing.
  if (containedCrop.aspect) {
    const currAspect = containedCrop.width / containedCrop.height
    if (currAspect < containedCrop.aspect) {
      // Crop is shrunk on the x so adjust the y.
      const newHeight = containedCrop.width / containedCrop.aspect

      if (ord === 'nw' || ord == 'ne') {
        // Stops box moving when min is hit.
        containedCrop.y -= newHeight - containedCrop.height
      }

      containedCrop.height = newHeight
    } else if (currAspect > containedCrop.aspect) {
      // Crop is shrunk on the y so adjust the x.
      const newWidth = containedCrop.height * containedCrop.aspect

      if (ord === 'sw' || ord == 'nw') {
        // Stops box moving when max is hit.
        containedCrop.x -= newWidth - containedCrop.width
      }

      containedCrop.width = newWidth
    }
  }

  return containedCrop
}
