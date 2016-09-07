import React, { Component, PropTypes } from 'react';
import assign from 'object-assign';

// Waiting for bug fix: https://github.com/yannickcr/eslint-plugin-react/issues/507
/* eslint-disable react/sort-comp */

class ReactCrop extends Component {

  static propTypes = {
    src: PropTypes.string.isRequired,
    crop: PropTypes.object,
    minWidth: PropTypes.number,
    minHeight: PropTypes.number,
    maxWidth: PropTypes.number,
    maxHeight: PropTypes.number,
    keepSelection: PropTypes.bool,
    onChange: PropTypes.func,
    onComplete: PropTypes.func,
    onImageLoaded: PropTypes.func,
    disabled: PropTypes.bool,
    ellipse: PropTypes.bool,
    crossorigin: PropTypes.string,
    children: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node,
    ]),
  }

  static defaultProps = {
    disabled: false,
    maxWidth: 100,
    maxHeight: 100,
    crossorigin: 'anonymous'
  }

  static xOrds = ['e', 'w']
  static yOrds = ['n', 's']
  static xyOrds = ['nw', 'ne', 'se', 'sw']

  static arrowKey = {
    left: 37,
    up: 38,
    right: 39,
    down: 40,
  }

  static nudgeStep = 0.2

  static defaultCrop = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    aspect: false,
  }

  constructor(props) {
    super(props);

    this.onDocMouseTouchMove = this.onDocMouseTouchMove.bind(this);
    this.onDocMouseTouchEnd = this.onDocMouseTouchEnd.bind(this);
    this.onImageLoad = this.onImageLoad.bind(this);
    this.onComponentMouseTouchDown = this.onComponentMouseTouchDown.bind(this);
    this.onComponentKeyDown = this.onComponentKeyDown.bind(this);
    this.onCropMouseTouchDown = this.onCropMouseTouchDown.bind(this);

    this.state = {
      crop: this.nextCropState(props.crop),
      polygonId: this.getRandomInt(1, 900000),
    };
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.onDocMouseTouchMove);
    document.addEventListener('touchmove', this.onDocMouseTouchMove);

    document.addEventListener('mouseup', this.onDocMouseTouchEnd);
    document.addEventListener('touchend', this.onDocMouseTouchEnd);
    document.addEventListener('touchcancel', this.onDocMouseTouchEnd);

    if (this.imageRef.complete || this.imageRef.readyState) {
      if (this.imageRef.naturalWidth === 0) {
        // Broken load on iOS, PR #51
        // https://css-tricks.com/snippets/jquery/fixing-load-in-ie-for-cached-images/
        // http://stackoverflow.com/questions/821516/browser-independent-way-to-detect-when-image-has-been-loaded
        const src = this.imageRef.src;
        const emptyGif = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
        this.imageRef.src = emptyGif;
        this.imageRef.src = src;
      } else {
        // Fixme: this is causing a double onImageLoaded event in normal cases.
        this.onImageLoad(this.imageRef);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.crop) {
      let nextCrop = this.nextCropState(nextProps.crop);

      if (nextCrop.aspect) {
        nextCrop = this.ensureAspectDimensions(nextCrop, this.imageRef);
      }

      this.cropInvalid = this.isCropInvalid(nextCrop);
      this.setState({ crop: nextCrop });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onDocMouseTouchMove);
    document.removeEventListener('touchmove', this.onDocMouseTouchMove);

    document.removeEventListener('mouseup', this.onDocMouseTouchEnd);
    document.removeEventListener('touchend', this.onDocMouseTouchEnd);
    document.removeEventListener('touchcancel', this.onDocMouseTouchEnd);
  }

  onDocMouseTouchMove(e) {
    if (this.props.disabled) {
      return;
    }

    if (!this.mouseDownOnCrop) {
      return;
    }

    e.preventDefault(); // Stop drag selection.

    const { crop } = this.state;
    const evData = this.evData;
    const clientPos = this.getClientPos(e);

    if (evData.isResize && crop.aspect && evData.cropOffset) {
      clientPos.y = this.straightenYPath(clientPos.x);
    }

    const xDiffPx = clientPos.x - evData.clientStartX;
    evData.xDiffPc = (xDiffPx / evData.imageWidth) * 100;

    const yDiffPx = clientPos.y - evData.clientStartY;
    evData.yDiffPc = (yDiffPx / evData.imageHeight) * 100;

    if (evData.isResize) {
      this.resizeCrop();
    } else {
      this.dragCrop();
    }

    this.cropInvalid = false;

    if (this.props.onChange) {
      this.props.onChange(crop, this.getPixelCrop(crop));
    }

    this.setState({ crop });
  }

  onCropMouseTouchDown(e) {
    if (this.props.disabled) {
      return;
    }

    e.preventDefault(); // Stop drag selection.

    const { crop } = this.state;
    const clientPos = this.getClientPos(e);

    // Focus for detecting keypress.
    this.componentRef.focus();

    const ord = e.target.dataset.ord;
    const xInversed = ord === 'nw' || ord === 'w' || ord === 'sw';
    const yInversed = ord === 'nw' || ord === 'n' || ord === 'ne';

    let cropOffset;

    if (crop.aspect) {
      cropOffset = this.getElementOffset(this.cropSelectRef);
    }

    this.evData = {
      imageWidth: this.imageRef.width,
      imageHeight: this.imageRef.height,
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
  }

  onComponentMouseTouchDown(e) {
    if (e.target !== this.imageCopyRef && e.target !== this.cropWrapperRef) {
      return;
    }

    if (this.props.disabled) {
      return;
    }

    e.preventDefault(); // Stop drag selection.

    const crop = this.props.keepSelection === true ? {} : this.state.crop;
    const clientPos = this.getClientPos(e);

    // Focus for detecting keypress.
    this.componentRef.focus();

    const imageOffset = this.getElementOffset(this.imageRef);
    const xPc = ((clientPos.x - imageOffset.left) / this.imageRef.width) * 100;
    const yPc = ((clientPos.y - imageOffset.top) / this.imageRef.height) * 100;

    crop.x = xPc;
    crop.y = yPc;
    crop.width = 0;
    crop.height = 0;

    this.evData = {
      imageWidth: this.imageRef.width,
      imageHeight: this.imageRef.height,
      clientStartX: clientPos.x,
      clientStartY: clientPos.y,
      cropStartWidth: crop.width,
      cropStartHeight: crop.height,
      cropStartX: crop.x,
      cropStartY: crop.y,
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
    this.setState({ newCropIsBeingDrawn: true });
  }

  onComponentKeyDown(e) {
    if (this.props.disabled) {
      return;
    }

    const keyCode = e.which;
    const { crop } = this.state;
    let nudged = false;

    if (!crop.width || !crop.height) {
      return;
    }

    if (keyCode === ReactCrop.arrowKey.left) {
      crop.x -= ReactCrop.nudgeStep;
      nudged = true;
    } else if (keyCode === ReactCrop.arrowKey.right) {
      crop.x += ReactCrop.nudgeStep;
      nudged = true;
    } else if (keyCode === ReactCrop.arrowKey.up) {
      crop.y -= ReactCrop.nudgeStep;
      nudged = true;
    } else if (keyCode === ReactCrop.arrowKey.down) {
      crop.y += ReactCrop.nudgeStep;
      nudged = true;
    }

    if (nudged) {
      e.preventDefault(); // Stop drag selection.
      crop.x = this.clamp(crop.x, 0, 100 - crop.width);
      crop.y = this.clamp(crop.y, 0, 100 - crop.height);

      this.setState({ crop }, () => {
        if (this.props.onChange) {
          this.props.onChange(crop, this.getPixelCrop(crop));
        }
        if (this.props.onComplete) {
          this.props.onComplete(crop, this.getPixelCrop(crop));
        }
      });
    }
  }

  onDocMouseTouchEnd() {
    if (this.props.disabled) {
      return;
    }

    if (this.mouseDownOnCrop) {
      const { crop } = this.state;
      this.cropInvalid = this.isCropInvalid(crop);
      this.mouseDownOnCrop = false;

      if (this.props.onComplete) {
        this.props.onComplete(crop, this.getPixelCrop(crop));
      }

      this.setState({ newCropIsBeingDrawn: false });
    }
  }

  getPixelCrop(crop) {
    return {
      x: Math.round(this.imageRef.naturalWidth * (crop.x / 100)),
      y: Math.round(this.imageRef.naturalHeight * (crop.y / 100)),
      width: Math.round(this.imageRef.naturalWidth * (crop.width / 100)),
      height: Math.round(this.imageRef.naturalHeight * (crop.height / 100)),
    };
  }

  getPolygonValues(forSvg) {
    const { crop } = this.state;
    let pTopLeft = [crop.x, crop.y];
    let pTopRight = [crop.x + crop.width, crop.y];
    let pBottomLeft = [crop.x, crop.y + crop.height];
    let pBottomRight = [crop.x + crop.width, crop.y + crop.height];

    if (forSvg) {
      pTopLeft = this.arrayDividedBy100(pTopLeft);
      pTopRight = this.arrayDividedBy100(pTopRight);
      pBottomLeft = this.arrayDividedBy100(pBottomLeft);
      pBottomRight = this.arrayDividedBy100(pBottomRight);
    } else {
      pTopLeft = this.arrayToPercent(pTopLeft);
      pTopRight = this.arrayToPercent(pTopRight);
      pBottomLeft = this.arrayToPercent(pBottomLeft);
      pBottomRight = this.arrayToPercent(pBottomRight);
    }
    return {
      top: {
        left: pTopLeft,
        right: pTopRight,
      },
      bottom: {
        left: pBottomLeft,
        right: pBottomRight,
      },
    };
  }

  getCropStyle() {
    return {
      top: `${this.state.crop.y}%`,
      left: `${this.state.crop.x}%`,
      width: `${this.state.crop.width}%`,
      height: `${this.state.crop.height}%`,
    };
  }

  getEllipseValues(forSvg) {
    const { crop } = this.state;
    let rx = crop.width / 2;
    let ry = crop.height / 2;
    let cx = crop.x + rx;
    let cy = crop.y + ry;

    if (forSvg) {
      rx /= 100;
      ry /= 100;
      cx /= 100;
      cy /= 100;
    } else {
      rx += '%';
      ry += '%';
      cx += '%';
      cy += '%';
    }
    return { cx, cy, rx, ry };
  }

  getPolygonClipPath() {
    const { top, bottom } = this.getPolygonValues();
    return `polygon(${top.left}, ${top.right}, ${bottom.right}, ${bottom.left})`;
  }

  getEllipseClipPath() {
    const { rx, ry, cx, cy } = this.getEllipseValues();
    return `ellipse(${rx} ${ry} at ${cx} ${cy})`;
  }

  getElementOffset(el) {
    const rect = el.getBoundingClientRect();
    const docEl = document.documentElement;

    const rectTop = (rect.top + window.pageYOffset) - docEl.clientTop;
    const rectLeft = (rect.left + window.pageXOffset) - docEl.clientLeft;

    return {
      top: rectTop,
      left: rectLeft,
    };
  }

  getClientPos(e) {
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

  getNewSize() {
    const { crop } = this.state;
    const evData = this.evData;
    const imageAspect = evData.imageWidth / evData.imageHeight;

    // New width.
    let newWidth = evData.cropStartWidth + evData.xDiffPc;

    if (evData.xCrossOver) {
      newWidth = Math.abs(newWidth);
    }

    let maxWidth = this.props.maxWidth;

    // Stop the box expanding on the opposite side when some edges are hit.
    if (!this.state.newCropIsBeingDrawn) {
      maxWidth = (['nw', 'w', 'sw'].indexOf(evData.inversedXOrd || evData.ord) > -1) ?
        evData.cropStartX :
        100 - evData.cropStartX;
      maxWidth = this.clamp(maxWidth, 100, this.props.maxWidth);
    }

    newWidth = this.clamp(newWidth, this.props.minWidth || 0, maxWidth);

    // New height.
    let newHeight;

    if (crop.aspect) {
      newHeight = (newWidth / crop.aspect) * imageAspect;
    } else {
      newHeight = evData.cropStartHeight + evData.yDiffPc;
    }

    if (evData.yCrossOver) {
      // Cap if polarity is inversed and the ape fills the y space.
      newHeight = Math.min(Math.abs(newHeight), evData.cropStartY);
    }

    let maxHeight = this.props.maxHeight;

    // Stop the box expanding on the opposite side when some edges are hit.
    if (!this.state.newCropIsBeingDrawn) {
      maxHeight = (['nw', 'n', 'ne'].indexOf(evData.inversedYOrd || evData.ord) > -1) ?
        evData.cropStartY :
        100 - evData.cropStartY;
      maxHeight = this.clamp(maxHeight, 100, this.props.maxHeight);
    }

    newHeight = this.clamp(newHeight, this.props.minHeight || 0, maxHeight);

    if (crop.aspect) {
      newWidth = this.clamp((newHeight * crop.aspect) / imageAspect, 0, 100);
    }

    return {
      width: newWidth,
      height: newHeight,
    };
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * ((max - min) + 1)) + min;
  }

  getPolygonId() {
    return `ReactCropClipPolygon-${this.state.polygonId}`;
  }

  dragCrop() {
    const { crop } = this.state;
    const evData = this.evData;
    crop.x = this.clamp(evData.cropStartX + evData.xDiffPc, 0, 100 - crop.width);
    crop.y = this.clamp(evData.cropStartY + evData.yDiffPc, 0, 100 - crop.height);
  }

  resizeCrop() {
    const { crop } = this.state;
    const evData = this.evData;
    const ord = evData.ord;

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
      newX = crop.x + (crop.width - newSize.width);
    }

    if (evData.yCrossOver) {
      // This not only removes the little "shake" when inverting at a diagonal, but for some
      // reason y was way off at fast speeds moving sw->ne with fixed aspect only, I couldn't
      // figure out why.
      if (evData.lastYCrossover === false) {
        newY = crop.y - newSize.height;
      } else {
        newY = crop.y + (crop.height - newSize.height);
      }
    }

    crop.x = this.clamp(newX, 0, 100 - newSize.width);
    crop.y = this.clamp(newY, 0, 100 - newSize.height);

    // Apply width/height changes depending on ordinate (fixed aspect always applies both).
    if (crop.aspect || ReactCrop.xyOrds.indexOf(ord) > -1) {
      crop.width = newSize.width;
      crop.height = newSize.height;
    } else if (ReactCrop.xOrds.indexOf(ord) > -1) {
      crop.width = newSize.width;
    } else if (ReactCrop.yOrds.indexOf(ord) > -1) {
      crop.height = newSize.height;
    }

    evData.lastYCrossover = evData.yCrossOver;
    this.crossOverCheck();
  }

  straightenYPath(clientX) {
    const evData = this.evData;
    const ord = evData.ord;
    const cropOffset = evData.cropOffset;
    const cropStartWidth = (evData.cropStartWidth / 100) * evData.imageWidth;
    const cropStartHeight = (evData.cropStartHeight / 100) * evData.imageHeight;
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

  onImageLoad(imageEl) {
    let crop = this.state.crop;

    // If there is a width or height then infer the other to
    // ensure the value is correct.
    if (crop.aspect) {
      crop = this.ensureAspectDimensions(crop, imageEl);
      this.cropInvalid = this.isCropInvalid(crop);
      this.setState({ crop });
    }
    if (this.props.onImageLoaded) {
      this.props.onImageLoaded(crop, imageEl, this.getPixelCrop(crop));
    }
  }

  arrayDividedBy100(arr, delimeter = ' ') {
    return arr.map(number => number / 100).join(delimeter);
  }

  arrayToPercent(arr, delimeter = ' ') {
    return arr.map(number => `${number}%`).join(delimeter);
  }

  createCropSelection() {
    const style = this.getCropStyle();
    const { aspect } = this.state.crop;
    const { ellipse } = this.props;

    return (
      <div
        ref={(c) => {
          this.cropSelectRef = c;
        }}
        style={style}
        className="ReactCrop--crop-selection"
        onMouseDown={this.onCropMouseTouchDown}
        onTouchStart={this.onCropMouseTouchDown}
      >

        <div className="ReactCrop--drag-bar ord-n" data-ord="n" />
        <div className="ReactCrop--drag-bar ord-e" data-ord="e" />
        <div className="ReactCrop--drag-bar ord-s" data-ord="s" />
        <div className="ReactCrop--drag-bar ord-w" data-ord="w" />

        {ellipse ? null : <div className="ReactCrop--drag-handle ord-nw" data-ord="nw" />}
        {aspect && !ellipse ? null : <div className="ReactCrop--drag-handle ord-n" data-ord="n" />}
        {ellipse ? null : <div className="ReactCrop--drag-handle ord-ne" data-ord="ne" />}
        {aspect && !ellipse ? null : <div className="ReactCrop--drag-handle ord-e" data-ord="e" />}
        {ellipse ? null : <div className="ReactCrop--drag-handle ord-se" data-ord="se" />}
        {aspect && !ellipse ? null : <div className="ReactCrop--drag-handle ord-s" data-ord="s" />}
        {ellipse ? null : <div className="ReactCrop--drag-handle ord-sw" data-ord="sw" />}
        {aspect && !ellipse ? null : <div className="ReactCrop--drag-handle ord-w" data-ord="w" />}
      </div>
    );
  }

  isCropInvalid(crop) {
    return !crop.width || !crop.height;
  }

  nextCropState(crop) {
    const nextCrop = assign({}, ReactCrop.defaultCrop, crop);
    this.cropInvalid = this.isCropInvalid(nextCrop);
    return nextCrop;
  }

  clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }

  crossOverCheck() {
    const evData = this.evData;

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

    evData.inversedXOrd = swapXOrd ? this.inverseOrd(evData.ord) : false;
    evData.inversedYOrd = swapYOrd ? this.inverseOrd(evData.ord) : false;
  }

  inverseOrd(ord) {
    let inverseOrd;

    if (ord === 'n') inverseOrd = 's';
    else if (ord === 'ne') inverseOrd = 'sw';
    else if (ord === 'e') inverseOrd = 'w';
    else if (ord === 'se') inverseOrd = 'nw';
    else if (ord === 's') inverseOrd = 'n';
    else if (ord === 'sw') inverseOrd = 'ne';
    else if (ord === 'w') inverseOrd = 'e';
    else if (ord === 'nw') inverseOrd = 'se';

    return inverseOrd;
  }

  ensureAspectDimensions(cropObj, imageEl) {
    const imageWidth = imageEl.naturalWidth;
    const imageHeight = imageEl.naturalHeight;
    const imageAspect = imageWidth / imageHeight;
    const crop = assign({}, cropObj);

    if (crop.width) {
      crop.height = (crop.width / crop.aspect) * imageAspect;
    } else if (crop.height) {
      crop.width = (crop.height * crop.aspect) / imageAspect;
    }

    if (crop.y + crop.height > 100) {
      crop.height = 100 - crop.y;
      crop.width = (crop.height * crop.aspect) / imageAspect;
    }
    if (crop.x + crop.width > 100) {
      crop.width = 100 - crop.x;
      crop.height = (crop.width / crop.aspect) * imageAspect;
    }

    return crop;
  }

  // Unfortunately some modern browsers like Firefox still don't support svg's as a css property..
  renderSvg() {
    let shape;
    if (this.props.ellipse) {
      shape = <ellipse {...this.getEllipseValues(true)} />;
    } else {
      const { top, bottom } = this.getPolygonValues(true);
      shape = <polygon points={`${top.left}, ${top.right}, ${bottom.right}, ${bottom.left}`} />;
    }

    return (
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id={this.getPolygonId()} clipPathUnits="objectBoundingBox">
            {shape}
          </clipPath>
        </defs>
      </svg>
    );
  }

  render() {
    let cropSelection;
    let imageClip;

    if (!this.cropInvalid) {
      cropSelection = this.createCropSelection();
      imageClip = {
        WebkitClipPath: (this.props.ellipse
          ? this.getEllipseClipPath()
          : this.getPolygonClipPath()
        ),
        clipPath: `url("#${this.getPolygonId()}")`,
      };
    }

    const componentClasses = ['ReactCrop'];

    if (this.state.newCropIsBeingDrawn) {
      componentClasses.push('ReactCrop-new-crop');
    }
    if (this.state.crop.aspect) {
      componentClasses.push('ReactCrop-fixed-aspect');
    }
    if (this.props.ellipse) {
      componentClasses.push('ReactCrop-ellipse');
    }
    if (this.props.disabled) {
      componentClasses.push('ReactCrop--disabled');
    }

    return (
      <div
        ref={(c) => {
          this.componentRef = c;
        }}
        className={componentClasses.join(' ')}
        onTouchStart={this.onComponentMouseTouchDown}
        onMouseDown={this.onComponentMouseTouchDown}
        tabIndex="1"
        onKeyDown={this.onComponentKeyDown}
      >
        {this.renderSvg()}

        <img
          ref={(c) => {
            this.imageRef = c;
          }}
          crossorigin={(this.props.src.indexOf('data:') === -1) ? this.props.crossorigin : undefined;}
          className="ReactCrop--image"
          src={this.props.src}
          onLoad={(e) => { this.onImageLoad(e.target); }}
          alt=""
        />

        <div
          className="ReactCrop--crop-wrapper"
          ref={(c) => {
            this.cropWrapperRef = c;
          }}
        >
          <img
            ref={(c) => {
              this.imageCopyRef = c;
            }}
            className="ReactCrop--image-copy"
            src={this.props.src}
            style={imageClip}
            alt=""
          />
          {cropSelection}
        </div>

        {this.props.children}
      </div>
    );
  }
}

module.exports = ReactCrop;
