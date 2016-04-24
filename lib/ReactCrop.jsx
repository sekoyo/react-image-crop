import React, { Component, PropTypes } from 'react';
import assign from 'object-assign';

class ReactCrop extends Component {

	static propTypes = {
		src: PropTypes.string.isRequired,
		crop: PropTypes.object,
		minWidth: PropTypes.number,
		minHeight: PropTypes.number,
		keepSelection: PropTypes.bool,
		onChange: PropTypes.func,
		onComplete: PropTypes.func,
		onImageLoaded: PropTypes.func
	}

	static xOrds = ['e', 'w']
	static yOrds = ['n', 's']
	static xyOrds = ['nw', 'ne', 'se', 'sw']

	static arrowKey = {
		left: 37,
		up: 38,
		right: 39,
		down: 40
	}

	static nudgeStep = 0.2

	static defaultCrop = {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		aspect: false
	}

	constructor(props) {
		super(props);

		this.onDocMouseTouchMove = this.onDocMouseTouchMove.bind(this);
		this.onDocMouseTouchEnd = this.onDocMouseTouchEnd.bind(this);
		this.onImageLoad = this.onImageLoad.bind(this);
		this.onComponentMouseTouchDown = this.onComponentMouseTouchDown.bind(this);
		this.onComponentKeyDown = this.onComponentKeyDown.bind(this);
		this.onCropMouseTouchDown = this.onCropMouseTouchDown.bind(this);

		this.state = this.getState();
	}

	getState(props = this.props) {
		const crop = assign({}, ReactCrop.defaultCrop, props.crop);

		this.cropInvalid = (!crop.width || !crop.height);

		return {
			crop: crop
		};
	}

	componentDidMount() {
		document.addEventListener('mousemove', this.onDocMouseTouchMove);
		document.addEventListener('touchmove', this.onDocMouseTouchMove);

		document.addEventListener('mouseup', this.onDocMouseTouchEnd);
		document.addEventListener('touchend', this.onDocMouseTouchEnd);
		document.addEventListener('touchcancel', this.onDocMouseTouchEnd);
	}

	componentWillUnmount() {
		document.removeEventListener('mousemove', this.onDocMouseTouchMove);
		document.removeEventListener('touchmove', this.onDocMouseTouchMove);

		document.removeEventListener('mouseup', this.onDocMouseTouchEnd);
		document.removeEventListener('touchend', this.onDocMouseTouchEnd);
		document.removeEventListener('touchcancel', this.onDocMouseTouchEnd);
	}

	componentWillReceiveProps(nextProps) {
		const nextState = this.getState(nextProps);
		if (nextState.crop.aspect) {
			this.ensureAspectDimensions(nextState.crop, this.refs.image);
		}
		this.setState(nextState);
	}

	getCropStyle() {
		return {
			top: this.state.crop.y + '%',
			left: this.state.crop.x + '%',
			width: this.state.crop.width + '%',
			height: this.state.crop.height + '%'
		};
	}

	straightenYPath(clientX) {
		const evData = this.evData;
		const ord = evData.ord;
		const cropOffset = evData.cropOffset;
		const cropStartWidth = evData.cropStartWidth / 100 * evData.imageWidth;
		const cropStartHeight = evData.cropStartHeight / 100 * evData.imageHeight;
		let k, d;

		if (ord === 'nw' || ord === 'se') {
			k = cropStartHeight / cropStartWidth;
			d = cropOffset.top - cropOffset.left * k;
		} else {
			k =  - cropStartHeight / cropStartWidth;
			d = (cropOffset.top + cropStartHeight) - cropOffset.left * k;
		}

		return k * clientX + d;
	}

	onDocMouseTouchMove(e) {
		if (!this.mouseDownOnCrop) {
			return;
		}

		const crop = this.state.crop;
		const evData = this.evData;
		const clientPos = this.getClientPos(e);

		if (evData.isResize && crop.aspect && evData.cropOffset) {
			clientPos.y = this.straightenYPath(clientPos.x);
		}

		const xDiffPx = clientPos.x - evData.clientStartX;
		evData.xDiffPc = xDiffPx / evData.imageWidth * 100;

		const yDiffPx = clientPos.y - evData.clientStartY;
		evData.yDiffPc = yDiffPx / evData.imageHeight * 100;

		if (evData.isResize) {
			this.resizeCrop();
		} else {
			this.dragCrop();
		}

		this.cropInvalid = false;

		if (this.props.onChange) {
			this.props.onChange(crop);
		}

		this.setState({ crop: crop });
	}

