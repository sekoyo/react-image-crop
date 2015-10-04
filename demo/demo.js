var React = require('react');
var ReactDOM = require('react-dom');
var ReactCrop = require('../index');
var CropPreview = require('./CropPreview');

/**
 * Select an image file.
 */
var imageType = /^image\//;
var fileInput = document.querySelector('#file-picker');

fileInput.addEventListener('change', function(e) {
	var file = e.target.files.item(0);

	if (!file || !imageType.test(file.type)) {
		return;
    }

    var reader = new FileReader();

	reader.onload = function(e) {
		loadEditView(e.target.result);
	};

	reader.readAsDataURL(file);
});

/**
 * Load the image in the crop editor & preview the crop.
 */
var cropEditor = document.querySelector('#crop-editor');
var cropPreview = document.querySelector('#crop-preview');

function loadEditView(dataUrl) {
	var crop = {
		x: 35,
		y: 30,
		width: 20,
		height: 40,
		// aspect: 1
	};

	function onCropComplete (crop) {
		ReactDOM.render(<CropPreview crop={crop} src={dataUrl} />, cropPreview);
	}

	ReactDOM.render(<ReactCrop src={dataUrl} crop={crop} onComplete={onCropComplete} />, cropEditor);
}