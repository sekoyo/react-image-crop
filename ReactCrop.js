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
		return {
			crop: this.props.crop,
			mouseDownOnCrop: false,
			currentCropName: this.props.currentCrop
		};
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
		var crop = this.state.crop;

		return {
			top: crop.y + '%',
			left: crop.x + '%',
			width: crop.width + '%',
			height: crop.height + '%'
		};
	},

	onMouseMove: function(e) {
		if (!this.state.mouseDownOnCrop) {
			return;
		}

		var crop = this.state.crop;
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

		this.setState({
			crop: crop
		});
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
			cropStartWidth: this.state.crop.width,
			cropStartHeight: this.state.crop.height,
			cropStartX: xInversed ? (this.state.crop.x + this.state.crop.width) : this.state.crop.x,
			cropStartY: yInversed ? (this.state.crop.y + this.state.crop.height) : this.state.crop.y,
			xInversed: xInversed,
			yInversed: yInversed,
			xCrossOver: xInversed,
			yCrossOver: yInversed,
			isResize: e.target !== this.refs.cropSelect,
			ord: ord
		};

		this.setState({
			mouseDownOnCrop: true
		});
	},

	onMouseUp: function(e) {
		if (this.state.mouseDownOnCrop) {
			this.setState({
				mouseDownOnCrop: false
			});
		}
	},

	clamp: function(num, min, max) {
		return Math.min(Math.max(num, min), max);
	},

	createCropSelection: function(cropName) {
		var style = this.getCropStyle();

		return (
			<div ref="cropSelect"
				style={style}
				className="ReactCrop--crop-selection ReactCrop--marching-ants marching"
				onMouseDown={this.onCropMouseDown}
				onMouseUp={this.onCropMouseUp}>

				<div className="ReactCrop--drag-bar ord-n" data-ord="n"></div>
				<div className="ReactCrop--drag-bar ord-e" data-ord="e"></div>
				<div className="ReactCrop--drag-bar ord-s" data-ord="s"></div>
				<div className="ReactCrop--drag-bar ord-w" data-ord="w"></div>

				<div className="ReactCrop--drag-handle ord-nw" data-ord="nw"></div>
				<div className="ReactCrop--drag-handle ord-n" data-ord="n"></div>
				<div className="ReactCrop--drag-handle ord-ne" data-ord="ne"></div>
				<div className="ReactCrop--drag-handle ord-e" data-ord="e"></div>
				<div className="ReactCrop--drag-handle ord-se" data-ord="se"></div>
				<div className="ReactCrop--drag-handle ord-s" data-ord="s"></div>
				<div className="ReactCrop--drag-handle ord-sw" data-ord="sw"></div>
				<div className="ReactCrop--drag-handle ord-w" data-ord="w"></div>
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

	render: function () {
		var cropSelection = this.createCropSelection(this.state.currentCropName);
		var imageClip = this.getImageClipStyle();

		return (
			<div className="ReactCrop">
				<img ref="image" className="ReactCrop--image" src={this.props.src} />

				<div className="ReactCrop--crop-wrapper">
					<img className="ReactCrop--image-copy" src={this.props.src} style={imageClip} />
					{cropSelection}
				</div>

				{this.props.children}
			</div>
		);
	}
});

module.exports = ReactCrop;