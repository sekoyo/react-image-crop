var React = require('react');
var ReactCreateFragment = require('react-addons-create-fragment');

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

	onMouseMove: function(e) {
		if (!this.mouseDownOnCrop) {
			return;
		}

		var crop = this.crop;
		var mEventData = this.mEventData;

		var xDiffPx = e.clientX - mEventData.clientStartX;
		var xDiffPc = (xDiffPx / mEventData.imageWidth) * 100;

		var yDiffPx = e.clientY - mEventData.clientStartY;
		var yDiffPc = (yDiffPx / mEventData.imageHeight) * 100;

		if (mEventData.isResize) {
			var ord = mEventData.ord;

			// On the inverse change the diff so it's the same and
			// the same algo applies.
			if (mEventData.xInversed) {
				xDiffPc -= mEventData.cropStartWidth * 2;
			}
			if (mEventData.yInversed) {
				yDiffPc -= mEventData.cropStartHeight * 2;
			}

			// New height.
			var newHeight = mEventData.cropStartHeight + yDiffPc;
			if (mEventData.yCrossOver) {
				newHeight = Math.abs(newHeight);
			}

			// Cap if polarity is inversed and the shape fills the y space.
			if (mEventData.yCrossOver) {
				newHeight = Math.min(newHeight, mEventData.cropStartY);
			}

			// New width.
			var newWidth = mEventData.cropStartWidth + xDiffPc;
			if (mEventData.xCrossOver) {
				newWidth = Math.abs(newWidth);
			}

			// Adjust x/y to give illusion of 'staticness' as width/height is increased
			// when polarity is inversed.
			crop.y = mEventData.yCrossOver ? crop.y + (crop.height - newHeight) : mEventData.cropStartY;
			crop.x = mEventData.xCrossOver ? crop.x + (crop.width - newWidth) : mEventData.cropStartX;

			// Clamp width & height.
			newWidth = this.clamp(newWidth, 0, (100 - crop.x));
			newHeight = this.clamp(newHeight, 0, (100 - crop.y));

			// Apply width/height changes depending on ordinate.
			if (this.xyOrds.indexOf(ord) > -1) {
				crop.width = newWidth;
				crop.height = newHeight;
			} else if (this.xOrds.indexOf(ord) > -1) {
				crop.width = newWidth;
			} else if (this.yOrds.indexOf(ord) > -1) {
				crop.height = newHeight;
			}

			// Detect changes in polarity.
			if ((!mEventData.yCrossOver && -Math.abs(mEventData.cropStartHeight) - yDiffPc >= 0) ||
				(mEventData.yCrossOver && -Math.abs(mEventData.cropStartHeight) - yDiffPc <= 0)) {
				mEventData.yCrossOver = !mEventData.yCrossOver;
			}

			if ((!mEventData.xCrossOver && -Math.abs(mEventData.cropStartWidth) - xDiffPc >= 0) ||
				(mEventData.xCrossOver && -Math.abs(mEventData.cropStartWidth) - xDiffPc <= 0)) {
				mEventData.xCrossOver = !mEventData.xCrossOver;
			}


		} else {
			crop.x = this.clamp(mEventData.cropStartX + xDiffPc, 0, (100 - crop.width));
			crop.y = this.clamp(mEventData.cropStartY + yDiffPc, 0, (100 - crop.height));
		}

		if (this.props.onChange) {
			this.props.onChange(crop);
		}

		this.forceUpdate();
	},

	onCropMouseDown: function(e) {
		e.preventDefault(); // Stop drag selection.

		var ord = e.target.dataset.ord;
		var xInversed = ord === 'nw' || ord === 'w' || ord === 'sw';
		var yInversed = ord === 'nw' || ord === 'n' || ord === 'ne';

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
			ord: ord
		};

		this.mouseDownOnCrop = true;
	},

	onComponentMouseDown: function(e) {
		if (e.target !== this.refs.imageCopy) {
			return;
		}
		
		e.preventDefault(); // Stop drag selection.

		var elOffset = this.getElementOffset(e.target);

		var xPc = (e.clientX - elOffset.left) / this.refs.image.width * 100;
		var yPc = (e.clientY - elOffset.top) / this.refs.image.height * 100;

		if (!this.crop) {
			this.crop = {};
		}

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
			if (this.props.onComplete) {
				this.props.onComplete(this.crop);
			}

			if (this.crop) {
				if (!this.crop.width || !this.crop.height) {
					this.crop = null;
				}
			}

			this.mouseDownOnCrop = false;
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

	render: function () {
		var cropSelection, imageClip;
		this.crop = this.crop || this.props.crop;

		if (this.crop) {
			cropSelection = this.createCropSelection();
			imageClip = this.getImageClipStyle();
		}

		var componentClasses = ['ReactCrop'];

		if (this.state.newCropIsBeingDrawn) {
			componentClasses.push('ReactCrop-new-crop');
		}

		return (
			<div className={componentClasses.join(' ')} onMouseDown={this.onComponentMouseDown}>
				<img ref='image' className='ReactCrop--image' src={this.props.src} />

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