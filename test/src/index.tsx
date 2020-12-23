/* eslint-disable jsx-a11y/media-has-caption, class-methods-use-this */
import React, { createRef, PureComponent } from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line
import { Crop, CropObject, makeAspectCrop } from 'react-image-crop';

import 'react-image-crop/dist/styles.css';
import './index.css';

const mp4Url = 'http://techslides.com/demos/sample-videos/small.mp4';

/**
 * Load the image in the crop editor.
 */
const cropEditor = document.querySelector('#crop-editor');

interface AppState {
  crop: CropObject;
  croppedImageUrl?: string;
  src?: string;
}

class App extends PureComponent {
  imageRef = createRef<HTMLImageElement>();
  fileUrl?: string;

  state: AppState = {
    crop: { aspect: 16 / 9 },
  };

  onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.setState({ src: reader.result });
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  onImageLoaded = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width: imageWidth, height: imageHeight } = e.currentTarget.getBoundingClientRect();

    const aspect = 16 / 9;
    const width = imageWidth > imageHeight ? 100 : ((imageHeight * aspect) / imageWidth) * 100;
    const height = imageHeight > imageWidth ? 100 : (imageWidth / aspect / imageHeight) * 100;
    const y = (100 - height) / 2;
    const x = (100 - width) / 2;

    this.setState({
      crop: {
        unit: '%',
        x,
        y,
        aspect,
        width,
        height,
      },
    });
  };

  onCropComplete = (crop: CropObject, percentCrop: CropObject) => {
    console.log('onCropComplete', crop, percentCrop);
    this.makeClientCrop(crop);
  };

  onCropChange = (crop: CropObject, percentCrop: CropObject) => {
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
    const { width, height } = this.imageRef.current.getBoundingClientRect();
    this.setState({
      crop: makeAspectCrop(
        {
          unit: '%',
          x: 0,
          y: 0,
          aspect: 16 / 9,
          width: 100,
        },
        width,
        height
      ),
    });
  };

  getCroppedImg(image: HTMLImageElement, crop: CropObject, fileName: string) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    return new Promise((resolve, reject) => {
      if (!ctx) {
        reject();
        return;
      }

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

      canvas.toBlob(blob => {
        if (this.fileUrl) {
          window.URL.revokeObjectURL(this.fileUrl);
        }
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, 'image/jpeg');
    });
  }

  makeClientCrop(crop: CropObject) {
    if (this.imageRef.current && crop.width && crop.height) {
      this.getCroppedImg(this.imageRef.current, crop, 'newFile.jpeg').then(croppedImageUrl =>
        this.setState({ croppedImageUrl })
      );
    }
  }

  renderVideo = (
    <video autoPlay loop>
      <source src={mp4Url} type="video/mp4" />
    </video>
  );

  render() {
    const { src, croppedImageUrl } = this.state;

    return (
      <div className="App">
        <div>
          <input type="file" onChange={this.onSelectFile} />
        </div>
        {src && (
          <>
            <Crop
              crop={this.state.crop}
              ruleOfThirds
              // circularCrop
              onComplete={this.onCropComplete}
              onChange={this.onCropChange}
              onDragStart={this.onDragStart}
              onDragEnd={this.onDragEnd}
              // minWidth={100}
              // minHeight={100}
            >
              <img ref={this.imageRef} src={src} onLoad={this.onImageLoaded} />
            </Crop>
            <button onClick={this.onChangeToIncompleteCropClick}>Change to incomplete aspect crop</button>
          </>
        )}
        {croppedImageUrl && <img alt="Crop" src={croppedImageUrl} />}
      </div>
    );
  }
}

ReactDOM.render(<App />, cropEditor);
