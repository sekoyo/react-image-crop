import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

// Feature detection
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Improving_scrolling_performance_with_passive_listeners
let passiveSupported = false;

try {
  window.addEventListener(
    'test',
    null,
    Object.defineProperty({}, 'passive', {
      get: () => {
        passiveSupported = true;
        return true;
      },
    })
  );
} catch (err) {} // eslint-disable-line no-empty

function getClientPos(e) {
  let pageX;
  let pageY;

  if (e.touches) {
    [{ pageX, pageY }] = e.touches;
  } else {
    ({ pageX, pageY } = e);
  }

  return {
    x: pageX,
    y: pageY,
  };
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function isCropValid(crop) {
  return crop && !isNaN(crop.width) && !isNaN(crop.height);
}

function inverseOrd(ord) {
  if (ord === 'n') return 's';
  if (ord === 'ne') return 'sw';
  if (ord === 'e') return 'w';
  if (ord === 'se') return 'nw';
  if (ord === 's') return 'n';
  if (ord === 'sw') return 'ne';
  if (ord === 'w') return 'e';
  if (ord === 'nw') return 'se';
  return ord;
}

function makeAspectCrop(crop, imageWidth, imageHeight) {
  if (isNaN(crop.aspect)) {
    console.warn('`crop.aspect` should be a number in order to make an aspect crop', crop);
    return crop;
  }

  const completeCrop = {
    unit: 'px',
    x: 0,
    y: 0,
    ...crop,
  };

  if (crop.width) {
    completeCrop.height = completeCrop.width / crop.aspect;
  }

  if (crop.height) {
    completeCrop.width = completeCrop.height * crop.aspect;
  }

  if (completeCrop.y + completeCrop.height > imageHeight) {
    completeCrop.height = imageHeight - completeCrop.y;
    completeCrop.width = completeCrop.height * crop.aspect;
  }

  if (completeCrop.x + completeCrop.width > imageWidth) {
    completeCrop.width = imageWidth - completeCrop.x;
    completeCrop.height = completeCrop.width / crop.aspect;
  }

  return completeCrop;
}

function convertToPercentCrop(crop, imageWidth, imageHeight) {
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

function convertToPixelCrop(crop, imageWidth, imageHeight) {
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

function isAspectInvalid(crop, imageWidth, imageHeight) {
  if ((!crop.width && crop.height) || (crop.width && !crop.height)) {
    return true;
  }

  // Allow a 1px tolerance due to %->px math imprecision.
  if (crop.y + crop.height > imageHeight + 1 || crop.x + crop.width > imageWidth + 1) {
    return true;
  }

  if (crop.width / crop.aspect < crop.height - 1 || crop.width / crop.aspect > crop.height + 1) {
    return true;
  }
  if (crop.height * crop.aspect < crop.width - 1 || crop.height * crop.aspect > crop.width + 1) {
    return true;
  }

  return false;
}

function resolveCrop(pixelCrop, imageWidth, imageHeight) {
  if (!pixelCrop) {
    return pixelCrop;
  }

  let fixedCrop = pixelCrop;
  // Allow a 1px tolerance due to %->px math imprecision.
  const widthOverflows = pixelCrop.x + pixelCrop.width > imageWidth + 1;
  const heightOverflows = pixelCrop.y + pixelCrop.height > imageHeight + 1;

  if (widthOverflows && heightOverflows) {
    fixedCrop = {
      unit: 'px',
      x: 0,
      y: 0,
      ...pixelCrop,
      width: imageWidth > pixelCrop.width ? pixelCrop.width : imageWidth,
      height: imageHeight > pixelCrop.height ? pixelCrop.height : imageHeight,
    };
  } else if (widthOverflows) {
    fixedCrop = {
      unit: 'px',
      x: 0,
      y: 0,
      ...pixelCrop,
      width: imageWidth > pixelCrop.width ? pixelCrop.width : imageWidth,
    };
  } else if (heightOverflows) {
    fixedCrop = {
      unit: 'px',
      x: 0,
      y: 0,
      ...pixelCrop,
      height: imageHeight > pixelCrop.height ? pixelCrop.height : imageHeight,
    };
  }

  if (fixedCrop.aspect && isAspectInvalid(fixedCrop, imageWidth, imageHeight)) {
    return makeAspectCrop(fixedCrop, imageWidth, imageHeight);
  }

  return fixedCrop;
}

function containCrop(prevCrop, crop, imageWidth, imageHeight) {
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

class ReactCrop extends PureComponent {
  window = typeof window !== 'undefined' ? window : {};

  document = typeof document !== 'undefined' ? document : {};

  state = {};

  componentDidMount() {
    if (this.document.addEventListener) {
      const options = passiveSupported ? { passive: false } : false;

      this.document.addEventListener('mousemove', this.onDocMouseTouchMove, options);
      this.document.addEventListener('touchmove', this.onDocMouseTouchMove, options);

      this.document.addEventListener('mouseup', this.onDocMouseTouchEnd, options);
      this.document.addEventListener('touchend', this.onDocMouseTouchEnd, options);
      this.document.addEventListener('touchcancel', this.onDocMouseTouchEnd, options);

      this.componentRef.addEventListener('medialoaded', this.onMediaLoaded);
    }
  }

  componentWillUnmount() {
    if (this.document.removeEventListener) {
      this.document.removeEventListener('mousemove', this.onDocMouseTouchMove);
      this.document.removeEventListener('touchmove', this.onDocMouseTouchMove);

      this.document.removeEventListener('mouseup', this.onDocMouseTouchEnd);
      this.document.removeEventListener('touchend', this.onDocMouseTouchEnd);
      this.document.removeEventListener('touchcancel', this.onDocMouseTouchEnd);

      this.componentRef.removeEventListener('medialoaded', this.onMediaLoaded);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.crop !== this.props.crop && this.imageRef) {
      const { width, height } = this.imageRef;
      const crop = this.makeNewCrop();
      const resolvedCrop = resolveCrop(crop, width, height);

      if (crop !== resolvedCrop) {
        const pixelCrop = convertToPixelCrop(resolvedCrop, width, height);
        const percentCrop = convertToPercentCrop(resolvedCrop, width, height);
        this.props.onChange(pixelCrop, percentCrop);
        this.props.onComplete(pixelCrop, percentCrop);
      }
    }
  }

  onCropMouseTouchDown = (e) => {
    const { crop, disabled } = this.props;
    const { width, height } = this.mediaDimensions;
    const pixelCrop = convertToPixelCrop(crop, width, height);

    if (disabled) {
      return;
    }
    e.preventDefault(); // Stop drag selection.

    const clientPos = getClientPos(e);

    // Focus for detecting keypress.
    if (this.componentRef.setActive) {
      this.componentRef.setActive({ preventScroll: true }); // IE/Edge #289
    } else {
      this.componentRef.focus({ preventScroll: true }); // All other browsers
    }

    const { ord } = e.target.dataset;
    const xInversed = ord === 'nw' || ord === 'w' || ord === 'sw';
    const yInversed = ord === 'nw' || ord === 'n' || ord === 'ne';

    let cropOffset;

    if (pixelCrop.aspect) {
      cropOffset = this.getElementOffset(this.cropSelectRef);
    }

    this.evData = {
      clientStartX: clientPos.x,
      clientStartY: clientPos.y,
      cropStartWidth: pixelCrop.width,
      cropStartHeight: pixelCrop.height,
      cropStartX: xInversed ? pixelCrop.x + pixelCrop.width : pixelCrop.x,
      cropStartY: yInversed ? pixelCrop.y + pixelCrop.height : pixelCrop.y,
      xInversed,
      yInversed,
      xCrossOver: xInversed,
      yCrossOver: yInversed,
      startXCrossOver: xInversed,
      startYCrossOver: yInversed,
      isResize: e.target.dataset.ord,
      ord,
      cropOffset,
    };

    this.mouseDownOnCrop = true;
    this.setState({ cropIsActive: true });
  };

  onComponentMouseTouchDown = (e) => {
    const { crop, disabled, locked, keepSelection, onChange } = this.props;

    const componentEl = this.mediaWrapperRef.firstChild;

    if (e.target !== componentEl || !componentEl.contains(e.target)) {
      return;
    }

    if (disabled || locked || (keepSelection && isCropValid(crop))) {
      return;
    }

    e.preventDefault(); // Stop drag selection.

    const clientPos = getClientPos(e);

    // Focus for detecting keypress.
    if (this.componentRef.setActive) {
      this.componentRef.setActive({ preventScroll: true }); // IE/Edge #289
    } else {
      this.componentRef.focus({ preventScroll: true }); // All other browsers
    }

    const mediaOffset = this.getElementOffset(this.mediaWrapperRef);
    const x = clientPos.x - mediaOffset.left;
    const y = clientPos.y - mediaOffset.top;

    const nextCrop = {
      unit: 'px',
      aspect: crop ? crop.aspect : undefined,
      x,
      y,
      width: 0,
      height: 0,
    };

    this.evData = {
      clientStartX: clientPos.x,
      clientStartY: clientPos.y,
      cropStartWidth: nextCrop.width,
      cropStartHeight: nextCrop.height,
      cropStartX: nextCrop.x,
      cropStartY: nextCrop.y,
      xInversed: false,
      yInversed: false,
      xCrossOver: false,
      yCrossOver: false,
      startXCrossOver: false,
      startYCrossOver: false,
      isResize: true,
      ord: 'nw',
    };

    this.mouseDownOnCrop = true;

    const { width, height } = this.mediaDimensions;

    onChange(convertToPixelCrop(nextCrop, width, height), convertToPercentCrop(nextCrop, width, height));

    this.setState({ cropIsActive: true, newCropIsBeingDrawn: true });
  };

  onDocMouseTouchMove = (e) => {
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
      onDragStart(e);
    }

    const { evData } = this;
    const clientPos = getClientPos(e);

    if (evData.isResize && crop.aspect && evData.cropOffset) {
      clientPos.y = this.straightenYPath(clientPos.x);
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
      const { width, height } = this.mediaDimensions;
      onChange(convertToPixelCrop(nextCrop, width, height), convertToPercentCrop(nextCrop, width, height));
    }
  };

  onComponentKeyDown = (e) => {
    const { crop, disabled, onChange, onComplete } = this.props;

    if (disabled) {
      return;
    }

    const keyCode = e.key;
    let nudged = false;

    if (!isCropValid(crop)) {
      return;
    }

    const nextCrop = this.makeNewCrop();
    const nudgeStep = e.shiftKey ? ReactCrop.nudgeStepLarge : ReactCrop.nudgeStep;

    if (keyCode === 'ArrowLeft') {
      nextCrop.x -= nudgeStep;
      nudged = true;
    } else if (keyCode === 'ArrowRight') {
      nextCrop.x += nudgeStep;
      nudged = true;
    } else if (keyCode === 'ArrowUp') {
      nextCrop.y -= nudgeStep;
      nudged = true;
    } else if (keyCode === 'ArrowDown') {
      nextCrop.y += nudgeStep;
      nudged = true;
    }

    if (nudged) {
      e.preventDefault(); // Stop drag selection.
      const { width, height } = this.mediaDimensions;

      nextCrop.x = clamp(nextCrop.x, 0, width - nextCrop.width);
      nextCrop.y = clamp(nextCrop.y, 0, height - nextCrop.height);

      const pixelCrop = convertToPixelCrop(nextCrop, width, height);
      const percentCrop = convertToPercentCrop(nextCrop, width, height);

      onChange(pixelCrop, percentCrop);
      onComplete(pixelCrop, percentCrop);
    }
  };

  onDocMouseTouchEnd = (e) => {
    const { crop, disabled, onComplete, onDragEnd } = this.props;

    if (disabled) {
      return;
    }

    if (this.mouseDownOnCrop) {
      this.mouseDownOnCrop = false;
      this.dragStarted = false;

      const { width, height } = this.mediaDimensions;

      onDragEnd(e);
      onComplete(convertToPixelCrop(crop, width, height), convertToPercentCrop(crop, width, height));

      this.setState({ cropIsActive: false, newCropIsBeingDrawn: false });
    }
  };

  // When the image is loaded or when a custom component via `renderComponent` prop fires
  // a custom "medialoaded" event.
  createNewCrop() {
    const { width, height } = this.mediaDimensions;
    const crop = this.makeNewCrop();
    const resolvedCrop = resolveCrop(crop, width, height);
    const pixelCrop = convertToPixelCrop(resolvedCrop, width, height);
    const percentCrop = convertToPercentCrop(resolvedCrop, width, height);
    return { pixelCrop, percentCrop };
  }

  // Custom components (using `renderComponent`) should fire a custom event
  // called "medialoaded" when they are loaded.
  onMediaLoaded = () => {
    const { onComplete, onChange } = this.props;
    const { pixelCrop, percentCrop } = this.createNewCrop();
    onChange(pixelCrop, percentCrop);
    onComplete(pixelCrop, percentCrop);
  };

  onImageLoad(image) {
    const { onComplete, onChange, onImageLoaded } = this.props;

    // Return false from onImageLoaded if you set the crop with setState in there as otherwise
    // the subsequent onChange + onComplete will not have your updated crop.
    const res = onImageLoaded(image);

    if (res !== false) {
      const { pixelCrop, percentCrop } = this.createNewCrop();
      onChange(pixelCrop, percentCrop);
      onComplete(pixelCrop, percentCrop);
    }
  }

  get mediaDimensions() {
    const { clientWidth, clientHeight } = this.mediaWrapperRef;
    return { width: clientWidth, height: clientHeight };
  }

  getDocumentOffset() {
    const { clientTop = 0, clientLeft = 0 } = this.document.documentElement || {};
    return { clientTop, clientLeft };
  }

  getWindowOffset() {
    const { pageYOffset = 0, pageXOffset = 0 } = this.window;
    return { pageYOffset, pageXOffset };
  }

  getElementOffset(el) {
    const rect = el.getBoundingClientRect();
    const doc = this.getDocumentOffset();
    const win = this.getWindowOffset();

    const top = rect.top + win.pageYOffset - doc.clientTop;
    const left = rect.left + win.pageXOffset - doc.clientLeft;

    return { top, left };
  }

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
    const { crop, minWidth, maxWidth, minHeight, maxHeight } = this.props;
    const { evData } = this;
    const { width, height } = this.mediaDimensions;

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
    const { width, height } = this.mediaDimensions;

    nextCrop.x = clamp(evData.cropStartX + evData.xDiff, 0, width - nextCrop.width);
    nextCrop.y = clamp(evData.cropStartY + evData.yDiff, 0, height - nextCrop.height);

    return nextCrop;
  }

  resizeCrop() {
    const { evData } = this;
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
      // This not only removes the little "shake" when inverting at a diagonal, but for some
      // reason y was way off at fast speeds moving sw->ne with fixed aspect only, I couldn't
      // figure out why.
      if (evData.lastYCrossover === false) {
        newY = nextCrop.y - newSize.height;
      } else {
        newY = nextCrop.y + (nextCrop.height - newSize.height);
      }
    }

    const { width, height } = this.mediaDimensions;
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
    );

    // Apply x/y/width/height changes depending on ordinate (fixed aspect always applies both).
    if (nextCrop.aspect || ReactCrop.xyOrds.indexOf(ord) > -1) {
      nextCrop.x = containedCrop.x;
      nextCrop.y = containedCrop.y;
      nextCrop.width = containedCrop.width;
      nextCrop.height = containedCrop.height;
    } else if (ReactCrop.xOrds.indexOf(ord) > -1) {
      nextCrop.x = containedCrop.x;
      nextCrop.width = containedCrop.width;
    } else if (ReactCrop.yOrds.indexOf(ord) > -1) {
      nextCrop.y = containedCrop.y;
      nextCrop.height = containedCrop.height;
    }

    evData.lastYCrossover = evData.yCrossOver;
    this.crossOverCheck();

    return nextCrop;
  }

  straightenYPath(clientX) {
    const { evData } = this;
    const { ord } = evData;
    const { cropOffset, cropStartWidth, cropStartHeight } = evData;
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

  createCropSelection() {
    const { disabled, locked, renderSelectionAddon, ruleOfThirds } = this.props;
    const style = this.getCropStyle();

    return (
      <div
        ref={(r) => (this.cropSelectRef = r)}
        style={style}
        className="ReactCrop__crop-selection"
        onMouseDown={this.onCropMouseTouchDown}
        onTouchStart={this.onCropMouseTouchDown}
        tabIndex="0"
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
        {renderSelectionAddon && (
          <div className="ReactCrop__selection-addon" onMouseDown={(e) => e.stopPropagation()}>
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
    );
  }

  makeNewCrop(unit = 'px') {
    const crop = { ...ReactCrop.defaultCrop, ...this.props.crop };
    const { width, height } = this.mediaDimensions;

    return unit === 'px' ? convertToPixelCrop(crop, width, height) : convertToPercentCrop(crop, width, height);
  }

  crossOverCheck() {
    const { evData } = this;
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

    const swapXOrd = evData.xCrossOver !== evData.startXCrossOver;
    const swapYOrd = evData.yCrossOver !== evData.startYCrossOver;

    evData.inversedXOrd = swapXOrd ? inverseOrd(evData.ord) : false;
    evData.inversedYOrd = swapYOrd ? inverseOrd(evData.ord) : false;
  }

  render() {
    const {
      children,
      circularCrop,
      className,
      crossorigin,
      crop,
      disabled,
      locked,
      imageAlt,
      onImageError,
      renderComponent,
      src,
      style,
      imageStyle,
      ruleOfThirds,
    } = this.props;

    const { cropIsActive, newCropIsBeingDrawn } = this.state;
    const cropSelection = isCropValid(crop) && this.componentRef ? this.createCropSelection() : null;

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
        ref={(n) => {
          this.componentRef = n;
        }}
        className={componentClasses}
        style={style}
        onTouchStart={this.onComponentMouseTouchDown}
        onMouseDown={this.onComponentMouseTouchDown}
        tabIndex="0"
        onKeyDown={this.onComponentKeyDown}
      >
        <div
          ref={(n) => {
            this.mediaWrapperRef = n;
          }}
        >
          {renderComponent || (
            <img
              ref={(r) => (this.imageRef = r)}
              crossOrigin={crossorigin}
              className="ReactCrop__image"
              style={imageStyle}
              src={src}
              onLoad={(e) => this.onImageLoad(e.target)}
              onError={onImageError}
              alt={imageAlt}
            />
          )}
        </div>
        {children}
        {cropSelection}
      </div>
    );
  }
}

ReactCrop.xOrds = ['e', 'w'];
ReactCrop.yOrds = ['n', 's'];
ReactCrop.xyOrds = ['nw', 'ne', 'se', 'sw'];

ReactCrop.nudgeStep = 0.2;
ReactCrop.nudgeStepLarge = 2;

ReactCrop.defaultCrop = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  unit: 'px',
};

ReactCrop.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  circularCrop: PropTypes.bool,
  crop: PropTypes.shape({
    aspect: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    unit: PropTypes.oneOf(['px', '%']),
  }),
  crossorigin: PropTypes.string,
  disabled: PropTypes.bool,
  locked: PropTypes.bool,
  imageAlt: PropTypes.string,
  imageStyle: PropTypes.shape({}),
  keepSelection: PropTypes.bool,
  minWidth: PropTypes.number,
  minHeight: PropTypes.number,
  maxWidth: PropTypes.number,
  maxHeight: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onImageError: PropTypes.func,
  onComplete: PropTypes.func,
  onImageLoaded: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func,
  src: PropTypes.string.isRequired,
  style: PropTypes.shape({}),
  renderComponent: PropTypes.node,
  renderSelectionAddon: PropTypes.func,
  ruleOfThirds: PropTypes.bool,
};

ReactCrop.defaultProps = {
  circularCrop: false,
  className: undefined,
  crop: undefined,
  crossorigin: undefined,
  disabled: false,
  locked: false,
  imageAlt: '',
  maxWidth: undefined,
  maxHeight: undefined,
  minWidth: 0,
  minHeight: 0,
  keepSelection: false,
  onComplete: () => {},
  onImageError: () => {},
  onImageLoaded: () => {},
  onDragStart: () => {},
  onDragEnd: () => {},
  children: undefined,
  style: undefined,
  renderComponent: undefined,
  imageStyle: undefined,
  renderSelectionAddon: undefined,
  ruleOfThirds: false,
};

export { ReactCrop as default, ReactCrop as Component, makeAspectCrop, containCrop };