	getNewSize() {
		const crop = this.state.crop;
		const evData = this.evData;
		const imageAspect = evData.imageWidth / evData.imageHeight;

		// New width.
		let newWidth = evData.cropStartWidth + evData.xDiffPc;

		if (evData.xCrossOver) {
			newWidth = Math.abs(newWidth);
		}

		let maxWidth = 100;

		// Stop the box expanding on the opposite side when some edges are hit.
		if (!this.state.newCropIsBeingDrawn) {
			maxWidth = (['nw', 'w', 'sw'].indexOf(evData.inversedXOrd || evData.ord) > -1) ?
				evData.cropStartX :
				100 - evData.cropStartX;
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
			// Cap if polarity is inversed and the shape fills the y space.
			newHeight = Math.min(Math.abs(newHeight), evData.cropStartY);
		}

		let maxHeight = 100;

		// Stop the box expanding on the opposite side when some edges are hit.
		if (!this.state.newCropIsBeingDrawn) {
			maxHeight = (['nw', 'n', 'ne'].indexOf(evData.inversedYOrd || evData.ord) > -1) ?
				evData.cropStartY :
				100 - evData.cropStartY;
		}

		newHeight = this.clamp(newHeight, this.props.minHeight || 0, maxHeight);

		if (crop.aspect) {
			newWidth = (newHeight * crop.aspect) / imageAspect;
		}

		return {
			width: newWidth,
			height: newHeight
		};
	}

