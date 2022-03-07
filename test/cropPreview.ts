import { PixelCrop } from '../src'

const TO_RADIANS = Math.PI / 180
let previewUrl = ''

function toBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise(resolve => {
    canvas.toBlob(resolve)
  })
}

export async function cropPreview(image: HTMLImageElement, crop: PixelCrop, scale = 1, rotate = 0) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('No 2d context')
  }

  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height
  // const pixelRatio = window.devicePixelRatio || 1
  const pixelRatio = 1

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

  ctx.scale(pixelRatio, pixelRatio)
  ctx.imageSmoothingQuality = 'high'

  const cropX = crop.x * scaleX
  const cropY = crop.y * scaleY

  const rotateRads = rotate * TO_RADIANS
  const centerX = image.naturalWidth / 2
  const centerY = image.naturalHeight / 2

  ctx.save()

  // 5) Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY)
  // 4) Move the origin to the center of the original position
  ctx.translate(centerX, centerY)
  // 3) Rotate around the origin
  ctx.rotate(rotateRads)
  // 2) Scaled the image
  ctx.scale(scale, scale)
  // 1) Move the center of the image to the origin (0,0)
  ctx.translate(-centerX, -centerY)
  ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, image.naturalWidth, image.naturalHeight)

  ctx.restore()

  // It's quicker to render out the canvas but the image resizes
  // nicely to aspect (might be poss with CSS aspect-ratio)
  // and is easily downloaded if desired.
  if (previewUrl) {
    URL.revokeObjectURL(previewUrl)
  }

  const blob = await toBlob(canvas)

  if (!blob) {
    previewUrl = ''
    return ''
  }

  previewUrl = URL.createObjectURL(blob)
  return previewUrl
}
