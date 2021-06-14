import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function isCropValid(crop) {
  return crop && !isNaN(crop.width) && !isNaN(crop.height);
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

function resolveCrop(pixelCrop, imageWidth, imageHeight) {
  if (pixelCrop.aspect && (!pixelCrop.width || !pixelCrop.height)) {
    return makeAspectCrop(pixelCrop, imageWidth, imageHeight);
  }

  return pixelCrop;
}

function containCrop(prevCrop, crop, imageWidth, imageHeight) {
  const pixelCrop = convertToPixelCrop(crop, imageWidth, imageHeight);
  const prevPixelCrop = convertToPixelCrop(prevCrop, imageWidth, imageHeight);
  const contained = { ...pixelCrop };

  // Non-aspects are simple.
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

  keysDown = new Set();

  componentDidMount() {
    if (this.componentRef.addEventListener) {
      this.componentRef.addEventListener('medialoaded', this.onMediaLoaded);
    }
  }

  componentWillUnmount() {
    if (this.componentRef.removeEventListener) {
      this.componentRef.removeEventListener('medialoaded', this.onMediaLoaded);
    }
  }

  componentDidUpdate(prevProps) {
    const { crop } = this.props;

    if (
      this.imageRef &&
      prevProps.crop !== crop &&
      crop.aspect &&
      ((crop.width && !crop.height) || (!crop.width && crop.height))
    ) {
      const { width, height } = this.mediaDimensions;
      const newCrop = this.makeNewCrop();
      const completedCrop = makeAspectCrop(newCrop, width, height);

      const pixelCrop = convertToPixelCrop(completedCrop, width, height);
      const percentCrop = convertToPercentCrop(completedCrop, width, height);
      this.props.onChange(pixelCrop, percentCrop);
      this.props.onComplete(pixelCrop, percentCrop);
    }
  }

  bindDocMove() {
    if (this.docMoveBound) {
      return;
    }

    this.document.addEventListener('pointermove', this.onDocPointerMove);
    this.document.addEventListener('pointerup', this.onDocPointerDone);
    this.document.addEventListener('pointercancel', this.onDocPointerDone);

    this.docMoveBound = true;
  }

  unbindDocMove() {
    if (!this.docMoveBound) {
      return;
    }

    this.document.removeEventListener('pointermove', this.onDocPointerMove);
    this.document.removeEventListener('pointerup', this.onDocPointerDone);
    this.document.removeEventListener('pointercancel', this.onDocPointerDone);

    this.docMoveBound = false;
  }

  onCropPointerDown = e => {
    const { crop, disabled } = this.props;
    const { width, height } = this.mediaDimensions;
    const pixelCrop = convertToPixelCrop(crop, width, height);

    if (disabled) {
      return;
    }

    if (e.cancelable) {
      e.preventDefault(); // Stop drag selection.
    }

    // Bind to doc to follow movements outside of element.
    this.bindDocMove();

    // Focus for detecting keypress.
    this.componentRef.focus({ preventScroll: true });

    const { ord } = e.target.dataset;
    const xInversed = ord === 'nw' || ord === 'w' || ord === 'sw';
    const yInversed = ord === 'nw' || ord === 'n' || ord === 'ne';

    this.evData = {
      clientStartX: e.clientX,
      clientStartY: e.clientY,
      cropStartWidth: pixelCrop.width,
      cropStartHeight: pixelCrop.height,
      cropStartX: pixelCrop.x,
      cropStartY: pixelCrop.y,
      xInversed,
      yInversed,
      xCrossOver: xInversed,
      yCrossOver: yInversed,
      xDiff: 0,
      yDiff: 0,
      isResize: Boolean(ord),
      ord,
    };

    this.mouseDownOnCrop = true;
    this.setState({ cropIsActive: true });
  };

  onComponentPointerDown = e => {
    const { crop, disabled, locked, keepSelection, onChange } = this.props;

    const componentEl = this.mediaWrapperRef.firstChild;

    // Ignore things inside renderSelectionAddon.
    if (e.target !== componentEl || !componentEl.contains(e.target)) {
      return;
    }

    if (disabled || locked || (keepSelection && isCropValid(crop))) {
      return;
    }

    if (e.cancelable) {
      e.preventDefault(); // Stop drag selection.
    }

    // Bind to doc to follow movements outside of element.
    this.bindDocMove();

    // Focus for detecting keypress.
    this.componentRef.focus({ preventScroll: true });

    const rect = this.mediaWrapperRef.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const nextCrop = {
      unit: 'px',
      aspect: crop ? crop.aspect : undefined,
      x,
      y,
      width: 0,
      height: 0,
    };

    this.evData = {
      clientStartX: e.clientX,
      clientStartY: e.clientY,
      cropStartWidth: nextCrop.width,
      cropStartHeight: nextCrop.height,
      cropStartX: nextCrop.x,
      cropStartY: nextCrop.y,
      xInversed: false,
      yInversed: false,
      xCrossOver: false,
      yCrossOver: false,
      xDiff: 0,
      yDiff: 0,
      isResize: true,
      ord: 'nw',
    };

    this.mouseDownOnCrop = true;

    const { width, height } = this.mediaDimensions;

    onChange(convertToPixelCrop(nextCrop, width, height), convertToPercentCrop(nextCrop, width, height));

    this.setState({ cropIsActive: true, newCropIsBeingDrawn: true });
  };

  onComponentKeyDown = e => {
    const { crop, disabled, onChange, onComplete } = this.props;

    if (disabled) {
      return;
    }

    this.keysDown.add(e.key);
    let nudged = false;

    if (!isCropValid(crop)) {
      return;
    }

    const nextCrop = this.makeNewCrop();
    const ctrlCmdPressed = navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey;
    const nudgeStep = ctrlCmdPressed
      ? ReactCrop.nudgeStepLarge
      : e.shiftKey
      ? ReactCrop.nudgeStepMedium
      : ReactCrop.nudgeStep;

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
      if (e.cancelable) {
        e.preventDefault(); // Stop drag selection.
      }
      const { width, height } = this.mediaDimensions;

      nextCrop.x = clamp(nextCrop.x, 0, width - nextCrop.width);
      nextCrop.y = clamp(nextCrop.y, 0, height - nextCrop.height);

      const pixelCrop = convertToPixelCrop(nextCrop, width, height);
      const percentCrop = convertToPercentCrop(nextCrop, width, height);

      onChange(pixelCrop, percentCrop);
      onComplete(pixelCrop, percentCrop);
    }
  };

  onDocPointerMove = e => {
    const { crop, disabled, onChange, onDragStart } = this.props;

    if (disabled) {
      return;
    }

    if (!this.mouseDownOnCrop) {
      return;
    }

    if (e.cancelable) {
      e.preventDefault(); // Stop drag selection.
    }

    if (!this.dragStarted) {
      this.dragStarted = true;
      onDragStart(e);
    }

    const { evData } = this;

    evData.xDiff = e.clientX - evData.clientStartX;
    evData.yDiff = e.clientY - evData.clientStartY;

    let nextCrop;

    if (evData.isResize) {
      let prevXInserve = evData.xInversed;
      let prevYInserve = evData.yInversed;

      this.crossOverCheck(e.clientX, e.clientY);

      nextCrop = this.resizeCrop();

      if (prevXInserve !== evData.xInversed) {
        console.log('PIN X');
        nextCrop.x = evData.cropStartX;
      }
      if (prevYInserve !== evData.yInversed) {
        console.log('PIN Y');
        nextCrop.y = evData.cropStartY;
      }
    } else {
      nextCrop = this.dragCrop();
    }

    if (nextCrop !== crop) {
      const { width, height } = this.mediaDimensions;
      onChange(convertToPixelCrop(nextCrop, width, height), convertToPercentCrop(nextCrop, width, height));
    }
  };

  onComponentKeyUp = e => {
    this.keysDown.delete(e.key);
  };

  onDocPointerDone = e => {
    const { crop, disabled, onComplete, onDragEnd } = this.props;

    this.unbindDocMove();

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

  onImageLoad = event => {
    const { target: image } = event;

    const { onComplete, onChange, onImageLoaded } = this.props;

    // Return false from onImageLoaded if you set the crop with setState in there as otherwise
    // the subsequent onChange + onComplete will not have your updated crop.
    const res = onImageLoaded(image);

    if (res !== false) {
      const { pixelCrop, percentCrop } = this.createNewCrop();
      onChange(pixelCrop, percentCrop);
      onComplete(pixelCrop, percentCrop);
    }
  };

  get mediaDimensions() {
    const { clientWidth, clientHeight } = this.mediaWrapperRef;
    return { width: clientWidth, height: clientHeight };
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
    const { crop } = this.props;
    const { evData } = this;

    // New width.
    let newWidth;

    if (evData.xInversed) {
      // On an inverse point if xDiff is +0 then:
      //
      newWidth = evData.cropStartWidth + evData.xDiff;
    } else {
      newWidth = evData.cropStartWidth + Math.abs(evData.xDiff);
    }

    // New height.
    let newHeight;

    if (crop.aspect) {
      newHeight = newWidth / crop.aspect;
    } else {
      newHeight = evData.cropStartHeight + evData.yDiff;

      if (evData.yInversed) {
        newHeight = evData.cropStartHeight - evData.yDiff;
      } else {
        newHeight = evData.cropStartHeight + Math.abs(evData.yDiff);
      }
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

    const { width, height } = this.mediaDimensions;
    const nextCrop = this.makeNewCrop();
    const changeAll = nextCrop.aspect || ReactCrop.xyOrds.indexOf(evData.ord) > -1;

    const changeX = changeAll || ReactCrop.xOrds.indexOf(evData.ord) > -1;
    const changeY = changeAll || ReactCrop.yOrds.indexOf(evData.ord) > -1;

    if (changeAll || changeX) {
      if (!evData.xInversed) {
        nextCrop.width = evData.cropStartWidth + evData.xDiff;
      } else {
        nextCrop.x = evData.cropStartX + evData.xDiff;
        nextCrop.width = evData.cropStartWidth - evData.xDiff;
      }
    }

    if (changeAll || changeY) {
      if (nextCrop.aspect) {
        nextCrop.height = nextCrop.width / nextCrop.aspect;
      } else {
        if (!evData.yInversed) {
          nextCrop.height = evData.cropStartHeight + evData.yDiff;
        } else {
          nextCrop.height = evData.cropStartHeight - evData.yDiff;
          nextCrop.y = evData.cropStartY + evData.yDiff;
        }
      }
    }

    // Contain to bounds of the container.
    // nextCrop.x = clamp(nextCrop.x, 0, width);
    // nextCrop.y = clamp(nextCrop.y, 0, height);
    // nextCrop.width = clamp(nextCrop.width, 0, width - nextCrop.x);
    // nextCrop.height = clamp(nextCrop.height, 0, height - nextCrop.y);

    return nextCrop;
  }

  makeNewCrop(unit = 'px') {
    const crop = { ...ReactCrop.defaultCrop, ...(this.props.crop || {}) };
    const { width, height } = this.mediaDimensions;

    return unit === 'px' ? convertToPixelCrop(crop, width, height) : convertToPercentCrop(crop, width, height);
  }

  crossOverCheck(clientX, clientY) {
    const { evData } = this;
    const { minWidth, minHeight } = this.props;

    if (minWidth === 0) {
      if (evData.xInversed) {
        if (evData.cropStartWidth - evData.xDiff <= 0) {
          console.log('Cross X ->');
          evData.clientStartX = clientX;
          evData.cropStartX = evData.cropStartX + evData.cropStartWidth;
          evData.cropStartWidth = Math.abs(evData.cropStartWidth - evData.xDiff);
          evData.xDiff = clientX - evData.clientStartX;
          evData.xInversed = false;
        }
      } else if (evData.cropStartWidth + evData.xDiff <= 0) {
        console.log('Cross X <-');
        evData.clientStartX = clientX;
        evData.cropStartWidth = Math.abs(evData.cropStartWidth + evData.xDiff);
        evData.cropStartX = evData.cropStartX - evData.cropStartWidth;
        evData.xDiff = clientX - evData.clientStartX;
        evData.xInversed = true;
      }
    }

    if (minHeight === 0) {
      if (evData.yInversed) {
        if (evData.cropStartHeight - evData.yDiff <= 0) {
          console.log('Cross Y ->');
          evData.clientStartY = clientY;
          evData.cropStartY = evData.cropStartY + evData.cropStartHeight;
          evData.cropStartHeight = Math.abs(evData.cropStartHeight - evData.yDiff);
          evData.yDiff = clientY - evData.clientStartY;
          evData.yInversed = false;
        }
      } else if (evData.cropStartHeight + evData.yDiff <= 0) {
        console.log('Cross Y <-');
        evData.clientStartY = clientY;
        evData.cropStartHeight = Math.abs(evData.cropStartHeight + evData.yDiff);
        evData.cropStartY = evData.cropStartY - evData.cropStartHeight;
        evData.yDiff = clientY - evData.clientStartY;
        evData.yInversed = true;
      }
    }
  }

  bindComponentRef = ref => {
    this.componentRef = ref;
  };

  bindMediaWrapperRef = ref => {
    this.mediaWrapperRef = ref;
  };

  bindImageRef = ref => {
    this.imageRef = ref;
  };

  bindCropSelectionRef = ref => {
    this.cropSelectRef = ref;
  };

  createCropSelection() {
    const { disabled, locked, renderSelectionAddon, ruleOfThirds, crop } = this.props;
    const style = this.getCropStyle();

    return (
      <div
        ref={this.bindCropSelectionRef}
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
    );
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
        ref={this.bindComponentRef}
        className={componentClasses}
        style={style}
        onPointerDown={this.onComponentPointerDown}
        tabIndex={0}
        onKeyDown={this.onComponentKeyDown}
        onKeyUp={this.onComponentKeyUp}
      >
        <div ref={this.bindMediaWrapperRef}>
          {children}
          {renderComponent || (
            <img
              ref={this.bindImageRef}
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
        {cropSelection}
      </div>
    );
  }
}

ReactCrop.xOrds = ['e', 'w'];
ReactCrop.yOrds = ['n', 's'];
ReactCrop.xyOrds = ['nw', 'ne', 'se', 'sw'];

ReactCrop.nudgeStep = 1;
ReactCrop.nudgeStepMedium = 10;
ReactCrop.nudgeStepLarge = 100;

ReactCrop.defaultCrop = {
  unit: 'px',
  x: 0,
  y: 0,
  width: 0,
  height: 0,
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
