import React from 'react';

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

	defaultCrop: {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	},

	mergeObjects(obj1, obj2) {
		let obj3 = {};
		for (let attrname in obj1) { obj3[attrname] = obj1[attrname]; }
		for (let attrname in obj2) { obj3[attrname] = obj2[attrname]; }
		return obj3;
	},

	getInitialState() {
		let crop = this.mergeObjects(this.defaultCrop, this.props.crop);

		if (crop.width === 0 || crop.height === 0) {
			this.cropInvalid = true;
		}

		return {
			crop: crop
		};
	},

	componentDidMount() {
		document.addEventListener('mousemove', this.onDocMouseTouchMove);
		document.addEventListener('touchmove', this.onDocMouseTouchMove);

		document.addEventListener('mouseup', this.onDocMouseTouchEnd);
		document.addEventListener('touchend', this.onDocMouseTouchEnd);
		document.addEventListener('touchcancel', this.onDocMouseTouchEnd);
	},

	componentWillUnmount() {
		document.removeEventListener('mousemove', this.onDocMouseTouchMove);
		document.removeEventListener('touchmove', this.onDocMouseTouchMove);

		document.removeEventListener('mouseup', this.onDocMouseTouchEnd);
		document.removeEventListener('touchend', this.onDocMouseTouchEnd);
		document.removeEventListener('touchcancel', this.onDocMouseTouchEnd);
	},

	getCropStyle() {
		return {
			top: this.state.crop.y + '%',
			left: this.state.crop.x + '%',
			width: this.state.crop.width + '%',
			height: this.state.crop.height + '%'
		};
	},

	straightenYPath(clientX) {
		let ord = this.mEventData.ord;
		let cropOffset = this.mEventData.cropOffset;
		let cropStartWidth = this.mEventData.cropStartWidth / 100 * this.mEventData.imageWidth;
		let cropStartHeight = this.mEventData.cropStartHeight / 100 * this.mEventData.imageHeight;
		let k, d;
		
		if (ord === 'nw' || ord === 'se') {
			k = cropStartHeight / cropStartWidth;
			d = cropOffset.top - cropOffset.left * k;
		} else {
			k =  - cropStartHeight / cropStartWidth;
			d = (cropOffset.top + cropStartHeight) - cropOffset.left * k;
		}

		let clientY = k * clientX + d;

		return clientY;
	},

	onDocMouseTouchMove(e) {
		if (!this.mouseDownOnCrop) {
			return;
		}

		let crop = this.state.crop;
		let mEventData = this.mEventData;
		let clientX = e.clientX;
		let clientY = e.clientY;

		if (mEventData.isResize && crop.aspect && mEventData.cropOffset) {
			clientY = this.straightenYPath(clientX);
		}

		let xDiffPx = clientX - mEventData.clientStartX;
		let xDiffPc = xDiffPx / mEventData.imageWidth * 100;

		let yDiffPx = clientY - mEventData.clientStartY;
		let yDiffPc = yDiffPx / mEventData.imageHeight * 100;

		if (mEventData.isResize) {
			let ord = mEventData.ord;
			let imageAspect = mEventData.imageWidth / mEventData.imageHeight;

			// On the inverse change the diff so it's the same and
			// the same algo applies.
			if (mEventData.xInversed) {
				xDiffPc -= mEventData.cropStartWidth * 2;
			}
			if (mEventData.yInversed) {
				yDiffPc -= mEventData.cropStartHeight * 2;
			}

			// New width.
			let newWidth = mEventData.cropStartWidth + xDiffPc;

			if (mEventData.xCrossOver) {
				newWidth = Math.abs(newWidth);
			}

			newWidth = this.clamp(newWidth, this.props.minWidth || 0, 100);

			// New height.
			let newHeight;

			if (crop.aspect) {
				newHeight = (newWidth / crop.aspect) * imageAspect;
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
				newWidth = (newHeight * crop.aspect) / imageAspect;
			}

			// Alt x+y calc:
			// if crossed { n = startSize + (startPos + diffPc)}
			// else { n = startPos }

			// Adjust x/y to give illusion of 'staticness' as width/height is increased
			// when polarity is inversed.
			let newX = mEventData.cropStartX;
			let newY = mEventData.cropStartY;

			if (mEventData.xCrossOver) {
				newX = crop.x + (crop.width - newWidth);
			}

			if (mEventData.yCrossOver) {
				// This not only removes the little "shake" when inverting at a diagonal, but for some
				// reason y was way off at fast speeds moving sw->ne with fixed aspect only, I couldn't
				// figure out why.
				if (mEventData.lastYCrossover === false) {
					newY = crop.y - newHeight;
				} else {
					newY = crop.y + (crop.height - newHeight);
				}
			}

			crop.x = this.clamp(newX, 0, 100 - newWidth);
			crop.y = this.clamp(newY, 0, 100 - newHeight);

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

	crossOverCheck(xDiffPc, yDiffPc) {
		let mEventData = this.mEventData;

		if ((!mEventData.yCrossOver && -Math.abs(mEventData.cropStartHeight) - yDiffPc >= 0) ||
			(mEventData.yCrossOver && -Math.abs(mEventData.cropStartHeight) - yDiffPc <= 0)) {
			mEventData.yCrossOver = !mEventData.yCrossOver;
		}

		if ((!mEventData.xCrossOver && -Math.abs(mEventData.cropStartWidth) - xDiffPc >= 0) ||
			(mEventData.xCrossOver && -Math.abs(mEventData.cropStartWidth) - xDiffPc <= 0)) {
			mEventData.xCrossOver = !mEventData.xCrossOver;
		}
	},

	onCropMouseTouchDown(e) {
		e.preventDefault(); // Stop drag selection.

		let crop = this.state.crop;
		let clientX, clientY;

		if (e.touches) {
			clientX = e.touches[0].clientX;
			clientY = e.touches[0].clientY;
		} else {
			clientX = e.clientX;
			clientY = e.clientY;
		}

		// Focus for detecting keypress.
		this.refs.component.focus();

		let ord = e.target.dataset.ord;
		let xInversed = ord === 'nw' || ord === 'w' || ord === 'sw';
		let yInversed = ord === 'nw' || ord === 'n' || ord === 'ne';

		let cropOffset;

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

	onComponentMouseTouchDown(e) {
		if (e.target !== this.refs.imageCopy) {
			return;
		}

		e.preventDefault(); // Stop drag selection.

		let crop = this.state.crop;
		let clientX, clientY;

		if (e.touches) {
			clientX = e.touches[0].clientX;
			clientY = e.touches[0].clientY;
		} else {
			clientX = e.clientX;
			clientY = e.clientY;
		}

		// Focus for detecting keypress.
		this.refs.component.focus();

		let imageOffset = this.getElementOffset(this.refs.image);
		let xPc = (clientX - imageOffset.left) / this.refs.image.width * 100;
		let yPc = (clientY - imageOffset.top) / this.refs.image.height * 100;

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

	onComponentKeyDown(e) {
		let keyCode = e.which;
		let crop = this.state.crop;
		let nudged = false;

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

	onDocMouseTouchEnd(e) {
		if (this.mouseDownOnCrop) {

			this.cropInvalid = !this.state.crop.width && !this.state.crop.height;
			this.mouseDownOnCrop = false;

			if (this.props.onComplete) {
				this.props.onComplete(this.state.crop);
			}

			this.setState({ newCropIsBeingDrawn: false });
		}
	},

	getElementOffset(el) {
		let rect = el.getBoundingClientRect();
		let docEl = document.documentElement;

		let rectTop = rect.top + window.pageYOffset - docEl.clientTop;
		let rectLeft = rect.left + window.pageXOffset - docEl.clientLeft;

		return {
			top: rectTop,
			left: rectLeft
		};
	},

	clamp(num, min, max) {
		return Math.min(Math.max(num, min), max);
	},

	createCropSelection() {
		let style = this.getCropStyle();

		return (
			<div ref='cropSelect'
				style={style}
				className='ReactCrop--crop-selection'
				onMouseDown={this.onCropMouseTouchDown}
				onTouchStart={this.onCropMouseTouchDown}>

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

	arrayToPercent(arr, delimeter) {
		delimeter = delimeter || ' ';
		return arr.map(number => number + '%').join(delimeter);
	},

	getImageClipStyle() {
		let crop = this.state.crop;

		let right = 100 - (crop.x + crop.width);
		let bottom = 100 - (crop.y + crop.height);

		// Safari doesn't like it if values add up to exactly
		// 100 (it doesn't draw the clip). I have submitted a bug.
		if (crop.x + right === 100) {
			right -= 0.00001;
		}

		if (crop.y + bottom === 100) {
			bottom -= 0.00001;
		}

		let insetVal = 'inset(' + this.arrayToPercent([
			crop.y,
			right,
			bottom,
			crop.x
		]) +')';

		return {
			WebkitClipPath: insetVal,
			clipPath: insetVal
		};
	},

	onImageLoad(e) {
		let crop = this.state.crop;
		let imageWidth = e.target.naturalWidth;
		let imageHeight = e.target.naturalHeight;
		let imageAspect = imageWidth / imageHeight;

		// If there is a width or height then infer the other to
		// ensure the value is correct.
		if (crop.aspect) {
			if (crop.width) {
				crop.height = (crop.width / crop.aspect) * imageAspect;
			} else if (crop.height) {
				crop.width = (crop.height * crop.aspect) / imageAspect;
			}
			this.cropInvalid = !crop.width && !crop.height;
			this.setState({ crop: crop });
		}
	},

	render() {
		let cropSelection, imageClip;

		if (!this.cropInvalid) {
			cropSelection = this.createCropSelection();
			imageClip = this.getImageClipStyle();
		}

		let componentClasses = ['ReactCrop'];

		if (this.state.newCropIsBeingDrawn) {
			componentClasses.push('ReactCrop-new-crop');
		}
		if (this.state.crop.aspect) {
			componentClasses.push('ReactCrop-fixed-aspect');
		}

		return (
			<div ref="component"
				className={componentClasses.join(' ')}
				onTouchStart={this.onComponentMouseTouchDown}
				onMouseDown={this.onComponentMouseTouchDown} 
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

export default ReactCrop;