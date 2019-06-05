(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["ReactCrop"] = factory(require("react"));
	else
		root["ReactCrop"] = factory(root["React"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_react__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/ReactCrop.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/ReactCrop.js":
/*!**************************!*\
  !*** ./lib/ReactCrop.js ***!
  \**************************/
/*! exports provided: default, Component, makeAspectCrop, containCrop */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return ReactCrop; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Component\", function() { return ReactCrop; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"makeAspectCrop\", function() { return makeAspectCrop; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"containCrop\", function() { return containCrop; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ \"./node_modules/prop-types/index.js\");\n/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }\n\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance\"); }\n\nfunction _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === \"[object Arguments]\") return Array.from(iter); }\n\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nfunction _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }\n\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance\"); }\n\nfunction _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i[\"return\"] != null) _i[\"return\"](); } finally { if (_d) throw _e; } } return _arr; }\n\nfunction _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }\n\n/* globals document, window */\n\n // Feature detection\n// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Improving_scrolling_performance_with_passive_listeners\n\nvar passiveSupported = false;\n\ntry {\n  window.addEventListener('test', null, Object.defineProperty({}, 'passive', {\n    get: function get() {\n      passiveSupported = true;\n      return true;\n    }\n  }));\n} catch (err) {} // eslint-disable-line no-empty\n\n\nvar EMPTY_GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';\n\nfunction getClientPos(e) {\n  var pageX;\n  var pageY;\n\n  if (e.touches) {\n    var _e$touches = _slicedToArray(e.touches, 1);\n\n    var _e$touches$ = _e$touches[0];\n    pageX = _e$touches$.pageX;\n    pageY = _e$touches$.pageY;\n  } else {\n    pageX = e.pageX;\n    pageY = e.pageY;\n  }\n\n  return {\n    x: pageX,\n    y: pageY\n  };\n}\n\nfunction clamp(num, min, max) {\n  return Math.min(Math.max(num, min), max);\n}\n\nfunction isCropValid(crop) {\n  return crop && crop.width && crop.height && !isNaN(crop.width) && !isNaN(crop.height);\n}\n\nfunction inverseOrd(ord) {\n  var inversedOrd;\n  if (ord === 'n') inversedOrd = 's';else if (ord === 'ne') inversedOrd = 'sw';else if (ord === 'e') inversedOrd = 'w';else if (ord === 'se') inversedOrd = 'nw';else if (ord === 's') inversedOrd = 'n';else if (ord === 'sw') inversedOrd = 'ne';else if (ord === 'w') inversedOrd = 'e';else if (ord === 'nw') inversedOrd = 'se';\n  return inversedOrd;\n}\n\nfunction makeAspectCrop(crop, imageWidth, imageHeight) {\n  if (isNaN(crop.aspect)) {\n    console.warn('`crop.aspect` should be a number in order to make an aspect crop', crop);\n    return crop;\n  }\n\n  var completeCrop = _objectSpread({\n    x: 0,\n    y: 0\n  }, crop);\n\n  if (crop.width) {\n    completeCrop.height = completeCrop.width / crop.aspect;\n  }\n\n  if (crop.height) {\n    completeCrop.width = completeCrop.height * crop.aspect;\n  }\n\n  if (completeCrop.y + completeCrop.height > imageHeight) {\n    completeCrop.height = imageHeight - completeCrop.y;\n    completeCrop.width = completeCrop.height * crop.aspect;\n  }\n\n  if (completeCrop.x + completeCrop.width > imageWidth) {\n    completeCrop.width = imageWidth - completeCrop.x;\n    completeCrop.height = completeCrop.width / crop.aspect;\n  }\n\n  return completeCrop;\n}\n\nfunction convertToPercentCrop(crop, imageWidth, imageHeight) {\n  if (crop.unit === 'pc') {\n    return crop;\n  }\n\n  return {\n    unit: 'pc',\n    aspect: crop.aspect,\n    x: crop.x / imageWidth * 100,\n    y: crop.y / imageHeight * 100,\n    width: crop.width / imageWidth * 100,\n    height: crop.height / imageHeight * 100\n  };\n}\n\nfunction convertToPixelCrop(crop, imageWidth, imageHeight) {\n  if (crop.unit === 'px') {\n    return crop;\n  }\n\n  return {\n    unit: 'px',\n    aspect: crop.aspect,\n    x: crop.x * imageWidth / 100,\n    y: crop.y * imageHeight / 100,\n    width: crop.width * imageWidth / 100,\n    height: crop.height * imageHeight / 100\n  };\n}\n\nfunction isAspectInvalid(crop, imageWidth, imageHeight) {\n  if (!crop.width && crop.height || crop.width && !crop.height) {\n    return true;\n  }\n\n  return crop.width / crop.aspect !== crop.height || crop.height * crop.aspect !== crop.width || crop.y + crop.height > imageHeight || crop.x + crop.width > imageWidth;\n}\n\nfunction resolveCrop(crop, imageWidth, imageHeight) {\n  var resolvedCrop = crop;\n\n  if (crop.unit === 'pc') {\n    resolvedCrop = convertToPixelCrop(crop, imageWidth, imageHeight);\n  }\n\n  if (resolvedCrop && resolvedCrop.aspect && isAspectInvalid(resolvedCrop, imageWidth, imageHeight)) {\n    return makeAspectCrop(resolvedCrop, imageWidth, imageHeight);\n  }\n\n  return resolvedCrop;\n}\n\nfunction containCrop(prevCrop, crop, imageWidth, imageHeight) {\n  var prevPixelCrop = convertToPixelCrop(prevCrop, imageWidth, imageHeight);\n\n  var contained = _objectSpread({}, crop); // Non-aspects are simple\n\n\n  if (!crop.aspect) {\n    if (crop.x < 0) {\n      contained.x = 0;\n      contained.width += crop.x;\n    } else if (crop.x + crop.width > imageWidth) {\n      contained.width = imageWidth - crop.x;\n    }\n\n    if (crop.y + crop.height > imageHeight) {\n      contained.height = imageHeight - crop.y;\n    }\n\n    return contained;\n  }\n\n  var heightAdjusted = false;\n\n  if (crop.x < 0) {\n    contained.x = 0;\n    contained.width += crop.x;\n    contained.height = contained.width / crop.aspect;\n    heightAdjusted = true;\n  } else if (crop.x + crop.width > imageWidth) {\n    contained.width = imageWidth - crop.x;\n    contained.height = contained.width / crop.aspect;\n    heightAdjusted = true;\n  } // If sizing in up direction we need to pin Y at the point it\n  // would be at the boundary.\n\n\n  if (heightAdjusted && prevPixelCrop.y > contained.y) {\n    contained.y = crop.y + (crop.height - contained.height);\n  }\n\n  var widthAdjusted = false;\n\n  if (crop.y + crop.height > imageHeight) {\n    contained.height = imageHeight - crop.y;\n    contained.width = contained.height * crop.aspect;\n    widthAdjusted = true;\n  } // If sizing in left direction we need to pin X at the point it\n  // would be at the boundary.\n\n\n  if (widthAdjusted && prevPixelCrop.x > contained.x) {\n    contained.x = crop.x + (crop.width - contained.width);\n  }\n\n  return contained;\n}\n\nvar ReactCrop =\n/*#__PURE__*/\nfunction (_PureComponent) {\n  _inherits(ReactCrop, _PureComponent);\n\n  function ReactCrop() {\n    var _getPrototypeOf2;\n\n    var _this;\n\n    _classCallCheck(this, ReactCrop);\n\n    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {\n      args[_key] = arguments[_key];\n    }\n\n    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ReactCrop)).call.apply(_getPrototypeOf2, [this].concat(args)));\n\n    _defineProperty(_assertThisInitialized(_this), \"window\", window);\n\n    _defineProperty(_assertThisInitialized(_this), \"document\", document);\n\n    _defineProperty(_assertThisInitialized(_this), \"state\", {});\n\n    _defineProperty(_assertThisInitialized(_this), \"onCropMouseTouchDown\", function (e) {\n      var disabled = _this.props.disabled;\n\n      if (disabled) {\n        return;\n      }\n\n      e.preventDefault(); // Stop drag selection.\n\n      var clientPos = getClientPos(e); // Focus for detecting keypress.\n\n      _this.componentRef.focus({\n        preventScroll: true\n      });\n\n      var ord = e.target.dataset.ord;\n      var xInversed = ord === 'nw' || ord === 'w' || ord === 'sw';\n      var yInversed = ord === 'nw' || ord === 'n' || ord === 'ne';\n      var cropOffset;\n      var crop = convertToPixelCrop(_this.props.crop, _this.imageRef.width, _this.imageRef.width);\n\n      if (crop.aspect) {\n        cropOffset = _this.getElementOffset(_this.cropSelectRef);\n      }\n\n      _this.evData = {\n        clientStartX: clientPos.x,\n        clientStartY: clientPos.y,\n        cropStartWidth: crop.width,\n        cropStartHeight: crop.height,\n        cropStartX: xInversed ? crop.x + crop.width : crop.x,\n        cropStartY: yInversed ? crop.y + crop.height : crop.y,\n        xInversed: xInversed,\n        yInversed: yInversed,\n        xCrossOver: xInversed,\n        yCrossOver: yInversed,\n        startXCrossOver: xInversed,\n        startYCrossOver: yInversed,\n        isResize: e.target.dataset.ord,\n        ord: ord,\n        cropOffset: cropOffset\n      };\n      _this.mouseDownOnCrop = true;\n\n      _this.setState({\n        cropIsActive: true\n      });\n    });\n\n    _defineProperty(_assertThisInitialized(_this), \"onComponentMouseTouchDown\", function (e) {\n      var _this$props = _this.props,\n          crop = _this$props.crop,\n          disabled = _this$props.disabled,\n          locked = _this$props.locked,\n          keepSelection = _this$props.keepSelection,\n          onChange = _this$props.onChange;\n\n      if (e.target !== _this.imageRef) {\n        return;\n      }\n\n      if (disabled || locked || keepSelection && isCropValid(crop)) {\n        return;\n      }\n\n      e.preventDefault(); // Stop drag selection.\n\n      var clientPos = getClientPos(e); // Focus for detecting keypress.\n\n      _this.componentRef.focus({\n        preventScroll: true\n      });\n\n      var imageOffset = _this.getElementOffset(_this.imageRef);\n\n      var x = clientPos.x - imageOffset.left;\n      var y = clientPos.y - imageOffset.top;\n      var nextCrop = {\n        units: 'px',\n        aspect: crop ? crop.aspect : undefined,\n        x: x,\n        y: y,\n        width: 0,\n        height: 0\n      };\n      _this.evData = {\n        clientStartX: clientPos.x,\n        clientStartY: clientPos.y,\n        cropStartWidth: nextCrop.width,\n        cropStartHeight: nextCrop.height,\n        cropStartX: nextCrop.x,\n        cropStartY: nextCrop.y,\n        xInversed: false,\n        yInversed: false,\n        xCrossOver: false,\n        yCrossOver: false,\n        startXCrossOver: false,\n        startYCrossOver: false,\n        isResize: true,\n        ord: 'nw'\n      };\n      _this.mouseDownOnCrop = true;\n      onChange(convertToPixelCrop(nextCrop, _this.imageRef.width, _this.imageRef.height), convertToPercentCrop(nextCrop, _this.imageRef.width, _this.imageRef.height));\n\n      _this.setState({\n        cropIsActive: true\n      });\n    });\n\n    _defineProperty(_assertThisInitialized(_this), \"onDocMouseTouchMove\", function (e) {\n      var _this$props2 = _this.props,\n          crop = _this$props2.crop,\n          disabled = _this$props2.disabled,\n          onChange = _this$props2.onChange,\n          onDragStart = _this$props2.onDragStart;\n\n      if (disabled) {\n        return;\n      }\n\n      if (!_this.mouseDownOnCrop) {\n        return;\n      }\n\n      e.preventDefault(); // Stop drag selection.\n\n      if (!_this.dragStarted) {\n        _this.dragStarted = true;\n        onDragStart(e);\n      }\n\n      var _assertThisInitialize = _assertThisInitialized(_this),\n          evData = _assertThisInitialize.evData;\n\n      var clientPos = getClientPos(e);\n\n      if (evData.isResize && crop.aspect && evData.cropOffset) {\n        clientPos.y = _this.straightenYPath(clientPos.x);\n      }\n\n      evData.xDiff = clientPos.x - evData.clientStartX;\n      evData.yDiff = clientPos.y - evData.clientStartY;\n      var nextCrop;\n\n      if (evData.isResize) {\n        nextCrop = _this.resizeCrop();\n      } else {\n        nextCrop = _this.dragCrop();\n      }\n\n      if (nextCrop !== crop) {\n        onChange(convertToPixelCrop(nextCrop, _this.imageRef.width, _this.imageRef.height), convertToPercentCrop(nextCrop, _this.imageRef.width, _this.imageRef.height));\n      }\n    });\n\n    _defineProperty(_assertThisInitialized(_this), \"onComponentKeyDown\", function (e) {\n      var _this$props3 = _this.props,\n          crop = _this$props3.crop,\n          disabled = _this$props3.disabled,\n          onChange = _this$props3.onChange,\n          onComplete = _this$props3.onComplete;\n\n      if (disabled) {\n        return;\n      }\n\n      var keyCode = e.which;\n      var nudged = false;\n\n      if (!isCropValid(crop)) {\n        return;\n      }\n\n      var nextCrop = _this.makeNewCrop();\n\n      if (keyCode === ReactCrop.arrowKey.left) {\n        nextCrop.x -= ReactCrop.nudgeStep;\n        nudged = true;\n      } else if (keyCode === ReactCrop.arrowKey.right) {\n        nextCrop.x += ReactCrop.nudgeStep;\n        nudged = true;\n      } else if (keyCode === ReactCrop.arrowKey.up) {\n        nextCrop.y -= ReactCrop.nudgeStep;\n        nudged = true;\n      } else if (keyCode === ReactCrop.arrowKey.down) {\n        nextCrop.y += ReactCrop.nudgeStep;\n        nudged = true;\n      }\n\n      if (nudged) {\n        e.preventDefault(); // Stop drag selection.\n\n        nextCrop.x = clamp(nextCrop.x, 0, _this.imageRef.width - nextCrop.width);\n        nextCrop.y = clamp(nextCrop.y, 0, _this.imageRef.height - nextCrop.height);\n        var pixelCrop = convertToPixelCrop(nextCrop, _this.imageRef.width, _this.imageRef.height);\n        var percentCrop = convertToPercentCrop(nextCrop, _this.imageRef.width, _this.imageRef.height);\n        onChange(pixelCrop, percentCrop);\n        onComplete(pixelCrop, percentCrop);\n      }\n    });\n\n    _defineProperty(_assertThisInitialized(_this), \"onDocMouseTouchEnd\", function (e) {\n      var _this$props4 = _this.props,\n          crop = _this$props4.crop,\n          disabled = _this$props4.disabled,\n          onComplete = _this$props4.onComplete,\n          onDragEnd = _this$props4.onDragEnd;\n\n      if (disabled) {\n        return;\n      }\n\n      if (_this.mouseDownOnCrop) {\n        _this.mouseDownOnCrop = false;\n        _this.dragStarted = false;\n        onDragEnd(e);\n        onComplete(convertToPixelCrop(crop, _this.imageRef.width, _this.imageRef.height), convertToPercentCrop(crop, _this.imageRef.width, _this.imageRef.height));\n\n        _this.setState({\n          cropIsActive: false\n        });\n      }\n    });\n\n    return _this;\n  }\n\n  _createClass(ReactCrop, [{\n    key: \"componentDidMount\",\n    value: function componentDidMount() {\n      var options = passiveSupported ? {\n        passive: false\n      } : false;\n      this.document.addEventListener('mousemove', this.onDocMouseTouchMove, options);\n      this.document.addEventListener('touchmove', this.onDocMouseTouchMove, options);\n      this.document.addEventListener('mouseup', this.onDocMouseTouchEnd, options);\n      this.document.addEventListener('touchend', this.onDocMouseTouchEnd, options);\n      this.document.addEventListener('touchcancel', this.onDocMouseTouchEnd, options);\n\n      if (this.imageRef.complete || this.imageRef.readyState) {\n        if (this.imageRef.naturalWidth === 0) {\n          // Broken load on iOS, PR #51\n          // https://css-tricks.com/snippets/jquery/fixing-load-in-ie-for-cached-images/\n          // http://stackoverflow.com/questions/821516/browser-independent-way-to-detect-when-image-has-been-loaded\n          var src = this.imageRef.src;\n          this.imageRef.src = EMPTY_GIF;\n          this.imageRef.src = src;\n        } else {\n          this.onImageLoad(this.imageRef);\n        }\n      }\n    }\n  }, {\n    key: \"componentWillUnmount\",\n    value: function componentWillUnmount() {\n      this.document.removeEventListener('mousemove', this.onDocMouseTouchMove);\n      this.document.removeEventListener('touchmove', this.onDocMouseTouchMove);\n      this.document.removeEventListener('mouseup', this.onDocMouseTouchEnd);\n      this.document.removeEventListener('touchend', this.onDocMouseTouchEnd);\n      this.document.removeEventListener('touchcancel', this.onDocMouseTouchEnd);\n    }\n  }, {\n    key: \"onImageLoad\",\n    value: function onImageLoad(image) {\n      var _this$props5 = this.props,\n          onComplete = _this$props5.onComplete,\n          onChange = _this$props5.onChange,\n          onImageLoaded = _this$props5.onImageLoaded;\n\n      var crop = _objectSpread({}, ReactCrop.defaultCrop, this.props.crop);\n\n      var resolvedCrop = resolveCrop(crop, image.width, image.height); // Return false from onImageLoaded if you set the crop with setState in there as otherwise the subsequent\n      // onChange + onComplete will not have your updated crop.\n\n      var res = onImageLoaded(image);\n\n      if (res !== false) {\n        var pixelCrop = convertToPixelCrop(resolvedCrop, image.width, image.height);\n        var percentCrop = convertToPercentCrop(resolvedCrop, image.width, image.height);\n        onChange(pixelCrop, percentCrop);\n        onComplete(pixelCrop, percentCrop);\n      }\n    }\n  }, {\n    key: \"getElementOffset\",\n    value: function getElementOffset(el) {\n      var rect = el.getBoundingClientRect();\n      var docEl = this.document.documentElement;\n      var rectTop = rect.top + this.window.pageYOffset - docEl.clientTop;\n      var rectLeft = rect.left + this.window.pageXOffset - docEl.clientLeft;\n      return {\n        top: rectTop,\n        left: rectLeft\n      };\n    }\n  }, {\n    key: \"getCropStyle\",\n    value: function getCropStyle() {\n      var crop = this.props.crop;\n\n      if (this.imageRef && crop.unit === 'pc') {\n        crop = convertToPixelCrop(crop, this.imageRef.width, this.imageRef.height);\n      }\n\n      return {\n        top: \"\".concat(crop.y, \"px\"),\n        left: \"\".concat(crop.x, \"px\"),\n        width: \"\".concat(crop.width, \"px\"),\n        height: \"\".concat(crop.height, \"px\")\n      };\n    }\n  }, {\n    key: \"getNewSize\",\n    value: function getNewSize() {\n      var _this$props6 = this.props,\n          crop = _this$props6.crop,\n          minWidth = _this$props6.minWidth,\n          maxWidth = _this$props6.maxWidth,\n          minHeight = _this$props6.minHeight,\n          maxHeight = _this$props6.maxHeight;\n      var evData = this.evData,\n          imageRef = this.imageRef; // New width.\n\n      var newWidth = evData.cropStartWidth + evData.xDiff;\n\n      if (evData.xCrossOver) {\n        newWidth = Math.abs(newWidth);\n      }\n\n      newWidth = clamp(newWidth, minWidth, maxWidth || imageRef.width); // New height.\n\n      var newHeight;\n\n      if (crop.aspect) {\n        newHeight = newWidth / crop.aspect;\n      } else {\n        newHeight = evData.cropStartHeight + evData.yDiff;\n      }\n\n      if (evData.yCrossOver) {\n        // Cap if polarity is inversed and the height fills the y space.\n        newHeight = Math.min(Math.abs(newHeight), evData.cropStartY);\n      }\n\n      newHeight = clamp(newHeight, minHeight, maxHeight || imageRef.height);\n\n      if (crop.aspect) {\n        newWidth = clamp(newHeight * crop.aspect, 0, this.imageRef.width);\n      }\n\n      return {\n        width: newWidth,\n        height: newHeight\n      };\n    }\n  }, {\n    key: \"dragCrop\",\n    value: function dragCrop() {\n      var nextCrop = this.makeNewCrop();\n      var evData = this.evData;\n      nextCrop.x = clamp(evData.cropStartX + evData.xDiff, 0, this.imageRef.width - nextCrop.width);\n      nextCrop.y = clamp(evData.cropStartY + evData.yDiff, 0, this.imageRef.height - nextCrop.height);\n      return nextCrop;\n    }\n  }, {\n    key: \"resizeCrop\",\n    value: function resizeCrop() {\n      var nextCrop = this.makeNewCrop();\n      var evData = this.evData;\n      var _this$props7 = this.props,\n          crop = _this$props7.crop,\n          minWidth = _this$props7.minWidth,\n          minHeight = _this$props7.minHeight;\n      var ord = evData.ord; // On the inverse change the diff so it's the same and\n      // the same algo applies.\n\n      if (evData.xInversed) {\n        evData.xDiff -= evData.cropStartWidth * 2;\n      }\n\n      if (evData.yInversed) {\n        evData.yDiff -= evData.cropStartHeight * 2;\n      } // New size.\n\n\n      var newSize = this.getNewSize(); // Adjust x/y to give illusion of 'staticness' as width/height is increased\n      // when polarity is inversed.\n\n      var newX = evData.cropStartX;\n      var newY = evData.cropStartY;\n\n      if (evData.xCrossOver) {\n        newX = nextCrop.x + (nextCrop.width - newSize.width);\n      }\n\n      if (evData.yCrossOver) {\n        // This not only removes the little \"shake\" when inverting at a diagonal, but for some\n        // reason y was way off at fast speeds moving sw->ne with fixed aspect only, I couldn't\n        // figure out why.\n        if (evData.lastYCrossover === false) {\n          newY = nextCrop.y - newSize.height;\n        } else {\n          newY = nextCrop.y + (nextCrop.height - newSize.height);\n        }\n      }\n\n      var containedCrop = containCrop(this.props.crop, {\n        unit: nextCrop.unit,\n        x: newX,\n        y: newY,\n        width: newSize.width,\n        height: newSize.height,\n        aspect: nextCrop.aspect\n      }, this.imageRef.width, this.imageRef.height); // Apply x/y/width/height changes depending on ordinate (fixed aspect always applies both).\n\n      if (nextCrop.aspect || ReactCrop.xyOrds.indexOf(ord) > -1) {\n        nextCrop.x = containedCrop.x;\n        nextCrop.y = containedCrop.y;\n        nextCrop.width = containedCrop.width;\n        nextCrop.height = containedCrop.height;\n      } else if (ReactCrop.xOrds.indexOf(ord) > -1) {\n        nextCrop.x = containedCrop.x;\n        nextCrop.width = containedCrop.width;\n      } else if (ReactCrop.yOrds.indexOf(ord) > -1) {\n        nextCrop.y = containedCrop.y;\n        nextCrop.height = containedCrop.height;\n      }\n\n      evData.lastYCrossover = evData.yCrossOver;\n      this.crossOverCheck(); // Ensure new dimensions aren't less than min dimensions.\n\n      if (minWidth && nextCrop.width < minWidth) {\n        return crop;\n      }\n\n      if (minHeight && nextCrop.height < minHeight) {\n        return crop;\n      }\n\n      return nextCrop;\n    }\n  }, {\n    key: \"straightenYPath\",\n    value: function straightenYPath(clientX) {\n      var evData = this.evData;\n      var ord = evData.ord;\n      var cropOffset = evData.cropOffset,\n          cropStartWidth = evData.cropStartWidth,\n          cropStartHeight = evData.cropStartHeight;\n      var k;\n      var d;\n\n      if (ord === 'nw' || ord === 'se') {\n        k = cropStartHeight / cropStartWidth;\n        d = cropOffset.top - cropOffset.left * k;\n      } else {\n        k = -cropStartHeight / cropStartWidth;\n        d = cropOffset.top + (cropStartHeight - cropOffset.left * k);\n      }\n\n      return k * clientX + d;\n    }\n  }, {\n    key: \"createCropSelection\",\n    value: function createCropSelection() {\n      var _this2 = this;\n\n      var _this$props8 = this.props,\n          disabled = _this$props8.disabled,\n          locked = _this$props8.locked,\n          renderSelectionAddon = _this$props8.renderSelectionAddon;\n      var style = this.getCropStyle();\n      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        ref: function ref(n) {\n          _this2.cropSelectRef = n;\n        },\n        style: style,\n        className: \"ReactCrop__crop-selection\",\n        onMouseDown: this.onCropMouseTouchDown,\n        onTouchStart: this.onCropMouseTouchDown,\n        role: \"presentation\"\n      }, !disabled && !locked && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"ReactCrop__drag-elements\"\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"ReactCrop__drag-bar ord-n\",\n        \"data-ord\": \"n\"\n      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"ReactCrop__drag-bar ord-e\",\n        \"data-ord\": \"e\"\n      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"ReactCrop__drag-bar ord-s\",\n        \"data-ord\": \"s\"\n      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"ReactCrop__drag-bar ord-w\",\n        \"data-ord\": \"w\"\n      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"ReactCrop__drag-handle ord-nw\",\n        \"data-ord\": \"nw\"\n      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"ReactCrop__drag-handle ord-n\",\n        \"data-ord\": \"n\"\n      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"ReactCrop__drag-handle ord-ne\",\n        \"data-ord\": \"ne\"\n      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"ReactCrop__drag-handle ord-e\",\n        \"data-ord\": \"e\"\n      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"ReactCrop__drag-handle ord-se\",\n        \"data-ord\": \"se\"\n      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"ReactCrop__drag-handle ord-s\",\n        \"data-ord\": \"s\"\n      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"ReactCrop__drag-handle ord-sw\",\n        \"data-ord\": \"sw\"\n      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        className: \"ReactCrop__drag-handle ord-w\",\n        \"data-ord\": \"w\"\n      })), renderSelectionAddon && renderSelectionAddon(this.state));\n    }\n  }, {\n    key: \"makeNewCrop\",\n    value: function makeNewCrop() {\n      var crop = _objectSpread({}, ReactCrop.defaultCrop, this.props.crop);\n\n      if (crop.unit === 'pc') {\n        return convertToPixelCrop(crop, this.imageRef.width, this.imageRef.height);\n      }\n\n      return crop;\n    }\n  }, {\n    key: \"crossOverCheck\",\n    value: function crossOverCheck() {\n      var evData = this.evData;\n\n      if (!evData.xCrossOver && -Math.abs(evData.cropStartWidth) - evData.xDiff >= 0 || evData.xCrossOver && -Math.abs(evData.cropStartWidth) - evData.xDiff <= 0) {\n        evData.xCrossOver = !evData.xCrossOver;\n      }\n\n      if (!evData.yCrossOver && -Math.abs(evData.cropStartHeight) - evData.yDiff >= 0 || evData.yCrossOver && -Math.abs(evData.cropStartHeight) - evData.yDiff <= 0) {\n        evData.yCrossOver = !evData.yCrossOver;\n      }\n\n      var swapXOrd = evData.xCrossOver !== evData.startXCrossOver;\n      var swapYOrd = evData.yCrossOver !== evData.startYCrossOver;\n      evData.inversedXOrd = swapXOrd ? inverseOrd(evData.ord) : false;\n      evData.inversedYOrd = swapYOrd ? inverseOrd(evData.ord) : false;\n    }\n  }, {\n    key: \"render\",\n    value: function render() {\n      var _this3 = this;\n\n      var _this$props9 = this.props,\n          children = _this$props9.children,\n          className = _this$props9.className,\n          crossorigin = _this$props9.crossorigin,\n          crop = _this$props9.crop,\n          disabled = _this$props9.disabled,\n          locked = _this$props9.locked,\n          imageAlt = _this$props9.imageAlt,\n          onImageError = _this$props9.onImageError,\n          src = _this$props9.src,\n          style = _this$props9.style,\n          imageStyle = _this$props9.imageStyle;\n      var cropIsActive = this.state.cropIsActive;\n      var cropSelection;\n\n      if (isCropValid(crop) && this.imageRef) {\n        cropSelection = this.createCropSelection();\n      }\n\n      var componentClasses = ['ReactCrop'];\n\n      if (cropIsActive) {\n        componentClasses.push('ReactCrop--active');\n      }\n\n      if (crop) {\n        if (crop.aspect) {\n          componentClasses.push('ReactCrop--fixed-aspect');\n        } // In this case we have to shadow the image, since the box-shadow\n        // on the crop won't work.\n\n\n        if (cropIsActive && (!crop.width || !crop.height)) {\n          componentClasses.push('ReactCrop--crop-invisible');\n        }\n      }\n\n      if (disabled) {\n        componentClasses.push('ReactCrop--disabled');\n      }\n\n      if (locked) {\n        componentClasses.push('ReactCrop--locked');\n      }\n\n      if (className) {\n        componentClasses.push.apply(componentClasses, _toConsumableArray(className.split(' ')));\n      }\n\n      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n        ref: function ref(n) {\n          _this3.componentRef = n;\n        },\n        className: componentClasses.join(' '),\n        style: style,\n        onTouchStart: this.onComponentMouseTouchDown,\n        onMouseDown: this.onComponentMouseTouchDown,\n        role: \"presentation\",\n        tabIndex: 1,\n        onKeyDown: this.onComponentKeyDown\n      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"img\", {\n        ref: function ref(n) {\n          _this3.imageRef = n;\n        },\n        crossOrigin: crossorigin,\n        className: \"ReactCrop__image\",\n        style: imageStyle,\n        src: src,\n        onLoad: function onLoad(e) {\n          return _this3.onImageLoad(e.target);\n        },\n        onError: onImageError,\n        alt: imageAlt\n      }), children, cropSelection);\n    }\n  }]);\n\n  return ReactCrop;\n}(react__WEBPACK_IMPORTED_MODULE_0__[\"PureComponent\"]);\n\nReactCrop.xOrds = ['e', 'w'];\nReactCrop.yOrds = ['n', 's'];\nReactCrop.xyOrds = ['nw', 'ne', 'se', 'sw'];\nReactCrop.arrowKey = {\n  left: 37,\n  up: 38,\n  right: 39,\n  down: 40\n};\nReactCrop.nudgeStep = 0.2;\nReactCrop.defaultCrop = {\n  x: 0,\n  y: 0,\n  width: 0,\n  height: 0,\n  unit: 'px'\n};\nReactCrop.propTypes = {\n  className: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,\n  crossorigin: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,\n  children: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOfType([prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.arrayOf(prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.node), prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.node]),\n  crop: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.shape({\n    aspect: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,\n    x: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,\n    y: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,\n    width: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,\n    height: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,\n    unit: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOf(['px', 'pc'])\n  }),\n  disabled: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,\n  locked: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,\n  imageAlt: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,\n  imageStyle: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.shape({}),\n  keepSelection: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,\n  minWidth: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,\n  minHeight: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,\n  maxWidth: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,\n  maxHeight: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,\n  onChange: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func.isRequired,\n  onImageError: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,\n  onComplete: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,\n  onImageLoaded: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,\n  onDragStart: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,\n  onDragEnd: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,\n  src: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired,\n  style: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.shape({}),\n  renderSelectionAddon: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func\n};\nReactCrop.defaultProps = {\n  className: undefined,\n  crop: undefined,\n  crossorigin: undefined,\n  disabled: false,\n  locked: false,\n  imageAlt: '',\n  maxWidth: undefined,\n  maxHeight: undefined,\n  minWidth: 0,\n  minHeight: 0,\n  keepSelection: false,\n  onComplete: function onComplete() {},\n  onImageError: function onImageError() {},\n  onImageLoaded: function onImageLoaded() {},\n  onDragStart: function onDragStart() {},\n  onDragEnd: function onDragEnd() {},\n  children: undefined,\n  style: undefined,\n  imageStyle: undefined,\n  renderSelectionAddon: undefined\n};\n\n\n//# sourceURL=webpack://ReactCrop/./lib/ReactCrop.js?");

/***/ }),

