import ReactDOM from 'react-dom'
import React, { useState } from 'react'

import AnnotatedImage from '../src/AnnotatedImage'
import '../src/ReactCrop.scss'

function App() {
  const [imgSrc, setImgSrc] = useState('')

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''))
      reader.readAsDataURL(e.target.files[0])
    }
  }

  return (
    <div className="App">
      <div>
        <input type="file" accept="image/*" onChange={onSelectFile} />
      </div>
      {Boolean(imgSrc) && (
        <AnnotatedImage src={imgSrc} rects={[]} lines={[]}  />
      )}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
