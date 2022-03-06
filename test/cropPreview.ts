import { PixelCrop } from '../src'

const TO_RADIANS = Math.PI / 180

export async function cropPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop,
  scale = 1,
  rotate = 0
) {
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('No 2d context')
  }

  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height
  // const pixelRatio = window.devicePixelRatio || 1
  const pixelRatio = 1

  canvas.width = Math.floor(crop.width * pixelRatio * scaleX)
  canvas.height = Math.floor(crop.height * pixelRatio * scaleY)

  ctx.scale(pixelRatio, pixelRatio)
  ctx.imageSmoothingQuality = 'high'

  const cropX = crop.x * scaleX
  const cropY = crop.y * scaleY
  // const cropWidth = crop.width * scaleX
  // const cropHeight = crop.height * scaleY

  const rotateRads = rotate * TO_RADIANS
  const centerX = image.width / 2
  const centerY = image.height / 2

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
  ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width, image.height)

  ctx.restore()
}
