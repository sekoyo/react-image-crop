import React from 'react';

export interface Rect {
  id: string | number
  bounds: number[]
  selected?: boolean
  label?: string
  theta?: number
  style?: React.CSSProperties
  className?: string
}

export interface Line {
  id: string | number
  bounds: number[]
  selected?: boolean
  label?: string
  style?: React.CSSProperties
  className?: string
}

export interface Zoom {
  center: number[]
  scale: number
}

export interface AnnotatedImageProps {
  src: string
  style?: React.CSSProperties
  className?: string
  onCreateRect?: (e: PointerEvent) => void
  onSelectRect?: (e: PointerEvent) => void
  onDeselectRect?: (e: PointerEvent) => void
  onEditRect?: (e: PointerEvent) => void
  onDeleteRect?: (e: PointerEvent) => void
  canCreateRects?: boolean
  canSelectRects?: boolean
  canDeleteRects?: boolean
  canEditRects?: boolean
  rects: Rect[]
  onCreateLine?: (e: PointerEvent) => void
  onSelectLine?: (e: PointerEvent) => void
  onDeselectLine?: (e: PointerEvent) => void
  onEditLine?: (e: PointerEvent) => void
  onDeleteLine?: (e: PointerEvent) => void
  canCreateLines?: boolean
  canSelectLines?: boolean
  canDeleteLines?: boolean
  canEditLines?: boolean
  lines: Line[]
  zoom?: Zoom
  onZoom?: (e: PointerEvent) => void
  canZoom?: boolean
  canFullscreen?: boolean
  canUseHotkeys?: boolean
  RectTooltip?: React.ReactNode
  LineTooltip?: React.ReactNode
}

export default function AnnotatedImage(props: AnnotatedImageProps): JSX.Element {
  const { src } = props;
  return <img src={src} />
}