/***/ "./node_modules/object-assign/index.js":
/*!*********************************************!*\
  !*** ./node_modules/object-assign/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
<<<<<<< HEAD
eval("/*\nobject-assign\n(c) Sindre Sorhus\n@license MIT\n*/\n\n\n/* eslint-disable no-unused-vars */\nvar getOwnPropertySymbols = Object.getOwnPropertySymbols;\nvar hasOwnProperty = Object.prototype.hasOwnProperty;\nvar propIsEnumerable = Object.prototype.propertyIsEnumerable;\n\nfunction toObject(val) {\n\tif (val === null || val === undefined) {\n\t\tthrow new TypeError('Object.assign cannot be called with null or undefined');\n\t}\n\n\treturn Object(val);\n}\n\nfunction shouldUseNative() {\n\ttry {\n\t\tif (!Object.assign) {\n\t\t\treturn false;\n\t\t}\n\n\t\t// Detect buggy property enumeration order in older V8 versions.\n\n\t\t// https://bugs.chromium.org/p/v8/issues/detail?id=4118\n\t\tvar test1 = new String('abc');  // eslint-disable-line no-new-wrappers\n\t\ttest1[5] = 'de';\n\t\tif (Object.getOwnPropertyNames(test1)[0] === '5') {\n\t\t\treturn false;\n\t\t}\n\n\t\t// https://bugs.chromium.org/p/v8/issues/detail?id=3056\n\t\tvar test2 = {};\n\t\tfor (var i = 0; i < 10; i++) {\n\t\t\ttest2['_' + String.fromCharCode(i)] = i;\n\t\t}\n\t\tvar order2 = Object.getOwnPropertyNames(test2).map(function (n) {\n\t\t\treturn test2[n];\n\t\t});\n\t\tif (order2.join('') !== '0123456789') {\n\t\t\treturn false;\n\t\t}\n\n\t\t// https://bugs.chromium.org/p/v8/issues/detail?id=3056\n\t\tvar test3 = {};\n\t\t'abcdefghijklmnopqrst'.split('').forEach(function (letter) {\n\t\t\ttest3[letter] = letter;\n\t\t});\n\t\tif (Object.keys(Object.assign({}, test3)).join('') !==\n\t\t\t\t'abcdefghijklmnopqrst') {\n\t\t\treturn false;\n\t\t}\n\n\t\treturn true;\n\t} catch (err) {\n\t\t// We don't expect any of the above to throw, but better to be safe.\n\t\treturn false;\n\t}\n}\n\nmodule.exports = shouldUseNative() ? Object.assign : function (target, source) {\n\tvar from;\n\tvar to = toObject(target);\n\tvar symbols;\n\n\tfor (var s = 1; s < arguments.length; s++) {\n\t\tfrom = Object(arguments[s]);\n\n\t\tfor (var key in from) {\n\t\t\tif (hasOwnProperty.call(from, key)) {\n\t\t\t\tto[key] = from[key];\n\t\t\t}\n\t\t}\n\n\t\tif (getOwnPropertySymbols) {\n\t\t\tsymbols = getOwnPropertySymbols(from);\n\t\t\tfor (var i = 0; i < symbols.length; i++) {\n\t\t\t\tif (propIsEnumerable.call(from, symbols[i])) {\n\t\t\t\t\tto[symbols[i]] = from[symbols[i]];\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n\n\treturn to;\n};\n\n\n//# sourceURL=webpack://ReactCrop/./node_modules/object-assign/index.js?");
=======


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.containCrop = exports.makeAspectCrop = exports.Component = exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /* globals document, window */


var _react = __webpack_require__(3);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Feature detection
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Improving_scrolling_performance_with_passive_listeners
var passiveSupported = false;

try {
  window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
    get: function get() {
      passiveSupported = true;return true;
    }
  }));
} catch (err) {} // eslint-disable-line no-empty

