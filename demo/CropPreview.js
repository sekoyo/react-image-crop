var React = require('react');

var CropPreview = React.createClass({
	propTypes: {
		crop: React.PropTypes.object.isRequired
	},

	maxScale: 1,

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

	scale: function (options) {
		var scale = options.scale ||
			Math.min(options.maxWidth/options.width, options.maxHeight/options.height);

		scale = Math.min(scale, this.maxScale);

		return {
		    scale: scale,
		    width: options.width * scale,
		    height: options.height * scale
		};
	},

	calcCrop: function (options) {
		var imageWidthUnit = options.imageEl.naturalWidth / 100;
		var imageHeightUnit = options.imageEl.naturalHeight / 100;

		// Viewport.
		var viewportWidth = imageWidthUnit * options.cropWidth;
		var viewportHeight = imageHeightUnit * options.cropHeight;

		// Scale viewport.
		var scaledViewport = this.scale({
			width: viewportWidth,
			height: viewportHeight,
			maxWidth: options.maxWidth,
			maxHeight: options.maxHeight,
		});

		// Scale image based on the viewport scale.
		var scaledImage = this.scale({
			scale: scaledViewport.scale,
			width: this.refs.image.naturalWidth,
			height: this.refs.image.naturalHeight
		});

		options.imageEl.width = scaledImage.width;
		options.imageEl.height = scaledImage.height;

		imageWidthUnit = scaledImage.width / 100;
		imageHeightUnit = scaledImage.height / 100;

		// For adjusting the position of the image underneath the viewport.
		var imageMLeft = -Math.abs(imageWidthUnit * options.cropX);
		var imageMTop = -Math.abs(imageHeightUnit * options.cropY);

		return {
			image: {
				marginLeft: imageMLeft,
				marginTop: imageMTop
			},
			viewport: {
				width: scaledViewport.width,
				height: scaledViewport.height
			}
		};
	},

	updateCrop: function() {
		var cssProps = this.calcCrop({
			imageEl: this.refs.image,
			cropWidth: this.props.crop.width,
			cropHeight: this.props.crop.height,
			cropX: this.props.crop.x,
			cropY: this.props.crop.y,
			maxWidth: 600,
			maxHeight: 500
		});

		this.refs.imageWrapper.style.width = cssProps.viewport.width + 'px';
		this.refs.imageWrapper.style.height = cssProps.viewport.height + 'px';

		this.refs.image.style.marginLeft = cssProps.image.marginLeft + 'px';
		this.refs.image.style.marginTop = cssProps.image.marginTop + 'px';
	},

	onWindowResize: function () {
		this.updateCrop();
	},

	componentDidMount: function() {
		this.onWindowResize = this.debounce(this.onWindowResize, 1000);
		window.addEventListener('resize', this.onWindowResize);
		this.updateCrop();
	},

	componentWillUnmount: function () {
		window.removeEventListener('resize', this.onWindowResize);
	},

	componentDidUpdate: function() {
		this.updateCrop();
	},

	render: function () {
		return (
			<div ref="imageWrapper" className="CropPreview">
				<img ref="image" src={this.props.src} className="CropPreview--image" />
			</div>
		);
	}
});

module.exports = CropPreview;