import { PixelCrop, PercentCrop, Crop, Ords } from './types'

export const defaultCrop: PixelCrop = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  unit: 'px',
}

export const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)

export const cls = (...args: unknown[]) => args.filter(v => v && typeof v === 'string').join(' ')

export const areCropsEqual = (cropA: Partial<Crop>, cropB: Partial<Crop>) =>
  cropA === cropB ||
  (cropA.width === cropB.width &&
    cropA.height === cropB.height &&
    cropA.x === cropB.x &&
    cropA.y === cropB.y &&
    cropA.unit === cropB.unit)

export function makeAspectCrop(
  crop: Pick<PercentCrop, 'unit'> & Partial<Omit<PercentCrop, 'unit'>>,
  aspect: number,
  containerWidth: number,
  containerHeight: number
): PercentCrop
export function makeAspectCrop(
  crop: Pick<PixelCrop, 'unit'> & Partial<Omit<PixelCrop, 'unit'>>,
  aspect: number,
  containerWidth: number,
  containerHeight: number
): PixelCrop
export function makeAspectCrop(crop: Partial<Crop>, aspect: number, containerWidth: number, containerHeight: number) {
  const pixelCrop = convertToPixelCrop(crop, containerWidth, containerHeight)

  if (crop.width) {
    pixelCrop.height = pixelCrop.width / aspect
  }

  if (crop.height) {
    pixelCrop.width = pixelCrop.height * aspect
  }

  if (pixelCrop.y + pixelCrop.height > containerHeight) {
    pixelCrop.height = containerHeight - pixelCrop.y
    pixelCrop.width = pixelCrop.height * aspect
  }

  if (pixelCrop.x + pixelCrop.width > containerWidth) {
    pixelCrop.width = containerWidth - pixelCrop.x
    pixelCrop.height = pixelCrop.width / aspect
  }

  if (crop.unit === '%') {
    return convertToPercentCrop(pixelCrop, containerWidth, containerHeight)
  }

  return pixelCrop
}

export function centerCrop(
  crop: Pick<PercentCrop, 'unit'> & Partial<Omit<PercentCrop, 'unit'>>,
  containerWidth: number,
  containerHeight: number
): PercentCrop
export function centerCrop(
  crop: Pick<PixelCrop, 'unit'> & Partial<Omit<PixelCrop, 'unit'>>,
  containerWidth: number,
  containerHeight: number
): PixelCrop
export function centerCrop(crop: Partial<Crop>, containerWidth: number, containerHeight: number) {
  const pixelCrop = convertToPixelCrop(crop, containerWidth, containerHeight)

  pixelCrop.x = (containerWidth - pixelCrop.width) / 2
  pixelCrop.y = (containerHeight - pixelCrop.height) / 2

  if (crop.unit === '%') {
    return convertToPercentCrop(pixelCrop, containerWidth, containerHeight)
  }

  return pixelCrop
}

export function convertToPercentCrop(
  crop: Partial<Crop>,
  containerWidth: number,
  containerHeight: number
): PercentCrop {
  if (crop.unit === '%') {
    return { ...defaultCrop, ...crop, unit: '%' }
  }

  return {
    unit: '%',
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
    x: crop.x ? (crop.x * containerWidth) / 100 : 0,
    y: crop.y ? (crop.y * containerHeight) / 100 : 0,
    width: crop.width ? (crop.width * containerWidth) / 100 : 0,
    height: crop.height ? (crop.height * containerHeight) / 100 : 0,
  }
}

