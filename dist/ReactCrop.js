module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _objectAssign = __webpack_require__(2);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	// Waiting for bug fix: https://github.com/yannickcr/eslint-plugin-react/issues/507
	/* eslint-disable react/sort-comp */

	var ReactCrop = function (_Component) {
	  _inherits(ReactCrop, _Component);

	  function ReactCrop(props) {
	    _classCallCheck(this, ReactCrop);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ReactCrop).call(this, props));

	    _this.onDocMouseTouchMove = _this.onDocMouseTouchMove.bind(_this);
	    _this.onDocMouseTouchEnd = _this.onDocMouseTouchEnd.bind(_this);
	    _this.onImageLoad = _this.onImageLoad.bind(_this);
	    _this.onComponentMouseTouchDown = _this.onComponentMouseTouchDown.bind(_this);
	    _this.onComponentKeyDown = _this.onComponentKeyDown.bind(_this);
	    _this.onCropMouseTouchDown = _this.onCropMouseTouchDown.bind(_this);

	    _this.state = {
	      crop: _this.nextCropState(_this.props.crop),
	      polygonId: _this.getRandomInt(1, 900000)
	    };
	    return _this;
	  }

	  _createClass(ReactCrop, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      document.addEventListener('mousemove', this.onDocMouseTouchMove);
	      document.addEventListener('touchmove', this.onDocMouseTouchMove);

	      document.addEventListener('mouseup', this.onDocMouseTouchEnd);
	      document.addEventListener('touchend', this.onDocMouseTouchEnd);
	      document.addEventListener('touchcancel', this.onDocMouseTouchEnd);

	      if ((this.imageRef.complete || this.imageRef.readyState) && !this.imageRef.naturalWidth) {
	        // Broken load on iOS, PR #51
	        // https://css-tricks.com/snippets/jquery/fixing-load-in-ie-for-cached-images/
	        // http://stackoverflow.com/questions/821516/browser-independent-way-to-detect-when-image-has-been-loaded
	        var src = this.imageRef.src;
	        var emptyGif = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
	        this.imageRef.src = emptyGif;
	        this.imageRef.src = src;
	      }
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      if (nextProps.crop) {
	        var nextCrop = this.nextCropState(nextProps.crop);

	        if (nextCrop.aspect) {
	          nextCrop = this.ensureAspectDimensions(nextCrop, this.imageRef);
	        }

	        this.cropInvalid = this.isCropInvalid(nextCrop);
	        this.setState({ crop: nextCrop });
	      }
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      document.removeEventListener('mousemove', this.onDocMouseTouchMove);
	      document.removeEventListener('touchmove', this.onDocMouseTouchMove);

	      document.removeEventListener('mouseup', this.onDocMouseTouchEnd);
	      document.removeEventListener('touchend', this.onDocMouseTouchEnd);
	      document.removeEventListener('touchcancel', this.onDocMouseTouchEnd);
	    }
	  }, {
	    key: 'onDocMouseTouchMove',
	    value: function onDocMouseTouchMove(e) {
	      if (this.props.disabled) {
	        return;
	      }

	      if (!this.mouseDownOnCrop) {
	        return;
	      }

	      e.preventDefault(); // Stop drag selection.

	      var crop = this.state.crop;

	      var evData = this.evData;
	      var clientPos = this.getClientPos(e);

	      if (evData.isResize && crop.aspect && evData.cropOffset) {
	        clientPos.y = this.straightenYPath(clientPos.x);
	      }

	      var xDiffPx = clientPos.x - evData.clientStartX;
	      evData.xDiffPc = xDiffPx / evData.imageWidth * 100;

	      var yDiffPx = clientPos.y - evData.clientStartY;
	      evData.yDiffPc = yDiffPx / evData.imageHeight * 100;

	      if (evData.isResize) {
	        this.resizeCrop();
	      } else {
	        this.dragCrop();
	      }

	      this.cropInvalid = false;

	      if (this.props.onChange) {
	        this.props.onChange(crop, this.getPixelCrop(crop));
	      }

	      this.setState({ crop: crop });
	    }
	  }, {
	    key: 'onCropMouseTouchDown',
	    value: function onCropMouseTouchDown(e) {
	      if (this.props.disabled) {
	        return;
	      }

	      e.preventDefault(); // Stop drag selection.

	      var crop = this.state.crop;

	      var clientPos = this.getClientPos(e);

	      // Focus for detecting keypress.
	      this.componentRef.focus();

	      var ord = e.target.dataset.ord;
	      var xInversed = ord === 'nw' || ord === 'w' || ord === 'sw';
	      var yInversed = ord === 'nw' || ord === 'n' || ord === 'ne';

	      var cropOffset = void 0;

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
	        cropStartX: xInversed ? crop.x + crop.width : crop.x,
	        cropStartY: yInversed ? crop.y + crop.height : crop.y,
	        xInversed: xInversed,
	        yInversed: yInversed,
	        xCrossOver: xInversed,
	        yCrossOver: yInversed,
	        startXCrossOver: xInversed,
	        startYCrossOver: yInversed,
	        isResize: e.target !== this.cropSelectRef,
	        ord: ord,
	        cropOffset: cropOffset
	      };

	      this.mouseDownOnCrop = true;
	    }
	  }, {
	    key: 'onComponentMouseTouchDown',
	    value: function onComponentMouseTouchDown(e) {
	      if (e.target !== this.imageCopyRef && e.target !== this.cropWrapperRef) {
	        return;
	      }

	      if (this.props.disabled) {
	        return;
	      }

	      e.preventDefault(); // Stop drag selection.

	      var crop = this.props.keepSelection === true ? {} : this.state.crop;
	      var clientPos = this.getClientPos(e);

	      // Focus for detecting keypress.
	      this.componentRef.focus();

	      var imageOffset = this.getElementOffset(this.imageRef);
	      var xPc = (clientPos.x - imageOffset.left) / this.imageRef.width * 100;
	      var yPc = (clientPos.y - imageOffset.top) / this.imageRef.height * 100;

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
	        ord: 'nw'
	      };

	      this.mouseDownOnCrop = true;
	      this.setState({ newCropIsBeingDrawn: true });
	    }
	  }, {
	    key: 'onComponentKeyDown',
	    value: function onComponentKeyDown(e) {
	      var _this2 = this;

	      if (this.props.disabled) {
	        return;
	      }

	      var keyCode = e.which;
	      var crop = this.state.crop;

	      var nudged = false;

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

	        this.setState({ crop: crop }, function () {
	          if (_this2.props.onChange) {
	            _this2.props.onChange(crop, _this2.getPixelCrop(crop));
	          }
	          if (_this2.props.onComplete) {
	            _this2.props.onComplete(crop, _this2.getPixelCrop(crop));
	          }
	        });
	      }
	    }
	  }, {
	    key: 'onDocMouseTouchEnd',
	    value: function onDocMouseTouchEnd() {
	      if (this.props.disabled) {
	        return;
	      }

	      if (this.mouseDownOnCrop) {
	        var crop = this.state.crop;

	        this.cropInvalid = this.isCropInvalid(crop);
	        this.mouseDownOnCrop = false;

	        if (this.props.onComplete) {
	          this.props.onComplete(crop, this.getPixelCrop(crop));
	        }

	        this.setState({ newCropIsBeingDrawn: false });
	      }
	    }
	  }, {
	    key: 'getPixelCrop',
	    value: function getPixelCrop(crop) {
	      return {
	        x: Math.round(this.imageRef.naturalWidth * (crop.x / 100)),
	        y: Math.round(this.imageRef.naturalHeight * (crop.y / 100)),
	        width: Math.round(this.imageRef.naturalWidth * (crop.width / 100)),
	        height: Math.round(this.imageRef.naturalHeight * (crop.height / 100))
	      };
	    }
	  }, {
	    key: 'getPolygonValues',
	    value: function getPolygonValues(forSvg) {
	      var crop = this.state.crop;

	      var pTopLeft = [crop.x, crop.y];
	      var pTopRight = [crop.x + crop.width, crop.y];
	      var pBottomLeft = [crop.x, crop.y + crop.height];
	      var pBottomRight = [crop.x + crop.width, crop.y + crop.height];

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
	          right: pTopRight
	        },
	        bottom: {
	          left: pBottomLeft,
	          right: pBottomRight
	        }
	      };
	    }
	  }, {
	    key: 'getCropStyle',
	    value: function getCropStyle() {
	      return {
	        top: this.state.crop.y + '%',
	        left: this.state.crop.x + '%',
	        width: this.state.crop.width + '%',
	        height: this.state.crop.height + '%'
	      };
	    }
	  }, {
	    key: 'getEllipseValues',
	    value: function getEllipseValues(forSvg) {
	      var crop = this.state.crop;

	      var rx = crop.width / 2;
	      var ry = crop.height / 2;
	      var cx = crop.x + rx;
	      var cy = crop.y + ry;

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
	      return { cx: cx, cy: cy, rx: rx, ry: ry };
	    }
	  }, {
	    key: 'getPolygonClipPath',
	    value: function getPolygonClipPath() {
	      var _getPolygonValues = this.getPolygonValues();

	      var top = _getPolygonValues.top;
	      var bottom = _getPolygonValues.bottom;

	      return 'polygon(' + top.left + ', ' + top.right + ', ' + bottom.right + ', ' + bottom.left + ')';
	    }
	  }, {
	    key: 'getEllipseClipPath',
	    value: function getEllipseClipPath() {
	      var _getEllipseValues = this.getEllipseValues();

	      var rx = _getEllipseValues.rx;
	      var ry = _getEllipseValues.ry;
	      var cx = _getEllipseValues.cx;
	      var cy = _getEllipseValues.cy;

	      return 'ellipse(' + rx + ' ' + ry + ' at ' + cx + ' ' + cy + ')';
	    }
	  }, {
	    key: 'getElementOffset',
	    value: function getElementOffset(el) {
	      var rect = el.getBoundingClientRect();
	      var docEl = document.documentElement;

	      var rectTop = rect.top + window.pageYOffset - docEl.clientTop;
	      var rectLeft = rect.left + window.pageXOffset - docEl.clientLeft;

	      return {
	        top: rectTop,
	        left: rectLeft
	      };
	    }
	  }, {
	    key: 'getClientPos',
	    value: function getClientPos(e) {
	      var pageX = void 0;
	      var pageY = void 0;

	      if (e.touches) {
	        pageX = e.touches[0].pageX;
	        pageY = e.touches[0].pageY;
	      } else {
	        pageX = e.pageX;
	        pageY = e.pageY;
	      }

	      return {
	        x: pageX,
	        y: pageY
	      };
	    }
	  }, {
	    key: 'getNewSize',
	    value: function getNewSize() {
	      var crop = this.state.crop;

	      var evData = this.evData;
	      var imageAspect = evData.imageWidth / evData.imageHeight;

	      // New width.
	      var newWidth = evData.cropStartWidth + evData.xDiffPc;

	      if (evData.xCrossOver) {
	        newWidth = Math.abs(newWidth);
	      }

	      var maxWidth = this.props.maxWidth;

	      // Stop the box expanding on the opposite side when some edges are hit.
	      if (!this.state.newCropIsBeingDrawn) {
	        maxWidth = ['nw', 'w', 'sw'].indexOf(evData.inversedXOrd || evData.ord) > -1 ? evData.cropStartX : 100 - evData.cropStartX;
	        maxWidth = this.clamp(maxWidth, 100, this.props.maxWidth);
	      }

	      newWidth = this.clamp(newWidth, this.props.minWidth || 0, maxWidth);

	      // New height.
	      var newHeight = void 0;

	      if (crop.aspect) {
	        newHeight = newWidth / crop.aspect * imageAspect;
	      } else {
	        newHeight = evData.cropStartHeight + evData.yDiffPc;
	      }

	      if (evData.yCrossOver) {
	        // Cap if polarity is inversed and the ape fills the y space.
	        newHeight = Math.min(Math.abs(newHeight), evData.cropStartY);
	      }

	      var maxHeight = this.props.maxHeight;

	      // Stop the box expanding on the opposite side when some edges are hit.
	      if (!this.state.newCropIsBeingDrawn) {
	        maxHeight = ['nw', 'n', 'ne'].indexOf(evData.inversedYOrd || evData.ord) > -1 ? evData.cropStartY : 100 - evData.cropStartY;
	        maxHeight = this.clamp(maxHeight, 100, this.props.maxHeight);
	      }

	      newHeight = this.clamp(newHeight, this.props.minHeight || 0, maxHeight);

	      if (crop.aspect) {
	        newWidth = this.clamp(newHeight * crop.aspect / imageAspect, 0, 100);
	      }

	      return {
	        width: newWidth,
	        height: newHeight
	      };
	    }
	  }, {
	    key: 'getRandomInt',
	    value: function getRandomInt(min, max) {
	      return Math.floor(Math.random() * (max - min + 1)) + min;
	    }
	  }, {
	    key: 'getPolygonId',
	    value: function getPolygonId() {
	      return 'ReactCropClipPolygon-' + this.state.polygonId;
	    }
	  }, {
	    key: 'dragCrop',
	    value: function dragCrop() {
	      var crop = this.state.crop;

	      var evData = this.evData;
	      crop.x = this.clamp(evData.cropStartX + evData.xDiffPc, 0, 100 - crop.width);
	      crop.y = this.clamp(evData.cropStartY + evData.yDiffPc, 0, 100 - crop.height);
	    }
	  }, {
	    key: 'resizeCrop',
	    value: function resizeCrop() {
	      var crop = this.state.crop;

	      var evData = this.evData;
	      var ord = evData.ord;

	      // On the inverse change the diff so it's the same and
	      // the same algo applies.
	      if (evData.xInversed) {
	        evData.xDiffPc -= evData.cropStartWidth * 2;
	      }
	      if (evData.yInversed) {
	        evData.yDiffPc -= evData.cropStartHeight * 2;
	      }

	      // New size.
	      var newSize = this.getNewSize();

	      // Adjust x/y to give illusion of 'staticness' as width/height is increased
	      // when polarity is inversed.
	      var newX = evData.cropStartX;
	      var newY = evData.cropStartY;

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
	  }, {
	    key: 'straightenYPath',
	    value: function straightenYPath(clientX) {
	      var evData = this.evData;
	      var ord = evData.ord;
	      var cropOffset = evData.cropOffset;
	      var cropStartWidth = evData.cropStartWidth / 100 * evData.imageWidth;
	      var cropStartHeight = evData.cropStartHeight / 100 * evData.imageHeight;
	      var k = void 0;
	      var d = void 0;

	      if (ord === 'nw' || ord === 'se') {
	        k = cropStartHeight / cropStartWidth;
	        d = cropOffset.top - cropOffset.left * k;
	      } else {
	        k = -cropStartHeight / cropStartWidth;
	        d = cropOffset.top + (cropStartHeight - cropOffset.left * k);
	      }

	      return k * clientX + d;
	    }
	  }, {
	    key: 'onImageLoad',
	    value: function onImageLoad(imageEl) {
	      var crop = this.state.crop;

	      // If there is a width or height then infer the other to
	      // ensure the value is correct.
	      if (crop.aspect) {
	        crop = this.ensureAspectDimensions(crop, imageEl);
	        this.cropInvalid = this.isCropInvalid(crop);
	        this.setState({ crop: crop });
	      }
	      if (this.props.onImageLoaded) {
	        this.props.onImageLoaded(crop, imageEl, this.getPixelCrop(crop));
	      }
	    }
	  }, {
	    key: 'arrayDividedBy100',
	    value: function arrayDividedBy100(arr) {
	      var delimeter = arguments.length <= 1 || arguments[1] === undefined ? ' ' : arguments[1];

	      return arr.map(function (number) {
	        return number / 100;
	      }).join(delimeter);
	    }
	  }, {
	    key: 'arrayToPercent',
	    value: function arrayToPercent(arr) {
	      var delimeter = arguments.length <= 1 || arguments[1] === undefined ? ' ' : arguments[1];

	      return arr.map(function (number) {
	        return number + '%';
	      }).join(delimeter);
	    }
	  }, {
	    key: 'createCropSelection',
	    value: function createCropSelection() {
	      var _this3 = this;

	      var style = this.getCropStyle();
	      var aspect = this.state.crop.aspect;
	      var ellipse = this.props.ellipse;


	      return _react2.default.createElement(
	        'div',
	        {
	          ref: function ref(c) {
	            _this3.cropSelectRef = c;
	          },
	          style: style,
	          className: 'ReactCrop--crop-selection',
	          onMouseDown: this.onCropMouseTouchDown,
	          onTouchStart: this.onCropMouseTouchDown
	        },
	        _react2.default.createElement('div', { className: 'ReactCrop--drag-bar ord-n', 'data-ord': 'n' }),
	        _react2.default.createElement('div', { className: 'ReactCrop--drag-bar ord-e', 'data-ord': 'e' }),
	        _react2.default.createElement('div', { className: 'ReactCrop--drag-bar ord-s', 'data-ord': 's' }),
	        _react2.default.createElement('div', { className: 'ReactCrop--drag-bar ord-w', 'data-ord': 'w' }),
	        ellipse ? null : _react2.default.createElement('div', { className: 'ReactCrop--drag-handle ord-nw', 'data-ord': 'nw' }),
	        aspect && !ellipse ? null : _react2.default.createElement('div', { className: 'ReactCrop--drag-handle ord-n', 'data-ord': 'n' }),
	        ellipse ? null : _react2.default.createElement('div', { className: 'ReactCrop--drag-handle ord-ne', 'data-ord': 'ne' }),
	        aspect && !ellipse ? null : _react2.default.createElement('div', { className: 'ReactCrop--drag-handle ord-e', 'data-ord': 'e' }),
	        ellipse ? null : _react2.default.createElement('div', { className: 'ReactCrop--drag-handle ord-se', 'data-ord': 'se' }),
	        aspect && !ellipse ? null : _react2.default.createElement('div', { className: 'ReactCrop--drag-handle ord-s', 'data-ord': 's' }),
	        ellipse ? null : _react2.default.createElement('div', { className: 'ReactCrop--drag-handle ord-sw', 'data-ord': 'sw' }),
	        aspect && !ellipse ? null : _react2.default.createElement('div', { className: 'ReactCrop--drag-handle ord-w', 'data-ord': 'w' })
	      );
	    }
	  }, {
	    key: 'isCropInvalid',
	    value: function isCropInvalid(crop) {
	      return !crop.width || !crop.height;
	    }
	  }, {
	    key: 'nextCropState',
	    value: function nextCropState(crop) {
	      var nextCrop = (0, _objectAssign2.default)({}, ReactCrop.defaultCrop, crop);
	      this.cropInvalid = this.isCropInvalid(nextCrop);
	      return nextCrop;
	    }
	  }, {
	    key: 'clamp',
	    value: function clamp(num, min, max) {
	      return Math.min(Math.max(num, min), max);
	    }
	  }, {
	    key: 'crossOverCheck',
	    value: function crossOverCheck() {
	      var evData = this.evData;

	      if (!evData.xCrossOver && -Math.abs(evData.cropStartWidth) - evData.xDiffPc >= 0 || evData.xCrossOver && -Math.abs(evData.cropStartWidth) - evData.xDiffPc <= 0) {
	        evData.xCrossOver = !evData.xCrossOver;
	      }

	      if (!evData.yCrossOver && -Math.abs(evData.cropStartHeight) - evData.yDiffPc >= 0 || evData.yCrossOver && -Math.abs(evData.cropStartHeight) - evData.yDiffPc <= 0) {
	        evData.yCrossOver = !evData.yCrossOver;
	      }

	      var swapXOrd = evData.xCrossOver !== evData.startXCrossOver;
	      var swapYOrd = evData.yCrossOver !== evData.startYCrossOver;

	      evData.inversedXOrd = swapXOrd ? this.inverseOrd(evData.ord) : false;
	      evData.inversedYOrd = swapYOrd ? this.inverseOrd(evData.ord) : false;
	    }
	  }, {
	    key: 'inverseOrd',
	    value: function inverseOrd(ord) {
	      var inverseOrd = void 0;

	      if (ord === 'n') inverseOrd = 's';else if (ord === 'ne') inverseOrd = 'sw';else if (ord === 'e') inverseOrd = 'w';else if (ord === 'se') inverseOrd = 'nw';else if (ord === 's') inverseOrd = 'n';else if (ord === 'sw') inverseOrd = 'ne';else if (ord === 'w') inverseOrd = 'e';else if (ord === 'nw') inverseOrd = 'se';

	      return inverseOrd;
	    }
	  }, {
	    key: 'ensureAspectDimensions',
	    value: function ensureAspectDimensions(cropObj, imageEl) {
	      var imageWidth = imageEl.naturalWidth;
	      var imageHeight = imageEl.naturalHeight;
	      var imageAspect = imageWidth / imageHeight;
	      var crop = (0, _objectAssign2.default)({}, cropObj);

	      if (crop.width) {
	        crop.height = crop.width / crop.aspect * imageAspect;
	      } else if (crop.height) {
	        crop.width = crop.height * crop.aspect / imageAspect;
	      }

	      if (crop.y + crop.height > 100) {
	        crop.height = 100 - crop.y;
	        crop.width = crop.height * crop.aspect / imageAspect;
	      }
	      if (crop.x + crop.width > 100) {
	        crop.width = 100 - crop.x;
	        crop.height = crop.width / crop.aspect * imageAspect;
	      }

	      return crop;
	    }

	    // Unfortunately some modern browsers like Firefox still don't support svg's as a css property..

	  }, {
	    key: 'renderSvg',
	    value: function renderSvg() {
	      var shape = void 0;
	      if (this.props.ellipse) {
	        shape = _react2.default.createElement('ellipse', this.getEllipseValues(true));
	      } else {
	        var _getPolygonValues2 = this.getPolygonValues(true);

	        var top = _getPolygonValues2.top;
	        var bottom = _getPolygonValues2.bottom;

	        shape = _react2.default.createElement('polygon', { points: top.left + ', ' + top.right + ', ' + bottom.right + ', ' + bottom.left });
	      }

	      return _react2.default.createElement(
	        'svg',
	        { width: '0', height: '0', style: { position: 'absolute' } },
	        _react2.default.createElement(
	          'defs',
	          null,
	          _react2.default.createElement(
	            'clipPath',
	            { id: this.getPolygonId(), clipPathUnits: 'objectBoundingBox' },
	            shape
	          )
	        )
	      );
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this4 = this;

	      var cropSelection = void 0;
	      var imageClip = void 0;

	      if (!this.cropInvalid) {
	        cropSelection = this.createCropSelection();
	        imageClip = {
	          WebkitClipPath: this.props.ellipse ? this.getEllipseClipPath() : this.getPolygonClipPath(),
	          clipPath: 'url("#' + this.getPolygonId() + '")'
	        };
	      }

	      var componentClasses = ['ReactCrop'];

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

	      return _react2.default.createElement(
	        'div',
	        {
	          ref: function ref(c) {
	            _this4.componentRef = c;
	          },
	          className: componentClasses.join(' '),
	          onTouchStart: this.onComponentMouseTouchDown,
	          onMouseDown: this.onComponentMouseTouchDown,
	          tabIndex: '1',
	          onKeyDown: this.onComponentKeyDown
	        },
	        this.renderSvg(),
	        _react2.default.createElement('img', {
	          ref: function ref(c) {
	            _this4.imageRef = c;
	          },
	          crossOrigin: 'anonymous',
	          className: 'ReactCrop--image',
	          src: this.props.src,
	          onLoad: function onLoad(e) {
	            _this4.onImageLoad(e.target);
	          },
	          alt: ''
	        }),
	        _react2.default.createElement(
	          'div',
	          {
	            className: 'ReactCrop--crop-wrapper',
	            ref: function ref(c) {
	              _this4.cropWrapperRef = c;
	            }
	          },
	          _react2.default.createElement('img', {
	            ref: function ref(c) {
	              _this4.imageCopyRef = c;
	            },
	            className: 'ReactCrop--image-copy',
	            src: this.props.src,
	            style: imageClip,
	            alt: ''
	          }),
	          cropSelection
	        ),
	        this.props.children
	      );
	    }
	  }]);

	  return ReactCrop;
	}(_react.Component);

	ReactCrop.propTypes = {
	  src: _react.PropTypes.string.isRequired,
	  crop: _react.PropTypes.object,
	  minWidth: _react.PropTypes.number,
	  minHeight: _react.PropTypes.number,
	  maxWidth: _react.PropTypes.number,
	  maxHeight: _react.PropTypes.number,
	  keepSelection: _react.PropTypes.bool,
	  onChange: _react.PropTypes.func,
	  onComplete: _react.PropTypes.func,
	  onImageLoaded: _react.PropTypes.func,
	  disabled: _react.PropTypes.bool,
	  ellipse: _react.PropTypes.bool,
	  children: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.arrayOf(_react2.default.PropTypes.node), _react2.default.PropTypes.node])
	};
	ReactCrop.defaultProps = {
	  disabled: false,
	  maxWidth: 100,
	  maxHeight: 100
	};
	ReactCrop.xOrds = ['e', 'w'];
	ReactCrop.yOrds = ['n', 's'];
	ReactCrop.xyOrds = ['nw', 'ne', 'se', 'sw'];
	ReactCrop.arrowKey = {
	  left: 37,
	  up: 38,
	  right: 39,
	  down: 40
	};
	ReactCrop.nudgeStep = 0.2;
	ReactCrop.defaultCrop = {
	  x: 0,
	  y: 0,
	  width: 0,
	  height: 0,
	  aspect: false
	};


	module.exports = ReactCrop;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("object-assign");

/***/ }
/******/ ]);