import React, { createRef, PureComponent } from 'react';
import clsx from './clsx';

import { CropObject, CropOrd, OffsetCoords, CropUnit } from './types';
import { clamp, convertToPixelCrop, convertToPercentCrop, isCropDrawn, containCrop, straightenYPath } from './utils';

import './Crop.scss';

interface CropProps {
  crop?: CropObject;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  disabled?: boolean;
  locked?: boolean;
  circularCrop?: boolean;
  keepSelection?: boolean;
  ruleOfThirds?: boolean;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  onChange: (pixelCrop: CropObject, percentCrop: CropObject) => void;
  onComplete?: (pixelCrop: CropObject, percentCrop: CropObject) => void;
  onDragStart?: (e: PointerEvent) => void;
  onDragEnd?: (e: PointerEvent) => void;
}

interface CropState {
  dimensions: { width: number; height: number };
  cropIsActive?: boolean;
  newCropIsBeingDrawn?: boolean;
}

interface EvData {
  clientStartX: number;
  clientStartY: number;
  cropStartWidth: number;
  cropStartHeight: number;
  cropStartX: number;
  cropStartY: number;
  xDiff: number;
  yDiff: number;
  xDiffPc: number;
  yDiffPc: number;
  xInversed: boolean;
  yInversed: boolean;
  xCrossOver: boolean;
  yCrossOver: boolean;
  startXCrossOver: boolean;
  startYCrossOver: boolean;
  isResize: boolean;
  ord: CropOrd;
  cropOffset: OffsetCoords;
  lastYCrossover?: boolean;
}

export const EMPTY_CROP: CropObject = {
  aspect: 0,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  unit: 'px',
};

export class Crop extends PureComponent<CropProps, CropState> {
  static xOrds = ['e', 'w'];
  static yOrds = ['n', 's'];
  static xyOrds = ['nw', 'ne', 'se', 'sw'];

  static nudgeStep = 1;
  static nudgeStepMedium = 10;
  static nudgeStepLarge = 100;

  componentRef = createRef<HTMLDivElement>();
  cropSelectRef = createRef<HTMLDivElement>();
  resizeObserver?: ResizeObserver;

  mouseDownOnCrop = false;
  dragStarted = false;
  keysDown = new Set();
  evData: EvData = {
    clientStartX: 0,
    clientStartY: 0,
    cropStartWidth: 0,
    cropStartHeight: 0,
    cropStartX: 0,
    cropStartY: 0,
    xDiff: 0,
    yDiff: 0,
    xDiffPc: 0,
    yDiffPc: 0,
    xInversed: false,
    yInversed: false,
    xCrossOver: false,
    yCrossOver: false,
    startXCrossOver: false,
    startYCrossOver: false,
    isResize: false,
    ord: 'nw',
    cropOffset: { top: 0, left: 0 },
  };

  state: CropState = {
    dimensions: { width: 0, height: 0 },
  };

  componentDidMount() {
    if (this.componentRef.current) {
      const el = this.componentRef.current;

      this.setState({
        dimensions: {
          width: el.clientWidth,
          height: el.clientHeight,
        },
      });

      this.resizeObserver = new ResizeObserver(([firstEntry]) => {
        this.setState({
          dimensions: {
            width: firstEntry.contentRect.width,
            height: firstEntry.contentRect.height,
          },
        });
        console.log('Size changed', firstEntry.contentRect.width, firstEntry.contentRect.height);
      });

      this.resizeObserver.observe(el);
    }
  }

  componentWillUnmount() {
    this.resizeObserver?.disconnect();
  }

  bindDocMove() {
    if (typeof document !== 'undefined') {
      document.addEventListener('pointermove', this.onDocPointerMove);
      document.addEventListener('pointerup', this.onDocPointerDone);
      document.addEventListener('pointercancel', this.onDocPointerDone);
    }
  }

  unbindDocMove() {
    if (typeof document !== 'undefined') {
      document.removeEventListener('pointermove', this.onDocPointerMove);
      document.removeEventListener('pointerup', this.onDocPointerDone);
      document.removeEventListener('pointercancel', this.onDocPointerDone);
    }
  }

  onCropPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const { crop = EMPTY_CROP, disabled } = this.props;
    const { width, height } = this.state.dimensions;
    const pixelCrop = convertToPixelCrop(crop, width, height);
    const cropEl = this.componentRef.current;

    if (disabled || !cropEl) {
      return;
    }
    e.preventDefault(); // Stop drag selection.

    // Bind to doc to follow movements outside of element.
    this.bindDocMove();

    // Focus for detecting keypress.
    cropEl.focus({ preventScroll: true });

    const ord = (e.target as HTMLElement)?.dataset.ord as CropOrd;
    const xInversed = ord === 'nw' || ord === 'w' || ord === 'sw';
    const yInversed = ord === 'nw' || ord === 'n' || ord === 'ne';
    const cropOffset = pixelCrop.aspect
      ? {
          top: cropEl.offsetTop,
          left: cropEl.offsetLeft,
        }
      : { top: 0, left: 0 };

    this.evData = {
      clientStartX: e.pageX,
      clientStartY: e.pageY,
      cropStartWidth: pixelCrop.width,
      cropStartHeight: pixelCrop.height,
      cropStartX: xInversed ? pixelCrop.x + pixelCrop.width : pixelCrop.x,
      cropStartY: yInversed ? pixelCrop.y + pixelCrop.height : pixelCrop.y,
      xDiff: 0,
      yDiff: 0,
      xDiffPc: 0,
      yDiffPc: 0,
      xInversed,
      yInversed,
      xCrossOver: xInversed,
      yCrossOver: yInversed,
      startXCrossOver: xInversed,
      startYCrossOver: yInversed,
      isResize: Boolean((e.target as HTMLElement)?.dataset.ord),
      ord,
      cropOffset,
    };

