/* globals document, FileReader */
import React, { Component } from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line
import ReactCrop, { makeAspectCrop } from '../lib/ReactCrop';

/**
 * Load the image in the crop editor.
 */
const cropEditor = document.querySelector('#crop-editor');

function loadEditView(dataUrl) {
  class Parent extends Component {
    constructor() {
      super();
      this.state = {
        crop: {
          x: 0,
          y: 0,
          // aspect: 16 / 9,
        },
        maxHeight: 80,
      };
      this.onButtonClick = this.onButtonClick.bind(this);
    }

    onButtonClick = () => {
      const { image } = this.state;
      this.setState({
        crop: makeAspectCrop({
          x: 20,
          y: 5,
          aspect: 1,
          height: 50,
        }, image.naturalWidth / image.naturalHeight),
        disabled: true,
      });
    }

    onImageLoaded = (image) => {
      this.setState({
        crop: makeAspectCrop({
          x: 0,
          y: 0,
          aspect: 16 / 9,
          width: 50,
        }, image.naturalWidth / image.naturalHeight),
        image,
      });
    }

    onCropComplete = (crop, pixelCrop) => {
      console.log('onCropComplete, pixelCrop:', pixelCrop);
    }

    onCropChange = (crop) => {
      this.setState({ crop });
    }

    render() {
      return (
        <div>
          <ReactCrop
            {...this.state}
            src={dataUrl}
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
          />
          <button onClick={this.onButtonClick}>Programatically set crop</button>
          <button onClick={() => { this.setState({ foo: Date.now() }); }}>Change foo state</button>
        </div>
      );
    }
  }

  ReactDOM.render(<Parent />, cropEditor);
}

/**
 * Select an image file.
 */
const imageType = /^image\//;
const fileInput = document.querySelector('#file-picker');

fileInput.addEventListener('change', (e) => {
  const file = e.target.files.item(0);

  if (!file || !imageType.test(file.type)) {
    return;
  }

  const reader = new FileReader();

  reader.onload = (e2) => {
    loadEditView(e2.target.result);
  };

  reader.readAsDataURL(file);
});
