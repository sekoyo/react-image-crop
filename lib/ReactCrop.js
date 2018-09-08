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

function getElementOffset(el) {
  const rect = el.getBoundingClientRect();
  const docEl = document.documentElement;

  const rectTop = (rect.top + window.pageYOffset) - docEl.clientTop;
  const rectLeft = (rect.left + window.pageXOffset) - docEl.clientLeft;

  return {
    top: rectTop,
    left: rectLeft,
  };
}

function getClientPos(e) {
  let pageX;
  let pageY;

  if (e.touches) {
    pageX = e.touches[0].pageX;
    pageY = e.touches[0].pageY;
  } else {
    pageX = e.pageX;
    pageY = e.pageY;
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
  return crop && crop.width && crop.height;
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

function makeAspectCrop(crop, imageAspect) {
  if (isNaN(crop.aspect) || isNaN(imageAspect)) {
    console.warn('`crop.aspect` and `imageAspect` need to be numbers in order to make an aspect crop');
    return crop;
  }
  
  const completeCrop = { ...crop };

  if (crop.width) {
    completeCrop.height = (crop.width / crop.aspect) * imageAspect;
  }
  if (crop.height) {
    completeCrop.width = (completeCrop.height || crop.height) * (crop.aspect / imageAspect);
  }

  if (crop.y + (completeCrop.height || crop.height) > 100) {
    completeCrop.height = 100 - crop.y;
    completeCrop.width = (completeCrop.height * crop.aspect) / imageAspect;
  }

  if (crop.x + (completeCrop.width || crop.width) > 100) {
    completeCrop.width = 100 - crop.x;
    completeCrop.height = (completeCrop.width / crop.aspect) * imageAspect;
  }

  return completeCrop;
}

function getPixelCrop(image, percentCrop) {
  const x = Math.round(image.naturalWidth * (percentCrop.x / 100));
  const y = Math.round(image.naturalHeight * (percentCrop.y / 100));
  const width = Math.round(image.naturalWidth * (percentCrop.width / 100));
  const height = Math.round(image.naturalHeight * (percentCrop.height / 100));

  return {
    x,
    y,
    // Clamp width and height so rounding doesn't cause the crop to exceed bounds.
    width: clamp(width, 0, image.naturalWidth - x),
    height: clamp(height, 0, image.naturalHeight - y),
  };
}

function containCrop(crop, imageAspect) {
  const contained = { ...crop };

  // Don't let the crop grow on the opposite side when hitting an x image boundary.
  let cropXAdjusted = false;
  if (contained.x + contained.width > 100) {
    contained.width = crop.width + (100 - (crop.x + crop.width));
    contained.x = crop.x + (100 - (crop.x + contained.width));
    cropXAdjusted = true;
  } else if (contained.x < 0) {
    contained.width = crop.x + crop.width;
    contained.x = 0;
    cropXAdjusted = true;
  }

  if (cropXAdjusted && crop.aspect) {
    // Adjust height to the resized width to maintain aspect.
    contained.height = (contained.width / crop.aspect) * imageAspect;
    // If sizing in up direction we need to pin Y at the point it
    // would be at the boundary.
    if (contained.y < crop.y) {
      contained.y = crop.y + (crop.height - contained.height);
    }
  }

  // Don't let the crop grow on the opposite side when hitting a y image boundary.
  let cropYAdjusted = false;
  if (contained.y + contained.height > 100) {
    contained.height = crop.height + (100 - (crop.y + crop.height));
    contained.y = crop.y + (100 - (crop.y + contained.height));
    cropYAdjusted = true;
  } else if (contained.y < 0) {
    contained.height = crop.y + crop.height;
    contained.y = 0;
    cropYAdjusted = true;
  }

  if (cropYAdjusted && crop.aspect) {
    // Adjust width to the resized height to maintain aspect.
    contained.width = (contained.height * crop.aspect) / imageAspect;
    // If sizing in up direction we need to pin X at the point it
    // would be at the boundary.
    if (contained.x < crop.x) {
      contained.x = crop.x + (crop.width - contained.width);
    }
  }

  return contained;
}

class ReactCrop extends PureComponent {
  state = {}

  componentDidMount() {
    const options = passiveSupported ? { passive: false } : false;

    document.addEventListener('mousemove', this.onDocMouseTouchMove, options);
    document.addEventListener('touchmove', this.onDocMouseTouchMove, options);

    document.addEventListener('mouseup', this.onDocMouseTouchEnd, options);
    document.addEventListener('touchend', this.onDocMouseTouchEnd, options);
    document.addEventListener('touchcancel', this.onDocMouseTouchEnd, options);

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
    document.removeEventListener('mousemove', this.onDocMouseTouchMove);
    document.removeEventListener('touchmove', this.onDocMouseTouchMove);

    document.removeEventListener('mouseup', this.onDocMouseTouchEnd);
    document.removeEventListener('touchend', this.onDocMouseTouchEnd);
    document.removeEventListener('touchcancel', this.onDocMouseTouchEnd);
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
      cropOffset = getElementOffset(this.cropSelectRef);
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
      isResize: e.target !== this.cropSelectRef,
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
      keepSelection,
      onChange,
    } = this.props;

    if (e.target !== this.imageRef) {
      return;
    }

    if (disabled || (keepSelection && isCropValid(crop))) {
      return;
    }

    e.preventDefault(); // Stop drag selection.

    const clientPos = getClientPos(e);

    // Focus for detecting keypress.
    this.componentRef.focus({ preventScroll: true });

    const imageOffset = getElementOffset(this.imageRef);
    const xPc = ((clientPos.x - imageOffset.left) / this.imageRef.width) * 100;
    const yPc = ((clientPos.y - imageOffset.top) / this.imageRef.height) * 100;

    const nextCrop = {
      aspect: crop ? crop.aspect : undefined,
      x: xPc,
      y: yPc,
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
    onChange(nextCrop, getPixelCrop(this.imageRef, nextCrop));
    this.setState({ cropIsActive: true });
  }

  onDocMouseTouchMove = (e) => {
    const {
      crop,
      disabled,
      onChange,
      onDragStart,
    } = this.props;

    onDragStart();

    if (disabled) {
      return;
    }

    if (!this.mouseDownOnCrop) {
      return;
    }

    e.preventDefault(); // Stop drag selection.

    const { evData } = this;
    const clientPos = getClientPos(e);

    if (evData.isResize && crop.aspect && evData.cropOffset) {
      clientPos.y = this.straightenYPath(clientPos.x);
    }

    const xDiffPx = clientPos.x - evData.clientStartX;
    evData.xDiffPc = (xDiffPx / this.imageRef.width) * 100;

    const yDiffPx = clientPos.y - evData.clientStartY;
    evData.yDiffPc = (yDiffPx / this.imageRef.height) * 100;

    let nextCrop;

    if (evData.isResize) {
      nextCrop = this.resizeCrop();
    } else {
      nextCrop = this.dragCrop();
    }

    onChange(nextCrop, getPixelCrop(this.imageRef, nextCrop));
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
      nextCrop.x = clamp(nextCrop.x, 0, 100 - nextCrop.width);
      nextCrop.y = clamp(nextCrop.y, 0, 100 - nextCrop.height);

      onChange(nextCrop, getPixelCrop(this.imageRef, nextCrop));
      onComplete(nextCrop, getPixelCrop(this.imageRef, nextCrop));
    }
  }

  onDocMouseTouchEnd = () => {
    const {
      crop,
      disabled,
      onComplete,
      onDragEnd,
    } = this.props;

    onDragEnd();

    if (disabled) {
      return;
    }

    if (this.mouseDownOnCrop) {
      this.mouseDownOnCrop = false;

      onComplete(crop, getPixelCrop(this.imageRef, crop));
      this.setState({ cropIsActive: false });
    }
  }

  onImageLoad(image) {
    this.props.onImageLoaded(image, getPixelCrop(image, this.props.crop));
  }

  getCropStyle() {
    const { crop } = this.props;
    return {
      top: `${crop.y}%`,
      left: `${crop.x}%`,
      width: `${crop.width}%`,
      height: `${crop.height}%`,
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
    const { evData } = this;
    const imageAspect = this.imageRef.width / this.imageRef.height;

    // New width.
    let newWidth = evData.cropStartWidth + evData.xDiffPc;

    if (evData.xCrossOver) {
      newWidth = Math.abs(newWidth);
    }

    newWidth = clamp(newWidth, minWidth, maxWidth);

    // New height.
    let newHeight;

    if (crop.aspect) {
      newHeight = (newWidth / crop.aspect) * imageAspect;
    } else {
      newHeight = evData.cropStartHeight + evData.yDiffPc;
    }

    if (evData.yCrossOver) {
      // Cap if polarity is inversed and the height fills the y space.
      newHeight = Math.min(Math.abs(newHeight), evData.cropStartY);
    }

    newHeight = clamp(newHeight, minHeight, maxHeight);

    if (crop.aspect) {
      newWidth = clamp((newHeight * crop.aspect) / imageAspect, 0, 100);
    }

    return {
      width: newWidth,
      height: newHeight,
    };
  }

  dragCrop() {
    const nextCrop = this.makeNewCrop();
    const { evData } = this;
    nextCrop.x = clamp(evData.cropStartX + evData.xDiffPc, 0, 100 - nextCrop.width);
    nextCrop.y = clamp(evData.cropStartY + evData.yDiffPc, 0, 100 - nextCrop.height);
    return nextCrop;
  }

  resizeCrop() {
    const nextCrop = this.makeNewCrop();
    const { evData } = this;
    const { ord } = evData;
    const imageAspect = this.imageRef.width / this.imageRef.height;

    // On the inverse change the diff so it's the same and
    // the same algo applies.
    if (evData.xInversed) {
      evData.xDiffPc -= evData.cropStartWidth * 2;
    }
    if (evData.yInversed) {
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

    const containedCrop = containCrop({
      x: newX,
      y: newY,
      width: newSize.width,
      height: newSize.height,
      aspect: nextCrop.aspect,
    }, imageAspect);

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
    const { cropOffset } = evData;
    const cropStartWidth = (evData.cropStartWidth / 100) * this.imageRef.width;
    const cropStartHeight = (evData.cropStartHeight / 100) * this.imageRef.height;
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
    const { disabled } = this.props;
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
        {!disabled &&
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
        }
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

    if ((!evData.xCrossOver && -Math.abs(evData.cropStartWidth) - evData.xDiffPc >= 0) ||
      (evData.xCrossOver && -Math.abs(evData.cropStartWidth) - evData.xDiffPc <= 0)) {
      evData.xCrossOver = !evData.xCrossOver;
    }

    if ((!evData.yCrossOver && -Math.abs(evData.cropStartHeight) - evData.yDiffPc >= 0) ||
      (evData.yCrossOver && -Math.abs(evData.cropStartHeight) - evData.yDiffPc <= 0)) {
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
        tabIndex="1"
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

        {cropSelection}

        {children}
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
};

ReactCrop.defaultProps = {
  className: undefined,
  crop: undefined,
  crossorigin: undefined,
  disabled: false,
  imageAlt: '',
  maxWidth: 100,
  maxHeight: 100,
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
};

module.exports = ReactCrop;
module.exports.getPixelCrop = getPixelCrop;
module.exports.makeAspectCrop = makeAspectCrop;
module.exports.containCrop = containCrop;
