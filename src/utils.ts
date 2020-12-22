import { CropObject, CropOrd, OffsetCoords } from './types';

export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

export function isCropValid(crop?: CropObject) {
  return crop && !isNaN(crop.width) && !isNaN(crop.height);
}

export function makeAspectCrop(crop: CropObject, imageWidth: number, imageHeight: number) {
  const aspectCrop: CropObject = { ...crop };
  const aspect = crop.aspect ?? 1;

  if (crop.width) {
    aspectCrop.height = aspectCrop.width / aspect;
  }

  if (crop.height) {
    aspectCrop.width = aspectCrop.height * aspect;
  }

  if (aspectCrop.y + aspectCrop.height > imageHeight) {
    aspectCrop.height = imageHeight - aspectCrop.y;
    aspectCrop.width = aspectCrop.height * aspect;
  }

  if (aspectCrop.x + aspectCrop.width > imageWidth) {
    aspectCrop.width = imageWidth - aspectCrop.x;
    aspectCrop.height = aspectCrop.width / aspect;
  }

  return aspectCrop;
}

export function convertToPercentCrop(crop: CropObject, imageWidth: number, imageHeight: number): CropObject {
  if (crop.unit === '%') {
    return crop;
  }

  return {
    unit: '%',
    aspect: crop.aspect,
    x: (crop.x / imageWidth) * 100,
    y: (crop.y / imageHeight) * 100,
    width: (crop.width / imageWidth) * 100,
    height: (crop.height / imageHeight) * 100,
  };
}

export function convertToPixelCrop(crop: CropObject, imageWidth: number, imageHeight: number): CropObject {
  if (!crop.unit) {
    return { ...crop, unit: 'px' };
  }

  if (crop.unit === 'px') {
    return crop;
  }

  return {
    unit: 'px',
    aspect: crop.aspect,
    x: (crop.x * imageWidth) / 100,
    y: (crop.y * imageHeight) / 100,
    width: (crop.width * imageWidth) / 100,
    height: (crop.height * imageHeight) / 100,
  };
}

export function resolveCrop(pixelCrop: CropObject, imageWidth: number, imageHeight: number) {
  if (pixelCrop.aspect && (!pixelCrop.width || !pixelCrop.height)) {
    return makeAspectCrop(pixelCrop, imageWidth, imageHeight);
  }

  return pixelCrop;
}

export function containCrop(prevCrop: CropObject, crop: CropObject, imageWidth: number, imageHeight: number) {
  const pixelCrop = convertToPixelCrop(crop, imageWidth, imageHeight);
  const prevPixelCrop = convertToPixelCrop(prevCrop, imageWidth, imageHeight);
  const contained = { ...pixelCrop };

  // Non-aspects are simple
  if (!pixelCrop.aspect) {
    if (pixelCrop.x < 0) {
      contained.x = 0;
      contained.width += pixelCrop.x;
    } else if (pixelCrop.x + pixelCrop.width > imageWidth) {
      contained.width = imageWidth - pixelCrop.x;
    }

    if (pixelCrop.y + pixelCrop.height > imageHeight) {
      contained.height = imageHeight - pixelCrop.y;
    }

    return contained;
  }

  let adjustedForX = false;

  if (pixelCrop.x < 0) {
    contained.x = 0;
    contained.width += pixelCrop.x;
    contained.height = contained.width / pixelCrop.aspect;
    adjustedForX = true;
  } else if (pixelCrop.x + pixelCrop.width > imageWidth) {
    contained.width = imageWidth - pixelCrop.x;
    contained.height = contained.width / pixelCrop.aspect;
    adjustedForX = true;
  }

  // If sizing in up direction we need to pin Y at the point it
  // would be at the boundary.
  if (adjustedForX && prevPixelCrop.y > contained.y) {
    contained.y = pixelCrop.y + (pixelCrop.height - contained.height);
  }

  let adjustedForY = false;

  if (contained.y + contained.height > imageHeight) {
    contained.height = imageHeight - pixelCrop.y;
    contained.width = contained.height * pixelCrop.aspect;
    adjustedForY = true;
  }

  // If sizing in left direction we need to pin X at the point it
  // would be at the boundary.
  if (adjustedForY && prevPixelCrop.x > contained.x) {
    contained.x = pixelCrop.x + (pixelCrop.width - contained.width);
  }

  return contained;
}

export function getDocumentOffset() {
  if (typeof document === 'undefined') {
    return { top: 0, left: 0 };
  }

  const { clientTop = 0, clientLeft = 0 } = document.documentElement || {};
  return { top: clientTop, left: clientLeft };
}

export function getWindowOffset() {
  if (typeof document === 'undefined') {
    return { top: 0, left: 0 };
  }

  const { pageYOffset = 0, pageXOffset = 0 } = window;
  return { top: pageYOffset, left: pageXOffset };
}

export function getElementOffset(el?: HTMLElement | null) {
  if (!el) {
    return { top: 0, left: 0 };
  }
  const rect = el.getBoundingClientRect();
  const doc = getDocumentOffset();
  const win = getWindowOffset();

  const top = rect.top + win.top - doc.top;
  const left = rect.left + win.left - doc.left;

  return { top, left };
}

export function straightenYPath(
  clientX: number,
  ord: CropOrd,
  cropOffset: OffsetCoords,
  cropStartWidth: number,
  cropStartHeight: number
) {
  let k;
  let d;

  if (ord === 'nw' || ord === 'se') {
    k = cropStartHeight / cropStartWidth;
    d = cropOffset.top - cropOffset.left * k;
  } else {
    k = -cropStartHeight / cropStartWidth;
    d = cropOffset.top + (cropStartHeight - cropOffset.left * k);
  }

  return k * clientX + d;
}
