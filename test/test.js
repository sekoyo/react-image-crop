/* eslint-disable jsx-a11y/media-has-caption, class-methods-use-this */
import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom' // eslint-disable-line

import ReactCrop from '../src/ReactCrop'
import '../src/ReactCrop.scss'

const mp4Url = 'http://techslides.com/demos/sample-videos/small.mp4'

/**
 * Load the image in the crop editor.
 */
const cropEditor = document.querySelector('#crop-editor')

class App extends PureComponent {
  state = {
    src: null,
    scale: 1,
    rotate: 0,
    spin: 0,
    crop: {
      // x: 200,
      // y: 200,
      // aspect: 16 / 9,
    },
  }

  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        this.setState({ src: reader.result })
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }

  onImageLoaded = e => {
    this.imageRef = e.target
    // this.setState({ crop: { unit: 'px', width: 50, height: 50 } });
    // return false;
  }

  onCropComplete = (crop, percentCrop) => {
    console.log('onCropComplete', crop, percentCrop)
    this.makeClientCrop(crop)
  }

  onCropChange = (crop, percentCrop) => {
    // console.log('onCropChange', crop, percentCrop);
    this.setState({ crop })
  }

  onDragStart = () => {
    // console.log('onDragStart');
  }

  onDragEnd = () => {
    // console.log('onDragEnd');
  }

  onChangeToIncompleteCropClick = () => {
    this.setState({
      crop: {
        aspect: 16 / 9,
        unit: '%',
        width: 100,
      },
    })
  }

  // Todo: apply scaling and rotation + update against
  // codesandbox demo.
  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const pixelRatio = window.devicePixelRatio

    canvas.width = crop.width * pixelRatio * scaleX
    canvas.height = crop.height * pixelRatio * scaleY

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    ctx.imageSmoothingQuality = 'high'

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    )

    return new Promise(resolve => {
      canvas.toBlob(blob => {
        if (blob) {
          blob.name = fileName
          window.URL.revokeObjectURL(this.fileUrl)
          this.fileUrl = window.URL.createObjectURL(blob)
          resolve(this.fileUrl)
        }
      }, 'image/jpeg')
    })
  }

  makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      this.getCroppedImg(this.imageRef, crop, 'newFile.jpeg').then(croppedImageUrl =>
        this.setState({ croppedImageUrl })
      )
    }
  }

  renderVideo = () => (
    <video autoPlay loop style={{ display: 'block', maxWidth: '100%' }}>
      <source src={mp4Url} type="video/mp4" />
    </video>
  )

  renderSelectionAddon = () => <input placeholder="Type something" />

  render() {
    const { croppedImageUrl, scale, rotate, spin, src, crop } = this.state

    // console.log({ scale, rotate });

    return (
      <div className="App">
        <div>
          <input type="file" onChange={this.onSelectFile} />
          <div>
            <label htmlFor="scaleInput">Scale: </label>
            <input
              id="scaleInput"
              type="number"
              step="0.1"
              value={scale}
              disabled={!src}
              onChange={e => this.setState({ scale: Number(e.target.value) })}
            />
          </div>
          <div>
            <label htmlFor="RotateInput">Rotate: </label>
            <input
              id="RotateInput"
              type="number"
              value={rotate}
              disabled={!src}
              onChange={e => this.setState({ rotate: Math.min(180, Math.max(-180, Number(e.target.value))) })}
            />
          </div>
          <div>
            <label htmlFor="SpinInput">Spin: </label>
            <input
              id="SpinInput"
              type="number"
              value={spin}
              disabled={!src}
              onChange={e => this.setState({ spin: Math.min(180, Math.max(-180, Number(e.target.value))) })}
            />
          </div>
        </div>
        {src && (
          <ReactCrop
            crop={crop}
            ruleOfThirds
            // circularCrop
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
            onDragStart={this.onDragStart}
            onDragEnd={this.onDragEnd}
            // renderSelectionAddon={this.renderSelectionAddon}
            minWidth={50}
            minHeight={50}
            maxWidth={200}
            maxHeight={200}
          >
            <img src={src} style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }} onLoad={this.onImageLoaded} />
          </ReactCrop>
        )}
        {src && (
          <button style={{ display: 'block' }} onClick={this.onChangeToIncompleteCropClick}>
            Change to incomplete aspect crop
          </button>
        )}
        {croppedImageUrl && (
          <img alt="Crop" src={croppedImageUrl} style={{ display: 'block', width: crop.width, height: crop.height }} />
        )}
      </div>
    )
  }
}

ReactDOM.render(<App />, cropEditor)
