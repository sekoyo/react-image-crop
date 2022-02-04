import React, { PureComponent, createRef } from 'react'
import clsx from 'clsx'

import { Ords, Crop } from './types'
import {
  defaultCrop,
  clamp,
  isCropValid,
  areCropsEqual,
  makeAspectCrop,
  convertToPercentCrop,
  convertToPixelCrop,
  resolveCrop,
  getMaxCrop,
  getMinCrop,
} from './utils'

import './ReactCrop.scss'

interface EVData {
  clientStartX: number
  clientStartY: number
  cropStartWidth: number
  cropStartHeight: number
  cropStartX: number
  cropStartY: number
  xDiff: number
  yDiff: number
  xInversed: boolean
  yInversed: boolean
  xCrossOver: boolean
  yCrossOver: boolean
  lastYCrossover: boolean
  startXCrossOver: boolean
  startYCrossOver: boolean
  isResize: boolean
  ord: Ords
}

const DOC_MOVE_OPTS = { capture: true, passive: false }

// NOTE: This function will be refactored out.
function containCrop(prevCrop: Partial<Crop>, crop: Partial<Crop>, imageWidth: number, imageHeight: number) {
  const pixelCrop = convertToPixelCrop(crop, imageWidth, imageHeight)
  const prevPixelCrop = convertToPixelCrop(prevCrop, imageWidth, imageHeight)

  // Non-aspects are simple
  if (!pixelCrop.aspect) {
    if (pixelCrop.x < 0) {
      pixelCrop.width += pixelCrop.x
      pixelCrop.x = 0
    } else if (pixelCrop.x + pixelCrop.width > imageWidth) {
      pixelCrop.width = imageWidth - pixelCrop.x
    }

    if (pixelCrop.y + pixelCrop.height > imageHeight) {
      pixelCrop.height = imageHeight - pixelCrop.y
    }

    return pixelCrop
  }

  // Contain crop if overflowing on X.
  if (pixelCrop.x < 0) {
    pixelCrop.width = pixelCrop.x + pixelCrop.width
    pixelCrop.x = 0
    pixelCrop.height = pixelCrop.width / pixelCrop.aspect
  } else if (pixelCrop.x + pixelCrop.width > imageWidth) {
    pixelCrop.width = imageWidth - pixelCrop.x
    pixelCrop.height = pixelCrop.width / pixelCrop.aspect
  }

  // If sizing in up direction...
  if (prevPixelCrop.y > pixelCrop.y) {
    if (pixelCrop.x + pixelCrop.width >= imageWidth) {
      // ...and we've hit the right border, don't adjust Y.
      // Adjust height so crop selection doesn't move if Y is adjusted.
      pixelCrop.height += prevPixelCrop.height - pixelCrop.height
      pixelCrop.y = prevPixelCrop.y
    } else if (pixelCrop.x <= 0) {
      // ...and we've hit the left border, don't adjust Y.
      // Adjust height so crop selection doesn't move if Y is adjusted.
      pixelCrop.height += prevPixelCrop.height - pixelCrop.height
      pixelCrop.y = prevPixelCrop.y
    }
  }

  // Contain crop if overflowing on Y.
  if (pixelCrop.y < 0) {
    pixelCrop.height = pixelCrop.y + pixelCrop.height
    pixelCrop.y = 0
    pixelCrop.width = pixelCrop.height * pixelCrop.aspect
  } else if (pixelCrop.y + pixelCrop.height > imageHeight) {
    pixelCrop.height = imageHeight - pixelCrop.y
    pixelCrop.width = pixelCrop.height * pixelCrop.aspect
  }

  // If sizing in left direction and we've hit the bottom border, don't adjust X.
  if (pixelCrop.x < prevPixelCrop.x && pixelCrop.y + pixelCrop.height >= imageHeight) {
    // Adjust width so crop selection doesn't move if X is adjusted.
    pixelCrop.width += prevPixelCrop.width - pixelCrop.width
    pixelCrop.x = prevPixelCrop.x
  }

  return pixelCrop
}

