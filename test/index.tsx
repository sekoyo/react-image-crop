import ReactDOM from 'react-dom'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from '../src'
import { cropPreview } from './cropPreview'
import { debounce } from './debounce'

import '../src/ReactCrop.scss'

function App() {
  const [imgSrc, setImgSrc] = useState('')
  const [previewSrc, setPreviewSrc] = useState('')
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined) // Makes crop preview update between images.
      const reader = new FileReader()
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''))
      reader.readAsDataURL(e.target.files[0])
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (!e.currentTarget) {
      return
    }

    imgRef.current = e.currentTarget
    const { width, height } = e.currentTarget

    // This is to demonstate how to make and center a % aspect crop
    // which is a bit trickier so we use some helper functions.
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        16 / 9,
        width,
        height
      ),
      width,
      height
    )

    setCrop(crop)
  }

  const updateCropPreview = React.useMemo(
    () =>
      debounce(async () => {
        if (completedCrop?.width && completedCrop?.height && imgRef.current) {
          const previewSrc = await cropPreview(imgRef.current, completedCrop, scale, rotate)
          setPreviewSrc(previewSrc)
        }
      }, 100),
    [completedCrop, scale, rotate]
  )

  useEffect(() => {
    updateCropPreview()
  }, [updateCropPreview])

  return (
    <div className="App">
      <div>
        <input type="file" accept="image/*" onChange={onSelectFile} />
        <div>
          <label htmlFor="scale-input">Scale: </label>
          <input
            id="scale-input"
            type="number"
            step="0.1"
            value={scale}
            disabled={!imgSrc}
            onChange={e => setScale(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="rotate-input">Rotate: </label>
          <input
            id="rotate-input"
            type="number"
            value={rotate}
            disabled={!imgSrc}
            onChange={e => setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))}
          />
        </div>
      </div>
      {Boolean(imgSrc) && (
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={c => setCompletedCrop(c)}
          aspect={16 / 9}
        >
          <img
            alt="Crop me"
            src={imgSrc}
            style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
            onLoad={onImageLoad}
          />
        </ReactCrop>
      )}
      {Boolean(previewSrc && completedCrop) && (
        <div>
          <img
            src={previewSrc}
            style={{
              border: '1px solid black',
              maxWidth: `min(100%, ${completedCrop?.width || 0}px)`,
            }}
            alt="Crop preview"
          />
        </div>
      )}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
