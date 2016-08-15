import React from 'react';
import ReactDOM from 'react-dom';
import ReactCrop from '../lib/ReactCrop';

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

/**
 * Load the image in the crop editor.
 */
const cropEditor = document.querySelector('#crop-editor');

function loadEditView(dataUrl) {
  const Parent = React.createClass({
    getInitialState: function() {
      return {
        crop: {
          x: 0,
          y: 0,
        },
        maxHeight: 80,
      };
    },

    onButtonClick: function() {
      this.setState({
        crop: {
          x: 20,
          y: 5,
          aspect: 1,
          width: 30,
          height: 50
        }
      });
    },

    onImageLoaded: function(crop) {
      console.log('Image was loaded. Crop:', crop);
      // this.setState({
      //  crop: {
      //    aspect: 16/9,
      //    width: 30,
      //  }
      // });
    },

    onCropComplete: function(crop) {
      console.log('Crop move complete:', crop);
    },

    // onCropChange: function(crop) {
    //  console.log('Crop change');
    // },

    render: function() {
      return (
        <div>
          <ReactCrop
            {...this.state}
            src={dataUrl}
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            outputPixelUnits
            // onChange={this.onCropChange}
          />
          <button onClick={this.onButtonClick}>Programatically set crop</button>
          <button onClick={() => { this.setState({ foo: Date.now() }); }}>Change foo state</button>
        </div>
      );
    },
  });

  ReactDOM.render(<Parent />, cropEditor);
}
