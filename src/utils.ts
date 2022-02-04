import { Crop, Ords } from './types'

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

export function isCropValid(crop: Partial<Crop>) {
  return crop && crop.width && !isNaN(crop.width) && crop.height && !isNaN(crop.height)
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

export function makeAspectCrop(crop: Crop, imageWidth: number, imageHeight: number) {
  if (!crop.aspect || isNaN(crop.aspect)) {
    console.error('`crop.aspect` should be a number.', crop)
    return { ...defaultCrop, ...crop }
  }

  const completeCrop: Crop = {
    unit: 'px',
    x: crop.x || 0,
    y: crop.y || 0,
    width: crop.width || 0,
    height: crop.height || 0,
    aspect: crop.aspect,
  }

  if (crop.width) {
    completeCrop.height = completeCrop.width / crop.aspect
  }

  if (crop.height) {
    completeCrop.width = completeCrop.height * crop.aspect
  }

  if (completeCrop.y + completeCrop.height > imageHeight) {
    completeCrop.height = imageHeight - completeCrop.y
    completeCrop.width = completeCrop.height * crop.aspect
  }

  if (completeCrop.x + completeCrop.width > imageWidth) {
    completeCrop.width = imageWidth - completeCrop.x
    completeCrop.height = completeCrop.width / crop.aspect
  }

  return completeCrop
}

export function convertToPercentCrop(crop: Partial<Crop>, imageWidth: number, imageHeight: number): Crop {
  if (crop.unit === '%') {
    return { ...defaultCrop, ...crop }
  }

  return {
    unit: '%',
    aspect: crop.aspect,
    x: crop.x ? (crop.x / imageWidth) * 100 : 0,
    y: crop.y ? (crop.y / imageHeight) * 100 : 0,
    width: crop.width ? (crop.width / imageWidth) * 100 : 0,
    height: crop.height ? (crop.height / imageHeight) * 100 : 0,
  }
}

export function convertToPixelCrop(crop: Partial<Crop>, imageWidth: number, imageHeight: number): Crop {
  if (!crop.unit) {
    return { ...defaultCrop, ...crop, unit: 'px' }
  }

  if (crop.unit === 'px') {
    return { ...defaultCrop, ...crop }
  }

  return {
    unit: 'px',
    aspect: crop.aspect,
    x: crop.x ? (crop.x * imageWidth) / 100 : 0,
    y: crop.y ? (crop.y * imageHeight) / 100 : 0,
    width: crop.width ? (crop.width * imageWidth) / 100 : 0,
    height: crop.height ? (crop.height * imageHeight) / 100 : 0,
  }
}

export function resolveCrop(pixelCrop: Crop, imageWidth: number, imageHeight: number) {
  if (pixelCrop.aspect && (!pixelCrop.width || !pixelCrop.height)) {
    return makeAspectCrop(pixelCrop, imageWidth, imageHeight)
  }

  return pixelCrop
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

export function getMaxCrop(
  pixelCrop: Crop,
  ord: Ords,
  containerWidth: number,
  containerHeight: number,
  maxWidth = containerWidth,
  maxHeight = containerHeight
) {
  const maxCrop = { ...pixelCrop }

  const getMaxWidthLeft = () => Math.min(maxWidth, maxCrop.x + maxCrop.width)

  const getMaxHeightTop = () => Math.min(maxHeight, maxCrop.y + maxCrop.height)

  const getMaxWidthRight = () => Math.min(maxWidth, containerWidth - maxCrop.x)

  const getMaxHeightBottom = () => Math.min(maxHeight, containerHeight - maxCrop.y)

  if (!maxCrop.aspect) {
    if (ord === 'n') {
      const height = getMaxHeightTop()
      maxCrop.y -= height - maxCrop.height
      maxCrop.height = height
    } else if (ord === 'ne') {
      const height = getMaxHeightTop()
      maxCrop.y -= height - maxCrop.height
      maxCrop.height = height
      maxCrop.width = getMaxWidthRight()
    } else if (ord === 'e') {
      maxCrop.width = getMaxWidthRight()
    } else if (ord === 'se') {
      maxCrop.width = getMaxWidthRight()
      maxCrop.height = getMaxHeightBottom()
    } else if (ord === 's') {
      maxCrop.height = getMaxHeightBottom()
    } else if (ord === 'sw') {
      const width = getMaxWidthLeft()
      maxCrop.x -= width - maxCrop.width
      maxCrop.width = width
      maxCrop.height = getMaxHeightBottom()
    } else if (ord === 'w') {
      const width = getMaxWidthLeft()
      maxCrop.x -= width - maxCrop.width
      maxCrop.width = width
    } else if (ord === 'nw') {
      const height = getMaxHeightTop()
      maxCrop.y -= height - maxCrop.height
      maxCrop.height = height
      const width = getMaxWidthLeft()
      maxCrop.x -= width - maxCrop.width
      maxCrop.width = width
    }
  } else {
    let longestWidth = 0
    let longestHeight = 0

    if (ord === 'ne') {
      longestWidth = getMaxWidthRight()
      longestHeight = getMaxHeightTop()
    } else if (ord === 'se') {
      longestWidth = getMaxWidthRight()
      longestHeight = getMaxHeightBottom()
    } else if (ord === 'sw') {
      longestWidth = getMaxWidthLeft()
      longestHeight = getMaxHeightBottom()
    } else if (ord === 'nw') {
      longestWidth = getMaxWidthLeft()
      longestHeight = getMaxHeightTop()
    }

    const ratioX = longestWidth / maxCrop.width
    const ratioY = longestHeight / maxCrop.height
    const ratio = Math.min(ratioX, ratioY)
    const width = maxCrop.width * ratio
    const height = width / maxCrop.aspect

    if (ord === 'ne') {
      maxCrop.y = maxCrop.y + (pixelCrop.height - height)
    } else if (ord === 'sw') {
      maxCrop.x = maxCrop.x + (pixelCrop.width - width)
    } else if (ord === 'nw') {
      maxCrop.x = maxCrop.x + (pixelCrop.width - width)
      maxCrop.y = maxCrop.y + (pixelCrop.height - height)
    }

    maxCrop.width = width
    maxCrop.height = height
  }

  return maxCrop
}
