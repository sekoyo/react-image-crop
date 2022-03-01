import { PixelCrop } from '.'
import { Crop, Ords, XYOrds } from './types'

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

export function convertToPixelCrop(crop: Partial<Crop>, containerWidth: number, containerHeight: number): Crop {
  if (!crop.unit) {
    return { ...defaultCrop, ...crop, unit: 'px' }
  }

  if (crop.unit === 'px') {
    return { ...defaultCrop, ...crop }
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
  ord: XYOrds,
  minWidth: number,
  minHeight: number,
  maxWidth: number,
  maxHeight: number,
  containerWidth: number,
  containerHeight: number
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

export function getMinCrop(pixelCrop: Crop, ord: Ords, minWidth = 0, minHeight = 0) {
  const minCrop = { ...pixelCrop }

  if (!minCrop.aspect) {
    minCrop.width = minWidth
    minCrop.height = minHeight
  } else {
    if (minWidth < minHeight) {
      minCrop.width = minWidth
      minCrop.height = minCrop.width / minCrop.aspect
    } else {
      minCrop.width = minHeight * minCrop.aspect
      minCrop.height = minHeight
    }
  }

  // Adjust x+y so it's sized towards the opposite
  // side.
  if (ord === 'n' || ord === 'ne') {
    minCrop.y += pixelCrop.height - minCrop.height
  } else if (ord === 'sw') {
    minCrop.x += pixelCrop.width - minCrop.width
  } else if (ord === 'nw') {
    minCrop.x += pixelCrop.width - minCrop.width
    minCrop.y += pixelCrop.height - minCrop.height
  } else if (ord === 'w') {
    minCrop.x += pixelCrop.width - minCrop.width
  }

  return minCrop
}

const r4 = (n: number) => Math.round((n + Number.EPSILON) * 10000) / 10000

export function getMaxCrop(
  pixelCrop: Crop,
  ord: Ords,
  containerWidth: number,
  containerHeight: number,
  maxWidth = containerWidth,
  maxHeight = containerHeight
) {
  const maxCrop = { ...pixelCrop }

  // Handles a call when no crop has started drawing
  // else there's a division by 0.
  if (maxCrop.aspect && (!maxCrop.width || !maxCrop.height)) {
    maxCrop.x = Infinity
    maxCrop.y = Infinity
    maxCrop.width = Infinity
    maxCrop.height = Infinity
    return maxCrop
  }

  const maxWidthLeft = Math.min(maxWidth, pixelCrop.x + pixelCrop.width)

  const maxHeightTop = Math.min(maxHeight, pixelCrop.y + pixelCrop.height)

  const maxWidthRight = Math.min(maxWidth, containerWidth - pixelCrop.x)

  const maxHeightBottom = Math.min(maxHeight, containerHeight - pixelCrop.y)

  if (!maxCrop.aspect) {
    if (ord === 'n') {
      maxCrop.y -= maxHeightTop - maxCrop.height
      maxCrop.height = maxHeightTop
    } else if (ord === 'ne') {
      maxCrop.y -= maxHeightTop - maxCrop.height
      maxCrop.height = maxHeightTop
      maxCrop.width = maxWidthRight
    } else if (ord === 'e') {
      maxCrop.width = maxWidthRight
    } else if (ord === 'se') {
      maxCrop.width = maxWidthRight
      maxCrop.height = maxHeightBottom
    } else if (ord === 's') {
      maxCrop.height = maxHeightBottom
    } else if (ord === 'sw') {
      maxCrop.x -= maxWidthLeft - maxCrop.width
      maxCrop.width = maxWidthLeft
      maxCrop.height = maxHeightBottom
    } else if (ord === 'w') {
      maxCrop.x -= maxWidthLeft - maxCrop.width
      maxCrop.width = maxWidthLeft
    } else if (ord === 'nw') {
      maxCrop.y -= maxHeightTop - maxCrop.height
      maxCrop.height = maxHeightTop
      maxCrop.x -= maxWidthLeft - maxCrop.width
      maxCrop.width = maxWidthLeft
    }
  } else {
    let longestWidth = 0
    let longestHeight = 0

    if (ord === 'ne') {
      longestWidth = maxWidthRight
      longestHeight = maxHeightTop
    } else if (ord === 'se') {
      longestWidth = maxWidthRight
      longestHeight = maxHeightBottom
    } else if (ord === 'sw') {
      longestWidth = maxWidthLeft
      longestHeight = maxHeightBottom
    } else if (ord === 'nw') {
      longestWidth = maxWidthLeft
      longestHeight = maxHeightTop
    }

    const ratioX = r4(longestWidth / maxCrop.width)
    const ratioY = r4(longestHeight / maxCrop.height)
    const ratio = Math.min(ratioX, ratioY)
    const width = maxCrop.width * ratio
    const height = width / maxCrop.aspect

    if (ord === 'ne') {
      maxCrop.y = r4(maxCrop.y + (pixelCrop.height - height))
    } else if (ord === 'sw') {
      maxCrop.x = r4(maxCrop.x + (pixelCrop.width - width))
    } else if (ord === 'nw') {
      maxCrop.x = r4(maxCrop.x + (pixelCrop.width - width))
      maxCrop.y = r4(maxCrop.y + (pixelCrop.height - height))
    }

    maxCrop.width = width
    maxCrop.height = height
  }

  // Prevent under/overflow due to floating point
  // arithmetic imprecision.
  // Note that numbers can still be slightly innacurate e.g.
  // 0.0001 ;(
  maxCrop.x = clamp(maxCrop.x, 0, containerWidth - maxCrop.width)
  maxCrop.y = clamp(maxCrop.y, 0, containerHeight - maxCrop.height)

  return maxCrop
}
