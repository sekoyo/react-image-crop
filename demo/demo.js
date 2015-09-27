var React = require('react');
var ReactDOM = require('react-dom');
var ReactCrop = require('../index');

/**
 * Select an image file.
 */
var imageType = /^image\//;
var fileInput = document.querySelector('#file-picker');

fileInput.addEventListener('change', function(e) {
	var file = e.target.files.item(0);

	if (!imageType.test(file.type)) {
		return;
    }

    var reader = new FileReader();

	reader.onload = function(e) {
		loadEditView(e.target.result);
	};

	reader.readAsDataURL(file);
});

/**
 * Load the image in the crop editor.
 */
var cropEditor = document.querySelector('#crop-editor');

function loadEditView(dataUrl) {
	var crop = {
		x: 40,
		y: 20,
		width: 20,
		height: 40
	};

	ReactDOM.render(<ReactCrop.Editor src={dataUrl} crop={crop} />, cropEditor);
}