export interface ReactCropProps {
  /** An object of labels to override the built-in English ones */
  ariaLabels?: {
    cropArea?: string
    nwDragHandle?: string
    nDragHandle?: string
    neDragHandle?: string
    eDragHandle?: string
    seDragHandle?: string
    sDragHandle?: string
    swDragHandle?: string
    wDragHandle?: string
  }
  /** A string of classes to add to the main `ReactCrop` element. */
  className?: string
  /** A React Node that will be inserted into the `ReactCrop` element */
  children?: React.ReactNode
  /** Show the crop area as a circle. If your aspect is not 1 (a square) then the circle will be warped into an oval shape. Defaults to false. */
  circularCrop?: boolean
  /** All crop params are initially optional. See README.md for more info. */
  crop: Partial<Crop>
  /** Allows setting the crossorigin attribute on the image. */
  crossorigin?: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>['crossOrigin']
  /** If true then the user cannot resize or draw a new crop. A class of `ReactCrop--disabled` is also added to the container for user styling. */
  disabled?: boolean
  /** If true then the user cannot create or resize a crop, but can still drag the existing crop around. A class of `ReactCrop--locked` is also added to the container for user styling. */
  locked?: boolean
  /** Add an alt attribute to the image element. */
  imageAlt?: string
  /** Inline styles object to be passed to the image element. */
  imageStyle?: React.CSSProperties
  /** If true is passed then selection can't be disabled if the user clicks outside the selection area. */
  keepSelection?: boolean
  /** A minimum crop width, in pixels. */
  minWidth?: number
  /** A minimum crop height, in pixels. */
  minHeight?: number
  /** A maximum crop width, in pixels. */
  maxWidth?: number
  /** A maximum crop height, in pixels. */
  maxHeight?: number
  /** A callback which happens for every change of the crop. You should set the crop to state and pass it back into the library via the `crop` prop. */
  onChange: (crop: Crop, percentageCrop: Crop) => void
  /** A callback which happens after a resize, drag, or nudge. Passes the current crop state object in pixels and percent. */
  onComplete?: (crop: Crop, percentageCrop: Crop) => void
  /** This event is called if the image had an error loading. */
  onImageError?: React.DOMAttributes<HTMLImageElement>['onError']
  /** A callback which happens when the image is loaded. Passes the image DOM element. Return false if you set the crop with setState in there as otherwise the subsequent onChange + onComplete will not have your updated crop. */
  onImageLoaded?: (image: HTMLImageElement) => void | boolean
  /** A callback which happens when a user starts dragging or resizing. It is convenient to manipulate elements outside this component. */
  onDragStart?: (e: PointerEvent) => void
  /** A callback which happens when a user releases the cursor or touch after dragging or resizing. */
  onDragEnd?: (e: PointerEvent) => void
  /** Render a custom HTML element in place of an image. Useful if you want to support videos. */
  renderComponent?: React.ReactNode
  /** Render a custom element in crop selection. */
  renderSelectionAddon?: (state: ReactCropState) => React.ReactNode
  /** Rotates the image, you should pass a value between -180 and 180. Defaults to 0. */
  rotate?: number
  /** Show rule of thirds lines in the cropped area. Defaults to false. */
  ruleOfThirds?: boolean
  /** Scales the image. Defaults to 1 (normal scale). */
  scale?: number
  /** The image source (can be base64 or a blob just like a normal image). */
  src: string
  /** Inline styles object to be passed to the image wrapper element. */
  style?: React.CSSProperties
  /** A non-visual prop to keep pointer coords accurate when a parent element is scaled. Not to be confused with the `scale` prop which scales the image itself. Defaults to 1. */
  zoom?: number
  /** A non-visual prop to keep pointer coords accurate when a parent element is rotated. Not to be confused with the `rotate` prop which rotates the image itself. Defaults to 0, range is from -180 to 180. */
  spin?: number
}

export interface ReactCropState {
  cropIsActive: boolean
  newCropIsBeingDrawn: boolean
}

class ReactCrop extends PureComponent<ReactCropProps, ReactCropState> {
  static xOrds = ['e', 'w']
  static yOrds = ['n', 's']
  static xyOrds = ['nw', 'ne', 'se', 'sw']

  static nudgeStep = 1
  static nudgeStepMedium = 10
  static nudgeStepLarge = 100

  keysDown = new Set<string>()
  docMoveBound = false
  mouseDownOnCrop = false
  dragStarted = false
  evData: EVData = {
    clientStartX: 0,
    clientStartY: 0,
    cropStartWidth: 0,
    cropStartHeight: 0,
    cropStartX: 0,
    cropStartY: 0,
    xDiff: 0,
    yDiff: 0,
    xInversed: false,
    yInversed: false,
    xCrossOver: false,
    yCrossOver: false,
    lastYCrossover: false,
    startXCrossOver: false,
    startYCrossOver: false,
    isResize: true,
    ord: 'nw',
  }

  componentRef = createRef<HTMLDivElement>()
  mediaWrapperRef = createRef<HTMLDivElement>()
  imageRef = createRef<HTMLImageElement>()
  cropSelectRef = createRef<HTMLDivElement>()

  state: ReactCropState = {
    cropIsActive: false,
    newCropIsBeingDrawn: false,
  }

  componentDidMount() {
    if (this.componentRef.current) {
      this.componentRef.current.addEventListener('medialoaded', this.onMediaLoaded)
    }
  }

