import React from 'react';
import PropTypes from 'prop-types';
import withCrop from './withCrop';
import CropSelection from './CropSelection';

const ReactCrop = ({
  newCropIsBeingDrawn,
  crop,
  disabled,
  onImageLoad,
  componentRef,
  imageRef,
  cropWrapperRef,
  imageCopyRef,
  cropSelectRef,
  crossorigin,
  src,
  imageAlt,
  children,
  cropInvalid,
  onComponentMouseTouchDown,
  onComponentKeyDown,
  getCropStyle,
  onCropMouseTouchDown,
}) => {
  const componentClasses = ['ReactCrop'];

  if (newCropIsBeingDrawn) {
    componentClasses.push('ReactCrop--new-crop');
  }
  if (crop.aspect) {
    componentClasses.push('ReactCrop--fixed-aspect');
  }
  if (disabled) {
    componentClasses.push('ReactCrop--disabled');
  }
  return (
    <div
      ref={componentRef}
      className={componentClasses.join(' ')}
      onTouchStart={onComponentMouseTouchDown}
      onMouseDown={onComponentMouseTouchDown}
      tabIndex="-1"
      onKeyDown={onComponentKeyDown}
    >
      <img
        ref={imageRef}
        crossOrigin={crossorigin}
        className="ReactCrop__image"
        src={src}
        onLoad={e => onImageLoad(e.target)}
        alt={imageAlt}
      />

      <div
        className="ReactCrop__crop-wrapper"
        ref={cropWrapperRef}
      >
        <img
          ref={imageCopyRef}
          crossOrigin={crossorigin}
          className="ReactCrop__image-copy"
          src={src}
          alt={imageAlt}
        />
        {!cropInvalid && <CropSelection
          disabled={disabled}
          cropSelectRef={cropSelectRef}
          style={getCropStyle()}
          onCropMouseTouchDown={onCropMouseTouchDown}
        />}
      </div>

      {children}
    </div>
  );
};


ReactCrop.propTypes = {
  src: PropTypes.string.isRequired,
  crop: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  imageAlt: PropTypes.string,
  disabled: PropTypes.bool,
  crossorigin: PropTypes.string,
  newCropIsBeingDrawn: PropTypes.bool,
  onImageLoad: PropTypes.func,
  componentRef: PropTypes.func,
  imageRef: PropTypes.func,
  cropWrapperRef: PropTypes.func,
  cropSelectRef: PropTypes.func,
  getCropStyle: PropTypes.func,
  onCropMouseTouchDown: PropTypes.func,
  imageCopyRef: PropTypes.func,
  cropInvalid: PropTypes.bool,
  onComponentMouseTouchDown: PropTypes.func,
  onComponentKeyDown: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

// Using FROM_HOC just to remind us that the props associated with this
// are already defined from the Higher Order Component.  This seems better
// then ommitting them and assuming we will remember all the things that are provided.
const FROM_HOC = undefined;

ReactCrop.defaultProps = {
  createCropSelection: FROM_HOC,
  newCropIsBeingDrawn: FROM_HOC,
  onImageLoad: FROM_HOC,
  componentRef: FROM_HOC,
  imageRef: FROM_HOC,
  cropWrapperRef: FROM_HOC,
  cropSelectRef: FROM_HOC,
  imageCopyRef: FROM_HOC,
  cropInvalid: FROM_HOC,
  onComponentMouseTouchDown: FROM_HOC,
  onComponentKeyDown: FROM_HOC,
  onCropMouseTouchDown: FROM_HOC,
  getCropStyle: FROM_HOC,
  crop: undefined,
  crossorigin: undefined,
  disabled: false,
  imageAlt: '',
  maxWidth: 100,
  maxHeight: 100,
  minWidth: 0,
  minHeight: 0,
  keepSelection: false,
  onChange: () => {},
  onComplete: () => {},
  onImageLoaded: () => {},
  onAspectRatioChange: () => {},
  onDragStart: () => {},
  onDragEnd: () => {},
  children: undefined,
};

export default withCrop(ReactCrop);
