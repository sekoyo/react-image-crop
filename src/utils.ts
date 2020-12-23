import { CropObject, CropOrd, OffsetCoords } from './types';

interface PartialCropObjectW extends Omit<CropObject, 'width'> {
  width?: number;
}
interface PartialCropObjectH extends Omit<CropObject, 'height'> {
  height?: number;
}
type PartialCropObject = PartialCropObjectW | PartialCropObjectH;

export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

export function isCropDrawn(crop?: CropObject) {
  return crop && crop.width && crop.height;
}

// Note: You should get image dimensions with `getBoundingClientRect` **NOT**
// with image.width/height/naturalWidth/naturaHeight as these are rounded.
export function makeAspectCrop(crop: PartialCropObject, imageWidth: number, imageHeight: number) {
  const pixelCrop = convertToPixelCrop({ width: 0, height: 0, ...crop }, imageWidth, imageHeight);
  const aspect = pixelCrop.aspect || 1;

  if (pixelCrop.width) {
    pixelCrop.height = pixelCrop.width / aspect;
  }

  if (pixelCrop.height) {
    pixelCrop.width = pixelCrop.height * aspect;
  }

  if (pixelCrop.y + pixelCrop.height > imageHeight) {
    pixelCrop.height = imageHeight - pixelCrop.y;
    pixelCrop.width = pixelCrop.height * aspect;
  }

  if (pixelCrop.x + pixelCrop.width > imageWidth) {
    pixelCrop.width = imageWidth - pixelCrop.x;
    pixelCrop.height = pixelCrop.width / aspect;
  }

  if (crop.unit === 'px') {
    return pixelCrop;
  }

  return convertToPercentCrop(pixelCrop, imageWidth, imageHeight);
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