  componentWillUnmount() {
    if (this.componentRef.current) {
      this.componentRef.current.removeEventListener('medialoaded', this.onMediaLoaded)
    }
  }

  componentDidUpdate(prevProps: ReactCropProps) {
    const { crop, onChange, onComplete } = this.props

    if (
      this.imageRef.current &&
      crop &&
      prevProps.crop !== crop &&
      crop.aspect &&
      ((crop.width && !crop.height) || (!crop.width && crop.height))
    ) {
      const { width, height } = this.imageRef.current
      const newCrop = this.makeNewCrop()
      const completedCrop = makeAspectCrop(newCrop, width, height)

      const pixelCrop = convertToPixelCrop(completedCrop, width, height)
      const percentCrop = convertToPercentCrop(completedCrop, width, height)
      onChange(pixelCrop, percentCrop)

      if (onComplete) {
        onComplete(pixelCrop, percentCrop)
      }
    }
  }

  bindDocMove() {
    if (this.docMoveBound) {
      return
    }

    document.addEventListener('pointermove', this.onDocPointerMove, DOC_MOVE_OPTS)
    document.addEventListener('pointerup', this.onDocPointerDone, DOC_MOVE_OPTS)
    document.addEventListener('pointercancel', this.onDocPointerDone, DOC_MOVE_OPTS)

    this.docMoveBound = true
  }

  unbindDocMove() {
    if (!this.docMoveBound) {
      return
    }

    document.removeEventListener('pointermove', this.onDocPointerMove, DOC_MOVE_OPTS)
    document.removeEventListener('pointerup', this.onDocPointerDone, DOC_MOVE_OPTS)
    document.removeEventListener('pointercancel', this.onDocPointerDone, DOC_MOVE_OPTS)

    this.docMoveBound = false
  }

  onCropPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const { crop, disabled } = this.props
    const { width, height } = this.mediaDimensions
    const pixelCrop = convertToPixelCrop(crop, width, height)

    if (disabled) {
      return
    }

    if (e.cancelable) e.preventDefault() // Stop drag selection.

    // Bind to doc to follow movements outside of element.
    this.bindDocMove()

    // Focus for detecting keypress.
    ;(this.componentRef.current as HTMLDivElement).focus({ preventScroll: true }) // All other browsers

    const { ord } = (e.target as HTMLElement).dataset
    const xInversed = ord === 'nw' || ord === 'w' || ord === 'sw'
    const yInversed = ord === 'nw' || ord === 'n' || ord === 'ne'

    this.evData = {
      clientStartX: e.clientX,
      clientStartY: e.clientY,
      cropStartWidth: pixelCrop.width,
      cropStartHeight: pixelCrop.height,
      cropStartX: xInversed ? pixelCrop.x + pixelCrop.width : pixelCrop.x,
      cropStartY: yInversed ? pixelCrop.y + pixelCrop.height : pixelCrop.y,
      xDiff: 0,
      yDiff: 0,
      xInversed,
      yInversed,
      xCrossOver: xInversed,
      yCrossOver: yInversed,
      lastYCrossover: yInversed,
      startXCrossOver: xInversed,
      startYCrossOver: yInversed,
      isResize: Boolean(ord),
      ord: (ord || 'ne') as Ords,
    }