var EMPTY_GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

function getClientPos(e) {
  var pageX = void 0;
  var pageY = void 0;

  if (e.touches) {
    var _e$touches = _slicedToArray(e.touches, 1);

    var _e$touches$ = _e$touches[0];
    pageX = _e$touches$.pageX;
    pageY = _e$touches$.pageY;
  } else {
    pageX = e.pageX;
    pageY = e.pageY;
  }

  return {
    x: pageX,
    y: pageY
  };
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function isCropValid(crop) {
  return crop && crop.width && crop.height && !isNaN(crop.width) && !isNaN(crop.height);
}

function inverseOrd(ord) {
  var inversedOrd = void 0;

  if (ord === 'n') inversedOrd = 's';else if (ord === 'ne') inversedOrd = 'sw';else if (ord === 'e') inversedOrd = 'w';else if (ord === 'se') inversedOrd = 'nw';else if (ord === 's') inversedOrd = 'n';else if (ord === 'sw') inversedOrd = 'ne';else if (ord === 'w') inversedOrd = 'e';else if (ord === 'nw') inversedOrd = 'se';

  return inversedOrd;
}

function makeAspectCrop(crop, image) {
  if (isNaN(crop.aspect)) {
    console.warn('`crop.aspect` should be a number in order to make an aspect crop', crop);
    return crop;
  }

  var completeCrop = _extends({
    x: 0,
    y: 0
  }, crop);

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
  if (!crop.width && crop.height || crop.width && !crop.height) {
    return true;
  }

  return crop.width / crop.aspect !== crop.height || crop.height * crop.aspect !== crop.width || crop.y + crop.height > image.height || crop.x + crop.width > image.width;
}

function resolveCrop(crop, image) {
  if (crop && crop.aspect && isAspectInvalid(crop, image)) {
    return makeAspectCrop(crop, image);
  }

  return crop;
}

function containCrop(prevCrop, crop, image) {
  var contained = _extends({}, crop);

  // Non-aspects are simple
  if (!crop.aspect) {
    if (crop.x < 0) {
      contained.x = 0;
      contained.width += crop.x;
    } else if (crop.x + crop.width > image.width) {
      contained.width = image.width - crop.x;
    }

    if (crop.y + crop.height > image.height) {
      contained.height = image.height - crop.y;
    }

    return contained;
  }

  var widthAdjusted = false;

  if (crop.x < 0) {
    contained.x = 0;
    contained.width += crop.x;
    contained.height = contained.width / crop.aspect;
    widthAdjusted = true;
  } else if (crop.x + crop.width > image.width) {
    contained.width = image.width - crop.x;
    contained.height = contained.width / crop.aspect;
    widthAdjusted = true;
  }

  // If sizing in up direction we need to pin Y at the point it
  // would be at the boundary.
  if (widthAdjusted && prevCrop.y > contained.y) {
    contained.y = crop.y + (crop.height - contained.height);
  }

  var heightAdjusted = false;

  if (contained.y + contained.height > image.height) {
    contained.height = image.height - contained.y;
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

var ReactCrop = function (_PureComponent) {
  _inherits(ReactCrop, _PureComponent);

  function ReactCrop() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ReactCrop);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ReactCrop.__proto__ || Object.getPrototypeOf(ReactCrop)).call.apply(_ref, [this].concat(args))), _this), _this.window = window, _this.document = document, _this.state = {}, _this.onCropMouseTouchDown = function (e) {
      var _this$props = _this.props,
          crop = _this$props.crop,
          disabled = _this$props.disabled;


      if (disabled) {
        return;
      }

      e.preventDefault(); // Stop drag selection.

      var clientPos = getClientPos(e);

      // Focus for detecting keypress.
      _this.componentRef.focus({ preventScroll: true });

      var ord = e.target.dataset.ord;

      var xInversed = ord === 'nw' || ord === 'w' || ord === 'sw';
      var yInversed = ord === 'nw' || ord === 'n' || ord === 'ne';

      var cropOffset = void 0;

      if (crop.aspect) {
        cropOffset = _this.getElementOffset(_this.cropSelectRef);
      }

      _this.evData = {
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
        isResize: e.target.dataset.ord,
        ord: ord,
        cropOffset: cropOffset
      };

      _this.mouseDownOnCrop = true;
      _this.setState({ cropIsActive: true });
    }, _this.onComponentMouseTouchDown = function (e) {
      var _this$props2 = _this.props,
          crop = _this$props2.crop,
          disabled = _this$props2.disabled,
          locked = _this$props2.locked,
          keepSelection = _this$props2.keepSelection,
          onChange = _this$props2.onChange;


      if (e.target !== _this.imageRef) {
        return;
      }

      if (disabled || locked || keepSelection && isCropValid(crop)) {
        return;
      }

      e.preventDefault(); // Stop drag selection.

      var clientPos = getClientPos(e);

      // Focus for detecting keypress.
      _this.componentRef.focus({ preventScroll: true });

      var imageOffset = _this.getElementOffset(_this.imageRef);
      var x = clientPos.x - imageOffset.left;
      var y = clientPos.y - imageOffset.top;

      var nextCrop = {
        aspect: crop ? crop.aspect : undefined,
        x: x,
        y: y,
        width: 0,
        height: 0
      };

      _this.evData = {
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
        ord: 'nw'
      };

      _this.mouseDownOnCrop = true;
      onChange(nextCrop);
      _this.setState({ cropIsActive: true });
    }, _this.onDocMouseTouchMove = function (e) {
      var _this$props3 = _this.props,
          crop = _this$props3.crop,
          disabled = _this$props3.disabled,
          onChange = _this$props3.onChange,
          onDragStart = _this$props3.onDragStart;


      if (disabled) {
        return;
      }

      if (!_this.mouseDownOnCrop) {
        return;
      }

      e.preventDefault(); // Stop drag selection.

      if (!_this.dragStarted) {
        _this.dragStarted = true;
        onDragStart(e);
      }

      var _this2 = _this,
          evData = _this2.evData;

      var clientPos = getClientPos(e);

      if (evData.isResize && crop.aspect && evData.cropOffset) {
        clientPos.y = _this.straightenYPath(clientPos.x);
      }

      evData.xDiff = clientPos.x - evData.clientStartX;
      evData.yDiff = clientPos.y - evData.clientStartY;

      var nextCrop = void 0;

      if (evData.isResize) {
        nextCrop = _this.resizeCrop();
      } else {
        nextCrop = _this.dragCrop();
      }

      if (nextCrop !== crop) {
        onChange(nextCrop);
      }
    }, _this.onComponentKeyDown = function (e) {
      var _this$props4 = _this.props,
          crop = _this$props4.crop,
          disabled = _this$props4.disabled,
          onChange = _this$props4.onChange,
          onComplete = _this$props4.onComplete;


      if (disabled) {
        return;
      }

      var keyCode = e.which;
      var nudged = false;

      if (!isCropValid(crop)) {
        return;
      }

      var nextCrop = _this.makeNewCrop();

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
        nextCrop.x = clamp(nextCrop.x, 0, _this.imageRef.width - nextCrop.width);
        nextCrop.y = clamp(nextCrop.y, 0, _this.imageRef.height - nextCrop.height);

        onChange(nextCrop);
        onComplete(nextCrop);
      }
    }, _this.onDocMouseTouchEnd = function (e) {
      var _this$props5 = _this.props,
          crop = _this$props5.crop,
          disabled = _this$props5.disabled,
          onComplete = _this$props5.onComplete,
          onDragEnd = _this$props5.onDragEnd;


      if (disabled) {
        return;
      }

      if (_this.mouseDownOnCrop) {
        _this.mouseDownOnCrop = false;
        _this.dragStarted = false;
        onDragEnd(e);
        onComplete(crop);
        _this.setState({ cropIsActive: false });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ReactCrop, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var options = passiveSupported ? { passive: false } : false;

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
          var src = this.imageRef.src;

          this.imageRef.src = EMPTY_GIF;
          this.imageRef.src = src;
        } else {
          this.onImageLoad(this.imageRef);
        }
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.document.removeEventListener('mousemove', this.onDocMouseTouchMove);
      this.document.removeEventListener('touchmove', this.onDocMouseTouchMove);

      this.document.removeEventListener('mouseup', this.onDocMouseTouchEnd);
      this.document.removeEventListener('touchend', this.onDocMouseTouchEnd);
      this.document.removeEventListener('touchcancel', this.onDocMouseTouchEnd);
    }
  }, {
    key: 'onImageLoad',
    value: function onImageLoad(image) {
      var _props = this.props,
          crop = _props.crop,
          onComplete = _props.onComplete,
          onChange = _props.onChange,
          onImageLoaded = _props.onImageLoaded;


      var resolvedCrop = resolveCrop(crop, image);

      // Return false from onImageLoaded if you set the crop with setState in there as otherwise the subsequent
      // onChange + onComplete will not have your updated crop.
      var res = onImageLoaded(image);

      if (res !== false && resolvedCrop !== crop) {
        onChange(resolvedCrop);
        onComplete(resolvedCrop);
      }
    }
  }, {
    key: 'getElementOffset',
    value: function getElementOffset(el) {
      var rect = el.getBoundingClientRect();
      var docEl = this.document.documentElement;

      var rectTop = rect.top + this.window.pageYOffset - docEl.clientTop;
      var rectLeft = rect.left + this.window.pageXOffset - docEl.clientLeft;

      return {
        top: rectTop,
        left: rectLeft
      };
    }
  }, {
    key: 'getCropStyle',
    value: function getCropStyle() {
      var crop = this.props.crop;

      return {
        top: crop.y + 'px',
        left: crop.x + 'px',
        width: crop.width + 'px',
        height: crop.height + 'px'
      };
    }
  }, {
    key: 'getNewSize',
    value: function getNewSize() {
      var _props2 = this.props,
          crop = _props2.crop,
          minWidth = _props2.minWidth,
          maxWidth = _props2.maxWidth,
          minHeight = _props2.minHeight,
          maxHeight = _props2.maxHeight;
      var evData = this.evData,
          imageRef = this.imageRef;

      // New width.

      var newWidth = evData.cropStartWidth + evData.xDiff;

      if (evData.xCrossOver) {
        newWidth = Math.abs(newWidth);
      }

      newWidth = clamp(newWidth, minWidth, maxWidth || imageRef.width);

      // New height.
      var newHeight = void 0;

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
        height: newHeight
      };
    }
  }, {
    key: 'dragCrop',
    value: function dragCrop() {
      var nextCrop = this.makeNewCrop();
      var evData = this.evData;

      nextCrop.x = clamp(evData.cropStartX + evData.xDiff, 0, this.imageRef.width - nextCrop.width);
      nextCrop.y = clamp(evData.cropStartY + evData.yDiff, 0, this.imageRef.height - nextCrop.height);
      return nextCrop;
    }
  }, {
    key: 'resizeCrop',
    value: function resizeCrop() {
      var nextCrop = this.makeNewCrop();
      var evData = this.evData;
      var _props3 = this.props,
          crop = _props3.crop,
          minWidth = _props3.minWidth,
          minHeight = _props3.minHeight;
      var ord = evData.ord;

      // On the inverse change the diff so it's the same and
      // the same algo applies.

      if (evData.xInversed) {
        evData.xDiff -= evData.cropStartWidth * 2;
      }
      if (evData.yInversed) {
        evData.yDiff -= evData.cropStartHeight * 2;
      }

      // New size.
      var newSize = this.getNewSize();

      // Adjust x/y to give illusion of 'staticness' as width/height is increased
      // when polarity is inversed.
      var newX = evData.cropStartX;
      var newY = evData.cropStartY;

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

      var containedCrop = containCrop(this.props.crop, {
        x: newX,
        y: newY,
        width: newSize.width,
        height: newSize.height,
        aspect: nextCrop.aspect
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
  }, {
    key: 'straightenYPath',
    value: function straightenYPath(clientX) {
      var evData = this.evData;
      var ord = evData.ord;
      var cropOffset = evData.cropOffset,
          cropStartWidth = evData.cropStartWidth,
          cropStartHeight = evData.cropStartHeight;

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
    key: 'createCropSelection',
    value: function createCropSelection() {
      var _this3 = this;

      var _props4 = this.props,
          disabled = _props4.disabled,
          locked = _props4.locked,
          renderSelectionAddon = _props4.renderSelectionAddon;

      var style = this.getCropStyle();

      return _react2.default.createElement(
        'div',
        {
          ref: function ref(n) {
            _this3.cropSelectRef = n;
          },
          style: style,
          className: 'ReactCrop__crop-selection',
          onMouseDown: this.onCropMouseTouchDown,
          onTouchStart: this.onCropMouseTouchDown,
          role: 'presentation'
        },
        !disabled && !locked && _react2.default.createElement(
          'div',
          { className: 'ReactCrop__drag-elements' },
          _react2.default.createElement('div', { className: 'ReactCrop__drag-bar ord-n', 'data-ord': 'n' }),
          _react2.default.createElement('div', { className: 'ReactCrop__drag-bar ord-e', 'data-ord': 'e' }),
          _react2.default.createElement('div', { className: 'ReactCrop__drag-bar ord-s', 'data-ord': 's' }),
          _react2.default.createElement('div', { className: 'ReactCrop__drag-bar ord-w', 'data-ord': 'w' }),
          _react2.default.createElement('div', { className: 'ReactCrop__drag-handle ord-nw', 'data-ord': 'nw' }),
          _react2.default.createElement('div', { className: 'ReactCrop__drag-handle ord-n', 'data-ord': 'n' }),
          _react2.default.createElement('div', { className: 'ReactCrop__drag-handle ord-ne', 'data-ord': 'ne' }),
          _react2.default.createElement('div', { className: 'ReactCrop__drag-handle ord-e', 'data-ord': 'e' }),
          _react2.default.createElement('div', { className: 'ReactCrop__drag-handle ord-se', 'data-ord': 'se' }),
          _react2.default.createElement('div', { className: 'ReactCrop__drag-handle ord-s', 'data-ord': 's' }),
          _react2.default.createElement('div', { className: 'ReactCrop__drag-handle ord-sw', 'data-ord': 'sw' }),
          _react2.default.createElement('div', { className: 'ReactCrop__drag-handle ord-w', 'data-ord': 'w' })
        ),
        renderSelectionAddon && renderSelectionAddon(this.state)
      );
    }
  }, {
    key: 'makeNewCrop',
    value: function makeNewCrop() {
      return _extends({}, ReactCrop.defaultCrop, this.props.crop);
    }
  }, {
    key: 'crossOverCheck',
    value: function crossOverCheck() {
      var evData = this.evData;


      if (!evData.xCrossOver && -Math.abs(evData.cropStartWidth) - evData.xDiff >= 0 || evData.xCrossOver && -Math.abs(evData.cropStartWidth) - evData.xDiff <= 0) {
        evData.xCrossOver = !evData.xCrossOver;
      }

      if (!evData.yCrossOver && -Math.abs(evData.cropStartHeight) - evData.yDiff >= 0 || evData.yCrossOver && -Math.abs(evData.cropStartHeight) - evData.yDiff <= 0) {
        evData.yCrossOver = !evData.yCrossOver;
      }

      var swapXOrd = evData.xCrossOver !== evData.startXCrossOver;
      var swapYOrd = evData.yCrossOver !== evData.startYCrossOver;

      evData.inversedXOrd = swapXOrd ? inverseOrd(evData.ord) : false;
      evData.inversedYOrd = swapYOrd ? inverseOrd(evData.ord) : false;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props5 = this.props,
          children = _props5.children,
          className = _props5.className,
          crossorigin = _props5.crossorigin,
          crop = _props5.crop,
          disabled = _props5.disabled,
          locked = _props5.locked,
          imageAlt = _props5.imageAlt,
          onImageError = _props5.onImageError,
          src = _props5.src,
          style = _props5.style,
          imageStyle = _props5.imageStyle;
      var cropIsActive = this.state.cropIsActive;

      var cropSelection = void 0;

      if (isCropValid(crop)) {
        cropSelection = this.createCropSelection();
      }

      var componentClasses = ['ReactCrop'];

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
        componentClasses.push.apply(componentClasses, _toConsumableArray(className.split(' ')));
      }

      return _react2.default.createElement(
        'div',
        {
          ref: function ref(n) {
            _this4.componentRef = n;
          },
          className: componentClasses.join(' '),
          style: style,
          onTouchStart: this.onComponentMouseTouchDown,
          onMouseDown: this.onComponentMouseTouchDown,
          role: 'presentation',
          tabIndex: 1,
          onKeyDown: this.onComponentKeyDown
        },
        _react2.default.createElement('img', {
          ref: function ref(n) {
            _this4.imageRef = n;
          },
          crossOrigin: crossorigin,
          className: 'ReactCrop__image',
          style: imageStyle,
          src: src,
          onLoad: function onLoad(e) {
            return _this4.onImageLoad(e.target);
          },
          onError: onImageError,
          alt: imageAlt
        }),
        children,
        cropSelection
      );
    }
  }]);

  return ReactCrop;
}(_react.PureComponent);

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
  height: 0
};

