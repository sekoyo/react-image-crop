import React from 'react';
import update from 'react-addons-update';

function objectAssign(target, source) {
	let from;
	let to = target;
	let symbols;

	for (let s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (let key in from) {
			if (Object.prototype.hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (Object.getOwnPropertySymbols) {
			symbols = Object.getOwnPropertySymbols(from);
			for (let i = 0; i < symbols.length; i++) {
				if (Object.prototype.propertyIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
}

var ReactCrop = React.createClass({
	propTypes: {
		src: React.PropTypes.string.isRequired,
		style: React.PropTypes.object,
		crop: React.PropTypes.object,
		minWidth: React.PropTypes.number,
		minHeight: React.PropTypes.number
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

  getDefaultProps: function() {
    return {
      style: {},
			crop: {
				x: 0,
				y: 0,
				width: 0,
				height: 0
			},
    };
  },

	getInitialState(props = this.props) {
		this.cropInvalid = (props.crop.width === 0 || props.crop.height === 0);

		return {
			crop: props.crop
		};
	},

	getStyles() {
		let marchingAntsColour = this.props.style.marchingAntsColour || 'rgba(255,255,255,0.7)';
		let marchingAntsAltColour = this.props.style.marchingAntsAltColour || 'rgba(0,0,0,0.7)';

		let dragHandleWidth = this.props.style.dragHandleWidth || 9;
		let dragHandleHeight = this.props.style.dragHandleHeight || 9;
		let dragHandleBackgroundColour = this.props.style.dragHandleBackgroundColour || 'rgba(0,0,0,0.2)';
		let dragHandleBorder = this.props.style.dragHandleBorder || '1px solid rgba(255,255,255,0.7)';

		let dragBarSize = 6;

		let croppedAreaOverlayColor = 'rgba(0,0,0,0.6)';

		return {
			root: {
				position: 'relative',
				display: 'inline-block',
				cursor: 'crosshair',
				overflow: 'hidden',
				outline: 'none'
			},

			image: {
				display: 'block',
				maxWidth: '100%'
			},
			imageCopy: {
				maxWidth: '100%',
				position: 'absolute',
				top: 0,
				left: 0
			},

			cropWrapper: {
				position: 'absolute',
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
				backgroundColor: croppedAreaOverlayColor
			},

			cropSelection: {
				position: 'absolute',
				top: 0,
				left: 0,
				transform: 'translate3d(0,0,0)',
				boxSizing: 'border-box',
				cursor: 'move',

				// Marching ants.
				backgroundImage:
					'linear-gradient(to right, ' + marchingAntsColour + ' 50%, ' + marchingAntsAltColour + ' 50%),' +
					'linear-gradient(to right, ' + marchingAntsColour + ' 50%, ' + marchingAntsAltColour + ' 50%),' +
					'linear-gradient(to bottom, ' + marchingAntsColour + ' 50%, ' + marchingAntsAltColour + ' 50%),' +
					'linear-gradient(to bottom, ' + marchingAntsColour + ' 50%, ' + marchingAntsAltColour + ' 50%)',
				padding: 1,
				backgroundSize: '10px 1px, 10px 1px, 1px 10px, 1px 10px',
				backgroundPosition: '0 0, 0 100%, 0 0, 100% 0',
				backgroundRepeat: 'repeat-x, repeat-x, repeat-y, repeat-y',
				animation: 'marching-ants 2s',
				animationTimingFunction: 'linear',
				animationIterationCount: 'infinite',
				animationPlayState: 'running'
			},

			marchingAntsAnimation:
				`@keyframes marching-ants {
					0% {
						background-position: 0 0,  0 100%,  0 0,  100% 0;
					}
					100% {
						background-position: 40px 0, -40px 100%, 0 -40px, 100% 40px;
					}
				}`,

			dragHandle: {
				position: 'absolute',
				width: dragHandleWidth,
				height: dragHandleHeight,
				backgroundColor: dragHandleBackgroundColour,
				border: dragHandleBorder,
				boxSizing: 'border-box',

				// This stops the borders disappearing when keyboard nudging.
				outline: '1px solid transparent'
			},

			ordNW: {
				top: 0,
				left: 0,
				marginTop: -(Math.floor(dragHandleHeight / 2)),
				marginLeft: -(Math.floor(dragHandleWidth / 2)),
				cursor: 'nw-resize'
			},
			ordN: {
				top: 0,
				left: '50%',
				marginTop: -(Math.floor(dragHandleHeight / 2)),
				marginLeft: -(Math.floor(dragHandleWidth / 2)),
				cursor: 'n-resize'
			},
			ordNE: {
				top: 0,
				right: 0,
				marginTop: -(Math.floor(dragHandleHeight / 2)),
				marginRight: -(Math.floor(dragHandleWidth / 2)),
				cursor: 'ne-resize'
			},
			ordE: {
				top: '50%',
				right: 0,
				marginTop: -(Math.floor(dragHandleHeight / 2)),
				marginRight: -(Math.floor(dragHandleWidth / 2)),
				cursor: 'e-resize'
			},
			ordSE: {
				bottom: 0,
				right: 0,
				marginBottom: -(Math.floor(dragHandleHeight / 2)),
				marginRight: -(Math.floor(dragHandleWidth / 2)),
				cursor: 'se-resize'
			},
			ordS: {
				bottom: 0,
				left: '50%',
				marginBottom: -(Math.floor(dragHandleHeight / 2)),
				marginLeft: -(Math.floor(dragHandleWidth / 2)),
				cursor: 's-resize'
			},
			ordSW: {
				bottom: 0,
				left: 0,
				marginBottom: -(Math.floor(dragHandleHeight / 2)),
				marginLeft: -(Math.floor(dragHandleWidth / 2)),
				cursor: 'sw-resize'
			},
			ordW: {
				top: '50%',
				left: 0,
				marginTop: -(Math.floor(dragHandleHeight / 2)),
				marginLeft: -(Math.floor(dragHandleWidth / 2)),
				cursor: 'w-resize'
			},

			dragBarN: {
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: dragBarSize,
				marginTop: -(dragBarSize - 2)
			},
			dragBarE: {
				position: 'absolute',
				right: 0,
				top: 0,
				width: dragBarSize,
				height: '100%',
				marginRight: -(dragBarSize - 2)
			},
			dragBarS: {
				position: 'absolute',
				bottom: 0,
				left: 0,
				width: '100%',
				height: dragBarSize,
				marginBottom: -(dragBarSize - 2)
			},
			dragBarW: {
				position: 'absolute',
				top: 0,
				left: 0,
				width: dragBarSize,
				height: '100%',
				marginLeft: -(dragBarSize - 2)
			}

		}

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

	componentWillReceiveProps(nextProps) {
		this.setState(this.getInitialState(nextProps));
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
		let evData = this.evData;
		let ord = evData.ord;
		let cropOffset = evData.cropOffset;
		let cropStartWidth = evData.cropStartWidth / 100 * evData.imageWidth;
		let cropStartHeight = evData.cropStartHeight / 100 * evData.imageHeight;
		let k, d;

		if (ord === 'nw' || ord === 'se') {
			k = cropStartHeight / cropStartWidth;
			d = cropOffset.top - cropOffset.left * k;
		} else {
			k =  - cropStartHeight / cropStartWidth;
			d = (cropOffset.top + cropStartHeight) - cropOffset.left * k;
		}

		return k * clientX + d;
	},

	onDocMouseTouchMove(e) {
		if (!this.mouseDownOnCrop) {
			return;
		}

		let crop = this.state.crop;
		let evData = this.evData;
		let clientPos = this.getClientPos(e);

		if (evData.isResize && crop.aspect && evData.cropOffset) {
			clientPos.y = this.straightenYPath(clientPos.x);
		}

		let xDiffPx = clientPos.x - evData.clientStartX;
		evData.xDiffPc = xDiffPx / evData.imageWidth * 100;

		let yDiffPx = clientPos.y - evData.clientStartY;
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
	},

	getNewSize() {
		let crop = this.state.crop;
		let evData = this.evData;
		let imageAspect = evData.imageWidth / evData.imageHeight;

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
	},

	resizeCrop() {
		let crop = this.state.crop;
		let evData = this.evData;
		let ord = evData.ord;

		// On the inverse change the diff so it's the same and
		// the same algo applies.
		if (evData.xInversed) {
			evData.xDiffPc -= evData.cropStartWidth * 2;
		}
		if (evData.yInversed) {
			evData.yDiffPc -= evData.cropStartHeight * 2;
		}

		// New size.
		let newSize = this.getNewSize();

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
		if (this.xyOrds.indexOf(ord) > -1) {
			crop.width = newSize.width;
			crop.height = newSize.height;
		} else if (this.xOrds.indexOf(ord) > -1) {
			crop.width = newSize.width;
		} else if (this.yOrds.indexOf(ord) > -1) {
			crop.height = newSize.height;
		}

		evData.lastYCrossover = evData.yCrossOver;
		this.crossOverCheck();
	},

	dragCrop() {
		let crop = this.state.crop;
		let evData = this.evData;
		crop.x = this.clamp(evData.cropStartX + evData.xDiffPc, 0, 100 - crop.width);
		crop.y = this.clamp(evData.cropStartY + evData.yDiffPc, 0, 100 - crop.height);
	},

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
	},

	crossOverCheck() {
		let evData = this.evData;

		if ((!evData.xCrossOver && -Math.abs(evData.cropStartWidth) - evData.xDiffPc >= 0) ||
			(evData.xCrossOver && -Math.abs(evData.cropStartWidth) - evData.xDiffPc <= 0)) {
			evData.xCrossOver = !evData.xCrossOver;
		}

		if ((!evData.yCrossOver && -Math.abs(evData.cropStartHeight) - evData.yDiffPc >= 0) ||
			(evData.yCrossOver && -Math.abs(evData.cropStartHeight) - evData.yDiffPc <= 0)) {
			evData.yCrossOver = !evData.yCrossOver;
		}

		let swapXOrd = evData.xCrossOver !== evData.startXCrossOver;
		let swapYOrd = evData.yCrossOver !== evData.startYCrossOver;

		evData.inversedXOrd = swapXOrd ? this.inverseOrd(evData.ord) : false;
		evData.inversedYOrd = swapYOrd ? this.inverseOrd(evData.ord) : false;
	},

	onCropMouseTouchDown(e) {
		e.preventDefault(); // Stop drag selection.

		let crop = this.state.crop;
		let clientPos = this.getClientPos(e);

		// Focus for detecting keypress.
		this.refs.component.focus();

		let ord = e.target.dataset.ord;
		let xInversed = ord === 'nw' || ord === 'w' || ord === 'sw';
		let yInversed = ord === 'nw' || ord === 'n' || ord === 'ne';

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
	},

	getClientPos(e) {
		let clientX, clientY;

		if (e.touches) {
			clientX = e.touches[0].clientX;
			clientY = e.touches[0].clientY;
		} else {
			clientX = e.clientX;
			clientY = e.clientY;
		}

		return {
			x: clientX,
			y: clientY
		}
	},

	onComponentMouseTouchDown(e) {
		if (e.target !== this.refs.imageCopy) {
			return;
		}

		e.preventDefault(); // Stop drag selection.

		let crop = this.state.crop;
		let clientPos = this.getClientPos(e);

		// Focus for detecting keypress.
		this.refs.component.focus();

		let imageOffset = this.getElementOffset(this.refs.image);
		let xPc = (clientPos.x - imageOffset.left) / this.refs.image.width * 100;
		let yPc = (clientPos.y - imageOffset.top) / this.refs.image.height * 100;

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

	createCropSelection(newCrop, fixedAspect) {
		let styles = this.getStyles();

		return (
			<div ref='cropSelect'
				style={objectAssign(styles.cropSelection, this.getCropStyle())}
				onMouseDown={this.onCropMouseTouchDown}
				onTouchStart={this.onCropMouseTouchDown}>

				{!newCrop &&
					<div ref='cropHandles'>
						{!fixedAspect &&
							<div ref='fixedAspectHandles'>
								<div style={update(styles.dragHandle, {$merge: styles.ordN})} data-ord='n'></div>
								<div style={update(styles.dragHandle, {$merge: styles.ordE})} data-ord='e'></div>
								<div style={update(styles.dragHandle, {$merge: styles.ordS})} data-ord='s'></div>
								<div style={update(styles.dragHandle, {$merge: styles.ordW})} data-ord='w'></div>
								<div style={styles.dragBarN} data-ord='n'></div>
								<div style={styles.dragBarE} data-ord='e'></div>
								<div style={styles.dragBarS} data-ord='s'></div>
								<div style={styles.dragBarW} data-ord='w'></div>
							</div>
						}

						<div style={update(styles.dragHandle, {$merge: styles.ordNW})} data-ord='nw'></div>
						<div style={update(styles.dragHandle, {$merge: styles.ordNE})} data-ord='ne'></div>
						<div style={update(styles.dragHandle, {$merge: styles.ordSE})} data-ord='se'></div>
						<div style={update(styles.dragHandle, {$merge: styles.ordSW})} data-ord='sw'></div>
					</div>
				}
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
			this.cropInvalid = !crop.width || !crop.height;
			this.setState({ crop: crop });
		}
	},

	render() {
		let styles = this.getStyles();
		let cropSelection, imageClipStyle;
		let fixedAspect = !!this.state.crop.aspect;
		let newCrop = this.state.newCropIsBeingDrawn;

		if (!this.cropInvalid) {
			cropSelection = this.createCropSelection(newCrop, fixedAspect);
			imageClipStyle = this.getImageClipStyle();
		}

		let rootStyles = styles.root;

		return (
			<div
				ref="component"
				style={objectAssign(rootStyles, this.props.style)}
				onTouchStart={this.onComponentMouseTouchDown}
				onMouseDown={this.onComponentMouseTouchDown}
				tabIndex="1"
				onKeyDown={this.onComponentKeyDown}>

				<style scoped={true} type="text/css">
					{styles.marchingAntsAnimation}
		    </style>

				<img ref='image' style={styles.image} src={this.props.src} onLoad={this.onImageLoad} />

				<div style={styles.cropWrapper}>
					<img ref='imageCopy' style={objectAssign(styles.imageCopy, imageClipStyle)} src={this.props.src} />
					{cropSelection}
				</div>

				{this.props.children}
			</div>
		);
	}
});

export default ReactCrop;