// Sorry.
export function containCrop(
  pixelCrop: PixelCrop,
  aspect: number,
  ord: Ords,
  containerWidth: number,
  containerHeight: number,
  minWidth = 0,
  minHeight = 0,
  maxWidth = containerWidth,
  maxHeight = containerHeight
) {
  const containedCrop = { ...pixelCrop }
  let _minWidth = Math.min(minWidth, containerWidth)
  let _minHeight = Math.min(minHeight, containerHeight)
  let _maxWidth = Math.min(maxWidth, containerWidth)
  let _maxHeight = Math.min(maxHeight, containerHeight)

  if (aspect) {
    if (aspect > 1) {
      // Landscape - increase width min + max.
      _minWidth = minHeight ? minHeight * aspect : _minWidth
      _minHeight = _minWidth / aspect
      _maxWidth = maxWidth * aspect
    } else {
      // Portrait - increase height min + max.
      _minHeight = minWidth ? minWidth / aspect : _minHeight
      _minWidth = _minHeight * aspect
      _maxHeight = maxHeight / aspect
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
  if (aspect) {
    const currAspect = containedCrop.width / containedCrop.height
    if (currAspect < aspect) {
      // Crop is shrunk on the width so adjust the height.
      const newHeight = Math.max(containedCrop.width / aspect, _minHeight)

      if (ord === 'nw' || ord == 'ne') {
        // Stops box moving when min is hit.
        containedCrop.y -= newHeight - containedCrop.height
      }

      containedCrop.height = newHeight
    } else if (currAspect > aspect) {
      // Crop is shrunk on the height so adjust the width.
      const newWidth = Math.max(containedCrop.height * aspect, _minWidth)

      if (ord === 'sw' || ord == 'nw') {
        // Stops box moving when max is hit.
        containedCrop.x -= newWidth - containedCrop.width
      }

      containedCrop.width = newWidth
    }
  }

  return containedCrop
}

export function nudgeCrop(pixelCrop: PixelCrop, key: string, offset: number, ord: Ords) {
  const nextCrop = { ...pixelCrop }

  if (key === 'ArrowLeft') {
    if (ord === 'nw') {
      nextCrop.x -= offset
      nextCrop.y -= offset
      nextCrop.width += offset
      nextCrop.height += offset
    } else if (ord === 'w') {
      nextCrop.x -= offset
      nextCrop.width += offset
    } else if (ord === 'sw') {
      nextCrop.x -= offset
      nextCrop.width += offset
      nextCrop.height += offset
    } else if (ord === 'ne') {
      nextCrop.y += offset
      nextCrop.width -= offset
      nextCrop.height -= offset
    } else if (ord === 'e') {
      nextCrop.width -= offset
    } else if (ord === 'se') {
      nextCrop.width -= offset
      nextCrop.height -= offset
    }
  } else if (key === 'ArrowRight') {
    if (ord === 'nw') {
      nextCrop.x += offset
      nextCrop.y += offset
      nextCrop.width -= offset
      nextCrop.height -= offset
    } else if (ord === 'w') {
      // Niche: Will move right if minWidth hit.
      nextCrop.x += offset
      nextCrop.width -= offset
    } else if (ord === 'sw') {
      nextCrop.x += offset
      nextCrop.width -= offset
      nextCrop.height -= offset
    } else if (ord === 'ne') {
      nextCrop.y -= offset
      nextCrop.width += offset
      nextCrop.height += offset
    } else if (ord === 'e') {
      nextCrop.width += offset
    } else if (ord === 'se') {
      nextCrop.width += offset
      nextCrop.height += offset
    }
  }

  if (key === 'ArrowUp') {
    if (ord === 'nw') {
      nextCrop.x -= offset
      nextCrop.y -= offset
      nextCrop.width += offset
      nextCrop.height += offset
    } else if (ord === 'n') {
      nextCrop.y -= offset
      nextCrop.height += offset
    } else if (ord === 'ne') {
      nextCrop.y -= offset
      nextCrop.width += offset
      nextCrop.height += offset
    } else if (ord === 'sw') {
      nextCrop.x += offset
      nextCrop.width -= offset
      nextCrop.height -= offset
    } else if (ord === 's') {
      nextCrop.height -= offset
    } else if (ord === 'se') {
      nextCrop.width -= offset
      nextCrop.height -= offset
    }
  } else if (key === 'ArrowDown') {
    if (ord === 'nw') {
      nextCrop.x += offset
      nextCrop.y += offset
      nextCrop.width -= offset
      nextCrop.height -= offset
    } else if (ord === 'n') {
      // Niche: Will move down if minHeight hit.
      nextCrop.y += offset
      nextCrop.height -= offset
    } else if (ord === 'ne') {
      nextCrop.y += offset
      nextCrop.width -= offset
      nextCrop.height -= offset
    } else if (ord === 'sw') {
      nextCrop.x -= offset
      nextCrop.width += offset
      nextCrop.height += offset
    } else if (ord === 's') {
      nextCrop.height += offset
    } else if (ord === 'se') {
      nextCrop.width += offset
      nextCrop.height += offset
    }
  }

  return nextCrop
}