ReactCrop.propTypes = {
  className: _propTypes2.default.string,
  crossorigin: _propTypes2.default.string,
  children: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.node), _propTypes2.default.node]),
  crop: _propTypes2.default.shape({
    aspect: _propTypes2.default.number,
    x: _propTypes2.default.number,
    y: _propTypes2.default.number,
    width: _propTypes2.default.number,
    height: _propTypes2.default.number
  }),
  disabled: _propTypes2.default.bool,
  locked: _propTypes2.default.bool,
  imageAlt: _propTypes2.default.string,
  imageStyle: _propTypes2.default.shape({}),
  keepSelection: _propTypes2.default.bool,
  minWidth: _propTypes2.default.number,
  minHeight: _propTypes2.default.number,
  maxWidth: _propTypes2.default.number,
  maxHeight: _propTypes2.default.number,
  onChange: _propTypes2.default.func.isRequired,
  onImageError: _propTypes2.default.func,
  onComplete: _propTypes2.default.func,
  onImageLoaded: _propTypes2.default.func,
  onDragStart: _propTypes2.default.func,
  onDragEnd: _propTypes2.default.func,
  src: _propTypes2.default.string.isRequired,
  style: _propTypes2.default.shape({}),
  renderSelectionAddon: _propTypes2.default.func
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
  onComplete: function onComplete() {},
  onImageError: function onImageError() {},
  onImageLoaded: function onImageLoaded() {},
  onDragStart: function onDragStart() {},
  onDragEnd: function onDragEnd() {},
  children: undefined,
  style: undefined,
  imageStyle: undefined,
  renderSelectionAddon: undefined
};

