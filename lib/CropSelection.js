import React from 'react';

export default ({
  disabled,
  style,
  cropSelectRef,
  onCropMouseTouchDown,
}) => (
  <div
    ref={cropSelectRef}
    style={style}
    className="ReactCrop__crop-selection"
    onMouseDown={onCropMouseTouchDown}
    onTouchStart={onCropMouseTouchDown}
  >
    {!disabled &&
      <div className="ReactCrop__drag-elements">
        <div className="ReactCrop__drag-bar ord-n" data-ord="n" />
        <div className="ReactCrop__drag-bar ord-e" data-ord="e" />
        <div className="ReactCrop__drag-bar ord-s" data-ord="s" />
        <div className="ReactCrop__drag-bar ord-w" data-ord="w" />

        <div className="ReactCrop__drag-handle ord-nw" data-ord="nw" />
        <div className="ReactCrop__drag-handle ord-n" data-ord="n" />
        <div className="ReactCrop__drag-handle ord-ne" data-ord="ne" />
        <div className="ReactCrop__drag-handle ord-e" data-ord="e" />
        <div className="ReactCrop__drag-handle ord-se" data-ord="se" />
        <div className="ReactCrop__drag-handle ord-s" data-ord="s" />
        <div className="ReactCrop__drag-handle ord-sw" data-ord="sw" />
        <div className="ReactCrop__drag-handle ord-w" data-ord="w" />
      </div>
    }
  </div>
);
