import React, { Component } from 'react';
import withCrop from './withCrop';

const ReactCrop = ({
  createCropSelection,
  newCropIsBeingDrawn,
  crop,
  disabled,
  onImageLoad,
  componentRef,
  imageRef,
  cropWrapperRef,
  imageCopyRef,
  crossorigin,
  src,
  imageAlt,
  children,
  cropInvalid,
  onComponentMouseTouchDown,
  onComponentKeyDown
}) => {
    const cropSelection = !cropInvalid ? createCropSelection() : null;
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
      tabIndex="1"
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
        {cropSelection}
      </div>

      {children}
    </div>
  );
}

export default withCrop(ReactCrop)