exports.default = ReactCrop;
exports.Component = ReactCrop;
exports.makeAspectCrop = makeAspectCrop;
exports.containCrop = containCrop;
>>>>>>> master

/***/ }),

/***/ "./node_modules/prop-types/checkPropTypes.js":
/*!***************************************************!*\
  !*** ./node_modules/prop-types/checkPropTypes.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/**\n * Copyright (c) 2013-present, Facebook, Inc.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE file in the root directory of this source tree.\n */\n\n\n\nvar printWarning = function() {};\n\nif (true) {\n  var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ \"./node_modules/prop-types/lib/ReactPropTypesSecret.js\");\n  var loggedTypeFailures = {};\n  var has = Function.call.bind(Object.prototype.hasOwnProperty);\n\n  printWarning = function(text) {\n    var message = 'Warning: ' + text;\n    if (typeof console !== 'undefined') {\n      console.error(message);\n    }\n    try {\n      // --- Welcome to debugging React ---\n      // This error was thrown as a convenience so that you can use this stack\n      // to find the callsite that caused this warning to fire.\n      throw new Error(message);\n    } catch (x) {}\n  };\n}\n\n/**\n * Assert that the values match with the type specs.\n * Error messages are memorized and will only be shown once.\n *\n * @param {object} typeSpecs Map of name to a ReactPropType\n * @param {object} values Runtime values that need to be type-checked\n * @param {string} location e.g. \"prop\", \"context\", \"child context\"\n * @param {string} componentName Name of the component for error messages.\n * @param {?Function} getStack Returns the component stack.\n * @private\n */\nfunction checkPropTypes(typeSpecs, values, location, componentName, getStack) {\n  if (true) {\n    for (var typeSpecName in typeSpecs) {\n      if (has(typeSpecs, typeSpecName)) {\n        var error;\n        // Prop type validation may throw. In case they do, we don't want to\n        // fail the render phase where it didn't fail before. So we log it.\n        // After these have been cleaned up, we'll let them throw.\n        try {\n          // This is intentionally an invariant that gets caught. It's the same\n          // behavior as without this statement except with a better message.\n          if (typeof typeSpecs[typeSpecName] !== 'function') {\n            var err = Error(\n              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +\n              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'\n            );\n            err.name = 'Invariant Violation';\n            throw err;\n          }\n          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);\n        } catch (ex) {\n          error = ex;\n        }\n        if (error && !(error instanceof Error)) {\n          printWarning(\n            (componentName || 'React class') + ': type specification of ' +\n            location + ' `' + typeSpecName + '` is invalid; the type checker ' +\n            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +\n            'You may have forgotten to pass an argument to the type checker ' +\n            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +\n            'shape all require an argument).'\n          );\n        }\n        if (error instanceof Error && !(error.message in loggedTypeFailures)) {\n          // Only monitor this failure once because there tends to be a lot of the\n          // same error.\n          loggedTypeFailures[error.message] = true;\n\n          var stack = getStack ? getStack() : '';\n\n          printWarning(\n            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')\n          );\n        }\n      }\n    }\n  }\n}\n\n/**\n * Resets warning cache when testing.\n *\n * @private\n */\ncheckPropTypes.resetWarningCache = function() {\n  if (true) {\n    loggedTypeFailures = {};\n  }\n}\n\nmodule.exports = checkPropTypes;\n\n\n//# sourceURL=webpack://ReactCrop/./node_modules/prop-types/checkPropTypes.js?");

