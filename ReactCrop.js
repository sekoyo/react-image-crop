var React = require('react');

var ReactCrop = React.createClass({
	propTypes: {
		src: React.PropTypes.string.isRequired,
		crop: React.PropTypes.object
	},

	xOrds: ['e', 'w'],
	yOrds: ['n', 's'],
	xyOrds: ['nw', 'ne', 'se', 'sw'],

	getInitialState: function() {
		return {};
	},

	componentDidMount: function() {
		document.addEventListener('mousemove', this.onMouseMove);
		document.addEventListener('mouseup', this.onMouseUp);
	},

	componentWillUnmount: function() {
		document.removeEventListener('mousemove', this.onMouseMove);
		document.addEventListener('mouseup', this.onMouseUp);
	},

	getCropStyle: function() {
		return {
			top: this.crop.y + '%',
			left: this.crop.x + '%',
			width: this.crop.width + '%',
			height: this.crop.height + '%'
		};
	},

	straightenYPath: function(clientX) {
		var markerEl = document.getElementById('marker');//debugger

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

		markerEl.style.left = clientX + 'px';//debugger
		markerEl.style.top = clientY + 'px';//debugger

		return clientY;
	},

	onMouseMove: function(e) {
		if (!this.mouseDownOnCrop) {
			return;
		}

		var crop = this.crop;
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

		this.forceUpdate();
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

		var ord = e.target.dataset.ord;
		var xInversed = ord === 'nw' || ord === 'w' || ord === 'sw';
		var yInversed = ord === 'nw' || ord === 'n' || ord === 'ne';

		var cropOffset, imageOffset;

		if (this.crop.aspect) {
			cropOffset = this.getElementOffset(this.refs.cropSelect);
		}

		this.mEventData = {
			imageWidth: this.refs.image.width,
			imageHeight: this.refs.image.height,
			clientStartX: e.clientX,
			clientStartY: e.clientY,
			cropStartWidth: this.crop.width,
			cropStartHeight: this.crop.height,
			cropStartX: xInversed ? (this.crop.x + this.crop.width) : this.crop.x,
			cropStartY: yInversed ? (this.crop.y + this.crop.height) : this.crop.y,
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

		var imageOffset = this.getElementOffset(this.refs.image);
		var xPc = (e.clientX - imageOffset.left) / this.refs.image.width * 100;
		var yPc = (e.clientY - imageOffset.top) / this.refs.image.height * 100;

		this.crop.x = xPc;
		this.crop.y = yPc;
		this.crop.width = 0;
		this.crop.height = 0;

		this.mEventData = {
			imageWidth: this.refs.image.width,
			imageHeight: this.refs.image.height,
			clientStartX: e.clientX,
			clientStartY: e.clientY,
			cropStartWidth: this.crop.width,
			cropStartHeight: this.crop.height,
			cropStartX: this.crop.x,
			cropStartY: this.crop.y,
			xInversed: false,
			yInversed: false,
			xCrossOver: false,
			yCrossOver: false,
			isResize: true,
			ord: 'nw'
		};

		this.mouseDownOnCrop = true;
		this.setState({
			newCropIsBeingDrawn: true
		});
	},

	onMouseUp: function(e) {
		if (this.mouseDownOnCrop) {

			this.cropInvalid = !this.crop.width && !this.crop.height;
			this.mouseDownOnCrop = false;

			if (this.props.onComplete) {
				this.props.onComplete(this.crop);
			}

			this.setState({
				newCropIsBeingDrawn: false
			});
		}
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
		var insetVal = 'inset(' + this.arrayToPercent([
			this.crop.y,
			100 - (this.crop.x + this.crop.width),
			100 - (this.crop.y + this.crop.height),
			this.crop.x
		]) +')';

		return {
			WebkitClipPath: insetVal,
			clipPath: insetVal
		};
	},

	setupCropObject: function() {
		if (!this.crop && !this.props.crop) {
			this.crop = {};
			this.cropInvalid = true;
		} else if (this.props.crop) {
			this.crop = this.props.crop;
		}
	},

	onImageLoad: function(e) {
		var imageWidth = e.target.naturalWidth;
		var imageHeight = e.target.naturalHeight;
		var imageAspect = imageWidth / imageHeight;

		// If there is a missing width or height but an aspect is
		// specified, then infer it.
		if (this.crop.aspect) {
			if (!this.crop.height && this.crop.width) {
				this.crop.height = (this.crop.width / this.crop.aspect) * imageAspect;
				this.forceUpdate();
			} else if (!this.crop.width && this.crop.height) {
				this.crop.width = (this.crop.height * this.crop.aspect) / imageAspect;
				this.forceUpdate();
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
		if (this.crop.aspect) {
			componentClasses.push('ReactCrop-fixed-aspect');
		}

		return (
			<div className={componentClasses.join(' ')} onMouseDown={this.onComponentMouseDown}>
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