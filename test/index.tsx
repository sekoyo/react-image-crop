import React, { createRef, PureComponent } from 'react'
import ReactDOM from 'react-dom'

import ReactCrop, { Crop, makeAspectCrop, PercentCrop, PixelCrop, centerCrop } from '../src'
import '../src/ReactCrop.scss'

const mp4Url = 'http://techslides.com/demos/sample-videos/small.mp4'

/**
 * Load the image in the crop editor.
 */
const cropEditor = document.querySelector('#crop-editor')

interface AppState {
  src: string
  scale: number
  rotate: number
  spin: number
  crop?: Crop
  croppedImageUrl: string
}

class App extends PureComponent<{}, AppState> {
  state: AppState = {
    src: '',
    scale: 1,
    rotate: 0,
    spin: 0,
    crop: undefined,
    croppedImageUrl: '',
  }

  fileUrl = ''
  imageRef = createRef<HTMLImageElement>()

  onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        this.setState({ src: reader.result?.toString() || '' })
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }

  onImageLoaded = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // This is where you can set a PERCENT aspect crop since you
    // now know the image dimentions:
    const { width, height } = e.currentTarget

    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 100,
        },
        16 / 9,
        width,
        height
      ),
      width,
      height
    )

    this.setState({ crop })
  }

  onCropComplete = (crop: PixelCrop, percentCrop: PercentCrop) => {
    console.log('onCropComplete', crop, percentCrop)
    this.makeClientCrop(crop)
  }

  onCropChange = (crop: PixelCrop, percentCrop: PercentCrop) => {
    // console.log('onCropChange', crop, percentCrop);
    this.setState({ crop })
  }

  onDragStart = () => {
    // console.log('onDragStart');
  }

  onDragEnd = () => {
    // console.log('onDragEnd');
  }

  // Todo: apply scaling and rotation + update against
  // codesandbox demo.
  getCroppedImg(image: HTMLImageElement, crop: PixelCrop): Promise<string> {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const pixelRatio = window.devicePixelRatio || 1

    if (!ctx) {
      throw new Error('No 2d context')
    }

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
      canvas.toBlob(
        blob => {
          if (blob) {
            window.URL.revokeObjectURL(this.fileUrl)
            this.fileUrl = window.URL.createObjectURL(blob)
            resolve(this.fileUrl)
          }
        },
        'image/jpeg',
        1
      )
    })
  }

  makeClientCrop(crop: PixelCrop) {
    if (this.imageRef.current && crop.width && crop.height) {
      this.getCroppedImg(this.imageRef.current, crop).then(croppedImageUrl => this.setState({ croppedImageUrl }))
    }
  }

  renderVideo = () => (
    <video autoPlay loop>
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
            aspect={16 / 9}
            ruleOfThirds
            // circularCrop
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
            onDragStart={this.onDragStart}
            onDragEnd={this.onDragEnd}
            // renderSelectionAddon={this.renderSelectionAddon}
            // minWidth={50}
            // minHeight={50}
            // maxWidth={250}
            // maxHeight={250}
          >
            <img
              ref={this.imageRef}
              alt="Crop image"
              src={src}
              style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
              onLoad={this.onImageLoaded}
            />
          </ReactCrop>
        )}
        {croppedImageUrl && (
          <img
            alt="Crop preview"
            src={croppedImageUrl}
            style={{ display: 'block', width: crop?.width || 0, height: crop?.height || 0 }}
          />
        )}
      </div>
    )
  }
}

ReactDOM.render(<App />, cropEditor)
