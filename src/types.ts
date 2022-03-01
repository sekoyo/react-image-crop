export type XOrds = 'e' | 'w'
export type YOrds = 'n' | 's'
export type XYOrds = 'nw' | 'ne' | 'se' | 'sw'
export type Ords = XOrds | YOrds | XYOrds

export interface Crop {
  x: number
  y: number
  width: number
  height: number
  unit: 'px' | '%'
}

export interface PixelCrop extends Crop {
  unit: 'px'
}

export interface PercentCrop extends Crop {
  unit: '%'
}
