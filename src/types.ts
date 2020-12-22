export interface CropObject {
  aspect?: number;
  x: number;
  y: number;
  width: number;
  height: number;
  unit?: CropUnit;
}

export type CropOrd = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

export type OffsetCoords = { top: number; left: number };

export type CropUnit = 'px' | '%';