	resizeCrop() {
		const crop = this.state.crop;
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

		// Apply width/height changes depending on ordinate.
		if (ReactCrop.xyOrds.indexOf(ord) > -1) {
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

	dragCrop() {
		const crop = this.state.crop;
		const evData = this.evData;
		crop.x = this.clamp(evData.cropStartX + evData.xDiffPc, 0, 100 - crop.width);
		crop.y = this.clamp(evData.cropStartY + evData.yDiffPc, 0, 100 - crop.height);
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

	onCropMouseTouchDown(e) {
		e.preventDefault(); // Stop drag selection.

		const crop = this.state.crop;
		const clientPos = this.getClientPos(e);

		// Focus for detecting keypress.
		this.refs.component.focus();

		const ord = e.target.dataset.ord;
		const xInversed = ord === 'nw' || ord === 'w' || ord === 'sw';
		const yInversed = ord === 'nw' || ord === 'n' || ord === 'ne';

		let cropOffset;

		if (crop.aspect) {
			cropOffset = this.getElementOffset(this.refs.cropSelect);
		}

		this.evData = {
			imageWidth: this.refs.image.width,
			imageHeight: this.refs.image.height,
			clientStartX: clientPos.x,
			clientStartY: clientPos.y,
			cropStartWidth: crop.width,
			cropStartHeight: crop.height,
			cropStartX: xInversed ? (crop.x + crop.width) : crop.x,
			cropStartY: yInversed ? (crop.y + crop.height) : crop.y,
			xInversed: xInversed,
			yInversed: yInversed,
			xCrossOver: xInversed,
			yCrossOver: yInversed,
			startXCrossOver: xInversed,
			startYCrossOver: yInversed,
			isResize: e.target !== this.refs.cropSelect,
			ord: ord,
			cropOffset: cropOffset
		};

		this.mouseDownOnCrop = true;
	}

	getClientPos(e) {
		let pageX, pageY;

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

	onComponentMouseTouchDown(e) {
		if (e.target !== this.refs.imageCopy && e.target !== this.refs.cropWrapper) {
			return;
		}

		e.preventDefault(); // Stop drag selection.

		let crop = this.props.keepSelection === true ? {} : this.state.crop;
		const clientPos = this.getClientPos(e);

		// Focus for detecting keypress.
		this.refs.component.focus();

		const imageOffset = this.getElementOffset(this.refs.image);
		const xPc = (clientPos.x - imageOffset.left) / this.refs.image.width * 100;
		const yPc = (clientPos.y - imageOffset.top) / this.refs.image.height * 100;

		crop.x = xPc;
		crop.y = yPc;
		crop.width = 0;
		crop.height = 0;

		this.evData = {
			imageWidth: this.refs.image.width,
			imageHeight: this.refs.image.height,
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

	onComponentKeyDown(e) {
		const keyCode = e.which;
		const crop = this.state.crop;
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
			if(e) {
				e.preventDefault();
			}
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
	}

	onDocMouseTouchEnd(e) {
		if (this.mouseDownOnCrop) {

			this.cropInvalid = !this.state.crop.width && !this.state.crop.height;
			this.mouseDownOnCrop = false;

			if (this.props.onComplete) {
				this.props.onComplete(this.state.crop);
			}

			this.setState({ newCropIsBeingDrawn: false });
		}
	}

	getElementOffset(el) {
		const rect = el.getBoundingClientRect();
		const docEl = document.documentElement;

		const rectTop = rect.top + window.pageYOffset - docEl.clientTop;
		const rectLeft = rect.left + window.pageXOffset - docEl.clientLeft;

		return {
			top: rectTop,
			left: rectLeft
		};
	}

	clamp(num, min, max) {
		return Math.min(Math.max(num, min), max);
	}

	createCropSelection() {
		const style = this.getCropStyle();

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
	}

	arrayDividedBy100(arr, delimeter = ' ') {
		return arr.map(number => number / 100).join(delimeter);
	}

	arrayToPercent(arr, delimeter = ' ') {
		return arr.map(number => number + '%').join(delimeter);
	}

	getPolygonValues(forSvg) {
		const crop = this.state.crop;
		let pTopLeft = [ crop.x, crop.y ];
		let pTopRight = [ crop.x + crop.width, crop.y ];
		let pBottomLeft = [ crop.x, crop.y + crop.height ];
		let pBottomRight = [ crop.x + crop.width, crop.y + crop.height ];

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

	getPolygonClipPath() {
		const { top, bottom } = this.getPolygonValues();
		return `polygon(${top.left}, ${top.right}, ${bottom.right}, ${bottom.left})`;
	}

	ensureAspectDimensions(crop, imageEl) {
		const imageWidth = imageEl.naturalWidth;
		const imageHeight = imageEl.naturalHeight;
		const imageAspect = imageWidth / imageHeight;

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
	}

	onImageLoad(e) {
		const crop = this.state.crop;
		const imageEl = e.target;

		// If there is a width or height then infer the other to
		// ensure the value is correct.
		if (crop.aspect) {
			this.ensureAspectDimensions(crop, imageEl);
			this.cropInvalid = !crop.width || !crop.height;
			this.setState({ crop: crop });
		}
		if (this.props.onImageLoaded) {
			this.props.onImageLoaded(crop, imageEl);
		}
	}

	// Unfortunately some modern browsers like Firefox still don't support svg's as a css property..
	renderSvg() {
		const { top, bottom } = this.getPolygonValues(true);
		const points = `${top.left}, ${top.right}, ${bottom.right}, ${bottom.left}`;

		return (
			<svg width="0" height="0" style={{ position: 'absolute' }}>
				<defs>
					<clipPath id="ReactCropperClipPolygon" clipPathUnits="objectBoundingBox">
						<polygon points={`${top.left}, ${top.right}, ${bottom.right}, ${bottom.left}`} />
					</clipPath>
				</defs>
			</svg>
		);
	}

	render() {
		let cropSelection, imageClip;

		if (!this.cropInvalid) {
			cropSelection = this.createCropSelection();
			imageClip = {
				WebkitClipPath: this.getPolygonClipPath(),
				clipPath: 'url("#ReactCropperClipPolygon")'
			};
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
				{this.renderSvg()}

				<img ref='image' className='ReactCrop--image' src={this.props.src} onLoad={this.onImageLoad} />

				<div className='ReactCrop--crop-wrapper' ref="cropWrapper">
					<img ref='imageCopy' className='ReactCrop--image-copy' src={this.props.src} style={imageClip} />
					{cropSelection}
				</div>

				{this.props.children}
			</div>
		);
	}
}

export default ReactCrop;