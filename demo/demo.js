/* globals document, FileReader */
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line
import ReactCrop from '../lib/ReactCrop';
import '../dist/ReactCrop.css';

/**
 * Load the image in the crop editor.
 */
const cropEditor = document.querySelector('#crop-editor');

class App extends PureComponent {
  state = {
    src: null,
    crop: {
      x: 10,
      y: 10,
      aspect: 1,
      width: 50,
    },
  };

  onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.setState({ src: reader.result });
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  onImageLoaded = (image, pixelCrop) => {
    const { crop } = this.state;
    if (crop.aspect && crop.height && crop.width) {
      this.setState({
        crop: { ...crop, height: null },
      });
    }
    this.imageRef = image;
  };

  onCropComplete = async (crop, pixelCrop) => {
    if (crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        pixelCrop,
        'newFile.jpeg',
      );
      this.setState({ croppedImageUrl });
    }
  };

  onCropChange = (crop) => {
    this.setState({ crop });
  };

  getCroppedImg(image, pixelCrop, fileName) {
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, 'image/jpeg');
    });
  }

  render() {
    const { croppedImageUrl } = this.state;

    return (
      <div className="App">
        <div>
          <input type="file" onChange={this.onSelectFile} />
        </div>
        {this.state.src && (
          <ReactCrop
            src={this.state.src}
            crop={this.state.crop}
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
          />
        )}
        {croppedImageUrl && <img alt="Crop" src={croppedImageUrl} />}
      </div>
    );
  }
}

ReactDOM.render(<App />, cropEditor);