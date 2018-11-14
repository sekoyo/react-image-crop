/* globals document, FileReader */
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line
import ReactCrop from '../lib/ReactCrop';
import '../dist/ReactCrop.css';

/**
 * Load the image in the crop editor.
 */
const cropEditor = document.querySelector('#crop-editor');

function loadEditView(dataUrl) {
  class Parent extends PureComponent {
    state = {
      crop: {
        x: 20,
        y: 10,
        width: 40,
        height: 40,
        // aspect: 16 / 9,
      },
      disabled: false,
    }

    onButtonClick = () => {
      this.setState({
        crop: {
          x: 20,
          y: 5,
          aspect: 16 / 9,
          height: 50,
        },
        disabled: true,
      });
    }

    onButtonClick2 = () => {
      this.setState(state => ({
        crop: {
          ...state.crop,
          height: 50,
          aspect: 1,
        },
      }));
    }

    onImageLoaded = (image, pixelCrop) => {
      console.log('onImageLoaded', { image, pixelCrop });
      // this.setState({
      //   crop: makeAspectCrop({
      //     x: 0,
      //     y: 0,
      //     aspect: 10 / 4,
      //     width: 50,
      //   }, image.naturalWidth / image.naturalHeight),
      //   image,
      // });
    }

    onCropComplete = (crop, pixelCrop) => {
      console.log('onCropComplete', { crop, pixelCrop });
    }

    onCropChange = (crop, pixelCrop) => {
      // console.log('onCropChange', { crop, pixelCrop });
      this.setState({ crop });
    }

    render() {
      return (
        <div>
          <ReactCrop
            crop={this.state.crop}
            disabled={this.state.disabled}
            maxHeight={80}
            minHeight={20}
            minWidth={20}
            className="ACustomClassA ACustomClassB"
            src={dataUrl}
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
          />
          <button type="button" onClick={this.onButtonClick}>Programatically set crop</button>
          <button type="button" onClick={this.onButtonClick2}>Change to 16/9 aspect</button>
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