/***/ }),

/***/ "./node_modules/prop-types/factoryWithTypeCheckers.js":
/*!************************************************************!*\
  !*** ./node_modules/prop-types/factoryWithTypeCheckers.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/**\n * Copyright (c) 2013-present, Facebook, Inc.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE file in the root directory of this source tree.\n */\n\n\n\nvar ReactIs = __webpack_require__(/*! react-is */ \"./node_modules/react-is/index.js\");\nvar assign = __webpack_require__(/*! object-assign */ \"./node_modules/object-assign/index.js\");\n\nvar ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ \"./node_modules/prop-types/lib/ReactPropTypesSecret.js\");\nvar checkPropTypes = __webpack_require__(/*! ./checkPropTypes */ \"./node_modules/prop-types/checkPropTypes.js\");\n\nvar has = Function.call.bind(Object.prototype.hasOwnProperty);\nvar printWarning = function() {};\n\nif (true) {\n  printWarning = function(text) {\n    var message = 'Warning: ' + text;\n    if (typeof console !== 'undefined') {\n      console.error(message);\n    }\n    try {\n      // --- Welcome to debugging React ---\n      // This error was thrown as a convenience so that you can use this stack\n      // to find the callsite that caused this warning to fire.\n      throw new Error(message);\n    } catch (x) {}\n  };\n}\n\nfunction emptyFunctionThatReturnsNull() {\n  return null;\n}\n\nmodule.exports = function(isValidElement, throwOnDirectAccess) {\n  /* global Symbol */\n  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;\n  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.\n\n  /**\n   * Returns the iterator method function contained on the iterable object.\n   *\n   * Be sure to invoke the function with the iterable as context:\n   *\n   *     var iteratorFn = getIteratorFn(myIterable);\n   *     if (iteratorFn) {\n   *       var iterator = iteratorFn.call(myIterable);\n   *       ...\n   *     }\n   *\n   * @param {?object} maybeIterable\n   * @return {?function}\n   */\n  function getIteratorFn(maybeIterable) {\n    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);\n    if (typeof iteratorFn === 'function') {\n      return iteratorFn;\n    }\n  }\n\n  /**\n   * Collection of methods that allow declaration and validation of props that are\n   * supplied to React components. Example usage:\n   *\n   *   var Props = require('ReactPropTypes');\n   *   var MyArticle = React.createClass({\n   *     propTypes: {\n   *       // An optional string prop named \"description\".\n   *       description: Props.string,\n   *\n   *       // A required enum prop named \"category\".\n   *       category: Props.oneOf(['News','Photos']).isRequired,\n   *\n   *       // A prop named \"dialog\" that requires an instance of Dialog.\n   *       dialog: Props.instanceOf(Dialog).isRequired\n   *     },\n   *     render: function() { ... }\n   *   });\n   *\n   * A more formal specification of how these methods are used:\n   *\n   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)\n   *   decl := ReactPropTypes.{type}(.isRequired)?\n   *\n   * Each and every declaration produces a function with the same signature. This\n   * allows the creation of custom validation functions. For example:\n   *\n   *  var MyLink = React.createClass({\n   *    propTypes: {\n   *      // An optional string or URI prop named \"href\".\n   *      href: function(props, propName, componentName) {\n   *        var propValue = props[propName];\n   *        if (propValue != null && typeof propValue !== 'string' &&\n   *            !(propValue instanceof URI)) {\n   *          return new Error(\n   *            'Expected a string or an URI for ' + propName + ' in ' +\n   *            componentName\n   *          );\n   *        }\n   *      }\n   *    },\n   *    render: function() {...}\n   *  });\n   *\n   * @internal\n   */\n\n  var ANONYMOUS = '<<anonymous>>';\n\n  // Important!\n  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.\n  var ReactPropTypes = {\n    array: createPrimitiveTypeChecker('array'),\n    bool: createPrimitiveTypeChecker('boolean'),\n    func: createPrimitiveTypeChecker('function'),\n    number: createPrimitiveTypeChecker('number'),\n    object: createPrimitiveTypeChecker('object'),\n    string: createPrimitiveTypeChecker('string'),\n    symbol: createPrimitiveTypeChecker('symbol'),\n\n    any: createAnyTypeChecker(),\n    arrayOf: createArrayOfTypeChecker,\n    element: createElementTypeChecker(),\n    elementType: createElementTypeTypeChecker(),\n    instanceOf: createInstanceTypeChecker,\n    node: createNodeChecker(),\n    objectOf: createObjectOfTypeChecker,\n    oneOf: createEnumTypeChecker,\n    oneOfType: createUnionTypeChecker,\n    shape: createShapeTypeChecker,\n    exact: createStrictShapeTypeChecker,\n  };\n\n  /**\n   * inlined Object.is polyfill to avoid requiring consumers ship their own\n   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is\n   */\n  /*eslint-disable no-self-compare*/\n  function is(x, y) {\n    // SameValue algorithm\n    if (x === y) {\n      // Steps 1-5, 7-10\n      // Steps 6.b-6.e: +0 != -0\n      return x !== 0 || 1 / x === 1 / y;\n    } else {\n      // Step 6.a: NaN == NaN\n      return x !== x && y !== y;\n    }\n  }\n  /*eslint-enable no-self-compare*/\n\n  /**\n   * We use an Error-like object for backward compatibility as people may call\n   * PropTypes directly and inspect their output. However, we don't use real\n   * Errors anymore. We don't inspect their stack anyway, and creating them\n   * is prohibitively expensive if they are created too often, such as what\n   * happens in oneOfType() for any type before the one that matched.\n   */\n  function PropTypeError(message) {\n    this.message = message;\n    this.stack = '';\n  }\n  // Make `instanceof Error` still work for returned errors.\n  PropTypeError.prototype = Error.prototype;\n\n  function createChainableTypeChecker(validate) {\n    if (true) {\n      var manualPropTypeCallCache = {};\n      var manualPropTypeWarningCount = 0;\n    }\n    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {\n      componentName = componentName || ANONYMOUS;\n      propFullName = propFullName || propName;\n\n      if (secret !== ReactPropTypesSecret) {\n        if (throwOnDirectAccess) {\n          // New behavior only for users of `prop-types` package\n          var err = new Error(\n            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +\n            'Use `PropTypes.checkPropTypes()` to call them. ' +\n            'Read more at http://fb.me/use-check-prop-types'\n          );\n          err.name = 'Invariant Violation';\n          throw err;\n        } else if ( true && typeof console !== 'undefined') {\n          // Old behavior for people using React.PropTypes\n          var cacheKey = componentName + ':' + propName;\n          if (\n            !manualPropTypeCallCache[cacheKey] &&\n            // Avoid spamming the console because they are often not actionable except for lib authors\n            manualPropTypeWarningCount < 3\n          ) {\n            printWarning(\n              'You are manually calling a React.PropTypes validation ' +\n              'function for the `' + propFullName + '` prop on `' + componentName  + '`. This is deprecated ' +\n              'and will throw in the standalone `prop-types` package. ' +\n              'You may be seeing this warning due to a third-party PropTypes ' +\n              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'\n            );\n            manualPropTypeCallCache[cacheKey] = true;\n            manualPropTypeWarningCount++;\n          }\n        }\n      }\n      if (props[propName] == null) {\n        if (isRequired) {\n          if (props[propName] === null) {\n            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));\n          }\n          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));\n        }\n        return null;\n      } else {\n        return validate(props, propName, componentName, location, propFullName);\n      }\n    }\n\n    var chainedCheckType = checkType.bind(null, false);\n    chainedCheckType.isRequired = checkType.bind(null, true);\n\n    return chainedCheckType;\n  }\n\n  function createPrimitiveTypeChecker(expectedType) {\n    function validate(props, propName, componentName, location, propFullName, secret) {\n      var propValue = props[propName];\n      var propType = getPropType(propValue);\n      if (propType !== expectedType) {\n        // `propValue` being instance of, say, date/regexp, pass the 'object'\n        // check, but we can offer a more precise error message here rather than\n        // 'of type `object`'.\n        var preciseType = getPreciseType(propValue);\n\n        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));\n      }\n      return null;\n    }\n    return createChainableTypeChecker(validate);\n  }\n\n  function createAnyTypeChecker() {\n    return createChainableTypeChecker(emptyFunctionThatReturnsNull);\n  }\n\n  function createArrayOfTypeChecker(typeChecker) {\n    function validate(props, propName, componentName, location, propFullName) {\n      if (typeof typeChecker !== 'function') {\n        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');\n      }\n      var propValue = props[propName];\n      if (!Array.isArray(propValue)) {\n        var propType = getPropType(propValue);\n        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));\n      }\n      for (var i = 0; i < propValue.length; i++) {\n        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);\n        if (error instanceof Error) {\n          return error;\n        }\n      }\n      return null;\n    }\n    return createChainableTypeChecker(validate);\n  }\n\n  function createElementTypeChecker() {\n    function validate(props, propName, componentName, location, propFullName) {\n      var propValue = props[propName];\n      if (!isValidElement(propValue)) {\n        var propType = getPropType(propValue);\n        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));\n      }\n      return null;\n    }\n    return createChainableTypeChecker(validate);\n  }\n\n  function createElementTypeTypeChecker() {\n    function validate(props, propName, componentName, location, propFullName) {\n      var propValue = props[propName];\n      if (!ReactIs.isValidElementType(propValue)) {\n        var propType = getPropType(propValue);\n        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));\n      }\n      return null;\n    }\n    return createChainableTypeChecker(validate);\n  }\n\n  function createInstanceTypeChecker(expectedClass) {\n    function validate(props, propName, componentName, location, propFullName) {\n      if (!(props[propName] instanceof expectedClass)) {\n        var expectedClassName = expectedClass.name || ANONYMOUS;\n        var actualClassName = getClassName(props[propName]);\n        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));\n      }\n      return null;\n    }\n    return createChainableTypeChecker(validate);\n  }\n\n  function createEnumTypeChecker(expectedValues) {\n    if (!Array.isArray(expectedValues)) {\n      if (true) {\n        if (arguments.length > 1) {\n          printWarning(\n            'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +\n            'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'\n          );\n        } else {\n          printWarning('Invalid argument supplied to oneOf, expected an array.');\n        }\n      }\n      return emptyFunctionThatReturnsNull;\n    }\n\n    function validate(props, propName, componentName, location, propFullName) {\n      var propValue = props[propName];\n      for (var i = 0; i < expectedValues.length; i++) {\n        if (is(propValue, expectedValues[i])) {\n          return null;\n        }\n      }\n\n      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {\n        var type = getPreciseType(value);\n        if (type === 'symbol') {\n          return String(value);\n        }\n        return value;\n      });\n      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));\n    }\n    return createChainableTypeChecker(validate);\n  }\n\n  function createObjectOfTypeChecker(typeChecker) {\n    function validate(props, propName, componentName, location, propFullName) {\n      if (typeof typeChecker !== 'function') {\n        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');\n      }\n      var propValue = props[propName];\n      var propType = getPropType(propValue);\n      if (propType !== 'object') {\n        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));\n      }\n      for (var key in propValue) {\n        if (has(propValue, key)) {\n          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);\n          if (error instanceof Error) {\n            return error;\n          }\n        }\n      }\n      return null;\n    }\n    return createChainableTypeChecker(validate);\n  }\n\n  function createUnionTypeChecker(arrayOfTypeCheckers) {\n    if (!Array.isArray(arrayOfTypeCheckers)) {\n       true ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : undefined;\n      return emptyFunctionThatReturnsNull;\n    }\n\n    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {\n      var checker = arrayOfTypeCheckers[i];\n      if (typeof checker !== 'function') {\n        printWarning(\n          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +\n          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'\n        );\n        return emptyFunctionThatReturnsNull;\n      }\n    }\n\n    function validate(props, propName, componentName, location, propFullName) {\n      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {\n        var checker = arrayOfTypeCheckers[i];\n        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {\n          return null;\n        }\n      }\n\n      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));\n    }\n    return createChainableTypeChecker(validate);\n  }\n\n  function createNodeChecker() {\n    function validate(props, propName, componentName, location, propFullName) {\n      if (!isNode(props[propName])) {\n        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));\n      }\n      return null;\n    }\n    return createChainableTypeChecker(validate);\n  }\n\n  function createShapeTypeChecker(shapeTypes) {\n    function validate(props, propName, componentName, location, propFullName) {\n      var propValue = props[propName];\n      var propType = getPropType(propValue);\n      if (propType !== 'object') {\n        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));\n      }\n      for (var key in shapeTypes) {\n        var checker = shapeTypes[key];\n        if (!checker) {\n          continue;\n        }\n        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);\n        if (error) {\n          return error;\n        }\n      }\n      return null;\n    }\n    return createChainableTypeChecker(validate);\n  }\n\n  function createStrictShapeTypeChecker(shapeTypes) {\n    function validate(props, propName, componentName, location, propFullName) {\n      var propValue = props[propName];\n      var propType = getPropType(propValue);\n      if (propType !== 'object') {\n        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));\n      }\n      // We need to check all keys in case some are required but missing from\n      // props.\n      var allKeys = assign({}, props[propName], shapeTypes);\n      for (var key in allKeys) {\n        var checker = shapeTypes[key];\n        if (!checker) {\n          return new PropTypeError(\n            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +\n            '\\nBad object: ' + JSON.stringify(props[propName], null, '  ') +\n            '\\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')\n          );\n        }\n        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);\n        if (error) {\n          return error;\n        }\n      }\n      return null;\n    }\n\n    return createChainableTypeChecker(validate);\n  }\n\n  function isNode(propValue) {\n    switch (typeof propValue) {\n      case 'number':\n      case 'string':\n      case 'undefined':\n        return true;\n      case 'boolean':\n        return !propValue;\n      case 'object':\n        if (Array.isArray(propValue)) {\n          return propValue.every(isNode);\n        }\n        if (propValue === null || isValidElement(propValue)) {\n          return true;\n        }\n\n        var iteratorFn = getIteratorFn(propValue);\n        if (iteratorFn) {\n          var iterator = iteratorFn.call(propValue);\n          var step;\n          if (iteratorFn !== propValue.entries) {\n            while (!(step = iterator.next()).done) {\n              if (!isNode(step.value)) {\n                return false;\n              }\n            }\n          } else {\n            // Iterator will provide entry [k,v] tuples rather than values.\n            while (!(step = iterator.next()).done) {\n              var entry = step.value;\n              if (entry) {\n                if (!isNode(entry[1])) {\n                  return false;\n                }\n              }\n            }\n          }\n        } else {\n          return false;\n        }\n\n        return true;\n      default:\n        return false;\n    }\n  }\n\n  function isSymbol(propType, propValue) {\n    // Native Symbol.\n    if (propType === 'symbol') {\n      return true;\n    }\n\n    // falsy value can't be a Symbol\n    if (!propValue) {\n      return false;\n    }\n\n    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'\n    if (propValue['@@toStringTag'] === 'Symbol') {\n      return true;\n    }\n\n    // Fallback for non-spec compliant Symbols which are polyfilled.\n    if (typeof Symbol === 'function' && propValue instanceof Symbol) {\n      return true;\n    }\n\n    return false;\n  }\n\n  // Equivalent of `typeof` but with special handling for array and regexp.\n  function getPropType(propValue) {\n    var propType = typeof propValue;\n    if (Array.isArray(propValue)) {\n      return 'array';\n    }\n    if (propValue instanceof RegExp) {\n      // Old webkits (at least until Android 4.0) return 'function' rather than\n      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/\n      // passes PropTypes.object.\n      return 'object';\n    }\n    if (isSymbol(propType, propValue)) {\n      return 'symbol';\n    }\n    return propType;\n  }\n\n  // This handles more types than `getPropType`. Only used for error messages.\n  // See `createPrimitiveTypeChecker`.\n  function getPreciseType(propValue) {\n    if (typeof propValue === 'undefined' || propValue === null) {\n      return '' + propValue;\n    }\n    var propType = getPropType(propValue);\n    if (propType === 'object') {\n      if (propValue instanceof Date) {\n        return 'date';\n      } else if (propValue instanceof RegExp) {\n        return 'regexp';\n      }\n    }\n    return propType;\n  }\n\n  // Returns a string that is postfixed to a warning about an invalid type.\n  // For example, \"undefined\" or \"of type array\"\n  function getPostfixForTypeWarning(value) {\n    var type = getPreciseType(value);\n    switch (type) {\n      case 'array':\n      case 'object':\n        return 'an ' + type;\n      case 'boolean':\n      case 'date':\n      case 'regexp':\n        return 'a ' + type;\n      default:\n        return type;\n    }\n  }\n\n  // Returns class name of the object, if any.\n  function getClassName(propValue) {\n    if (!propValue.constructor || !propValue.constructor.name) {\n      return ANONYMOUS;\n    }\n    return propValue.constructor.name;\n  }\n\n  ReactPropTypes.checkPropTypes = checkPropTypes;\n  ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;\n  ReactPropTypes.PropTypes = ReactPropTypes;\n\n  return ReactPropTypes;\n};\n\n\n//# sourceURL=webpack://ReactCrop/./node_modules/prop-types/factoryWithTypeCheckers.js?");

