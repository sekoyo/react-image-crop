/* globals document, window */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Feature detection
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Improving_scrolling_performance_with_passive_listeners
let passiveSupported = false;

try {
  window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
    get: () => { passiveSupported = true; return true; },
  }));
} catch (err) {} // eslint-disable-line no-empty

const EMPTY_GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

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
  return crop && crop.width && crop.height && !isNaN(crop.width) && !isNaN(crop.height);
}

function inverseOrd(ord) {
  let inversedOrd;

  if (ord === 'n') inversedOrd = 's';
  else if (ord === 'ne') inversedOrd = 'sw';
  else if (ord === 'e') inversedOrd = 'w';
  else if (ord === 'se') inversedOrd = 'nw';
  else if (ord === 's') inversedOrd = 'n';
  else if (ord === 'sw') inversedOrd = 'ne';
  else if (ord === 'w') inversedOrd = 'e';
  else if (ord === 'nw') inversedOrd = 'se';

  return inversedOrd;
}

function makeAspectCrop(crop, image) {
  if (isNaN(crop.aspect)) {
    console.warn('`crop.aspect` should be a number in order to make an aspect crop', crop);
    return crop;
  }

  const completeCrop = {
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

  if (completeCrop.y + completeCrop.height > image.height) {
    completeCrop.height = image.height - completeCrop.y;
    completeCrop.width = completeCrop.height * crop.aspect;
  }

  if (completeCrop.x + completeCrop.width > image.width) {
    completeCrop.width = image.width - completeCrop.x;
    completeCrop.height = completeCrop.width / crop.aspect;
  }

  return completeCrop;
}

function isAspectInvalid(crop, image) {
  if ((!crop.width && crop.height) || (crop.width && !crop.height)) {
    return true;
  }

  return (
    crop.width / crop.aspect !== crop.height ||
    crop.height * crop.aspect !== crop.width ||
    crop.y + crop.height > image.height ||
    crop.x + crop.width > image.width
  );
}

function resolveCrop(crop, image) {
  if (crop && crop.aspect && isAspectInvalid(crop, image)) {
    return makeAspectCrop(crop, image);
  }

  return crop;
}

function containCrop(prevCrop, crop, image) {
  const contained = { ...crop };

  // Non-aspects are simple
  if (!crop.aspect) {
    if (crop.x < 0) {
      contained.x = 0;
      contained.width += crop.x;
    } else if ((crop.x + crop.width) > image.width) {
      contained.width = (image.width - crop.x);
    }

    if ((crop.y + crop.height) > image.height) {
      contained.height = (image.height - crop.y);
    }

    return contained;
  }

  let widthAdjusted = false;

  if (crop.x < 0) {
    contained.x = 0;
    contained.width += crop.x;
    contained.height = contained.width / crop.aspect;
    widthAdjusted = true;
  } else if ((crop.x + crop.width) > image.width) {
    contained.width = (image.width - crop.x);
    contained.height = contained.width / crop.aspect;
    widthAdjusted = true;
  }

  // If sizing in up direction we need to pin Y at the point it
  // would be at the boundary.
  if (widthAdjusted && prevCrop.y > contained.y) {
    contained.y = crop.y + (crop.height - contained.height);
  }

  let heightAdjusted = false;

  if ((contained.y + contained.height) > image.height) {
    contained.height = (image.height - contained.y);
    contained.width = contained.height * contained.aspect;
    heightAdjusted = true;
  }

  // If sizing in left direction we need to pin X at the point it
  // would be at the boundary.
  if (heightAdjusted && prevCrop.x > contained.x) {
    contained.x = crop.x + (crop.width - contained.width);
  }

  return contained;
}

class ReactCrop extends PureComponent {
  window = window

  document = document

  state = {}

  componentDidMount() {
    const options = passiveSupported ? { passive: false } : false;

    this.document.addEventListener('mousemove', this.onDocMouseTouchMove, options);
    this.document.addEventListener('touchmove', this.onDocMouseTouchMove, options);

    this.document.addEventListener('mouseup', this.onDocMouseTouchEnd, options);
    this.document.addEventListener('touchend', this.onDocMouseTouchEnd, options);
    this.document.addEventListener('touchcancel', this.onDocMouseTouchEnd, options);

    if (this.imageRef.complete || this.imageRef.readyState) {
      if (this.imageRef.naturalWidth === 0) {
        // Broken load on iOS, PR #51
        // https://css-tricks.com/snippets/jquery/fixing-load-in-ie-for-cached-images/
        // http://stackoverflow.com/questions/821516/browser-independent-way-to-detect-when-image-has-been-loaded
        const { src } = this.imageRef;
        this.imageRef.src = EMPTY_GIF;
        this.imageRef.src = src;
      } else {
        this.onImageLoad(this.imageRef);
      }
    }
  }

  componentWillUnmount() {
    this.document.removeEventListener('mousemove', this.onDocMouseTouchMove);
    this.document.removeEventListener('touchmove', this.onDocMouseTouchMove);

    this.document.removeEventListener('mouseup', this.onDocMouseTouchEnd);
    this.document.removeEventListener('touchend', this.onDocMouseTouchEnd);
    this.document.removeEventListener('touchcancel', this.onDocMouseTouchEnd);
  }

  onCropMouseTouchDown = (e) => {
    const { crop, disabled } = this.props;

    if (disabled) {
      return;
    }

    e.preventDefault(); // Stop drag selection.

    const clientPos = getClientPos(e);

    // Focus for detecting keypress.
    this.componentRef.focus({ preventScroll: true });

    const { ord } = e.target.dataset;
    const xInversed = ord === 'nw' || ord === 'w' || ord === 'sw';
    const yInversed = ord === 'nw' || ord === 'n' || ord === 'ne';

    let cropOffset;

    if (crop.aspect) {
      cropOffset = this.getElementOffset(this.cropSelectRef);
    }

    this.evData = {
      clientStartX: clientPos.x,
      clientStartY: clientPos.y,
      cropStartWidth: crop.width,
      cropStartHeight: crop.height,
      cropStartX: xInversed ? (crop.x + crop.width) : crop.x,
      cropStartY: yInversed ? (crop.y + crop.height) : crop.y,
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
  }

  onComponentMouseTouchDown = (e) => {
    const {
      crop,
      disabled,
      locked,
      keepSelection,
      onChange,
    } = this.props;

    if (e.target !== this.imageRef) {
      return;
    }

    if (disabled || locked || (keepSelection && isCropValid(crop))) {
      return;
    }

    e.preventDefault(); // Stop drag selection.

    const clientPos = getClientPos(e);

    // Focus for detecting keypress.
    this.componentRef.focus({ preventScroll: true });

    const imageOffset = this.getElementOffset(this.imageRef);
    const x = clientPos.x - imageOffset.left;
    const y = clientPos.y - imageOffset.top;

    const nextCrop = {
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
    onChange(nextCrop);
    this.setState({ cropIsActive: true });
  }

  onDocMouseTouchMove = (e) => {
    const {
      crop,
      disabled,
      onChange,
      onDragStart,
    } = this.props;

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
      onChange(nextCrop);
    }
  }

  onComponentKeyDown = (e) => {
    const {
      crop,
      disabled,
      onChange,
      onComplete,
    } = this.props;

    if (disabled) {
      return;
    }

    const keyCode = e.which;
    let nudged = false;

    if (!isCropValid(crop)) {
      return;
    }

    const nextCrop = this.makeNewCrop();

    if (keyCode === ReactCrop.arrowKey.left) {
      nextCrop.x -= ReactCrop.nudgeStep;
      nudged = true;
    } else if (keyCode === ReactCrop.arrowKey.right) {
      nextCrop.x += ReactCrop.nudgeStep;
      nudged = true;
    } else if (keyCode === ReactCrop.arrowKey.up) {
      nextCrop.y -= ReactCrop.nudgeStep;
      nudged = true;
    } else if (keyCode === ReactCrop.arrowKey.down) {
      nextCrop.y += ReactCrop.nudgeStep;
      nudged = true;
    }

    if (nudged) {
      e.preventDefault(); // Stop drag selection.
      nextCrop.x = clamp(nextCrop.x, 0, this.imageRef.width - nextCrop.width);
      nextCrop.y = clamp(nextCrop.y, 0, this.imageRef.height - nextCrop.height);

      onChange(nextCrop);
      onComplete(nextCrop);
    }
  }

  onDocMouseTouchEnd = (e) => {
    const {
      crop,
      disabled,
      onComplete,
      onDragEnd,
    } = this.props;

    if (disabled) {
      return;
    }

    if (this.mouseDownOnCrop) {
      this.mouseDownOnCrop = false;
      this.dragStarted = false;
      onDragEnd(e);
      onComplete(crop);
      this.setState({ cropIsActive: false });
    }
  }

  onImageLoad(image) {
    const {
      crop,
      onComplete,
      onChange,
      onImageLoaded,
    } = this.props;

    const resolvedCrop = resolveCrop(crop, image);

    // Return false from onImageLoaded if you set the crop with setState in there as otherwise the subsequent
    // onChange + onComplete will not have your updated crop.
    const res = onImageLoaded(image);

    if (res !== false && resolvedCrop !== crop) {
      onChange(resolvedCrop);
      onComplete(resolvedCrop);
    }
  }

  getElementOffset(el) {
    const rect = el.getBoundingClientRect();
    const docEl = this.document.documentElement;

    const rectTop = (rect.top + this.window.pageYOffset) - docEl.clientTop;
    const rectLeft = (rect.left + this.window.pageXOffset) - docEl.clientLeft;

    return {
      top: rectTop,
      left: rectLeft,
    };
  }

  getCropStyle() {
    const { crop } = this.props;
    return {
      top: `${crop.y}px`,
      left: `${crop.x}px`,
      width: `${crop.width}px`,
      height: `${crop.height}px`,
    };
  }

  getNewSize() {
    const {
      crop,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
    } = this.props;
    const { evData, imageRef } = this;

    // New width.
    let newWidth = evData.cropStartWidth + evData.xDiff;

    if (evData.xCrossOver) {
      newWidth = Math.abs(newWidth);
    }

    newWidth = clamp(newWidth, minWidth, maxWidth || imageRef.width);

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

    newHeight = clamp(newHeight, minHeight, maxHeight || imageRef.height);

    if (crop.aspect) {
      newWidth = clamp(newHeight * crop.aspect, 0, this.imageRef.width);
    }

    return {
      width: newWidth,
      height: newHeight,
    };
  }

  dragCrop() {
    const nextCrop = this.makeNewCrop();
    const { evData } = this;
    nextCrop.x = clamp(evData.cropStartX + evData.xDiff, 0, this.imageRef.width - nextCrop.width);
    nextCrop.y = clamp(evData.cropStartY + evData.yDiff, 0, this.imageRef.height - nextCrop.height);
    return nextCrop;
  }

  resizeCrop() {
    const nextCrop = this.makeNewCrop();
    const { evData } = this;
    const { crop, minWidth, minHeight } = this.props;
    const { ord } = evData;

    // On the inverse change the diff so it's the same and
    // the same algo applies.
    if (evData.xInversed) {
      evData.xDiff -= evData.cropStartWidth * 2;
    }
    if (evData.yInversed) {
      evData.yDiff -= evData.cropStartHeight * 2;
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

    const containedCrop = containCrop(this.props.crop, {
      x: newX,
      y: newY,
      width: newSize.width,
      height: newSize.height,
      aspect: nextCrop.aspect,
    }, this.imageRef);

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

    // Ensure new dimensions aren't less than min dimensions.
    if (minWidth && nextCrop.width < minWidth) {
      return crop;
    }

    if (minHeight && nextCrop.height < minHeight) {
      return crop;
    }

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
      d = cropOffset.top - (cropOffset.left * k);
    } else {
      k = -cropStartHeight / cropStartWidth;
      d = cropOffset.top + (cropStartHeight - (cropOffset.left * k));
    }

    return (k * clientX) + d;
  }

  createCropSelection() {
    const { disabled, locked, renderSelectionAddon } = this.props;
    const style = this.getCropStyle();

    return (
      <div
        ref={(n) => { this.cropSelectRef = n; }}
        style={style}
        className="ReactCrop__crop-selection"
        onMouseDown={this.onCropMouseTouchDown}
        onTouchStart={this.onCropMouseTouchDown}
        role="presentation"
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
        {renderSelectionAddon && renderSelectionAddon(this.state)}
      </div>
    );
  }

  makeNewCrop() {
    return {
      ...ReactCrop.defaultCrop,
      ...this.props.crop,
    };
  }

  crossOverCheck() {
    const { evData } = this;

    if ((!evData.xCrossOver && -Math.abs(evData.cropStartWidth) - evData.xDiff >= 0) ||
      (evData.xCrossOver && -Math.abs(evData.cropStartWidth) - evData.xDiff <= 0)) {
      evData.xCrossOver = !evData.xCrossOver;
    }

    if ((!evData.yCrossOver && -Math.abs(evData.cropStartHeight) - evData.yDiff >= 0) ||
      (evData.yCrossOver && -Math.abs(evData.cropStartHeight) - evData.yDiff <= 0)) {
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
      className,
      crossorigin,
      crop,
      disabled,
      locked,
      imageAlt,
      onImageError,
      src,
      style,
      imageStyle,
    } = this.props;
    const { cropIsActive } = this.state;
    let cropSelection;

    if (isCropValid(crop)) {
      cropSelection = this.createCropSelection();
    }

    const componentClasses = ['ReactCrop'];

    if (cropIsActive) {
      componentClasses.push('ReactCrop--active');
    }

    if (crop) {
      if (crop.aspect) {
        componentClasses.push('ReactCrop--fixed-aspect');
      }

      // In this case we have to shadow the image, since the box-shadow
      // on the crop won't work.
      if (cropIsActive && (!crop.width || !crop.height)) {
        componentClasses.push('ReactCrop--crop-invisible');
      }
    }

    if (disabled) {
      componentClasses.push('ReactCrop--disabled');
    }

    if (locked) {
      componentClasses.push('ReactCrop--locked');
    }

    if (className) {
      componentClasses.push(...className.split(' '));
    }

    return (
      <div
        ref={(n) => { this.componentRef = n; }}
        className={componentClasses.join(' ')}
        style={style}
        onTouchStart={this.onComponentMouseTouchDown}
        onMouseDown={this.onComponentMouseTouchDown}
        role="presentation"
        tabIndex={1}
        onKeyDown={this.onComponentKeyDown}
      >
        <img
          ref={(n) => { this.imageRef = n; }}
          crossOrigin={crossorigin}
          className="ReactCrop__image"
          style={imageStyle}
          src={src}
          onLoad={e => this.onImageLoad(e.target)}
          onError={onImageError}
          alt={imageAlt}
        />
        {children}
        {cropSelection}
      </div>
    );
  }
}

ReactCrop.xOrds = ['e', 'w'];
ReactCrop.yOrds = ['n', 's'];
ReactCrop.xyOrds = ['nw', 'ne', 'se', 'sw'];

ReactCrop.arrowKey = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
};

ReactCrop.nudgeStep = 0.2;

ReactCrop.defaultCrop = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

ReactCrop.propTypes = {
  className: PropTypes.string,
  crossorigin: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  crop: PropTypes.shape({
    aspect: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
  }),
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
  renderSelectionAddon: PropTypes.func,
};

ReactCrop.defaultProps = {
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
  imageStyle: undefined,
  renderSelectionAddon: undefined,
};

export {
  ReactCrop as default,
  ReactCrop as Component,
  makeAspectCrop,
  containCrop,
};
