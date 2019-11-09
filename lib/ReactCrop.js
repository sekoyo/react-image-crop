import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import image from './image.png';

const StyledReactCrop = styled.div(
  {
    position: 'relative',
    display: 'inline-block',
    cursor: 'crosshair',
    overflow: 'hidden',
    maxWidth: '100%',
    backgroundColor: '#000',

    '&:focus': {
      outline: 'none',
    },
  },
  ({ disabled, locked }) => {
    if (disabled || locked) {
      return { cursor: 'inherit' };
    }
    return undefined;
  }
);

const ReactCropImage = styled.img(
  {
    display: 'block',
    maxWidth: '100%',
    touchAction: 'manipulation',
  },
  ({ cropInvisible }) => {
    if (cropInvisible) {
      return {
        opacity: 0.5,
      };
    }
    return undefined;
  }
);

const ReactCropSelection = styled.div(
  {
    position: 'absolute',
    top: '0',
    left: '0',
    transform: 'translate3d(0, 0, 0)',
    boxSizing: 'border-box',
    cursor: 'move',
    boxShadow: '0 0 0 9999em rgba(0, 0, 0, 0.5)',
    touchAction: 'manipulation',
    border: '1px solid',
    borderImageSlice: '1',
    borderImageRepeat: 'repeat',
    borderImageSource: `url(${image})`,
  },
  ({ disabled, circularCrop }) => {
    if (disabled) {
      return {
        cursor: 'inherit',
      };
    }

    if (circularCrop) {
      return {
        borderRadius: '50%',
        boxShadow: '0px 0px 1px 1px white, 0 0 0 9999em rgba(0, 0, 0, 0.5)',
      };
    }
  }
);

// TODO:: make this varable overridable.
const dragHandleWidth = 10;
const dragHandleHeight = 10;
const dragBarSize = 6;

// Handle color/border.
const dragHandleBackgroundColour = 'rgba(0, 0, 0, 0.2)';
const dragHandleBorder = '1px solid rgba(255, 255, 255, 0.7)';

const dragHandleMobileWidth = '34px';
const dragHandleMobileHeight = '34px';
const mobileMediaQuery = '@media (pointer: coarse)';
const DragHandle = styled.div(
  {
    position: 'absolute',
    width: dragHandleWidth,
    height: dragHandleHeight,
    backgroundColor: dragHandleBackgroundColour,
    border: dragHandleBorder,
    boxSizing: 'border-box',

    // This stops the borders disappearing when keyboard
    // nudging.
    outline: '1px solid transparent',

    [mobileMediaQuery]: {
      width: dragHandleMobileWidth,
      height: dragHandleMobileHeight,
    },
  },
  ({ location, disabled, newCrop }) => {
    if (disabled) {
      return {
        cursor: 'inherit',
      };
    }

    if (newCrop) {
      return {
        display: 'none',
      };
    }

    const marginTopBottom = Math.ceil(dragHandleWidth / 2);
    const marginLeftRight = Math.ceil(dragHandleHeight / 2);
    switch (location) {
      case 'nw':
        return {
          top: 0,
          left: 0,
          marginTop: `-${marginTopBottom}px`,
          marginLeft: `-${marginLeftRight}px`,
          cursor: 'nw-resize',

          [mobileMediaQuery]: {
            display: 'none',
          },
        };
      case 'n':
        return {
          top: 0,
          left: '50%',
          marginTop: `-${marginTopBottom}px`,
          marginLeft: `-${marginLeftRight}px`,
          cursor: 'n-resize',

          [mobileMediaQuery]: {
            display: 'none',
          },
        };
      case 'ne':
        return {
          top: 0,
          right: 0,
          marginTop: `-${marginTopBottom}px`,
          marginRight: `-${marginLeftRight}px`,
          cursor: 'ne-resize',

          [mobileMediaQuery]: {
            display: 'none',
          },
        };
      case 'e':
        return {
          top: '50%',
          right: 0,
          marginTop: `-${marginTopBottom}px`,
          marginRight: `-${marginLeftRight}px`,
          cursor: 'e-resize',

          [mobileMediaQuery]: {
            display: 'none',
          },
        };
      case 'se':
        return {
          bottom: 0,
          right: 0,
          marginBottom: `-${marginTopBottom}px`,
          marginRight: `-${marginLeftRight}px`,
          cursor: 'se-resize',

          [mobileMediaQuery]: {
            marginBottom: '-1px',
            marginRight: '-1px',
          },
        };
      case 's':
        return {
          bottom: 0,
          left: '50%',
          marginBottom: `-${marginTopBottom}px`,
          marginLeft: `-${marginLeftRight}px`,
          cursor: 's-resize',

          [mobileMediaQuery]: {
            display: 'none',
          },
        };
      case 'sw':
        return {
          bottom: 0,
          left: 0,
          marginBottom: `-${marginTopBottom}px`,
          marginLeft: `-${marginLeftRight}px`,
          cursor: 'sw-resize',

          [mobileMediaQuery]: {
            display: 'none',
          },
        };
      case 'w':
        return {
          top: '50%',
          left: 0,
          marginTop: `-${marginTopBottom}px`,
          marginLeft: `-${marginLeftRight}px`,
          cursor: 'w-resize',

          [mobileMediaQuery]: {
            display: 'none',
          },
        };
      default:
        return undefined;
    }
  }
);