/***/ }),

/***/ "./node_modules/prop-types/index.js":
/*!******************************************!*\
  !*** ./node_modules/prop-types/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Copyright (c) 2013-present, Facebook, Inc.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE file in the root directory of this source tree.\n */\n\nif (true) {\n  var ReactIs = __webpack_require__(/*! react-is */ \"./node_modules/react-is/index.js\");\n\n  // By explicitly using `prop-types` you are opting into new development behavior.\n  // http://fb.me/prop-types-in-prod\n  var throwOnDirectAccess = true;\n  module.exports = __webpack_require__(/*! ./factoryWithTypeCheckers */ \"./node_modules/prop-types/factoryWithTypeCheckers.js\")(ReactIs.isElement, throwOnDirectAccess);\n} else {}\n\n\n//# sourceURL=webpack://ReactCrop/./node_modules/prop-types/index.js?");

/***/ }),

/***/ "./node_modules/prop-types/lib/ReactPropTypesSecret.js":
/*!*************************************************************!*\
  !*** ./node_modules/prop-types/lib/ReactPropTypesSecret.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/**\n * Copyright (c) 2013-present, Facebook, Inc.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE file in the root directory of this source tree.\n */\n\n\n\nvar ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';\n\nmodule.exports = ReactPropTypesSecret;\n\n\n//# sourceURL=webpack://ReactCrop/./node_modules/prop-types/lib/ReactPropTypesSecret.js?");

