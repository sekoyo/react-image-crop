import React from 'react';
import ReactDOM from 'react-dom';
import ReactCrop from '../lib/ReactCrop.jsx';

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
 * Load the image in the crop editor.
 */
var cropEditor = document.querySelector('#crop-editor');

function loadEditView(dataUrl) {
	
	var Parent = React.createClass({
		getInitialState: function() {
			return {
				crop: {
					x: 0,
					y: 0,
					height: 16/9,
					width: 50
				}
			};
		},

		onButtonClick: function() {
			this.setState({
				crop: {
					x: 20,
					y: 5,
					aspect: 1,
					width: 30,
					height: 50
				}
			});
		},

		onImageLoaded: function(crop) {
			console.log('Image was loaded. Crop:', crop);
			// this.setState({
			// 	crop: {
			// 		aspect: 16/9,
			// 		width: 30,
			// 	}
			// });
		},

		onCropComplete: function(crop) {
			// console.log('Crop move complete:', crop);
		},

		render: function() {
			return (
				<div>
					<ReactCrop crop={this.state.crop} src={dataUrl} onImageLoaded={this.onImageLoaded} onComplete={this.onCropComplete} />
					<button onClick={this.onButtonClick}>Programatically set crop</button>
				</div>
			);
		}
	});

	ReactDOM.render(<Parent />, cropEditor);
}