const RuleOfThirdsHZ = styled.div({
  '&::before, &::after': {
    width: '100%',
    height: 1,
    content: '""',
    display: 'block',
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },

  '&::before': {
    top: '33.3333%',
    top: 'calc(100% / 3)',
  },

  '&::after ': {
    top: '66.6666%',
    top: 'calc(100% / 3 * 2)',
  },
});

const RuleOfThirdsVT = styled.div({
  '&::before, &::after': {
    width: 1,
    height: '100%',
    content: '""',
    display: 'block',
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },

  '&::before': {
    left: '33.3333%',
    left: 'calc(100% / 3)',
  },

  '&::after ': {
    left: '66.6666%',
    left: 'calc(100% / 3 * 2)',
  },
});

const DragBar = styled.div(
  {
    position: 'absolute',

    [mobileMediaQuery]: {
      display: 'none',
    },
  },
  ({ location, fixedAspect, newCrop }) => {
    if (fixedAspect || newCrop) {
      return {
        display: 'none',
      };
    }
    switch (location) {
      case 'n':
        return {
          top: 0,
          left: 0,
          width: '100%',
          height: dragBarSize,
          marginTop: `-${dragBarSize / 2}px`,
        };

      case 'e':
        return {
          right: 0,
          top: 0,
          width: dragBarSize,
          height: '100%',
          marginRight: `-${dragBarSize / 2}px`,
        };
      case 's':
        return {
          bottom: 0,
          left: 0,
          width: '100%',
          height: dragBarSize,
          marginBottom: `-${dragBarSize / 2}px`,
        };
      case 'w':
        return {
          top: 0,
          left: 0,
          width: dragBarSize,
          height: '100%',
          marginLeft: `-${dragBarSize / 2}px`,
        };
      default:
        return undefined;
    }
  }
);

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
  return crop && crop.width && crop.height && !isNaN(crop.width) && !isNaN(crop.height);
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

  if (crop.y + crop.height > imageHeight || crop.x + crop.width > imageWidth) {
    return true;
  }

  // Allow a 1px tolerance due to %->px rounding.
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
  const widthOverflows = pixelCrop.x + pixelCrop.width > imageWidth;
  const heightOverflows = pixelCrop.y + pixelCrop.height > imageHeight;

  if (widthOverflows && heightOverflows) {
    fixedCrop = {
      unit: 'px',
      x: 0,
      y: 0,
      width: imageWidth > pixelCrop.width ? pixelCrop.width : imageWidth,
      height: imageHeight > pixelCrop.height ? pixelCrop.height : imageHeight,
    };
  } else if (widthOverflows) {
    fixedCrop = {
      ...pixelCrop,
      x: 0,
      width: imageWidth > pixelCrop.width ? pixelCrop.width : imageWidth,
    };
  } else if (heightOverflows) {
    fixedCrop = {
      ...pixelCrop,
      y: 0,
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
    }
  }

  componentWillUnmount() {
    if (this.document.removeEventListener) {
      this.document.removeEventListener('mousemove', this.onDocMouseTouchMove);
      this.document.removeEventListener('touchmove', this.onDocMouseTouchMove);

      this.document.removeEventListener('mouseup', this.onDocMouseTouchEnd);
      this.document.removeEventListener('touchend', this.onDocMouseTouchEnd);
      this.document.removeEventListener('touchcancel', this.onDocMouseTouchEnd);
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

  onCropMouseTouchDown = e => {
    const { crop, disabled } = this.props;
    const { width, height } = this.componentDimensions;
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

  onComponentMouseTouchDown = e => {
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

    const imageOffset = this.getElementOffset(this.componentRef);
    const x = clientPos.x - imageOffset.left;
    const y = clientPos.y - imageOffset.top;

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

    const { width, height } = this.componentDimensions;

    onChange(convertToPixelCrop(nextCrop, width, height), convertToPercentCrop(nextCrop, width, height));

    this.setState({ cropIsActive: true, newCropIsBeingDrawn: true });
  };

  onDocMouseTouchMove = e => {
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
      const { width, height } = this.componentDimensions;
      onChange(convertToPixelCrop(nextCrop, width, height), convertToPercentCrop(nextCrop, width, height));
    }
  };

  onComponentKeyDown = e => {
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
      const { width, height } = this.componentDimensions;

      nextCrop.x = clamp(nextCrop.x, 0, width - nextCrop.width);
      nextCrop.y = clamp(nextCrop.y, 0, height - nextCrop.height);

      const pixelCrop = convertToPixelCrop(nextCrop, width, height);
      const percentCrop = convertToPercentCrop(nextCrop, width, height);

      onChange(pixelCrop, percentCrop);
      onComplete(pixelCrop, percentCrop);
    }
  };

  onDocMouseTouchEnd = e => {
    const { crop, disabled, onComplete, onDragEnd } = this.props;

    if (disabled) {
      return;
    }

    if (this.mouseDownOnCrop) {
      this.mouseDownOnCrop = false;
      this.dragStarted = false;

      const { width, height } = this.componentDimensions;

      onDragEnd(e);
      onComplete(convertToPixelCrop(crop, width, height), convertToPercentCrop(crop, width, height));

      this.setState({ cropIsActive: false, newCropIsBeingDrawn: false });
    }
  };

  onImageLoad(image) {
    const { onComplete, onChange, onImageLoaded } = this.props;

    const crop = this.makeNewCrop();
    const resolvedCrop = resolveCrop(crop, image.width, image.height);

    // Return false from onImageLoaded if you set the crop with setState in there as otherwise
    // the subsequent onChange + onComplete will not have your updated crop.
    const res = onImageLoaded(image);

    if (res !== false) {
      const pixelCrop = convertToPixelCrop(resolvedCrop, image.width, image.height);
      const percentCrop = convertToPercentCrop(resolvedCrop, image.width, image.height);
      onChange(pixelCrop, percentCrop);
      onComplete(pixelCrop, percentCrop);
    }
  }

  get componentDimensions() {
    const { clientWidth, clientHeight } = this.componentRef;
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
    const { width, height } = this.componentDimensions;

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
    const { width, height } = this.componentDimensions;

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

    const { width, height } = this.componentDimensions;
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
    const { crop, disabled, locked, renderSelectionAddon, ruleOfThirds, circularCrop } = this.props;
    const style = this.getCropStyle();
    const { newCropIsBeingDrawn: newCrop } = this.state;
    const fixedAspect = crop && crop.aspect;

    return (
      <ReactCropSelection
        disabled={disabled}
        circularCrop={circularCrop}
        ref={r => (this.cropSelectRef = r)}
        style={style}
        onMouseDown={this.onCropMouseTouchDown}
        onTouchStart={this.onCropMouseTouchDown}
        tabIndex="0"
      >
        {!disabled && !locked && (
          <div>
            <DragBar newCrop={newCrop} fixedAspect={fixedAspect} location="n" data-ord="n" />
            <DragBar newCrop={newCrop} fixedAspect={fixedAspect} location="e" data-ord="e" />
            <DragBar newCrop={newCrop} fixedAspect={fixedAspect} location="s" data-ord="s" />
            <DragBar newCrop={newCrop} fixedAspect={fixedAspect} location="w" data-ord="w" />

            <DragHandle newCrop={newCrop} fixedAspect={fixedAspect} disabled={disabled} location="nw" data-ord="nw" />
            <DragHandle newCrop={newCrop} fixedAspect={fixedAspect} disabled={disabled} location="n" data-ord="n" />
            <DragHandle newCrop={newCrop} fixedAspect={fixedAspect} disabled={disabled} location="ne" data-ord="ne" />
            <DragHandle newCrop={newCrop} fixedAspect={fixedAspect} disabled={disabled} location="e" data-ord="e" />
            <DragHandle newCrop={newCrop} fixedAspect={fixedAspect} disabled={disabled} location="se" data-ord="se" />
            <DragHandle newCrop={newCrop} fixedAspect={fixedAspect} disabled={disabled} location="s" data-ord="s" />
            <DragHandle newCrop={newCrop} fixedAspect={fixedAspect} disabled={disabled} location="sw" data-ord="sw" />
            <DragHandle newCrop={newCrop} fixedAspect={fixedAspect} disabled={disabled} location="w" data-ord="w" />
          </div>
        )}
        {renderSelectionAddon && renderSelectionAddon(this.state)}
        {ruleOfThirds && (
          <>
            <RuleOfThirdsHZ />
            <RuleOfThirdsVT />
          </>
        )}
      </ReactCropSelection>
    );
  }

  makeNewCrop(unit = 'px') {
    const crop = { ...ReactCrop.defaultCrop, ...this.props.crop };
    const { width, height } = this.componentDimensions;

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

    const cropInvisible = crop && cropIsActive && (!crop.width || !crop.height);

    return (
      <StyledReactCrop
        disabled={disabled}
        locked={locked}
        ref={n => {
          this.componentRef = n;
        }}
        style={style}
        onTouchStart={this.onComponentMouseTouchDown}
        onMouseDown={this.onComponentMouseTouchDown}
        tabIndex="0"
        onKeyDown={this.onComponentKeyDown}
      >
        <div
          ref={n => {
            this.mediaWrapperRef = n;
          }}
        >
          {renderComponent || (
            <ReactCropImage
              cropInvisible={cropInvisible}
              ref={r => (this.imageRef = r)}
              crossOrigin={crossorigin}
              style={imageStyle}
              src={src}
              onLoad={e => this.onImageLoad(e.target)}
              onError={onImageError}
              alt={imageAlt}
            />
          )}
        </div>
        {children}
        {cropSelection}
      </StyledReactCrop>
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