    this.mouseDownOnCrop = true
    this.setState({ cropIsActive: true })
  }

  onComponentPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const { crop, disabled, locked, keepSelection, onChange, zoom = 1, spin = 0 } = this.props

    const componentEl = (this.mediaWrapperRef.current as HTMLDivElement).firstChild

    if (e.target !== componentEl || !componentEl.contains(e.target as Node)) {
      return
    }

    if (disabled || locked || (keepSelection && isCropValid(crop))) {
      return
    }

    if (e.cancelable) e.preventDefault() // Stop drag selection.

    // Bind to doc to follow movements outside of element.
    this.bindDocMove()

    // Focus for detecting keypress.
    ;(this.componentRef.current as HTMLDivElement).focus({ preventScroll: true }) // All other browsers

    const rect = (this.mediaWrapperRef.current as HTMLDivElement).getBoundingClientRect()
    let x = 0
    let y = 0
    let scaledX = (e.clientX - rect.left) / zoom
    let scaledY = (e.clientY - rect.top) / zoom
    let degrees = spin
    let radians = Math.abs((degrees * Math.PI) / 180.0)
    if ((degrees > -45 && degrees <= 45) || (Math.abs(degrees) > 135 && Math.abs(degrees) <= 180)) {
      // Top and Bottom
      x = scaledX * Math.cos(radians)
      y = scaledY * Math.cos(radians)
    } else if (degrees > 45 && degrees <= 135) {
      // Left
      x = scaledY * Math.sin(radians)
      y = scaledX * Math.sin(radians) * -1
    } else if (degrees > -135 && degrees <= -45) {
      // Right
      x = scaledY * Math.sin(radians) * -1
      y = scaledX * Math.sin(radians)
    }

    const nextCrop: Crop = {
      unit: 'px',
      aspect: crop ? crop.aspect : undefined,
      x,
      y,
      width: 0,
      height: 0,
    }

    const { width, height } = this.mediaDimensions

    this.evData = {
      clientStartX: e.clientX,
      clientStartY: e.clientY,
      cropStartWidth: nextCrop.width,
      cropStartHeight: nextCrop.height,
      cropStartX: nextCrop.x,
      cropStartY: nextCrop.y,
      xDiff: 0,
      yDiff: 0,
      xInversed: false,
      yInversed: false,
      xCrossOver: false,
      yCrossOver: false,
      lastYCrossover: false,
      startXCrossOver: false,
      startYCrossOver: false,
      isResize: true,
      ord: 'nw',
    }

    this.mouseDownOnCrop = true

    onChange(convertToPixelCrop(nextCrop, width, height), convertToPercentCrop(nextCrop, width, height))

    this.setState({ cropIsActive: true, newCropIsBeingDrawn: true })
  }

  onDocPointerMove = (e: PointerEvent) => {
    const { crop, disabled, onChange, onDragStart, zoom = 1, spin = 0 } = this.props

    if (disabled) {
      return
    }

    if (!this.mouseDownOnCrop) {
      return
    }

    if (e.cancelable) e.preventDefault() // Stop drag selection.

    if (!this.dragStarted) {
      this.dragStarted = true
      if (onDragStart) {
        onDragStart(e)
      }
    }

    const { evData } = this

    let scaledX = (e.clientX - evData.clientStartX) / zoom
    let scaledY = (e.clientY - evData.clientStartY) / zoom
    let degrees = spin
    let radians = Math.abs((degrees * Math.PI) / 180.0)
    if ((degrees > -45 && degrees <= 45) || (Math.abs(degrees) > 135 && Math.abs(degrees) <= 180)) {
      // Top and Bottom
      evData.xDiff = scaledX * Math.cos(radians)
      evData.yDiff = scaledY * Math.cos(radians)
    } else if (degrees > 45 && degrees <= 135) {
      // Left
      evData.xDiff = scaledY * Math.sin(radians)
      evData.yDiff = scaledX * Math.sin(radians) * -1
    } else if (degrees > -135 && degrees <= -45) {
      // Right
      evData.xDiff = scaledY * Math.sin(radians) * -1
      evData.yDiff = scaledX * Math.sin(radians)
    }

    let nextCrop

    if (evData.isResize) {
      nextCrop = this.resizeCrop()
    } else {
      nextCrop = this.dragCrop()
    }

    if (nextCrop !== crop) {
      const { width, height } = this.mediaDimensions
      onChange(convertToPixelCrop(nextCrop, width, height), convertToPercentCrop(nextCrop, width, height))
    }
  }

  onComponentKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const { crop, disabled, onChange, onComplete } = this.props

    if (disabled) {
      return
    }

    this.keysDown.add(e.key)
    let nudged = false

    if (!isCropValid(crop)) {
      return
    }

    const nextCrop = this.makeNewCrop()
    const ctrlCmdPressed = navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey
    const nudgeStep = ctrlCmdPressed
      ? ReactCrop.nudgeStepLarge
      : e.shiftKey
      ? ReactCrop.nudgeStepMedium
      : ReactCrop.nudgeStep

    if (this.keysDown.has('ArrowLeft')) {
      nextCrop.x -= nudgeStep
      nudged = true
    }

    if (this.keysDown.has('ArrowRight')) {
      nextCrop.x += nudgeStep
      nudged = true
    }

    if (this.keysDown.has('ArrowUp')) {
      nextCrop.y -= nudgeStep
      nudged = true
    }

    if (this.keysDown.has('ArrowDown')) {
      nextCrop.y += nudgeStep
      nudged = true
    }

    if (nudged) {
      if (e.cancelable) e.preventDefault() // Stop drag selection.
      const { width, height } = this.mediaDimensions

      nextCrop.x = clamp(nextCrop.x, 0, width - nextCrop.width)
      nextCrop.y = clamp(nextCrop.y, 0, height - nextCrop.height)

      const pixelCrop = convertToPixelCrop(nextCrop, width, height)
      const percentCrop = convertToPercentCrop(nextCrop, width, height)

      onChange(pixelCrop, percentCrop)
      if (onComplete) {
        onComplete(pixelCrop, percentCrop)
      }
    }
  }

  onHandlerKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    ord: 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'
  ) => {
    const { crop, disabled, minWidth, minHeight, maxWidth, maxHeight, onChange, onComplete } = this.props
    const { width: mediaWidth, height: mediaHeight } = this.mediaDimensions

    if (disabled) {
      return
    }

    if (!isCropValid(crop)) {
      return
    }

    // Keep the event from bubbling up to the container
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.stopPropagation()
      e.preventDefault()
    } else {
      return
    }

    const nextCrop = convertToPixelCrop(crop, mediaWidth, mediaHeight)
    const maxCrop = getMaxCrop(nextCrop, ord, mediaWidth, mediaHeight, maxWidth, maxHeight)
    const minCrop = getMinCrop(nextCrop, ord, minWidth, minHeight)
    const ctrlCmdPressed = navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey
    const offset = ctrlCmdPressed
      ? ReactCrop.nudgeStepLarge
      : e.shiftKey
      ? ReactCrop.nudgeStepMedium
      : ReactCrop.nudgeStep

    let widthChanged = false
    let heightChanged = false

    if (e.key === 'ArrowLeft') {
      if (ord === 'nw' || ord === 'w' || ord === 'sw') {
        // Left side
        widthChanged = true
        nextCrop.x = Math.max(maxCrop.x, nextCrop.x - offset)
        nextCrop.width = Math.min(maxCrop.width, nextCrop.width + offset)
      } else if (ord === 'ne' || ord === 'e' || ord === 'se') {
        // Right side
        widthChanged = true
        nextCrop.width = Math.max(minCrop.width, nextCrop.width - offset)
      }
    } else if (e.key === 'ArrowRight') {
      if (ord === 'nw' || ord === 'w' || ord === 'sw') {
        // Left side
        widthChanged = true
        nextCrop.x = Math.min(minCrop.x, nextCrop.x + offset)
        nextCrop.width = Math.max(minCrop.width, nextCrop.width - offset)
      } else if (ord === 'ne' || ord === 'e' || ord === 'se') {
        // Right side
        widthChanged = true
        nextCrop.width = Math.min(maxCrop.width, nextCrop.width + offset)
      }
    }

    if (e.key === 'ArrowUp') {
      if (ord === 'nw' || ord === 'n' || ord === 'ne') {
        // Top side
        heightChanged = true
        nextCrop.y = Math.max(maxCrop.y, Math.max(0, nextCrop.y - offset))
        nextCrop.height = Math.min(maxCrop.height, nextCrop.height + offset)
      } else if (ord === 'sw' || ord === 's' || ord === 'se') {
        // Bottom side
        heightChanged = true
        nextCrop.height = Math.max(minCrop.height, nextCrop.height - offset)
      }
    } else if (e.key === 'ArrowDown') {
      if (ord === 'nw' || ord === 'n' || ord === 'ne') {
        // Top side
        heightChanged = true
        nextCrop.y = Math.min(minCrop.y, nextCrop.y + offset)
        nextCrop.height = Math.max(minCrop.height, nextCrop.height - offset)
      } else if (ord === 'sw' || ord === 's' || ord === 'se') {
        // Bottom side
        heightChanged = true
        nextCrop.height = Math.min(maxCrop.height, nextCrop.height + offset)
      }
    }

    if (nextCrop.aspect) {
      if (widthChanged) {
        nextCrop.height = nextCrop.width / nextCrop.aspect
      } else if (heightChanged) {
        const prevWidth = nextCrop.width
        nextCrop.width = nextCrop.height * nextCrop.aspect
        // Need to offset x on subtractive ords to maintain
        // staticness. Why does y not need this?
        if (ord === 'nw' || ord === 'sw') {
          nextCrop.x -= nextCrop.width - prevWidth
        }
      }
    }

    if (!areCropsEqual(crop, nextCrop)) {
      const percentCrop = convertToPercentCrop(nextCrop, mediaWidth, mediaHeight)
      onChange(nextCrop, percentCrop)

      if (onComplete) {
        onComplete(nextCrop, percentCrop)
      }
    }
  }

  onComponentKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    this.keysDown.delete(e.key)
  }

  onDocPointerDone = (e: PointerEvent) => {
    const { crop, disabled, onComplete, onDragEnd } = this.props

    this.unbindDocMove()

    if (disabled) {
      return
    }

    if (this.mouseDownOnCrop) {
      this.mouseDownOnCrop = false
      this.dragStarted = false

      const { width, height } = this.mediaDimensions

      onDragEnd && onDragEnd(e)
      onComplete && onComplete(convertToPixelCrop(crop, width, height), convertToPercentCrop(crop, width, height))

      this.setState({ cropIsActive: false, newCropIsBeingDrawn: false })
    }
  }

  // TODO: Confusing to have this and makeNewCrop.
  // When the image is loaded or when a custom component via `renderComponent` prop fires
  // a custom "medialoaded" event.
  createNewCrop() {
    const { width, height } = this.mediaDimensions
    const crop = this.makeNewCrop()
    const resolvedCrop = resolveCrop(crop, width, height)
    const pixelCrop = convertToPixelCrop(resolvedCrop, width, height)
    const percentCrop = convertToPercentCrop(resolvedCrop, width, height)
    return { pixelCrop, percentCrop }
  }

  // Custom components (using `renderComponent`) should fire a custom event
  // called "medialoaded" when they are loaded.
  onMediaLoaded = () => {
    const { onComplete, onChange } = this.props
    const { pixelCrop, percentCrop } = this.createNewCrop()
    onChange(pixelCrop, percentCrop)
    onComplete && onComplete(pixelCrop, percentCrop)
  }

  onImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const { onComplete, onChange, onImageLoaded } = this.props

    // Return false from onImageLoaded if you set the crop with setState in there as otherwise
    // the subsequent onChange + onComplete will not have your updated crop.
    const res = onImageLoaded ? onImageLoaded(e.currentTarget) : true

    if (res !== false) {
      const { pixelCrop, percentCrop } = this.createNewCrop()
      onChange(pixelCrop, percentCrop)
      onComplete && onComplete(pixelCrop, percentCrop)
    }
  }

  get mediaDimensions() {
    const el = this.mediaWrapperRef.current
    if (el) {
      const { width, height } = el.getBoundingClientRect()
      return { width, height }
    }
    return { width: 0, height: 0 }
  }

  getCropStyle() {
    const crop = this.makeNewCrop(this.props.crop ? this.props.crop.unit : 'px')

    return {
      top: `${crop.y}${crop.unit}`,
      left: `${crop.x}${crop.unit}`,
      width: `${crop.width}${crop.unit}`,
      height: `${crop.height}${crop.unit}`,
    }
  }

  getNewSize() {
    const { crop, minWidth = 0, maxWidth, minHeight = 0, maxHeight } = this.props
    const { evData } = this
    const { width, height } = this.mediaDimensions

    // New width.
    let newWidth = evData.cropStartWidth + evData.xDiff

    if (evData.xCrossOver) {
      newWidth = Math.abs(newWidth)
    }

    newWidth = clamp(newWidth, minWidth, maxWidth || width)

    // New height.
    let newHeight

    if (crop.aspect) {
      newHeight = newWidth / crop.aspect
    } else {
      newHeight = evData.cropStartHeight + evData.yDiff
    }

    if (evData.yCrossOver) {
      // Cap if polarity is inversed and the height fills the y space.
      newHeight = Math.min(Math.abs(newHeight), evData.cropStartY)
    }

    newHeight = clamp(newHeight, minHeight, maxHeight || height)

    if (crop.aspect) {
      newWidth = clamp(newHeight * crop.aspect, 0, width)
    }

    return {
      width: newWidth,
      height: newHeight,
    }
  }

  dragCrop() {
    const nextCrop = this.makeNewCrop()
    const { evData } = this
    const { width, height } = this.mediaDimensions

    nextCrop.x = clamp(evData.cropStartX + evData.xDiff, 0, width - nextCrop.width)
    nextCrop.y = clamp(evData.cropStartY + evData.yDiff, 0, height - nextCrop.height)

    return nextCrop
  }

  resizeCrop() {
    const { evData } = this
    const { crop, minWidth = 0, minHeight = 0 } = this.props
    const nextCrop = this.makeNewCrop()
    const { ord } = evData

    // On the inverse change the diff so it's the same and
    // the same algo applies.
    if (evData.xInversed) {
      evData.xDiff -= evData.cropStartWidth * 2
    }
    if (evData.yInversed) {
      evData.yDiff -= evData.cropStartHeight * 2
    }

    // New size.
    const newSize = this.getNewSize()

    // Adjust x/y to give illusion of 'staticness' as width/height is increased
    // when polarity is inversed.
    let newX = evData.cropStartX
    let newY = evData.cropStartY

    if (evData.xCrossOver) {
      newX = nextCrop.x + (nextCrop.width - newSize.width)
    }

    if (evData.yCrossOver) {
      // This has a more favorable behavior for aspect crops crossing over on the
      // diagonal, else it flips over from the bottom corner and looks jumpy.
      if (evData.lastYCrossover === false) {
        newY = nextCrop.y - newSize.height
      } else {
        newY = nextCrop.y + (nextCrop.height - newSize.height)
      }
    }

    const { width, height } = this.mediaDimensions

    const containedCrop = containCrop(
      this.props.crop,
      {
        unit: nextCrop.unit,
        x: newX,
        y: newY,
        width: newSize.width,
        height: newSize.height,
        aspect: nextCrop.aspect,
      },
      width,
      height
    )

    // Apply x/y/width/height changes depending on ordinate (fixed aspect always applies both).
    if (nextCrop.aspect || ReactCrop.xyOrds.indexOf(ord) > -1) {
      nextCrop.x = containedCrop.x
      nextCrop.y = containedCrop.y
      nextCrop.width = containedCrop.width
      nextCrop.height = containedCrop.height
    } else if (ReactCrop.xOrds.indexOf(ord) > -1) {
      nextCrop.x = containedCrop.x
      nextCrop.width = containedCrop.width
    } else if (ReactCrop.yOrds.indexOf(ord) > -1) {
      nextCrop.y = containedCrop.y
      nextCrop.height = containedCrop.height
    }

    evData.lastYCrossover = evData.yCrossOver
    this.crossOverCheck()

    // Improve: This should go to the min box not
    // the last one.
    // Contain crop can result in crops that are too
    // small to meet minimums. Fixes #425.
    if (nextCrop.width < minWidth) {
      return crop
    }
    if (nextCrop.height < minHeight) {
      return crop
    }

    return nextCrop
  }

  getRotatedCursor(handle: string, degrees: number) {
    if ((degrees > -135 && degrees <= -45) || (degrees > 45 && degrees <= 135)) {
      // Left and Right
      switch (handle) {
        case 'nw':
          return { cursor: 'ne-resize' }
        case 'n':
          return { cursor: 'w-resize' }
        case 'ne':
          return { cursor: 'nw-resize' }
        case 'e':
          return { cursor: 's-resize' }
        case 'se':
          return { cursor: 'sw-resize' }
        case 's':
          return { cursor: 'e-resize' }
        case 'sw':
          return { cursor: 'se-resize' }
        case 'w':
          return { cursor: 'n-resize' }
      }
    }
  }

  createCropSelection() {
    const { ariaLabels, disabled, locked, renderSelectionAddon, ruleOfThirds, crop, spin = 0 } = this.props
    const style = this.getCropStyle()

    return (
      <div
        style={style}
        className="ReactCrop__crop-selection"
        onPointerDown={this.onCropPointerDown}
        aria-label={
          this.props.ariaLabels && this.props.ariaLabels.cropArea
            ? this.props.ariaLabels.cropArea
            : 'Use the arrow keys to move the crop selection area'
        }
        tabIndex={0}
        onKeyDown={this.onComponentKeyDown}
        onKeyUp={this.onComponentKeyUp}
      >
        {!disabled && !locked && (
          <div className="ReactCrop__drag-elements">
            <div className="ReactCrop__drag-bar ord-n" data-ord="n" />
            <div className="ReactCrop__drag-bar ord-e" data-ord="e" />
            <div className="ReactCrop__drag-bar ord-s" data-ord="s" />
            <div className="ReactCrop__drag-bar ord-w" data-ord="w" />

            <div
              className="ReactCrop__drag-handle ord-nw"
              data-ord="nw"
              style={this.getRotatedCursor('nw', spin)}
              tabIndex={0}
              aria-label={
                ariaLabels?.nwDragHandle ||
                'Use the arrow keys to move the north west drag handle to change the crop selection area'
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                this.onHandlerKeyDown(e, 'nw')
              }}
            />
            <div
              className="ReactCrop__drag-handle ord-n"
              data-ord="n"
              style={this.getRotatedCursor('n', spin)}
              tabIndex={0}
              aria-label={
                ariaLabels?.nDragHandle ||
                'Use the up and down arrow keys to move the north drag handle to change the crop selection area'
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                this.onHandlerKeyDown(e, 'n')
              }}
            />
            <div
              className="ReactCrop__drag-handle ord-ne"
              data-ord="ne"
              style={this.getRotatedCursor('ne', spin)}
              tabIndex={0}
              aria-label={
                ariaLabels?.neDragHandle ||
                'Use the arrow keys to move the north east drag handle to change the crop selection area'
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                this.onHandlerKeyDown(e, 'ne')
              }}
            />
            <div
              className="ReactCrop__drag-handle ord-e"
              data-ord="e"
              style={this.getRotatedCursor('e', spin)}
              tabIndex={0}
              aria-label={
                ariaLabels?.eDragHandle ||
                'Use the up and down arrow keys to move the east drag handle to change the crop selection area'
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                this.onHandlerKeyDown(e, 'e')
              }}
            />
            <div
              className="ReactCrop__drag-handle ord-se"
              data-ord="se"
              style={this.getRotatedCursor('se', spin)}
              tabIndex={0}
              aria-label={
                ariaLabels?.seDragHandle ||
                'Use the arrow keys to move the south east drag handle to change the crop selection area'
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                this.onHandlerKeyDown(e, 'se')
              }}
            />
            <div
              className="ReactCrop__drag-handle ord-s"
              data-ord="s"
              style={this.getRotatedCursor('s', spin)}
              tabIndex={0}
              aria-label={
                ariaLabels?.sDragHandle ||
                'Use the up and down arrow keys to move the south drag handle to change the crop selection area'
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                this.onHandlerKeyDown(e, 's')
              }}
            />
            <div
              className="ReactCrop__drag-handle ord-sw"
              data-ord="sw"
              style={this.getRotatedCursor('sw', spin)}
              tabIndex={0}
              aria-label={
                ariaLabels?.swDragHandle ||
                'Use the arrow keys to move the south west drag handle to change the crop selection area'
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                this.onHandlerKeyDown(e, 'sw')
              }}
            />
            <div
              className="ReactCrop__drag-handle ord-w"
              data-ord="w"
              style={this.getRotatedCursor('w', spin)}
              tabIndex={0}
              aria-label={
                ariaLabels?.wDragHandle ||
                'Use the up and down arrow keys to move the west drag handle to change the crop selection area'
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                this.onHandlerKeyDown(e, 'w')
              }}
            />
          </div>
        )}
        {renderSelectionAddon && isCropValid(crop) && (
          <div className="ReactCrop__selection-addon" onMouseDown={e => e.stopPropagation()}>
            {renderSelectionAddon(this.state)}
          </div>
        )}
        {ruleOfThirds && (
          <>
            <div className="ReactCrop__rule-of-thirds-hz" />
            <div className="ReactCrop__rule-of-thirds-vt" />
          </>
        )}
      </div>
    )
  }

  makeNewCrop(unit = 'px') {
    const crop = { ...defaultCrop, ...(this.props.crop || {}) }
    const { width, height } = this.mediaDimensions

    return unit === 'px' ? convertToPixelCrop(crop, width, height) : convertToPercentCrop(crop, width, height)
  }

  crossOverCheck() {
    const { evData } = this
    const { minWidth, minHeight } = this.props

    if (
      !minWidth &&
      ((!evData.xCrossOver && -Math.abs(evData.cropStartWidth) - evData.xDiff >= 0) ||
        (evData.xCrossOver && -Math.abs(evData.cropStartWidth) - evData.xDiff <= 0))
    ) {
      evData.xCrossOver = !evData.xCrossOver
    }

    if (
      !minHeight &&
      ((!evData.yCrossOver && -Math.abs(evData.cropStartHeight) - evData.yDiff >= 0) ||
        (evData.yCrossOver && -Math.abs(evData.cropStartHeight) - evData.yDiff <= 0))
    ) {
      evData.yCrossOver = !evData.yCrossOver
    }
  }

  render() {
    const {
      children,
      circularCrop,
      className,
      crossorigin,
      crop,
      disabled,
      imageStyle,
      locked,
      imageAlt,
      onImageError,
      renderComponent,
      scale = 1,
      src,
      style,
      rotate = 0,
      ruleOfThirds,
    } = this.props

    const { cropIsActive, newCropIsBeingDrawn } = this.state
    const cropSelection = isCropValid(crop) && this.componentRef ? this.createCropSelection() : null

    const componentClasses = clsx('ReactCrop', className, {
      'ReactCrop--active': cropIsActive,
      'ReactCrop--disabled': disabled,
      'ReactCrop--locked': locked,
      'ReactCrop--new-crop': newCropIsBeingDrawn,
      'ReactCrop--fixed-aspect': crop && crop.aspect,
      'ReactCrop--circular-crop': crop && circularCrop,
      'ReactCrop--rule-of-thirds': crop && ruleOfThirds,
      'ReactCrop--invisible-crop': !this.dragStarted && crop && !crop.width && !crop.height,
    })

    return (
      <div
        ref={this.componentRef}
        className={componentClasses}
        style={style}
        onPointerDown={this.onComponentPointerDown}
      >
        <div ref={this.mediaWrapperRef} style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}>
          {renderComponent || (
            <img
              ref={this.imageRef}
              crossOrigin={crossorigin}
              className="ReactCrop__image"
              style={imageStyle}
              src={src}
              onLoad={this.onImageLoad}
              onError={onImageError}
              alt={imageAlt}
            />
          )}
        </div>
        {children}
        {cropSelection}
      </div>
    )
  }
}

export { ReactCrop as default, ReactCrop as Component }
