/* eslint-disable jsx-a11y/media-has-caption, class-methods-use-this */
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line
import ReactCrop from '../lib/ReactCrop';
import '../dist/ReactCrop.css';

const mp4Url = 'http://techslides.com/demos/sample-videos/small.mp4';

/**
 * Load the image in the crop editor.
 */
const cropEditor = document.querySelector('#crop-editor');

class App extends PureComponent {
  state = {
    src: null,
    crop: {
      // x: 200,
      // y: 200,
      unit: '%',
      width: 40,
      aspect: 16 / 9,
    },
  };

  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.setState({ src: reader.result });
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  onImageLoaded = onLoad => e => {
    this.imageRef = e.target;
    const img = e.target;

    const aspect = 16 / 9;
    const width = img.width > img.height ? 100 : ((img.height * aspect) / img.width) * 100;
    const height = img.height > img.width ? 100 : (img.width / aspect / img.height) * 100;
    const y = (100 - height) / 2;
    const x = (100 - width) / 2;

    onLoad({
      unit: '%',
      width,
      x,
      y,
      aspect,
    });
  };

  onCropComplete = (crop, percentCrop) => {
    console.log('onCropComplete', crop, percentCrop);
    this.makeClientCrop(crop);
  };

  onCropChange = (crop, percentCrop) => {
    // console.log('onCropChange', crop, percentCrop);
    this.setState({ crop: percentCrop });
  };

  onDragStart = () => {
    console.log('onDragStart');
  };

  onDragEnd = () => {
    console.log('onDragEnd');
  };

  onChangeToIncompleteCropClick = () => {
    this.setState({
      crop: {
        aspect: 16 / 9,
        unit: '%',
        width: 100,
      },
    });
  };

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
      crop.height
    );

    return new Promise(resolve => {
      canvas.toBlob(blob => {
        blob.name = fileName; // eslint-disable-line no-param-reassign
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, 'image/jpeg');
    });
  }

  makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      this.getCroppedImg(this.imageRef, crop, 'newFile.jpeg').then(croppedImageUrl =>
        this.setState({ croppedImageUrl })
      );
    }
  }

  renderVideo = onLoad => (
    <video autoPlay loop onLoadStart={onLoad}>
      <source src={mp4Url} type="video/mp4" />
    </video>
  );

  renderSelectionAddon = () => <input placeholder="Type something" />;

  render() {
    const { croppedImageUrl } = this.state;

    return (
      <div className="App">
        <div>
          <input type="file" onChange={this.onSelectFile} />
        </div>
        {this.state.src && (
          <>
            <ReactCrop
              crop={this.state.crop}
              ruleOfThirds
              // circularCrop
              onComplete={this.onCropComplete}
              onChange={this.onCropChange}
              onDragStart={this.onDragStart}
              onDragEnd={this.onDragEnd}
            // renderSelectionAddon={this.renderSelectionAddon}
            // minWidth={100}
            // minHeight={100}
            >
              {/* {onLoad => <img src={this.state.src} onLoad={onLoad} />} */}
              {onLoad => <img src={this.state.src} onLoad={this.onImageLoaded(onLoad)} />}
              {/* {onLoad => this.renderVideo(onLoad)} */}
            </ReactCrop>
            <button onClick={this.onChangeToIncompleteCropClick}>Change to incomplete aspect crop</button>
          </>
        )}
        {croppedImageUrl && <img alt="Crop" src={croppedImageUrl} />}
      </div>
    );
  }
}

ReactDOM.render(<App />, cropEditor);
