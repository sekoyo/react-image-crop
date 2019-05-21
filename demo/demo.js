/* globals window, document, FileReader */
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
  }

  onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.setState({ src: reader.result });
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  onImageLoaded = (image) => {
    this.imageRef = image;
    this.makeClientCrop(this.state.crop);
  }

  onCropComplete = (crop) => {
    console.log('onCropComplete', crop);
    this.makeClientCrop(crop);
  }

  onCropChange = (crop) => {
    // console.log('onCropChange', crop);
    this.setState({ crop });
  }

  onDragStart = () => {
    console.log('onDragStart');
  }

  onDragEnd = () => {
    console.log('onDragEnd');
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        blob.name = fileName; // eslint-disable-line no-param-reassign
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, 'image/jpeg');
    });
  }

  makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      this.getCroppedImg(
        this.imageRef,
        crop,
        'newFile.jpeg',
      ).then(croppedImageUrl => this.setState({ croppedImageUrl }));
    }
  }

  renderSelectionAddon = () => (
    <button
      type="button"
      style={{
        position: 'absolute',
        bottom: -25,
        right: 0,
      }}
      onClick={() => window.alert('You clicked the addon!')}
    >
      custom addon
    </button>
  );

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
            onDragStart={this.onDragStart}
            onDragEnd={this.onDragEnd}
            renderSelectionAddon={this.renderSelectionAddon}
          />
        )}
        {croppedImageUrl && <img alt="Crop" src={croppedImageUrl} />}
      </div>
    );
  }
}

ReactDOM.render(<App />, cropEditor);