/***/ }),

/***/ "./node_modules/react-is/cjs/react-is.development.js":
/*!***********************************************************!*\
  !*** ./node_modules/react-is/cjs/react-is.development.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/** @license React v16.8.6\n * react-is.development.js\n *\n * Copyright (c) Facebook, Inc. and its affiliates.\n *\n * This source code is licensed under the MIT license found in the\n * LICENSE file in the root directory of this source tree.\n */\n\n\n\n\n\nif (true) {\n  (function() {\n'use strict';\n\nObject.defineProperty(exports, '__esModule', { value: true });\n\n// The Symbol used to tag the ReactElement-like types. If there is no native Symbol\n// nor polyfill, then a plain number is used for performance.\nvar hasSymbol = typeof Symbol === 'function' && Symbol.for;\n\nvar REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;\nvar REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;\nvar REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;\nvar REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;\nvar REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;\nvar REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;\nvar REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace;\nvar REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;\nvar REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;\nvar REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;\nvar REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;\nvar REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;\nvar REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;\n\nfunction isValidElementType(type) {\n  return typeof type === 'string' || typeof type === 'function' ||\n  // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.\n  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE);\n}\n\n/**\n * Forked from fbjs/warning:\n * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js\n *\n * Only change is we use console.warn instead of console.error,\n * and do nothing when 'console' is not supported.\n * This really simplifies the code.\n * ---\n * Similar to invariant but only logs a warning if the condition is not met.\n * This can be used to log issues in development environments in critical\n * paths. Removing the logging code for production environments will keep the\n * same logic and follow the same code paths.\n */\n\nvar lowPriorityWarning = function () {};\n\n{\n  var printWarning = function (format) {\n    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {\n      args[_key - 1] = arguments[_key];\n    }\n\n    var argIndex = 0;\n    var message = 'Warning: ' + format.replace(/%s/g, function () {\n      return args[argIndex++];\n    });\n    if (typeof console !== 'undefined') {\n      console.warn(message);\n    }\n    try {\n      // --- Welcome to debugging React ---\n      // This error was thrown as a convenience so that you can use this stack\n      // to find the callsite that caused this warning to fire.\n      throw new Error(message);\n    } catch (x) {}\n  };\n\n  lowPriorityWarning = function (condition, format) {\n    if (format === undefined) {\n      throw new Error('`lowPriorityWarning(condition, format, ...args)` requires a warning ' + 'message argument');\n    }\n    if (!condition) {\n      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {\n        args[_key2 - 2] = arguments[_key2];\n      }\n\n      printWarning.apply(undefined, [format].concat(args));\n    }\n  };\n}\n\nvar lowPriorityWarning$1 = lowPriorityWarning;\n\nfunction typeOf(object) {\n  if (typeof object === 'object' && object !== null) {\n    var $$typeof = object.$$typeof;\n    switch ($$typeof) {\n      case REACT_ELEMENT_TYPE:\n        var type = object.type;\n\n        switch (type) {\n          case REACT_ASYNC_MODE_TYPE:\n          case REACT_CONCURRENT_MODE_TYPE:\n          case REACT_FRAGMENT_TYPE:\n          case REACT_PROFILER_TYPE:\n          case REACT_STRICT_MODE_TYPE:\n          case REACT_SUSPENSE_TYPE:\n            return type;\n          default:\n            var $$typeofType = type && type.$$typeof;\n\n            switch ($$typeofType) {\n              case REACT_CONTEXT_TYPE:\n              case REACT_FORWARD_REF_TYPE:\n              case REACT_PROVIDER_TYPE:\n                return $$typeofType;\n              default:\n                return $$typeof;\n            }\n        }\n      case REACT_LAZY_TYPE:\n      case REACT_MEMO_TYPE:\n      case REACT_PORTAL_TYPE:\n        return $$typeof;\n    }\n  }\n\n  return undefined;\n}\n\n// AsyncMode is deprecated along with isAsyncMode\nvar AsyncMode = REACT_ASYNC_MODE_TYPE;\nvar ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;\nvar ContextConsumer = REACT_CONTEXT_TYPE;\nvar ContextProvider = REACT_PROVIDER_TYPE;\nvar Element = REACT_ELEMENT_TYPE;\nvar ForwardRef = REACT_FORWARD_REF_TYPE;\nvar Fragment = REACT_FRAGMENT_TYPE;\nvar Lazy = REACT_LAZY_TYPE;\nvar Memo = REACT_MEMO_TYPE;\nvar Portal = REACT_PORTAL_TYPE;\nvar Profiler = REACT_PROFILER_TYPE;\nvar StrictMode = REACT_STRICT_MODE_TYPE;\nvar Suspense = REACT_SUSPENSE_TYPE;\n\nvar hasWarnedAboutDeprecatedIsAsyncMode = false;\n\n// AsyncMode should be deprecated\nfunction isAsyncMode(object) {\n  {\n    if (!hasWarnedAboutDeprecatedIsAsyncMode) {\n      hasWarnedAboutDeprecatedIsAsyncMode = true;\n      lowPriorityWarning$1(false, 'The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');\n    }\n  }\n  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;\n}\nfunction isConcurrentMode(object) {\n  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;\n}\nfunction isContextConsumer(object) {\n  return typeOf(object) === REACT_CONTEXT_TYPE;\n}\nfunction isContextProvider(object) {\n  return typeOf(object) === REACT_PROVIDER_TYPE;\n}\nfunction isElement(object) {\n  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;\n}\nfunction isForwardRef(object) {\n  return typeOf(object) === REACT_FORWARD_REF_TYPE;\n}\nfunction isFragment(object) {\n  return typeOf(object) === REACT_FRAGMENT_TYPE;\n}\nfunction isLazy(object) {\n  return typeOf(object) === REACT_LAZY_TYPE;\n}\nfunction isMemo(object) {\n  return typeOf(object) === REACT_MEMO_TYPE;\n}\nfunction isPortal(object) {\n  return typeOf(object) === REACT_PORTAL_TYPE;\n}\nfunction isProfiler(object) {\n  return typeOf(object) === REACT_PROFILER_TYPE;\n}\nfunction isStrictMode(object) {\n  return typeOf(object) === REACT_STRICT_MODE_TYPE;\n}\nfunction isSuspense(object) {\n  return typeOf(object) === REACT_SUSPENSE_TYPE;\n}\n\nexports.typeOf = typeOf;\nexports.AsyncMode = AsyncMode;\nexports.ConcurrentMode = ConcurrentMode;\nexports.ContextConsumer = ContextConsumer;\nexports.ContextProvider = ContextProvider;\nexports.Element = Element;\nexports.ForwardRef = ForwardRef;\nexports.Fragment = Fragment;\nexports.Lazy = Lazy;\nexports.Memo = Memo;\nexports.Portal = Portal;\nexports.Profiler = Profiler;\nexports.StrictMode = StrictMode;\nexports.Suspense = Suspense;\nexports.isValidElementType = isValidElementType;\nexports.isAsyncMode = isAsyncMode;\nexports.isConcurrentMode = isConcurrentMode;\nexports.isContextConsumer = isContextConsumer;\nexports.isContextProvider = isContextProvider;\nexports.isElement = isElement;\nexports.isForwardRef = isForwardRef;\nexports.isFragment = isFragment;\nexports.isLazy = isLazy;\nexports.isMemo = isMemo;\nexports.isPortal = isPortal;\nexports.isProfiler = isProfiler;\nexports.isStrictMode = isStrictMode;\nexports.isSuspense = isSuspense;\n  })();\n}\n\n\n//# sourceURL=webpack://ReactCrop/./node_modules/react-is/cjs/react-is.development.js?");

/***/ }),

/***/ "./node_modules/react-is/index.js":
/*!****************************************!*\
  !*** ./node_modules/react-is/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nif (false) {} else {\n  module.exports = __webpack_require__(/*! ./cjs/react-is.development.js */ \"./node_modules/react-is/cjs/react-is.development.js\");\n}\n\n\n//# sourceURL=webpack://ReactCrop/./node_modules/react-is/index.js?");

/***/ }),

/***/ "react":
/*!**************************************************************************************!*\
  !*** external {"root":"React","commonjs":"react","commonjs2":"react","amd":"react"} ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_react__;\n\n//# sourceURL=webpack://ReactCrop/external_%7B%22root%22:%22React%22,%22commonjs%22:%22react%22,%22commonjs2%22:%22react%22,%22amd%22:%22react%22%7D?");

/***/ })

/******/ });
});