    this.mouseDownOnCrop = true;
    this.setState({ cropIsActive: true });
  };

  onComponentPointerDown = (e: React.PointerEvent) => {
    const componentEl = this.componentRef.current;
    const cropEl = componentEl?.firstChild;
    if (!componentEl || e.target !== cropEl) {
      return;
    }

    const { crop, disabled, locked, keepSelection, onChange } = this.props;
    if (disabled || locked || (keepSelection && isCropDrawn(crop))) {
      return;
    }

    e.preventDefault(); // Stop drag selection.

    // Bind to doc to follow movements outside of element.
    this.bindDocMove();

    // Focus for detecting keypress.
    componentEl.focus({ preventScroll: true });

    const nextCrop: CropObject = {
      unit: 'px',
      aspect: crop ? crop.aspect : undefined,
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
      width: 0,
      height: 0,
    };

    this.evData = {
      clientStartX: e.pageX,
      clientStartY: e.pageY,
      cropStartWidth: nextCrop.width,
      cropStartHeight: nextCrop.height,
      cropStartX: nextCrop.x,
      cropStartY: nextCrop.y,
      xDiff: 0,
      yDiff: 0,
      xDiffPc: 0,
      yDiffPc: 0,
      xInversed: false,
      yInversed: false,
      xCrossOver: false,
      yCrossOver: false,
      startXCrossOver: false,
      startYCrossOver: false,
      isResize: true,
      ord: 'nw',
      cropOffset: { top: 0, left: 0 },
    };

    this.mouseDownOnCrop = true;

    const { width, height } = this.state.dimensions;

    if (onChange) {
      onChange(convertToPixelCrop(nextCrop, width, height), convertToPercentCrop(nextCrop, width, height));
    }

    this.setState({ cropIsActive: true, newCropIsBeingDrawn: true });
  };

  onDocPointerMove = (e: PointerEvent) => {
    const { crop, disabled, onChange, onDragStart } = this.props;

    if (disabled) {
      return;
    }

    if (!this.mouseDownOnCrop) {
      return;
    }

    e.preventDefault(); // Stop drag selection.

    if (!this.dragStarted) {
      this.dragStarted = true;
      if (onDragStart) {
        onDragStart(e);
      }
    }

    const { evData } = this;
    const clientPos = {
      x: e.pageX,
      y: e.pageY,
    };

    if (evData.isResize && crop?.aspect && evData.cropOffset) {
      clientPos.y = straightenYPath(
        clientPos.x,
        evData.ord,
        evData.cropOffset,
        evData.cropStartWidth,
        evData.cropStartHeight
      );
    }

    evData.xDiff = clientPos.x - evData.clientStartX;
    evData.yDiff = clientPos.y - evData.clientStartY;

    let nextCrop;

    if (evData.isResize) {
      nextCrop = this.resizeCrop();
    } else {
      nextCrop = this.dragCrop();
    }

    if (nextCrop !== crop) {
      const { width, height } = this.state.dimensions;
      onChange(convertToPixelCrop(nextCrop, width, height), convertToPercentCrop(nextCrop, width, height));
    }
  };

  onComponentKeyDown = (e: React.KeyboardEvent) => {
    const { crop, disabled, onChange, onComplete } = this.props;

    if (disabled) {
      return;
    }

    this.keysDown.add(e.key);
    let nudged = false;

    if (!isCropDrawn(crop)) {
      return;
    }

    const nextCrop = this.makeNewCrop();
    const ctrlCmdPressed = navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey;
    const nudgeStep = ctrlCmdPressed ? Crop.nudgeStepLarge : e.shiftKey ? Crop.nudgeStepMedium : Crop.nudgeStep;

    if (this.keysDown.has('ArrowLeft')) {
      nextCrop.x -= nudgeStep;
      nudged = true;
    }

    if (this.keysDown.has('ArrowRight')) {
      nextCrop.x += nudgeStep;
      nudged = true;
    }

    if (this.keysDown.has('ArrowUp')) {
      nextCrop.y -= nudgeStep;
      nudged = true;
    }

    if (this.keysDown.has('ArrowDown')) {
      nextCrop.y += nudgeStep;
      nudged = true;
    }

    if (nudged) {
      e.preventDefault(); // Stop drag selection.
      const { width, height } = this.state.dimensions;

      nextCrop.x = clamp(nextCrop.x, 0, width - nextCrop.width);
      nextCrop.y = clamp(nextCrop.y, 0, height - nextCrop.height);

      const pixelCrop = convertToPixelCrop(nextCrop, width, height);
      const percentCrop = convertToPercentCrop(nextCrop, width, height);

      onChange(pixelCrop, percentCrop);

      if (onComplete) {
        onComplete(pixelCrop, percentCrop);
      }
    }
  };

  onComponentKeyUp = (e: React.KeyboardEvent) => {
    this.keysDown.delete(e.key);
  };

  onDocPointerDone = (e: PointerEvent) => {
    const { crop = EMPTY_CROP, disabled, onComplete, onDragEnd } = this.props;

    this.unbindDocMove();

    if (disabled) {
      return;
    }

    if (this.mouseDownOnCrop) {
      this.mouseDownOnCrop = false;
      this.dragStarted = false;

      const { width, height } = this.state.dimensions;

      if (onDragEnd) {
        onDragEnd(e);
      }

      if (onComplete) {
        onComplete(convertToPixelCrop(crop, width, height), convertToPercentCrop(crop, width, height));
      }

      this.setState({ cropIsActive: false, newCropIsBeingDrawn: false });
    }
  };

  getCropStyle() {
    const crop = this.makeNewCrop(this.props.crop ? this.props.crop.unit : 'px');

    return {
      top: `${crop.y}${crop.unit}`,
      left: `${crop.x}${crop.unit}`,
      width: `${crop.width}${crop.unit}`,
      height: `${crop.height}${crop.unit}`,
    };
  }

  getNewSize() {
    const { crop, minWidth = 0, maxWidth, minHeight = 0, maxHeight } = this.props;
    const { evData } = this;
    const { width, height } = this.state.dimensions;

    if (!crop) {
      return { width: 0, height: 0 };
    }

    // New width.
    let newWidth = evData.cropStartWidth + evData.xDiff;

    if (evData.xCrossOver) {
      newWidth = Math.abs(newWidth);
    }

    newWidth = clamp(newWidth, minWidth, maxWidth || width);

    // New height.
    let newHeight;

    if (crop.aspect) {
      newHeight = newWidth / crop.aspect;
    } else {
      newHeight = evData.cropStartHeight + evData.yDiff;
    }

    if (evData.yCrossOver) {
      // Cap if polarity is inversed and the height fills the y space.
      newHeight = Math.min(Math.abs(newHeight), evData.cropStartY);
    }

    newHeight = clamp(newHeight, minHeight, maxHeight || height);

    if (crop.aspect) {
      newWidth = clamp(newHeight * crop.aspect, 0, width);
    }

    return {
      width: newWidth,
      height: newHeight,
    };
  }

  dragCrop() {
    const nextCrop = this.makeNewCrop();
    const { evData } = this;
    const { width, height } = this.state.dimensions;

    nextCrop.x = clamp(evData.cropStartX + evData.xDiff, 0, width - nextCrop.width);
    nextCrop.y = clamp(evData.cropStartY + evData.yDiff, 0, height - nextCrop.height);

    return nextCrop;
  }

  resizeCrop() {
    const { evData } = this;
    const { crop = EMPTY_CROP } = this.props;
    const nextCrop = this.makeNewCrop();
    const { ord } = evData;

    // On the inverse change the diff so it's the same and
    // the same algo applies.
    if (evData.xInversed) {
      evData.xDiff -= evData.cropStartWidth * 2;
      evData.xDiffPc -= evData.cropStartWidth * 2;
    }
    if (evData.yInversed) {
      evData.yDiff -= evData.cropStartHeight * 2;
      evData.yDiffPc -= evData.cropStartHeight * 2;
    }

    // New size.
    const newSize = this.getNewSize();

    // Adjust x/y to give illusion of 'staticness' as width/height is increased
    // when polarity is inversed.
    let newX = evData.cropStartX;
    let newY = evData.cropStartY;

    if (evData.xCrossOver) {
      newX = nextCrop.x + (nextCrop.width - newSize.width);
    }

    if (evData.yCrossOver) {
      // This not only removes the little "shake" when inverting at a diagonal, but
      // for some reason y was way off at fast speeds moving sw->ne with fixed aspect
      // only, I couldn't figure out why.
      if (evData.lastYCrossover === false) {
        newY = nextCrop.y - newSize.height;
      } else {
        newY = nextCrop.y + (nextCrop.height - newSize.height);
      }
    }

    const { width, height } = this.state.dimensions;
    const containedCrop = containCrop(
      crop,
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
    );

    // Apply x/y/width/height changes depending on ordinate (fixed aspect always applies both).
    if (nextCrop.aspect || Crop.xyOrds.indexOf(ord) > -1) {
      nextCrop.x = containedCrop.x;
      nextCrop.y = containedCrop.y;
      nextCrop.width = containedCrop.width;
      nextCrop.height = containedCrop.height;
    } else if (Crop.xOrds.indexOf(ord) > -1) {
      nextCrop.x = containedCrop.x;
      nextCrop.width = containedCrop.width;
    } else if (Crop.yOrds.indexOf(ord) > -1) {
      nextCrop.y = containedCrop.y;
      nextCrop.height = containedCrop.height;
    }

    evData.lastYCrossover = evData.yCrossOver;
    this.crossOverCheck(this.evData);

    return nextCrop;
  }

  createCropSelection() {
    const { disabled, locked, ruleOfThirds, crop } = this.props;
    const style = this.getCropStyle();

    return (
      <div
        ref={this.cropSelectRef}
        style={style}
        className="ReactCrop__crop-selection"
        onPointerDown={this.onCropPointerDown}
      >
        {!disabled && !locked && (
          <div className="ReactCrop__drag-elements">
            <div className="ReactCrop__drag-bar ord-n" data-ord="n" />
            <div className="ReactCrop__drag-bar ord-e" data-ord="e" />
            <div className="ReactCrop__drag-bar ord-s" data-ord="s" />
            <div className="ReactCrop__drag-bar ord-w" data-ord="w" />

            <div className="ReactCrop__drag-handle ord-nw" data-ord="nw" />
            <div className="ReactCrop__drag-handle ord-n" data-ord="n" />
            <div className="ReactCrop__drag-handle ord-ne" data-ord="ne" />
            <div className="ReactCrop__drag-handle ord-e" data-ord="e" />
            <div className="ReactCrop__drag-handle ord-se" data-ord="se" />
            <div className="ReactCrop__drag-handle ord-s" data-ord="s" />
            <div className="ReactCrop__drag-handle ord-sw" data-ord="sw" />
            <div className="ReactCrop__drag-handle ord-w" data-ord="w" />
          </div>
        )}
        {ruleOfThirds && (
          <>
            <div className="ReactCrop__rule-of-thirds-hz" />
            <div className="ReactCrop__rule-of-thirds-vt" />
          </>
        )}
      </div>
    );
  }

  makeNewCrop(unit: CropUnit = 'px') {
    const userCrop = this.props.crop || EMPTY_CROP;
    const newCrop: CropObject = {
      unit: userCrop.unit || unit,
      aspect: userCrop.aspect ?? EMPTY_CROP.aspect,
      x: userCrop.x ?? EMPTY_CROP.x,
      y: userCrop.y ?? EMPTY_CROP.y,
      width: userCrop.width ?? EMPTY_CROP.width,
      height: userCrop.height ?? EMPTY_CROP.height,
    };
    const { width, height } = this.state.dimensions;

    return unit === 'px' ? convertToPixelCrop(newCrop, width, height) : convertToPercentCrop(newCrop, width, height);
  }

  crossOverCheck(evData: EvData) {
    const { minWidth, minHeight } = this.props;

    if (
      !minWidth &&
      ((!evData.xCrossOver && -Math.abs(evData.cropStartWidth) - evData.xDiff >= 0) ||
        (evData.xCrossOver && -Math.abs(evData.cropStartWidth) - evData.xDiff <= 0))
    ) {
      evData.xCrossOver = !evData.xCrossOver;
    }

    if (
      !minHeight &&
      ((!evData.yCrossOver && -Math.abs(evData.cropStartHeight) - evData.yDiff >= 0) ||
        (evData.yCrossOver && -Math.abs(evData.cropStartHeight) - evData.yDiff <= 0))
    ) {
      evData.yCrossOver = !evData.yCrossOver;
    }
  }

  render() {
    const { children, circularCrop, className, style, crop, disabled, locked, ruleOfThirds } = this.props;
    const { width, height } = this.state.dimensions;

    const { cropIsActive, newCropIsBeingDrawn } = this.state;
    const cropSelection = width && height && isCropDrawn(crop) ? this.createCropSelection() : null;

    const componentClasses = clsx('ReactCrop', className, {
      'ReactCrop--active': cropIsActive,
      'ReactCrop--disabled': disabled,
      'ReactCrop--locked': locked,
      'ReactCrop--new-crop': newCropIsBeingDrawn,
      'ReactCrop--fixed-aspect': crop && crop.aspect,
      'ReactCrop--circular-crop': crop && circularCrop,
      'ReactCrop--rule-of-thirds': crop && ruleOfThirds,
      'ReactCrop--invisible-crop': !this.dragStarted && crop && !crop.width && !crop.height,
    });

    return (
      <div
        ref={this.componentRef}
        className={componentClasses}
        style={style}
        tabIndex={0}
        onPointerDown={this.onComponentPointerDown}
        onKeyDown={this.onComponentKeyDown}
        onKeyUp={this.onComponentKeyUp}
      >
        {children}
        {cropSelection}
      </div>
    );
  }
}
