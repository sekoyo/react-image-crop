'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var ReactCrop = _react2['default'].createClass({
	displayName: 'ReactCrop',

	propTypes: {
		src: _react2['default'].PropTypes.string.isRequired,
		crop: _react2['default'].PropTypes.object
	},

	xOrds: ['e', 'w'],
	yOrds: ['n', 's'],
	xyOrds: ['nw', 'ne', 'se', 'sw'],

	arrowKey: {
		left: 37,
		up: 38,
		right: 39,
		down: 40
	},
	nudgeStep: 0.2,

	defaultCrop: {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	},

	mergeObjects: function mergeObjects(obj1, obj2) {
		var obj3 = {};
		for (var attrname in obj1) {
			obj3[attrname] = obj1[attrname];
		}
		for (var attrname in obj2) {
			obj3[attrname] = obj2[attrname];
		}
		return obj3;
	},

	getInitialState: function getInitialState() {
		var crop = this.mergeObjects(this.defaultCrop, this.props.crop);

		if (crop.width === 0 || crop.height === 0) {
			this.cropInvalid = true;
		}

		return {
			crop: crop
		};
	},

	componentDidMount: function componentDidMount() {
		document.addEventListener('mousemove', this.onDocMouseTouchMove);
		document.addEventListener('touchmove', this.onDocMouseTouchMove);

		document.addEventListener('mouseup', this.onDocMouseTouchEnd);
		document.addEventListener('touchend', this.onDocMouseTouchEnd);
		document.addEventListener('touchcancel', this.onDocMouseTouchEnd);
	},

	componentWillUnmount: function componentWillUnmount() {
		document.removeEventListener('mousemove', this.onDocMouseTouchMove);
		document.removeEventListener('touchmove', this.onDocMouseTouchMove);

		document.removeEventListener('mouseup', this.onDocMouseTouchEnd);
		document.removeEventListener('touchend', this.onDocMouseTouchEnd);
		document.removeEventListener('touchcancel', this.onDocMouseTouchEnd);
	},

	getCropStyle: function getCropStyle() {
		return {
			top: this.state.crop.y + '%',
			left: this.state.crop.x + '%',
			width: this.state.crop.width + '%',
			height: this.state.crop.height + '%'
		};
	},

	straightenYPath: function straightenYPath(clientX) {
		var ord = this.mEventData.ord;
		var cropOffset = this.mEventData.cropOffset;
		var cropStartWidth = this.mEventData.cropStartWidth / 100 * this.mEventData.imageWidth;
		var cropStartHeight = this.mEventData.cropStartHeight / 100 * this.mEventData.imageHeight;
		var k = undefined,
		    d = undefined;

		if (ord === 'nw' || ord === 'se') {
			k = cropStartHeight / cropStartWidth;
			d = cropOffset.top - cropOffset.left * k;
		} else {
			k = -cropStartHeight / cropStartWidth;
			d = cropOffset.top + cropStartHeight - cropOffset.left * k;
		}

		var clientY = k * clientX + d;

		return clientY;
	},

	onDocMouseTouchMove: function onDocMouseTouchMove(e) {
		if (!this.mouseDownOnCrop) {
			return;
		}

		var crop = this.state.crop;
		var mEventData = this.mEventData;
		var clientX = e.clientX;
		var clientY = e.clientY;

		if (mEventData.isResize && crop.aspect && mEventData.cropOffset) {
			clientY = this.straightenYPath(clientX);
		}

		var xDiffPx = clientX - mEventData.clientStartX;
		var xDiffPc = xDiffPx / mEventData.imageWidth * 100;

		var yDiffPx = clientY - mEventData.clientStartY;
		var yDiffPc = yDiffPx / mEventData.imageHeight * 100;

		if (mEventData.isResize) {
			var ord = mEventData.ord;
			var imageAspect = mEventData.imageWidth / mEventData.imageHeight;

			// On the inverse change the diff so it's the same and
			// the same algo applies.
			if (mEventData.xInversed) {
				xDiffPc -= mEventData.cropStartWidth * 2;
			}
			if (mEventData.yInversed) {
				yDiffPc -= mEventData.cropStartHeight * 2;
			}

			// New width.
			var newWidth = mEventData.cropStartWidth + xDiffPc;

			if (mEventData.xCrossOver) {
				newWidth = Math.abs(newWidth);
			}

			newWidth = this.clamp(newWidth, this.props.minWidth || 0, 100);

			// New height.
			var newHeight = undefined;

			if (crop.aspect) {
				newHeight = newWidth / crop.aspect * imageAspect;
			} else {
				newHeight = mEventData.cropStartHeight + yDiffPc;
			}

			if (mEventData.yCrossOver) {
				newHeight = Math.abs(newHeight);
				// Cap if polarity is inversed and the shape fills the y space.
				newHeight = Math.min(newHeight, mEventData.cropStartY);
			}

			newHeight = this.clamp(newHeight, this.props.minHeight || 0, 100);

			if (crop.aspect) {
				newWidth = newHeight * crop.aspect / imageAspect;
			}

			// This is an alternative for calulating x+y which doesn't use
			// newWidth/newHeight. It makes it easier to stop increasing size
			// when hitting some edges, but still increase the size when the
			// crop is sitting flat against some. It also avoids the 'lastYCrossover'
			// edge-case, and the 'crossOverCheck' check can happen before any
			// calcs. However it is much harder in fixed aspect to stop x/y from
			// moving when hitting certain boundaries, and capping x/y to
			// the value it should have been at the boundary. Perhaps an
			// enhancement for the next version..
			//
			// if crossed { n = startSize + (startPos + diffPc)}
			// else { n = startPos }

			// Adjust x/y to give illusion of 'staticness' as width/height is increased
			// when polarity is inversed.
			crop.x = mEventData.xCrossOver ? crop.x + (crop.width - newWidth) : mEventData.cropStartX;

			if (mEventData.lastYCrossover === false && mEventData.yCrossOver) {
				// This not only removes the little "shake" when inverting at a diagonal, but for some
				// reason y was way off at fast speeds moving sw->ne with fixed aspect only, I couldn't
				// figure out why.
				crop.y -= newHeight;
			} else {
				crop.y = mEventData.yCrossOver ? crop.y + (crop.height - newHeight) : mEventData.cropStartY;
			}

			crop.x = this.clamp(crop.x, 0, 100 - newWidth);
			crop.y = this.clamp(crop.y, 0, 100 - newHeight);

			// Apply width/height changes depending on ordinate.
			if (this.xyOrds.indexOf(ord) > -1) {
				crop.width = newWidth;
				crop.height = newHeight;
			} else if (this.xOrds.indexOf(ord) > -1) {
				crop.width = newWidth;
			} else if (this.yOrds.indexOf(ord) > -1) {
				crop.height = newHeight;
			}

			mEventData.lastYCrossover = mEventData.yCrossOver;
			this.crossOverCheck(xDiffPc, yDiffPc);
		} else {
			crop.x = this.clamp(mEventData.cropStartX + xDiffPc, 0, 100 - crop.width);
			crop.y = this.clamp(mEventData.cropStartY + yDiffPc, 0, 100 - crop.height);
		}

		this.cropInvalid = false;

		if (this.props.onChange) {
			this.props.onChange(crop);
		}

		this.setState({ crop: crop });
	},

	crossOverCheck: function crossOverCheck(xDiffPc, yDiffPc) {
		var mEventData = this.mEventData;

		if (!mEventData.yCrossOver && -Math.abs(mEventData.cropStartHeight) - yDiffPc >= 0 || mEventData.yCrossOver && -Math.abs(mEventData.cropStartHeight) - yDiffPc <= 0) {
			mEventData.yCrossOver = !mEventData.yCrossOver;
		}

		if (!mEventData.xCrossOver && -Math.abs(mEventData.cropStartWidth) - xDiffPc >= 0 || mEventData.xCrossOver && -Math.abs(mEventData.cropStartWidth) - xDiffPc <= 0) {
			mEventData.xCrossOver = !mEventData.xCrossOver;
		}
	},

	onCropMouseTouchDown: function onCropMouseTouchDown(e) {
		e.preventDefault(); // Stop drag selection.

		var crop = this.state.crop;
		var clientX = undefined,
		    clientY = undefined;

		if (e.touches) {
			clientX = e.touches[0].clientX;
			clientY = e.touches[0].clientY;
		} else {
			clientX = e.clientX;
			clientY = e.clientY;
		}

		// Focus for detecting keypress.
		this.refs.component.focus();

		var ord = e.target.dataset.ord;
		var xInversed = ord === 'nw' || ord === 'w' || ord === 'sw';
		var yInversed = ord === 'nw' || ord === 'n' || ord === 'ne';

		var cropOffset = undefined;

		if (crop.aspect) {
			cropOffset = this.getElementOffset(this.refs.cropSelect);
		}

		this.mEventData = {
			imageWidth: this.refs.image.width,
			imageHeight: this.refs.image.height,
			clientStartX: clientX,
			clientStartY: clientY,
			cropStartWidth: crop.width,
			cropStartHeight: crop.height,
			cropStartX: xInversed ? crop.x + crop.width : crop.x,
			cropStartY: yInversed ? crop.y + crop.height : crop.y,
			xInversed: xInversed,
			yInversed: yInversed,
			xCrossOver: xInversed,
			yCrossOver: yInversed,
			isResize: e.target !== this.refs.cropSelect,
			ord: ord,
			cropOffset: cropOffset
		};

		this.mouseDownOnCrop = true;
	},

	onComponentMouseTouchDown: function onComponentMouseTouchDown(e) {
		if (e.target !== this.refs.imageCopy) {
			return;
		}

		e.preventDefault(); // Stop drag selection.

		var crop = this.state.crop;
		var clientX = undefined,
		    clientY = undefined;

		if (e.touches) {
			clientX = e.touches[0].clientX;
			clientY = e.touches[0].clientY;
		} else {
			clientX = e.clientX;
			clientY = e.clientY;
		}

		// Focus for detecting keypress.
		this.refs.component.focus();

		var imageOffset = this.getElementOffset(this.refs.image);
		var xPc = (clientX - imageOffset.left) / this.refs.image.width * 100;
		var yPc = (clientY - imageOffset.top) / this.refs.image.height * 100;

		crop.x = xPc;
		crop.y = yPc;
		crop.width = 0;
		crop.height = 0;

		this.mEventData = {
			imageWidth: this.refs.image.width,
			imageHeight: this.refs.image.height,
			clientStartX: clientX,
			clientStartY: clientY,
			cropStartWidth: crop.width,
			cropStartHeight: crop.height,
			cropStartX: crop.x,
			cropStartY: crop.y,
			xInversed: false,
			yInversed: false,
			xCrossOver: false,
			yCrossOver: false,
			isResize: true,
			ord: 'nw'
		};

		this.mouseDownOnCrop = true;
		this.setState({ newCropIsBeingDrawn: true });
	},

	onComponentKeyDown: function onComponentKeyDown(e) {
		var keyCode = e.which;
		var crop = this.state.crop;
		var nudged = false;

		if (!crop.width || !crop.height) {
			return;
		}

		if (keyCode === this.arrowKey.left) {
			crop.x -= this.nudgeStep;
			nudged = true;
		} else if (keyCode === this.arrowKey.right) {
			crop.x += this.nudgeStep;
			nudged = true;
		} else if (keyCode === this.arrowKey.up) {
			crop.y -= this.nudgeStep;
			nudged = true;
		} else if (keyCode === this.arrowKey.down) {
			crop.y += this.nudgeStep;
			nudged = true;
		}

		if (nudged) {
			crop.x = this.clamp(crop.x, 0, 100 - crop.width);
			crop.y = this.clamp(crop.y, 0, 100 - crop.height);

			this.setState({ crop: crop });

			if (this.props.onChange) {
				this.props.onChange(crop);
			}
			if (this.props.onComplete) {
				this.props.onComplete(crop);
			}
		}
	},

	onDocMouseTouchEnd: function onDocMouseTouchEnd(e) {
		if (this.mouseDownOnCrop) {

			this.cropInvalid = !this.state.crop.width && !this.state.crop.height;
			this.mouseDownOnCrop = false;

			if (this.props.onComplete) {
				this.props.onComplete(this.state.crop);
			}

			this.setState({ newCropIsBeingDrawn: false });
		}
	},

	getElementOffset: function getElementOffset(el) {
		var rect = el.getBoundingClientRect();
		var docEl = document.documentElement;

		var rectTop = rect.top + window.pageYOffset - docEl.clientTop;
		var rectLeft = rect.left + window.pageXOffset - docEl.clientLeft;

		return {
			top: rectTop,
			left: rectLeft
		};
	},

	clamp: function clamp(num, min, max) {
		return Math.min(Math.max(num, min), max);
	},

	createCropSelection: function createCropSelection() {
		var style = this.getCropStyle();

		return _react2['default'].createElement(
			'div',
			{ ref: 'cropSelect',
				style: style,
				className: 'ReactCrop--crop-selection',
				onMouseDown: this.onCropMouseTouchDown,
				onTouchStart: this.onCropMouseTouchDown },
			_react2['default'].createElement('div', { className: 'ReactCrop--drag-bar ord-n', 'data-ord': 'n' }),
			_react2['default'].createElement('div', { className: 'ReactCrop--drag-bar ord-e', 'data-ord': 'e' }),
			_react2['default'].createElement('div', { className: 'ReactCrop--drag-bar ord-s', 'data-ord': 's' }),
			_react2['default'].createElement('div', { className: 'ReactCrop--drag-bar ord-w', 'data-ord': 'w' }),
			_react2['default'].createElement('div', { className: 'ReactCrop--drag-handle ord-nw', 'data-ord': 'nw' }),
			_react2['default'].createElement('div', { className: 'ReactCrop--drag-handle ord-n', 'data-ord': 'n' }),
			_react2['default'].createElement('div', { className: 'ReactCrop--drag-handle ord-ne', 'data-ord': 'ne' }),
			_react2['default'].createElement('div', { className: 'ReactCrop--drag-handle ord-e', 'data-ord': 'e' }),
			_react2['default'].createElement('div', { className: 'ReactCrop--drag-handle ord-se', 'data-ord': 'se' }),
			_react2['default'].createElement('div', { className: 'ReactCrop--drag-handle ord-s', 'data-ord': 's' }),
			_react2['default'].createElement('div', { className: 'ReactCrop--drag-handle ord-sw', 'data-ord': 'sw' }),
			_react2['default'].createElement('div', { className: 'ReactCrop--drag-handle ord-w', 'data-ord': 'w' })
		);
	},

	arrayToPercent: function arrayToPercent(arr, delimeter) {
		delimeter = delimeter || ' ';
		return arr.map(function (number) {
			return number + '%';
		}).join(delimeter);
	},

	getImageClipStyle: function getImageClipStyle() {
		var crop = this.state.crop;

		var right = 100 - (crop.x + crop.width);
		var bottom = 100 - (crop.y + crop.height);

		// Safari doesn't like it if values add up to exactly
		// 100 (it doesn't draw the clip). I have submitted a bug.
		if (crop.x + right === 100) {
			right -= 0.00001;
		}

		if (crop.y + bottom === 100) {
			bottom -= 0.00001;
		}

		var insetVal = 'inset(' + this.arrayToPercent([crop.y, right, bottom, crop.x]) + ')';

		return {
			WebkitClipPath: insetVal,
			clipPath: insetVal
		};
	},

	onImageLoad: function onImageLoad(e) {
		var crop = this.state.crop;
		var imageWidth = e.target.naturalWidth;
		var imageHeight = e.target.naturalHeight;
		var imageAspect = imageWidth / imageHeight;

		// If there is a width or height then infer the other to
		// ensure the value is correct.
		if (crop.aspect) {
			if (crop.width) {
				crop.height = crop.width / crop.aspect * imageAspect;
			} else if (crop.height) {
				crop.width = crop.height * crop.aspect / imageAspect;
			}
			this.setState({ crop: crop });
		}
	},

	render: function render() {
		var cropSelection = undefined,
		    imageClip = undefined;

		if (!this.cropInvalid) {
			cropSelection = this.createCropSelection();
			imageClip = this.getImageClipStyle();
		}

		var componentClasses = ['ReactCrop'];

		if (this.state.newCropIsBeingDrawn) {
			componentClasses.push('ReactCrop-new-crop');
		}
		if (this.state.crop.aspect) {
			componentClasses.push('ReactCrop-fixed-aspect');
		}

		return _react2['default'].createElement(
			'div',
			{ ref: 'component',
				className: componentClasses.join(' '),
				onTouchStart: this.onComponentMouseTouchDown,
				onMouseDown: this.onComponentMouseTouchDown,
				tabIndex: '1',
				onKeyDown: this.onComponentKeyDown },
			_react2['default'].createElement('img', { ref: 'image', className: 'ReactCrop--image', src: this.props.src, onLoad: this.onImageLoad }),
			_react2['default'].createElement(
				'div',
				{ className: 'ReactCrop--crop-wrapper' },
				_react2['default'].createElement('img', { ref: 'imageCopy', className: 'ReactCrop--image-copy', src: this.props.src, style: imageClip }),
				cropSelection
			),
			this.props.children
		);
	}
});

exports['default'] = ReactCrop;
module.exports = exports['default'];
