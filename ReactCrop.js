var React = require('react');

var ReactCrop = React.createClass({
	propTypes: {
		src: React.PropTypes.string.isRequired,
		crop: React.PropTypes.object
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

	getInitialState: function() {
		return {
			crop: {}
		};
	},

	componentDidMount: function() {
		document.addEventListener('mousemove', this.onDocMouseMove);
		document.addEventListener('mouseup', this.onDocMouseUp);
	},

	componentWillUnmount: function() {
		document.removeEventListener('mousemove', this.onDocMouseMove);
		document.addEventListener('mouseup', this.onDocMouseUp);
	},

	getCropStyle: function() {
		return {
			top: this.state.crop.y + '%',
			left: this.state.crop.x + '%',
			width: this.state.crop.width + '%',
			height: this.state.crop.height + '%'
		};
	},

	straightenYPath: function(clientX) {
		var markerEl = document.getElementById('marker');//debug

		var ord = this.mEventData.ord;
		var cropOffset = this.mEventData.cropOffset;
		var cropStartWidth = this.mEventData.cropStartWidth / 100 * this.mEventData.imageWidth;
		var cropStartHeight = this.mEventData.cropStartHeight / 100 * this.mEventData.imageHeight;
		var k, d;
		
		if (ord === 'nw' || ord === 'se') {
			k = cropStartHeight / cropStartWidth;
			d = cropOffset.top - cropOffset.left * k;
		} else {
			k =  - cropStartHeight / cropStartWidth;
			d = (cropOffset.top + cropStartHeight) - cropOffset.left * k;
		}

		var clientY = k * clientX + d;

		markerEl.style.left = clientX + 'px';//debug
		markerEl.style.top = clientY + 'px';//debug

		return clientY;
	},

	onDocMouseMove: function(e) {
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

			newWidth = this.clamp(newWidth, 0, 100);

			// New height.
			var newHeight;

			if (crop.aspect) {
				newHeight = (newWidth / crop.aspect) * imageAspect;
			} else {
				newHeight = mEventData.cropStartHeight + yDiffPc;

				if (mEventData.yCrossOver) {
					newHeight = Math.abs(newHeight);
				}
			}

			// Cap if polarity is inversed and the shape fills the y space.
			if (mEventData.yCrossOver) {
				newHeight = Math.min(newHeight, mEventData.cropStartY);
			}

			newHeight = this.clamp(newHeight, 0, 100);

			if (crop.aspect) {
				newWidth = (newHeight * crop.aspect) / imageAspect;
			}

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

	crossOverCheck: function(xDiffPc, yDiffPc) {
		var mEventData = this.mEventData;

		if ((!mEventData.yCrossOver && -Math.abs(mEventData.cropStartHeight) - yDiffPc >= 0) ||
			(mEventData.yCrossOver && -Math.abs(mEventData.cropStartHeight) - yDiffPc <= 0)) {
			mEventData.yCrossOver = !mEventData.yCrossOver;
		}

		if ((!mEventData.xCrossOver && -Math.abs(mEventData.cropStartWidth) - xDiffPc >= 0) ||
			(mEventData.xCrossOver && -Math.abs(mEventData.cropStartWidth) - xDiffPc <= 0)) {
			mEventData.xCrossOver = !mEventData.xCrossOver;
		}
	},

	onCropMouseDown: function(e) {
		e.preventDefault(); // Stop drag selection.

		var crop = this.state.crop;

		// Focus for detecting keypress.
		this.refs.component.focus();

		var ord = e.target.dataset.ord;
		var xInversed = ord === 'nw' || ord === 'w' || ord === 'sw';
		var yInversed = ord === 'nw' || ord === 'n' || ord === 'ne';

		var cropOffset, imageOffset;

		if (crop.aspect) {
			cropOffset = this.getElementOffset(this.refs.cropSelect);
		}

		this.mEventData = {
			imageWidth: this.refs.image.width,
			imageHeight: this.refs.image.height,
			clientStartX: e.clientX,
			clientStartY: e.clientY,
			cropStartWidth: crop.width,
			cropStartHeight: crop.height,
			cropStartX: xInversed ? (crop.x + crop.width) : crop.x,
			cropStartY: yInversed ? (crop.y + crop.height) : crop.y,
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

	onComponentMouseDown: function(e) {
		if (e.target !== this.refs.imageCopy) {
			return;
		}

		e.preventDefault(); // Stop drag selection.

		var crop = this.state.crop;

		// Focus for detecting keypress.
		this.refs.component.focus();

		var imageOffset = this.getElementOffset(this.refs.image);
		var xPc = (e.clientX - imageOffset.left) / this.refs.image.width * 100;
		var yPc = (e.clientY - imageOffset.top) / this.refs.image.height * 100;

		crop.x = xPc;
		crop.y = yPc;
		crop.width = 0;
		crop.height = 0;

		this.mEventData = {
			imageWidth: this.refs.image.width,
			imageHeight: this.refs.image.height,
			clientStartX: e.clientX,
			clientStartY: e.clientY,
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

	onComponentKeyDown: function(e) {
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

	onDocMouseUp: function(e) {
		if (this.mouseDownOnCrop) {

			this.cropInvalid = !this.state.crop.width && !this.state.crop.height;
			this.mouseDownOnCrop = false;

			if (this.props.onComplete) {
				this.props.onComplete(this.state.crop);
			}

			this.setState({ newCropIsBeingDrawn: false });
		}
	},

	debounce: function (func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	},

	getElementOffset: function(el) {
		var rect = el.getBoundingClientRect();
		var docEl = document.documentElement;

		var rectTop = rect.top + window.pageYOffset - docEl.clientTop;
		var rectLeft = rect.left + window.pageXOffset - docEl.clientLeft;

		return {
			top: rectTop,
			left: rectLeft
		};
	},

	clamp: function(num, min, max) {
		return Math.min(Math.max(num, min), max);
	},

	createCropSelection: function() {
		var style = this.getCropStyle();

		return (
			<div ref='cropSelect'
				style={style}
				className='ReactCrop--crop-selection ReactCrop--marching-ants marching'
				onMouseDown={this.onCropMouseDown}
				onMouseUp={this.onCropMouseUp}>

				<div className='ReactCrop--drag-bar ord-n' data-ord='n'></div>
				<div className='ReactCrop--drag-bar ord-e' data-ord='e'></div>
				<div className='ReactCrop--drag-bar ord-s' data-ord='s'></div>
				<div className='ReactCrop--drag-bar ord-w' data-ord='w'></div>

				<div className='ReactCrop--drag-handle ord-nw' data-ord='nw'></div>
				<div className='ReactCrop--drag-handle ord-n' data-ord='n'></div>
				<div className='ReactCrop--drag-handle ord-ne' data-ord='ne'></div>
				<div className='ReactCrop--drag-handle ord-e' data-ord='e'></div>
				<div className='ReactCrop--drag-handle ord-se' data-ord='se'></div>
				<div className='ReactCrop--drag-handle ord-s' data-ord='s'></div>
				<div className='ReactCrop--drag-handle ord-sw' data-ord='sw'></div>
				<div className='ReactCrop--drag-handle ord-w' data-ord='w'></div>
			</div>
		);
	},

	arrayToPercent: function(arr, delimeter) {
		delimeter = delimeter || ' ';
		return arr.map(function(number) {
			return number + '%';
		}).join(delimeter);
	},

	getImageClipStyle: function() {
		var crop = this.state.crop;

		var insetVal = 'inset(' + this.arrayToPercent([
			crop.y,
			100 - (crop.x + crop.width),
			100 - (crop.y + crop.height),
			crop.x
		]) +')';

		return {
			WebkitClipPath: insetVal,
			clipPath: insetVal
		};
	},

	setupCropObject: function() {
		if (!Object.keys(this.state.crop).length && !this.props.crop) {
			this.cropInvalid = true;
		} else if (this.props.crop) {
			this.state.crop = this.props.crop;
		}
	},

	onImageLoad: function(e) {
		var crop = this.state.crop;
		var imageWidth = e.target.naturalWidth;
		var imageHeight = e.target.naturalHeight;
		var imageAspect = imageWidth / imageHeight;

		// If there is a missing width or height but an aspect is
		// specified, then infer it.
		if (crop.aspect) {
			if (!crop.height && crop.width) {
				crop.height = (crop.width / crop.aspect) * imageAspect;
				this.setState({ crop: crop });
			} else if (!crop.width && crop.height) {
				crop.width = (crop.height * crop.aspect) / imageAspect;
				this.setState({ crop: crop });
			}
		}
	},

	render: function () {
		var cropSelection, imageClip;

		this.setupCropObject();

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

		return (
			<div ref="component"
				className={componentClasses.join(' ')}
				onMouseDown={this.onComponentMouseDown} 
				tabIndex="1" 
				onKeyDown={this.onComponentKeyDown}>

				<img ref='image' className='ReactCrop--image' src={this.props.src} onLoad={this.onImageLoad} />

				<div className='ReactCrop--crop-wrapper'>
					<img ref='imageCopy' className='ReactCrop--image-copy' src={this.props.src} style={imageClip} />
					{cropSelection}
				</div>

				{this.props.children}
			</div>
		);
	}
});

module.exports = ReactCrop;